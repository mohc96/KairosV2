import React, { useState } from "react";
import {
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import "../styles/Workshop.css";

const STEPS = ["Topic", "Standards", "Group", "Artifacts", "Review"];

export default function SidebarWorkshop() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState(0);

  // 👇 moved INSIDE the component (fixes the hook error)
  // 'idle' | 'processing' | 'success' | 'error'
  const [procStatus, setProcStatus] = useState("idle");

  const [data, setData] = useState({
    topic: "",
    duration: 20,
    standards: "",     // kept (unused), per your original object
    standard: "",      // this is what the selects bind to
    grade: "",
    subject: "",
    students: "",
    demographics: [],
    personas: [],
    notes: "",         // renamed in UI to "Additional Feedback"
    artifacts: [],
    resources: [],     // {title, url}
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
  
    // === header status helpers (mirror Advice panel) ===
  const getWSStatusClass = () => {
    if (procStatus === "processing") return "text-yellow";
    if (procStatus === "success")    return "text-green";
    if (procStatus === "error")      return "text-red";
    return "text-gray";
  };
  const getWSStatusDot = () => {
    if (procStatus === "processing") return "dot-yellow";
    if (procStatus === "success")    return "dot-green";
    if (procStatus === "error")      return "dot-red";
    return "dot-gray";
  };
  const getWSSubtitle = () => {
    if (procStatus === "processing") return "Processing workshop…";
    if (procStatus === "success")    return "Processed successfully";
    if (procStatus === "error")      return "Processing failed";
    return "Plan engaging workshops";
  };
  const getWSSubtitleColor = () => {
    if (procStatus === "processing") return "#facc15"; // yellow-400
    if (procStatus === "success")    return "#22c55e"; // green-500
    if (procStatus === "error")      return "#ef4444"; // red-500
    return "#6b7280";                // gray-500
  };


  // 👇 lives inside the component so it can read `data` and update `procStatus`
  async function processWorkshop() {
    try {
      setProcStatus("processing");

      const payload = {
        topic: data.topic,
        duration: data.duration,
        grade: data.grade,
        subject: data.subject,
        standard: data.standard,
        notes: data.notes,              // Additional Feedback
        students: data.students,
        demographics: data.demographics,
        artifacts: data.artifacts,
        resources: data.resources,      // [{title, url}]
      };

      // swap this URL to your real API when ready
      const res = await fetch("/api/workshop/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      // if step 6 will show the backend output, store it here:
      // setData((d) => ({ ...d, processed: result }));

      setProcStatus("success");
    } catch (err) {
      console.error("Process failed:", err);
      setProcStatus("error");
    }
  }

  return (
    <div className="workshop-wrapper">
      {/* status-* class drives header colors & dot */}
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
                {/* Topic */}
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
                    <div className="text-sm text-gray-600 mt-1">
                      {data.duration} minutes
                    </div>
                  </Section>
                )}

                {/* Standards + Additional Feedback */}
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
                          {[
                            "Science",
                            "ELA",
                            "Math",
                            "Social Studies",
                            "Civics",
                            "Economics",
                            "Geography",
                            "History",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ gridColumn: "span 2" }}>
                        <Label>Standards</Label>
                        <select
                          value={data.standard}
                          onChange={(e) => setField("standard")(e.target.value)}
                          disabled={!data.subject}
                        >
                          <option value="">Select</option>
                          {(
                            {
                              Science: ["HS.P1U1.1","HS+C.P1U1.1","HS+C.P1U1.2","HS+C.P1U1.3","HS.P1U1.2","HS.P1U1.3",
                                "HS+C.P1U1.4","HS+C.P1U1.5","HS+C.P1U1.6","HS+C.P1U1.7","HS.P1U3.4","HS+C.P1U3.8",
                                "HS.P2U1.5","HS+Phy.P2U1.1","HS.P3U1.6","HS+Phy.P3U1.2","HS+Phy.P3U1.3","HS+Phy.P3U1.4",
                                "HS.P3U2.7","HS+Phy.P3U2.5","HS.P4U1.8","HS.P4U3.9","HS+Phy.P4U1.6","HS+Phy.P4U2.7",
                                "HS+Phy.P4U1.8","HS.P4U1.10","HS.E1U1.11","HS+E.E1U1.1","HS+E.E1U1.2","HS+E.E1U1.3",
                                "HS.E1U1.12","HS+E.E1U1.4","HS+E.E1U1.5","HS.E1U1.13","HS+E.E1U1.6","HS+E.E1U1.7",
                                "HS+E.E1U1.8","HS.E1U3.14","HS+E.E1U3.9","HS+E.E1U3.10","HS+E.E1U3.11","HS.E2U1.15",
                                "HS+E.E2U1.12","HS.E2U1.16","HS+E.E2U1.13","HS+E.E2U1.14","HS.E2U1.17","HS+E.E2U1.15",
                                "HS+E.E2U1.16","HS+E.E2U2.17","HS.L2U3.18","HS+B.L2U1.1","HS+B.L4U1.2","HS.L2U1.19",
                                "HS+B.L2U1.3","HS.L1U1.20","HS+B.L1U1.4","HS+B.L1U1.5","HS+B.L1U1.6","HS+B.L1U1.7",
                                "HS.L2U1.21","HS+B.L2U1.8","HS.L1U1.22","HS.L1U3.23","HS+B.L1U1.9","HS.L3U1.24",
                                "HS.L3U1.25","HS.L3U3.26","HS+B.L3U1.10","HS+B.L3U1.11","HS+B.L3U1.12","HS.L4U1.27",
                                "HS.L4U1.28","HS+B.L4U1.13","HS+B.L4U1.14"],
                              ELA: ["9-10.RL.1","9-10.RL.2","9-10.RL.3","9-10.RL.4","9-10.RL.5","9-10.RL.6",
                                "9-10.RL.7","9-10.RL.9","9-10.RL.10","9-10.RI.1","9-10.RI.2","9-10.RI.3",
                                "9-10.RI.4","9-10.RI.5","9-10.RI.6","9-10.RI.7","9-10.RI.8","9-10.RI.9","9-10.RI.10"],
                              Math: [/* ... (unchanged list) ... */],
                              "Social Studies": ["HS.SP1.1","HS.SP1.2","HS.SP1.3","HS.SP1.4"],
                              Civics: ["HS.C1.1","HS.C2.1"],
                              Economics: ["HS.E1.1","HS.E2.1"],
                              Geography: ["HS.G1.1","HS.G2.1"],
                              History: ["HS.H1.1","HS.H2.1"],
                            }[data.subject] || []
                          ).map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
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

                {/* Group */}
                {step === 2 && (
                  <Section>
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}
                    >
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

                {/* Artifacts */}
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

                {/* Review */}
                {step === 4 && (
                <Section>
                  <h4 className="title" style={{ marginBottom: 8 }}>
                    Preview
                  </h4>
                  <div className="markdown">
                    <h5>🧩 Topic & Duration</h5>
                    <p>{data.topic || "—"}</p>
                    <p><strong>Duration:</strong> {data.duration} min</p>

                    <h5>🎯 Standards</h5>
                    <p>
                      <strong>Grade:</strong> {data.grade || "—"} |{" "}
                      <strong>Subject:</strong> {data.subject || "—"} |{" "}
                      <strong>Standard:</strong> {data.standard || "—"}
                    </p>
                    <p><strong>Additional Feedback:</strong> {data.notes || "—"}</p>

                    <h5>👥 Group</h5>
                    <p><strong>Students:</strong> {data.students || "—"}</p>
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
                          <li key={i}>{r.title} — {r.url}</li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  </div>

                  {/* Process button with status */}
                  <div className="btn-group">
                    <button
                      className={`submit-btn process-btn ${procStatus}`}
                      title="Send this workshop for processing"
                      onClick={processWorkshop}
                      disabled={procStatus === "processing"}
                    >
                      {procStatus === "processing" && <span className="spinner" />}
                      <Download className="icon" /> Process Workshop
                    </button>
                  </div>
                </Section>
              )}

              </div>

              {/* Nav buttons */}
              <div className="nav-row">
                <button className="nav-btn" onClick={prev} disabled={step === 0}>
                  <ChevronLeft className="icon-sm" />
                  Back
                </button>
                <button
                  className="nav-btn"
                  onClick={next}
                  disabled={step === STEPS.length - 1}
                >
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
      {/* Two-column inputs (no hidden third column) */}
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
          onBlur={add} /* auto-add on blur if both filled */
        />
      </div>

      {/* Centered Add button below */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
        <button
          className="submit-btn"
          type="button"
          onClick={add}
          disabled={!title.trim() || !url.trim()}
        >
          Add
        </button>
      </div>

      {/* List */}
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
