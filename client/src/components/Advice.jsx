import React, { useState } from "react";
import {
  MessageCircle,
  ChevronDown,
  Send,
  Lightbulb,
  Loader2,
} from "lucide-react";
import "../styles/Advice.css";

export default function SidebarAdvice() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [subject, setSubject] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdvice, setHasAdvice] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setRecommendation(null);

    const fullPrompt = subject
      ? `${userInput}\n\nSubject Area: ${subject}`
      : userInput;

    google.script.run
      .withSuccessHandler((result) => {
        const isEmpty = !result || !result.action_response;
        setRecommendation(isEmpty ? null : result.action_response.response);
        setHasAdvice(true);
        setIsLoading(false);
      })
      .withFailureHandler((error) => {
        console.error("Error calling Apps Script:", error);
        setRecommendation(null);
        setHasAdvice(true);
        setIsLoading(false);
      })
      .getAdvice(fullPrompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput("");
    setSubject("");
    setRecommendation(null);
    setHasAdvice(false);
  };

  const getStatusClass = () => {
    if (isLoading) return "text-yellow";
    if (hasAdvice && recommendation?.advice) return "text-green";
    if (hasAdvice && !recommendation?.advice) return "text-red";
    return "text-gray";
  };

  const getStatusDot = () => {
    if (isLoading) return "dot-yellow";
    if (hasAdvice && recommendation?.advice) return "dot-green";
    if (hasAdvice && !recommendation?.advice) return "dot-red";
    return "dot-gray";
  };

  const getStatusSubtitle = () => {
    if (isLoading) return "Finding real-world connections...";
    if (hasAdvice && recommendation?.advice) return "Advice ready";
    if (hasAdvice && !recommendation?.advice) return "No advice available";
    return "Ask for guidance";
  };

  const getStatusTextColor = () => {
    if (isLoading) return "#facc15";
    if (hasAdvice && recommendation?.advice) return "#22c55e";
    if (hasAdvice && !recommendation?.advice) return "#ef4444";
    return "#6b7280";
  };

  const buildFullText = () => {
    return [
      `🧠 Advice: ${recommendation?.advice || ""}`,
      ``,
      `📘 Subject: ${recommendation?.subject || ""}`,
      ``,
      `🌍 Connection: ${recommendation?.connection || ""}`,
      ``,
      `📌 Examples:`,
      ...(recommendation?.examples?.length
        ? recommendation.examples.map((ex) => `• ${ex}`)
        : ["• No examples provided."]),
      ``,
      `📚 Resources:`,
      ...(recommendation?.resources?.length
        ? recommendation.resources.map((res) => `• ${res.title} - ${res.url}`)
        : ["• No resources provided."]),
    ].join("\n");
  };

  return (
    <div className="advice-wrapper">
      <div className="advice-card">
        <div onClick={toggleExpanded} className="advice-toggle">
          <div className="advice-header">
            <div className="advice-header-left">
              <div className="status-icon">
                <MessageCircle className={`icon ${getStatusClass()}`} />
                <div className={`status-dot ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="title">Get Advice</div>
                <div
                  className="subtitle"
                  style={{ color: getStatusTextColor() }}
                >
                  {getStatusSubtitle()}
                </div>
              </div>
            </div>
            <ChevronDown className={`chevron ${isExpanded ? "rotate" : ""}`} />
          </div>
        </div>

        {isExpanded && (
          <div className="advice-panel">
            <div className="panel-body">
              <div className="input-section">
                <label>What concept are you investigating?</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="I'm struggling with... / I need help deciding..."
                  rows="3"
                  disabled={isLoading}
                />
                <div className="dropdown-section">
                  <label htmlFor="subject-select">Select Subject:</label>
                  <select
                    id="subject-select"
                    className="subject-dropdown"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">-- Select Subject --</option>
                    <option value="ELA">ELA</option>
                    <option value="Math">Math</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                <div className="btn-group">
                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || isLoading}
                    className="submit-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="loading-icon animate-spin" />
                        <span className="typing-dots">
                          Finding real-world connections<span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="send-icon" />
                        <span>Get Advice</span>
                      </>
                    )}
                  </button>
                  {!isLoading && (userInput || recommendation || subject) && (
                    <button onClick={handleClear} className="clear-btn">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Display advice content */}
              {hasAdvice && (
                <div
                  className={`advice-box ${
                    !recommendation?.advice ? "text-red" : ""
                  }`}
                >
                  <div className="advice-content">
                    <Lightbulb className="bulb-icon" />
                    <h4>Advice for you:</h4>
                  </div>
                  <div className="markdown">
                    {recommendation?.advice && (
                      <>
                        <h5>🧠 Advice</h5>
                        <p>{recommendation.advice}</p>
                      </>
                    )}
                    {recommendation?.subject && (
                      <>
                        <h5>📘 Subject</h5>
                        <p>{recommendation.subject}</p>
                      </>
                    )}
                    {recommendation?.connection && (
                      <>
                        <h5>🌍 Connection</h5>
                        <p>{recommendation.connection}</p>
                      </>
                    )}
                    {recommendation?.examples?.length > 0 && (
                      <>
                        <h5>📌 Examples</h5>
                        <ul>
                          {recommendation.examples.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {recommendation?.resources?.length > 0 && (
                      <>
                        <h5>📚 Resources</h5>
                        <ul>
                          {recommendation.resources.map((res, idx) => (
                            <li key={idx}>
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#2563eb", textDecoration: "underline" }}
                              >
                                {res.title}
                              </a>
                              <br />
                              <small>{res.description}</small>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Buttons if advice exists */}
              {recommendation?.advice && (
                <div className="copy-section">
                  <button
                    onClick={() => navigator.clipboard.writeText(buildFullText())}
                  >
                    📋 Copy advice to clipboard
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => alert("✅ Added to your project!")}
                  >
                    ➕ Add to Project
                  </button>
                  <button
                    className="pdf-btn"
                    onClick={() =>
                      alert("📄 PDF download is not available yet")
                    }
                  >
                    📄 Download as PDF
                  </button>
                </div>
              )}

              {/* Tips box when no advice */}
              {!recommendation?.advice && !isLoading && (
                <div className="tips-box">
                  <h5>💡 Tips for better advice:</h5>
                  <ul>
                    <li>• Be specific about your situation</li>
                    <li>• Mention what you've already tried</li>
                    <li>• Ask about decisions, challenges, or goals</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
