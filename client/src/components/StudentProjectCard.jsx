import React from 'react';
import { User, FileText, Loader2 } from 'lucide-react';
import ProjectPreview from './ProjectPreview';





// const ProjectPreview = ({ project }) => (
//   <div className="bg-white border border-gray-100 rounded p-2">
//     <div className="text-sm font-semibold text-gray-900 mb-1">{project.project_title}</div>
//     <div className="text-xs text-gray-600 mb-2">{project.description}</div>
//     <div className="text-xs text-blue-600 font-medium">Subject: {project.subject_domain}</div>
//   </div>
// );

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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Student Header */}
      <div className="p-1 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {student.FirstName} {student.Lastname}
              </div>
              <div className="text-xs text-gray-500">
                {student.student}
              </div>
              <div className="text-xs text-blue-600 font-medium">
                {student.Project.subject_domain}
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
      </div>

      {/* Project Preview */}
      <ProjectPreview project={student.Project} />
    </div>
  );
}