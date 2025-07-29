import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle, ChevronDown, Send, Lightbulb, Loader2,
} from 'lucide-react';
import '../styles/Advice.css'; // Make sure this matches your file path

export default function SidebarAdvice() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [subject, setSubject] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdvice, setHasAdvice] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAdvice('');

    const fullPrompt = subject
      ? `${userInput}\n\nSubject Area: ${subject}`
      : userInput;

    google.script.run
      .withSuccessHandler((result) => {
        const isEmpty = !result || result.trim() === '';
        setAdvice(isEmpty ? '' : result);
        setHasAdvice(true);
        setIsLoading(false);
      })
      .withFailureHandler((error) => {
        console.error('Error calling Apps Script:', error);
        setAdvice('');
        setHasAdvice(true);
        setIsLoading(false);
      })
      .callOpenAI(fullPrompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setSubject('');
    setAdvice('');
    setHasAdvice(false);
  };

  const getStatusClass = () => {
    if (isLoading) return 'text-yellow';
    if (hasAdvice && advice && advice.trim() !== 'No response available') return 'text-green';
    if (hasAdvice && (!advice || advice.trim() === 'No response available')) return 'text-red';
    return 'text-gray';
  };

  const getStatusDot = () => {
    if (isLoading) return 'dot-yellow';
    if (hasAdvice && advice && advice.trim() !== 'No response available') return 'dot-green';
    if (hasAdvice && (!advice || advice.trim() === 'No response available')) return 'dot-red';
    return 'dot-gray';
  };

  const getStatusSubtitle = () => {
    if (isLoading) return 'Finding real-world connections...';
    if (hasAdvice && advice && advice.trim() !== 'No response available') return 'Advice ready';
    if (hasAdvice && (!advice || advice.trim() === 'No response available')) return 'No advice available';
    return 'Ask for guidance';
  };

  const getStatusTextColor = () => {
    if (isLoading) return '#facc15';
    if (hasAdvice && advice && advice.trim() !== 'No response available') return '#22c55e';
    if (hasAdvice && (!advice || advice.trim() === 'No response available')) return '#ef4444';
    return '#6b7280';
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
                <div className="subtitle" style={{ color: getStatusTextColor() }}>
                  {getStatusSubtitle()}
                </div>
              </div>
            </div>
            <ChevronDown className={`chevron ${isExpanded ? 'rotate' : ''}`} />
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
                        <span className="typing-dots">Finding real-world connections<span>.</span><span>.</span><span>.</span></span>
                      </>
                    ) : (
                      <>
                        <Send className="send-icon" />
                        <span>Get Advice</span>
                      </>
                    )}
                  </button>
                  {!isLoading && (userInput || advice || subject) && (
                    <button onClick={handleClear} className="clear-btn">Clear</button>
                  )}
                </div>
              </div>

              

                {/* Only show buttons if advice is non-empty */}
                
              {hasAdvice && (
                <div className={`advice-box ${!advice ? 'text-red' : ''}`}>
                  <div className="advice-content">
                    <Lightbulb className="bulb-icon" />
                    <h4>Advice for you:</h4>
                  </div>
                  <div className={`markdown ${advice?.trim() === 'No response available' ? 'text-red' : ''}`}>
                    <ReactMarkdown>{advice || 'No response available'}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Only show buttons if advice is non-empty */}
              {advice?.trim() && (
                <div className="copy-section">
                  <button onClick={() => navigator.clipboard.writeText(advice)}>
                    📋 Copy advice to clipboard
                  </button>
                  <button className="add-btn" onClick={() => alert("✅ Added to your project!")}>➕ Add to Project</button>
                  <button className="pdf-btn" onClick={() => alert("📄 PDF download is not available yet")}>📄 Download as PDF</button>
                </div>
              )}

              {!advice && !isLoading && (
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
