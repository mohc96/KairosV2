import React, { useState } from 'react';
import { Upload, FileText, User, ChevronDown } from 'lucide-react';
import '../styles/AboutMe.css';

export default function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="aboutme-wrapper">
      <div className="aboutme-card">
        {/* Toggle Button */}
        <div onClick={() => setIsExpanded(!isExpanded)} className="aboutme-toggle">
          <div className="aboutme-header">
            <div className="aboutme-header-left">
              <div className="status-icon">
                <User className="icon text-gray" />
              </div>
              <div>
                <div className="title">Tell Us About Yourself</div>
                <div className="subtitle">Choose how you want to share</div>
              </div>
            </div>
            <ChevronDown className={`chevron ${isExpanded ? 'rotate' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="aboutme-panel">
            <div className="panel-body">
              <div className="aboutme-options">
                <div className="aboutme-option">
                  <Upload className="aboutme-icon" />
                  <span>Use my resume</span>
                </div>
                <div className="aboutme-option">
                  <FileText className="aboutme-icon" />
                  <span>I’ll fill out a form</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 