import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  MessageCircle, ChevronDown, Send, Lightbulb, Loader2, X,
} from 'lucide-react';
import '../styles/Advice.css';

export default function SidebarAdvice() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdvice, setHasAdvice] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAdvice('');

    google.script.run
      .withSuccessHandler((result) => {
        const adviceText = result || "No response available";
        setAdvice(adviceText);
        setHasAdvice(true);
        setIsLoading(false);
      })
      .withFailureHandler((error) => {
        console.error('Error calling Apps Script:', error);
        setAdvice("I'm currently unable to connect to the advice service. Please try again later.");
        setHasAdvice(true);
        setIsLoading(false);
      })
      .callOpenAI(userInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setAdvice('');
    setHasAdvice(false);
  };

  const getStatusClass = () => {
    if (hasAdvice) return 'text-green';
    if (isLoading) return 'text-blue';
    return 'text-gray';
  };

  const getStatusDot = () => {
    if (hasAdvice) return 'dot-green';
    if (isLoading) return 'dot-blue';
    return 'dot-gray';
  };

  return (
    <div className="advice-wrapper">
      <div className="advice-card">
        {/* Toggle Button */}
        <div onClick={toggleExpanded} className="advice-toggle">
          <div className="advice-header">
            <div className="advice-header-left">
              <div className="status-icon">
                <MessageCircle className={`icon ${getStatusClass()}`} />
                <div className={`status-dot ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="title">Get Advice</div>
                <div className="subtitle">
                  {isLoading ? 'Getting advice...' : hasAdvice ? 'Advice ready' : 'Ask for guidance'}
                </div>
              </div>
            </div>
            <ChevronDown className={`chevron ${isExpanded ? 'rotate' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="advice-panel">
            <div className="panel-body">
              <div className="input-section">
                <label>What would you like advice about?</label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="I'm struggling with... / I need help deciding... / How do I..."
                  rows="3"
                  disabled={isLoading}
                />
                <div className="btn-group">
                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || isLoading}
                    className="submit-btn"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="loading-icon animate-spin" />
                        <span>Getting advice...</span>
                      </>
                    ) : (
                      <>
                        <Send className="send-icon" />
                        <span>Get Advice</span>
                      </>
                    )}
                  </button>
                  {(userInput || advice) && (
                    <button onClick={handleClear} className="clear-btn">
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Advice Output */}
              {advice && (
                <div className="advice-box">
                  <div className="advice-content">
                    <Lightbulb className="bulb-icon" />
                    <h4>Advice for you:</h4>
                  </div>
                  <div className="markdown">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                  </div>
                  <div className="copy-section">
                    <button onClick={() => navigator.clipboard.writeText(advice)}>
                      📋 Copy advice to clipboard
                    </button>
                  </div>
                </div>
              )}

              {/* Status Text */}
              <div className={`status ${hasAdvice ? 'green' : isLoading ? 'blue' : 'gray'}`}>
                {isLoading ? '🤔 Thinking...' : hasAdvice ? '💡 Advice received' : '💭 Ready to help'}
              </div>

              {/* Tips */}
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
