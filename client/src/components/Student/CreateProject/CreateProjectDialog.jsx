import React, { useState } from 'react';
import { Plus, X, ChevronRight, Trash2 } from 'lucide-react';

const CreateProjectDialog = () => {
    const [isLoading, setIsLoading] = useState(false);

    const openStandardsDialog = () => {
      setIsLoading(true);
          google.script.run
            .withSuccessHandler(() => {
              setIsLoading(false);
            })
            .withFailureHandler((err) => {
              console.error(err);
              setIsLoading(false);
            })
            .showCreateProjectDialog();
     }


  return (
    <div className="w-full max-w-[300px] p-3">

      {/* Enhanced Add Button */}
      <button
        onClick={openStandardsDialog}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-150 text-sm font-semibold shadow-sm hover:shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Plus size={16} strokeWidth={2.5} />
            <span>Create Project</span>
          </>
        )}
      </button>

    </div>
  );
};

export default CreateProjectDialog;