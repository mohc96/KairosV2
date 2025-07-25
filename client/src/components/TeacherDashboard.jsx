import { useEffect, useState } from 'react';
import { FileText, MessageSquareText } from 'lucide-react';

export default function TeacherDashboard({ email }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    google.script.run
      .withSuccessHandler((data) => setProjects(data))
      .getStudentProjectsForTeacher(); // Define this in Apps Script
  }, []);

  return (
    <div className="space-y-4 p-2">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Teacher Dashboard</h2>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-600">No student submissions yet.</p>
      ) : (
        projects.map((project, index) => (
          <div
            key={index}
            className="p-3 border border-slate-200 rounded-lg shadow-sm bg-white space-y-1"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-slate-800">{project.title}</h3>
              <span className="text-xs text-slate-500">{project.studentEmail}</span>
            </div>
            <p className="text-sm text-slate-600">{project.summary}</p>
            <div className="flex gap-2 mt-2">
              <a
                href={project.docLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm flex items-center gap-1"
              >
                <FileText className="w-4 h-4" /> View Doc
              </a>
              <button className="text-green-700 text-sm flex items-center gap-1">
                <MessageSquareText className="w-4 h-4" /> Add Feedback
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
