import React from 'react';
import { Lock } from 'lucide-react';

const LockConfirmationDialog = ({ showDialog, onConfirm, onCancel }) => {
  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg w-full max-w-sm mx-2">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Lock Project</h2>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">
            Are you sure you want to lock and submit this project for teacher review?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> You won't be able to make any further edits after locking.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Lock & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockConfirmationDialog;