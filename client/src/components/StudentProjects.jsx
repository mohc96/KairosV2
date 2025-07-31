import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import StudentProjectCard from './StudentProjectCard';

export default function StudentProjects(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportingStudent, setExportingStudent] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Use the structured students data from props
  const studentsData = props.studentsData || [];

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const formatProjectContent = (project) => {
    let content = `${project.project_title}\n\n`;
    content += `Student: ${project.student || 'N/A'}\n`;
    content += `Subject Domain: ${project.subject_domain}\n`;
    content += `Project Title: ${project.project_title}\n`;
    content += `Description: ${project.description}\n\n`;

    project.stages.forEach((stage, stageIndex) => {
      content += `Stage ${stage.stage_order}: ${stage.title}\n\n`;
      
      content += `Tasks\n`;
      stage.tasks.forEach((task, taskIndex) => {
        content += `${taskIndex + 1}. ${task.title}\n`;
        content += `   Description: ${task.description}\n`;
        content += `   Standard: ${task.academic_standard}\n`;
        content += `   Resource: ${task.resource_id.label}\n`;
        content += `   URL: ${task.resource_id.url}\n\n`;
      });

      if (stage.gate) {
        content += `Gate: ${stage.gate.title}\n`;
        content += `${stage.gate.description}\n`;
        stage.gate.checklist.forEach(item => {
          content += `* ${item}\n`;
        });
        content += `\n`;
      }
    });

    return content;
  };

  const handleViewProject = async (student, index) => {
    const studentId = student.student;
    setExportingStudent(studentId);
    setDebugInfo(`Starting export for ${student.FirstName} ${student.Lastname}...`);

    try {
      const studentName = `${student.FirstName} ${student.Lastname}`;
      const projectContent = formatProjectContent(student.Project);

      console.log('Export starting for:', studentName);
      console.log('Project content length:', projectContent.length);

      await new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.script) {
          setDebugInfo(`Exporting ${studentName} Projects ...`);
          
          google.script.run
            .withSuccessHandler((result) => {
              console.log('Export successful for', studentName, ':', result);
              setDebugInfo(`Successfully exported ${studentName}`);
              
              // Scroll to the newly added section
              setTimeout(() => {
                const doc = DocumentApp.getActiveDocument();
                const body = doc.getBody();
                const numChildren = body.getNumChildren();
                if (numChildren > 0) {
                  const lastElement = body.getChild(numChildren - 1);
                  doc.setCursor(doc.newPosition(lastElement, 0));
                }
              }, 500);
              
              resolve(result);
            })
            .withFailureHandler((error) => {
              console.error('Export failed for', studentName, error);
              const errorMessage = error.message || error.toString() || 'Unknown error occurred';
              setDebugInfo(`Export failed for ${studentName}: ${errorMessage}`);
              reject(error);
            })
            .createStudentTab(studentName, projectContent);
        } else {
          setDebugInfo(`Simulating export for ${studentName} (no Google Apps Script detected)`);
          setTimeout(() => {
            console.log(`Creating new section: "${studentName}"`);
            console.log('Project Content Length:', projectContent.length);
            setDebugInfo(`Simulated export complete for ${studentName}`);
            resolve('simulated success');
          }, 1500);
        }
      });

    } catch (error) {
      console.error('Error exporting project for', student.FirstName, error);
      const errorMessage = error.message || error.toString() || 'Unknown error in React component';
      setDebugInfo(`React Error: ${errorMessage}`);
    } finally {
      setExportingStudent(null);
    }
  };

  const getOverallStatusText = () => {
    if (exportingStudent) return 'Exporting project...';
    return `${studentsData.length} student projects ready`;
  };

  const getOverallStatusClass = () => {
    if (exportingStudent) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getOverallStatusDot = () => {
    if (exportingStudent) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full max-w-[400px] font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden transition-all duration-200">
        {/* Toggle Button */}
        <div 
          onClick={toggleExpanded} 
          className="w-full p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium text-gray-900">Student Projects</div>
                <div className="text-sm text-gray-500">
                  {getOverallStatusText()}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-3">
              
              {/* Debug Info */}
              {debugInfo && (
                <div className="mb-3 p-2 bg-gray-50 border rounded text-xs font-mono text-gray-600">
                  <strong>Debug:</strong> {debugInfo}
                </div>
              )}

              {/* Students List */}
              <div className="space-y-3">
                {studentsData.map((student, index) => (
                  <StudentProjectCard 
                    key={student.student}
                    student={student}
                    index={index}
                    exportingStudent={exportingStudent}
                    onViewProject={handleViewProject}
                  />
                ))}
              </div>

              {/* Overall Status */}
              <div className={`text-center py-1 px-2 rounded-full text-xs font-medium inline-block mt-3 ${
                exportingStudent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {exportingStudent ? 'Exporting...' : 'Ready to export'}
              </div>

              {/* Instructions */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}