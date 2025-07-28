import React, { useState } from 'react';
import {
  Users, ChevronDown, Eye, Check, AlertCircle, User, FileText, Loader2, ChevronRight
} from 'lucide-react';

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

  const getStudentStatusClass = (studentId) => {
    if (exportingStudent === studentId) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStudentStatusDot = (studentId) => {
    if (exportingStudent === studentId) return 'bg-blue-500';
    return 'bg-gray-400';
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

  const ProjectPreview = ({ project }) => (
    <div className="bg-white border border-gray-100 rounded p-2">
      <div className="text-sm font-semibold text-gray-900 mb-1">{project.project_title}</div>
      <div className="text-xs text-gray-600 mb-2">{project.description}</div>
      <div className="text-xs text-blue-600 font-medium">Subject: {project.subject_domain}</div>
    </div>
  );

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
              <div className="relative">
                <Users className={`w-5 h-5 ${getOverallStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getOverallStatusDot()}`}></div>
              </div>
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
                {studentsData.map((student, index) => {
                  const studentId = student.student;
                  const isExporting = exportingStudent === studentId;
                  
                  return (
                    <div key={studentId} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Student Header */}
                      <div className="p-1 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <User className={`w-4 h-4 ${getStudentStatusClass(studentId)}`} />
                              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStudentStatusDot(studentId)}`}></div>
                            </div>
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
                            onClick={() => handleViewProject(student, index)}
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
                })}
              </div>

              {/* Overall Status */}
              <div className={`text-center py-1 px-2 rounded-full text-xs font-medium inline-block mt-3 ${
                exportingStudent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {exportingStudent ? 'Exporting...' : 'Ready to export'}
              </div>

              {/* Instructions */}
              <div className="mt-3 bg-blue-50 border border-blue-200 p-2 rounded-lg">
                <h5 className="text-xs font-medium text-blue-900 mb-1">Instructions:</h5>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Click "Export Project" for any student</li>
                  <li>• A new section will be added to the document</li>
                  <li>• The project will be formatted with stages and tasks</li>
                  <li>• The document will automatically scroll to the new content</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}