import React from 'react';
import { User, FileText, Loader2 } from 'lucide-react';
import ProjectPreview from './ProjectPreview';
import  { useState } from 'react';

export default function StudentProjectCard({ student, index, exportingStudent, onViewProject }) {
  const studentId = student.student;
  const isExporting = exportingStudent === studentId;

  const getStudentStatusClass = (studentId) => {
    if (exportingStudent === studentId) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStudentStatusDot = (studentId) => {
    if (exportingStudent === studentId) return 'bg-blue-500';
    return 'bg-gray-400';
  };


  const [status, setStatus] = useState('Pending for Approval');

  const getColorClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600';
      case 'Rejected':
        return 'text-red-600';
      case 'Pending for Approval':
      default:
        return 'text-yellow-500';
    }
  };






  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      
      <div className="p-1 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {student.FirstName} {student.Lastname}
              </div>
              <div className="text-xs text-gray-500">
                {student.student}
              </div>
            </div>
          </div>

          <button
            onClick={() => onViewProject(student, index)}
            disabled={isExporting}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3" />
                <span>Export Project</span>
              </>
            )}
          </button>
        </div>




        <div className="text-xs text-blue-600 font-medium">
                {/* {student.Status} */}
          
              
                <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className={`text-xs font-semibold rounded px-2 py-1 border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400 ${getColorClass(status)}`}
>
  <option value="Pending for Approval" className="text-orange-600">
    Pending for Approval
  </option>
  <option value="Approved" className="text-green-700">
    Approved
  </option>
  <option value="Rejected" className="text-red-600">
    Rejected
  </option>
</select>





        </div>



      </div>

      {/* Project Preview */}
      <ProjectPreview project={student.Project} />
    </div>
  );
}