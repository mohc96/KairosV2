import React, { useState } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import "../styles/Workshop.css";
import standardsData from "../data/learning-standards.json";
import Select from "react-select";

const STEPS = ["Topic", "Standards", "Group", "Artifacts", "Review", "Results"];

export default function SidebarWorkshop() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState(0);

  const [procStatus, setProcStatus] = useState("idle");

  const [processed, setProcessed] = useState(null);

  const [data, setData] = useState({
    topic: "",
    duration: 20,
    standards: "",
    standard: "",
    grade: "",
    subject: "",
    keywords: "",
    students: "",
    demographics: [],
    personas: [],
    notes: "",
    artifacts: [],
    resources: [], 
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const setField = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  const toggleInArray = (k, value) =>
    setData((d) => {
      const set = new Set(d[k]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...d, [k]: Array.from(set) };
    });

  // Header status helpers (mirrors Advice styling)
  const getWSStatusClass = () => {
    if (procStatus === "processing") return "text-yellow";
    if (procStatus === "success") return "text-green";
    if (procStatus === "error") return "text-red";
    return "text-gray";
  };
  const getWSStatusDot = () => {
    if (procStatus === "processing") return "dot-yellow";
    if (procStatus === "success") return "dot-green";
    if (procStatus === "error") return "dot-red";
    return "dot-gray";
  };
  const getWSSubtitle = () => {
    if (procStatus === "processing") return "Processing workshop…";
    if (procStatus === "success") return "Processed successfully";
    if (procStatus === "error") return "Processing failed";
    return "Plan engaging workshops";
  };
  const getWSSubtitleColor = () => {
    if (procStatus === "processing") return "#facc15";
    if (procStatus === "success") return "#22c55e";
    if (procStatus === "error") return "#ef4444";
    return "#6b7280";
  };

  // Remove empty values before sending to backend
  function prune(obj) {
    if (Array.isArray(obj)) {
      const arr = obj
        .map(prune)
        .filter(
          (v) =>
            v !== undefined &&
            v !== null &&
            !(typeof v === "string" && v.trim() === "") &&
            !(Array.isArray(v) && v.length === 0) &&
            !(typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0)
        );
      return arr.length ? arr : undefined;
    }
    if (obj && typeof obj === "object") {
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        const pv = prune(v);
        if (
          pv !== undefined &&
          pv !== null &&
          !(typeof pv === "string" && pv.trim() === "") &&
          !(Array.isArray(pv) && pv.length === 0) &&
          !(typeof pv === "object" && !Array.isArray(pv) && Object.keys(pv).length === 0)
        ) {
          out[k] = pv;
        }
      }
      return Object.keys(out).length ? out : undefined;
    }
    return obj;
  }

  // Send to backend; store result; jump to Step 6
async function processWorkshop() {
    try {
      setProcStatus("processing");

      // Build payload in backend’s expected format
    //   const payload = {
    //   "action": "workshop",
    //   "payload": {
    //     "email_id": "student1@gmail.com",
    //     "workshop_input": {
    //       "topic": (data.topic || "").trim(),
    //       "audience": `${data.grade || "Grade ?"} ${data.subject || ""} students`.trim(),
    //       "standards": data.standard ? [data.standard] : [],
    //       "desired_outcomes": data.notes
    //         ? data.notes.split("\n").filter(Boolean)
    //         : ["Students will achieve defined outcomes"],
    //       "required_artifacts": (data.artifacts || []).map((a) =>
    //         a.toLowerCase().replace(/\s+/g, "_")
    //       ),
    //       "total_workshop_time": data.duration || 20,
    //       "special_group_considerations": data.special_group_considerations || "",
    //       "reading_level": data.grade || "",
    //       "visuals": data.visuals || [],
    //       "worksheet_task_type": data.worksheet_task_type || "",
    //       "exit_ticket_question_count": data.exit_ticket_question_count || 0
    //     },
    //     "huddle_id": "test-huddle-uuid-1234"
    //   }
    // };


      const payload = {
        action: "workshop",
        payload: {
          "email_id": "student1@gmail.com",
          "workshop_input": {
            "topic": "Understanding Photosynthesis",
            "audience": "Grade 6 science students",
            "standards": ["NGSS.MS-LS1-6"],
            "desired_outcomes": [
              "Students will explain the process of photosynthesis",
              "Students will apply understanding to real-world scenarios"
            ],
            "required_artifacts": ["slides", "worksheet", "Dicussion_Guide", "Quiz"],
            "total_workshop_time": 20,
            "special_group_considerations": "ELL students with beginner-level English proficiency",
            "reading_level": "Grade 6",
            "visuals": ["diagram of chloroplast", "flowchart of photosynthesis"],
            "worksheet_task_type": "labelling diagrams and short-answer explainations",
            "exit_ticket_question_count":2
          },
          "huddle_id": "test-huddle-uuid-1234"
        },
      };


      // Connect via WebSocket
      const ws = new WebSocket("wss://s7pmpoc37f.execute-api.us-west-1.amazonaws.com/prod");

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(JSON.stringify(payload));
      };

      ws.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data);
          console.log("WS result:", result);
          setProcessed(result);
          setProcStatus("success");
          setStep(5); // jump to Results
        } catch (e) {
          console.error("Parse error:", e);
          setProcStatus("error");
        }
        ws.close();
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setProcStatus("error");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (err) {
      console.error("Process failed:", err);
      setProcStatus("error");
    }
  }


  function buildResultsText(r) {
    try {
      if (r?.user_response?.artifacts) {
        const lines = ["## Generated Artifacts"];
        for (const [key, val] of Object.entries(r.user_response.artifacts)) {
          lines.push(`• ${key}: ${val.s3_uri}`);
        }
        return lines.join("\n");
      }
      return JSON.stringify(r ?? {}, null, 2);
    } catch {
      return JSON.stringify(r ?? {}, null, 2);
    }
  }



  async function copyResultsToClipboard() {
    try {
      const text = buildResultsText(processed);
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }

  // Inserts content into the active Google Doc via Apps Script
  function insertResultsIntoDoc() {
    if (!processed) return;
    const text = buildResultsText(processed);
    if (window.google?.script?.run) {
      window.google.script.run
        .withFailureHandler((err) => console.error("Insert failed:", err))
        .insertProcessedWorkshop(text);
    } else {
      console.warn("google.script.run not available in this environment.");
    }
  }

  // Standards filters (subject + keywords)
  const subjectOptions = Array.from(new Set((standardsData || []).map((s) => s.subject_area)));
  const filteredStandards = (standardsData || [])
    .filter((s) => !data.subject || s.subject_area === data.subject)
    .filter((s) => {
      if (!data.keywords) return true;
      const keys = data.keywords.toLowerCase().split(/\s+/).filter(Boolean);
      const hay = `${s.code} ${s.description}`.toLowerCase();
      return keys.some((kw) => hay.includes(kw));
    });

  return (
    <div className="workshop-wrapper">
      <div className={`workshop-card status-${procStatus}`}>
        <div onClick={toggleExpanded} className="workshop-toggle">
          <div className="workshop-header">
            <div className="workshop-header-left">
              <div className="status-icon">
                <ClipboardList className={`icon ${getWSStatusClass()}`} />
                <div className={`status-dot ${getWSStatusDot()}`} />
              </div>
              <div>
                <div className="title">Workshop Designer</div>
                <div className="subtitle" style={{ color: getWSSubtitleColor() }}>
                  {getWSSubtitle()}
                </div>
              </div>
            </div>
            <ChevronDown className={`chevron ${isExpanded ? "rotate" : ""}`} />
          </div>
        </div>

        {isExpanded && (
          <div className="workshop-panel">
            <div className="panel-body">
              {/* Stepper */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-1">
                  Step {step + 1} of {STEPS.length}: <strong>{STEPS[step]}</strong>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`,
                    gap: 6,
                  }}
                >
                  {STEPS.map((label, i) => (
                    <div
                      key={label}
                      className="h-1.5 rounded-full"
                      style={{ background: i <= step ? "#6366f1" : "#e5e7eb" }}
                    />
                  ))}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="workshop-step">
                {/* Step 1: Topic */}
                {step === 0 && (
                  <Section>
                    <Label>What is your workshop about?</Label>
                    <textarea
                      rows="3"
                      value={data.topic}
                      onChange={(e) => setField("topic")(e.target.value)}
                      placeholder="e.g., Modeling photosynthesis; Socratic seminar on chapters 3–4"
                    />
                    <Label className="mt-3">Duration (minutes)</Label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={data.duration}
                      onChange={(e) => setField("duration")(Number(e.target.value))}
                    />
                    <div className="text-sm text-gray-600 mt-1">{data.duration} minutes</div>
                  </Section>
                )}

                {/* Step 2: Standards + Additional Feedback */}
                {step === 1 && (
                <Section>
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
                  >
                    <div>
                      <Label>Grade</Label>
                      <select
                        value={data.grade}
                        onChange={(e) => setField("grade")(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <Label>Subject</Label>
                      <select
                        value={data.subject}
                        onChange={(e) => setField("subject")(e.target.value)}
                      >
                        <option value="">Select</option>
                        {[...new Set(standardsData.map((s) => s.subject_area))].map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                      <Label>Keywords</Label>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={data.keywords}
                        onChange={(e) => setField("keywords")(e.target.value)}
                      />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                      <Label>Standards</Label>
                      <Select
                        value={
                          data.standard
                            ? { value: data.standard, label: data.standard } 
                            : null
                        }
                        onChange={(option) => setField("standard")(option?.value || "")}
                        options={standardsData
                          .filter(s => {
                            if (!data.subject) return true;
                            return s.subject_area === data.subject;
                          })
                          .filter(s => {
                            if (!data.keywords) return true;
                            const keywordList = data.keywords.toLowerCase().split(" ");
                            const description = s.description.toLowerCase();
                            return keywordList.every(kw => description.includes(kw));
                          })
                          .map((s) => ({
                            value: s.code,
                            label: `${s.code} – ${s.description}`,
                          }))
                        }
                        menuPlacement="auto"
                        menuPosition="fixed"
                        menuPortalTarget={document.body} 
                        styles={{
                          container: (base) => ({ ...base, width: "100%" }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({
                            ...base,
                            textAlign: "left",
                            left: "0px",
                          }),
                          option: (base) => ({ ...base, fontSize: "0.8rem" }),                           
                        }}
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                          Why align with standards? Keeps outcomes clear &amp; measurable.
                  </div>
                  
                  <Label className="mt-3">Additional Feedback</Label>
                  <textarea
                    rows="2"
                    value={data.notes}
                    onChange={(e) => setField("notes")(e.target.value)}
                  />
                </Section>
              )}

                {/* Step 3: Group */}
                {step === 2 && (
                  <Section>
                    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <Label># Students</Label>
                        <input
                          type="number"
                          min="1"
                          value={data.students}
                          onChange={(e) => setField("students")(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Demographics</Label>
                        <Chips
                          options={["ELL", "IEP", "Gifted"]}
                          values={data.demographics}
                          onToggle={(v) => toggleInArray("demographics", v)}
                        />
                      </div>
                    </div>
                  </Section>
                )}

                {/* Step 4: Artifacts */}
                {step === 3 && (
                  <Section>
                    <Label>Artifacts</Label>
                    <Chips
                      options={["Worksheet", "Slides", "Discussion Guide", "Quiz"]}
                      values={data.artifacts}
                      onToggle={(v) => toggleInArray("artifacts", v)}
                    />
                    <Label className="mt-3">Resources (title + URL)</Label>
                    <ResourceEditor
                      resources={data.resources}
                      onChange={(resources) => setField("resources")(resources)}
                    />
                  </Section>
                )}

                {/* Step 5: Review */}
                {step === 4 && (
                  <Section>
                    <h4 className="title" style={{ marginBottom: 8 }}>
                      Preview
                    </h4>
                    <div className="markdown">
                      <h5>🧩 Topic & Duration</h5>
                      <p>{data.topic || "—"}</p>
                      <p>
                        <strong>Duration:</strong> {data.duration} min
                      </p>

                      <h5>🎯 Standards</h5>
                      <p>
                        <strong>Grade:</strong> {data.grade || "—"} |{" "}
                        <strong>Subject:</strong> {data.subject || "—"} |{" "}
                        <strong>Standard:</strong> {data.standard || "—"}
                      </p>
                      <p>
                        <strong>Additional Feedback:</strong> {data.notes || "—"}
                      </p>

                      <h5>👥 Group</h5>
                      <p>
                        <strong>Students:</strong> {data.students || "—"}
                      </p>
                      <p>
                        <strong>Demographics:</strong>{" "}
                        {data.demographics.length ? data.demographics.join(", ") : "—"}
                      </p>

                      <h5>📦 Artifacts & Resources</h5>
                      <p>
                        <strong>Artifacts:</strong>{" "}
                        {data.artifacts.length ? data.artifacts.join(", ") : "—"}
                      </p>
                      <ul>
                        {data.resources.length ? (
                          data.resources.map((r, i) => (
                            <li key={i}>
                              {r.title} — {r.url}
                            </li>
                          ))
                        ) : (
                          <li>—</li>
                        )}
                      </ul>
                    </div>

                    <div 
                      className="btn-group">
                      <button
                        className="submit-btn process-btn"
                        title="Send this workshop for processing"
                        onClick={processWorkshop}
                        disabled={procStatus === "processing"}
                      >
                        {procStatus === "processing" && <span className="spinner" />}
                        <Download className="icon" />
                        {procStatus === "processing" ? "Processing Workshop..." : "Process Workshop"}
                      </button>
                    </div>
                  </Section>
                )}

                {/* Step 6: Results */}
                {step === 5 && (
                  <Section>
                    <h4 className="title" style={{ marginBottom: 8 }}>
                      Processed Results
                    </h4>

                    {!processed ? (
                      <div className="text-sm text-gray-500">
                        No result available. Please run <strong>Process Workshop</strong> in Step 5.
                      </div>
                    ) : (
                      <>
                        <div
                          className="results-box"
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: 12,
                            maxHeight: 320,
                            overflow: "auto",
                          }}
                        >
                          {/* Artifacts */}
                          <h5>📦 Generated Artifacts</h5>
                          <ul>
                            {processed?.body?.action_response?.artifacts &&
                            Object.keys(processed.body.action_response.artifacts).length > 0 ? (
                              Object.entries(processed.body.action_response.artifacts).map(([k, v]) => (
                                <li key={k}>
                                  <strong>{k}:</strong>{" "}
                                  <a
                                    href={v.s3_uri.replace(
                                      /^s3:\/\//,
                                      "https://s3.console.aws.amazon.com/s3/object/"
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {v.s3_uri.split("/").pop().slice(0, 30)}
                                  </a>
                                </li>
                              ))
                            ) : (
                              <li>—</li>
                            )}
                          </ul>

                          {/* Editor Notes */}
                          <h5>📝 Editor Notes</h5>
                          <p>
                            {processed?.body?.action_response?.editor_notes?.tightening_actions?.join(", ") || "—"}
                          </p>
                          <p>
                            {processed?.body?.action_response?.editor_notes?.risks?.join(", ") || "—"}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="btn-group" style={{ marginTop: 12 }}>
                          <button className="submit-btn process-btn" onClick={copyResultsToClipboard}>
                            Copy to Clipboard
                          </button>
                          <button className="submit-btn process-btn" onClick={insertResultsIntoDoc}>
                            Move to Docs
                          </button>
                        </div>
                      </>
                    )}
                  </Section>
                )}

              </div>

              {/* Nav buttons */}
              <div className="nav-row">
                <button className="nav-btn" onClick={prev} disabled={step === 0}>
                  <ChevronLeft className="icon-sm" />
                  Back
                </button>
                <button className="nav-btn" onClick={next} disabled={step === STEPS.length - 1}>
                  Next
                  <ChevronRight className="icon-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- tiny presentational helpers ---------- */
function Section({ children }) {
  return <div className="input-section">{children}</div>;
}
function Label({ children, className = "" }) {
  return <label className={className}>{children}</label>;
}
function Chips({ options, values, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              padding: "6px 10px",
              borderRadius: 9999,
              fontSize: 12,
              border: `1px solid ${active ? "#6366f1" : "#e5e7eb"}`,
              background: active ? "#eef2ff" : "#fff",
              color: active ? "#3730a3" : "#374151",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
function ResourceEditor({ resources, onChange }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    const t = title.trim();
    const u = url.trim();
    if (!t || !u) return;
    onChange([...(resources || []), { title: t, url: u }]);
    setTitle("");
    setUrl("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <div className="resource-inputs">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
        />
      </div>

      <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
        <button className="submit-btn" type="button" onClick={add} disabled={!title.trim() || !url.trim()}>
          Add
        </button>
      </div>

      <ul className="resource-list" style={{ marginTop: 8 }}>
        {resources.map((r, i) => (
          <li key={`${r.title}-${i}`} className="resource-row">
            <span className="text-gray">
              {r.title} — {r.url}
            </span>
            <button
              className="clear-btn clear-btn--outline"
              type="button"
              onClick={() => onChange(resources.filter((_, idx) => idx !== i))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
