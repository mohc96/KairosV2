import React, { useState } from 'react';

const StandardsSelector = ({ onStandardsChange, initialStandards = [] }) => {
    const [selectedStandards, setSelectedStandards] = useState(initialStandards);
    const [isLoading, setIsLoading] = useState(false);


    const openStandardsDialog = () => {
      setIsLoading(true);
      
      google.script.run
        .withSuccessHandler(() => {
          google.script.run
            .withSuccessHandler(() => {
              pollForResults();
            })
            .withFailureHandler((err) => {
              console.error(err);
              setIsLoading(false);
            })
            .showStandardsDialogAndReturn();
        })
        .withFailureHandler((err) => {
          console.error(err);
          setIsLoading(false);
        })
        .clearSelectedStandards(); 
    };

    const pollForResults = () => {
      let attempts = 0;
      const maxAttempts = 60;
      
      const checkForResults = () => {
        // Check dialog status first
        google.script.run
          .withSuccessHandler((status) => {
            if (status === 'closed') {
              // Dialog closed without selection - stop loading
              setIsLoading(false);
              return;
            }
            
            if (status === 'selected') {
              // User made a selection - fetch the data
              google.script.run
                .withSuccessHandler((data) => {
                  setSelectedStandards(data || []);
                  if (onStandardsChange) onStandardsChange(data || []);
                  setIsLoading(false);
                })
                .getSelectedStandards();
              return;
            }
            
            // No status yet - keep polling
            if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkForResults, 1000);
            } else {
              // Timeout
              setIsLoading(false);
            }
          })
          .withFailureHandler((err) => {
            console.error(err);
            setIsLoading(false);
          })
          .getDialogStatus();
      };
      
      setTimeout(checkForResults, 1000);
    };



    const removeStandard = (codeToRemove) => {
        const updated = selectedStandards.filter(s => s.code !== codeToRemove);
        setSelectedStandards(updated);
        if (onStandardsChange) {
        onStandardsChange(updated);
        }
    };

  return (
    <div className="standards-selector">
        <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {/* Add Standards Button */}
      <button
        onClick={openStandardsDialog}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Opening...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Learning Standards</span>
          </>
        )}
      </button>

      {/* Selected Standards Display */}
      {selectedStandards.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Selected Standards ({selectedStandards.length})
            </h3>
            <button
              onClick={() => {
                setSelectedStandards([]);
                if (onStandardsChange) {
                  onStandardsChange([]);
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedStandards.map((standard) => (
              <div
                key={standard.code}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-blue-700">
                        {standard.code}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                        {standard.grade_level}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                        {standard.subject_area}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {standard.description}
                    </p>
                  </div>
                  <button
                    onClick={() => removeStandard(standard.code)}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 p-1"
                    title="Remove standard"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardsSelector;