import React, { useState } from 'react';
import { FilePlus, Loader2, ChevronDown } from 'lucide-react';
import '../styles/NewDocCreator.css';

export default function NewDocCreatorDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckboxChange = () => {
    setCreateNew(!createNew);
    setMessage('');
  };

  const handleCreate = () => {
    if (!createNew) return;

    setIsCreating(true);
    setMessage('');

    google.script.run
      .withSuccessHandler((url) => {
        setIsCreating(false);
        setMessage('✅ New document created!');
        window.open(url, '_blank');
      })
      .withFailureHandler((err) => {
        console.error('Error creating document:', err);
        setIsCreating(false);
        setMessage('❌ Failed to create document.');
      })
      .createNewGoogleDoc();
  };

  return (
    <div className="new-doc-dropdown-container">
      <div
        className="dropdown-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded); }}
      >
        <div className="dropdown-header-left">
          <FilePlus className="dropdown-header-icon" />
          <div className="dropdown-title">Create New Document</div>
        </div>
        <ChevronDown className={`dropdown-chevron ${isExpanded ? 'rotate-180' : ''}`} />
      </div>

      {isExpanded && (
        <div className="dropdown-body">
          <div className="checkbox-row">
            <input
              type="checkbox"
              checked={createNew}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
            <label className="checkbox-label">
              I want to create a new Google Doc
            </label>
          </div>

          <button
            onClick={handleCreate}
            disabled={!createNew || isCreating}
            className="create-button"
          >
            {isCreating ? (
              <>
                <Loader2 className="spinner" />
                Creating...
              </>
            ) : (
              <>
                <FilePlus className="icon" />
                Create Document
              </>
            )}
          </button>

          {message && <p className="status-message">{message}</p>}
        </div>
      )}
    </div>
  );
}
