import React, { useState, useRef, useEffect } from 'react';
import { FolderPlus, ChevronDown, Send, Lightbulb, Loader2, X, ChevronRight } from 'lucide-react';

export default function IntegratedProjectCreator() {
  // Main UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [userInput, setUserInput] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [wsConnection, setWsConnection] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);

  // Project state (from CreateProject)
  const [projectData, setProjectData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasProject, setHasProject] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasLockedOnce, setHasLockedOnce] = useState(false);
  const [view, setView] = useState('text'); // 'text' or 'structured'

  const responseRef = useRef(null);

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'art', label: 'Art' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' }
  ];

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (responseRef.current && isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [streamedResponse, isStreaming]);

  // Check if data has been edited
  useEffect(() => {
    if (originalData && projectData) {
      const hasChanges = JSON.stringify(projectData) !== JSON.stringify(originalData);
      setIsEdited(hasChanges);
    }
  }, [projectData, originalData]);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubjectDropdown && !event.target.closest('.relative')) {
        setShowSubjectDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSubjectDropdown]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const openDialog = () => setShowDialog(true);
  
  const closeDialog = () => {
    setShowDialog(false);
    setUserInput('');
    setSelectedSubject('');
    setShowSubjectDropdown(false);
    setSubjectError(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    if (!selectedSubject) {
      setSubjectError(true);
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setStreamedResponse('');
    setShowDialog(false);
    setSubjectError(false);
    setIsComplete(false);
    setHasResponse(false);
    
    // Reset project state
    setProjectData(null);
    setOriginalData(null);
    setHasProject(false);
    setIsEdited(false);
    setView('text');
    try {
      const userEmail = "mindspark.user1@schoolfuel.org";
      const subjectLabel = subjects.find(s => s.value === selectedSubject)?.label;
      const message = `${userInput}, Subject: ${subjectLabel}`;

      const ws = new WebSocket('wss://s7pmpoc37f.execute-api.us-west-1.amazonaws.com/prod/');
      setWsConnection(ws);

      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          setIsStreaming(false);
          setIsLoading(false);
          setStreamedResponse('Connection timeout. Please try again.');
          setHasResponse(true);
          setIsComplete(true);
        }
      }, 10000);

      let collectingJson = false;
      let jsonBuffer = '';

      ws.onopen = () => {
        console.log('WebSocket connected');
        clearTimeout(connectionTimeout);

        const requestPayload = {
          action: "testing",
          payload: {
            email_id: userEmail,
            message: message
          }
        };

        ws.send(JSON.stringify(requestPayload));
      };

      ws.onmessage = (event) => {
        const chunk = event.data.trim();

        // Check for end marker frame
        if (chunk === '__END__') {
          console.log('📍 Received __END__, switching to JSON mode');
          collectingJson = true;
          return;
        }

        if (collectingJson) {
          jsonBuffer += chunk;

          try {
            const parsedJson = JSON.parse(jsonBuffer);
            console.log('✅ Parsed final JSON:', parsedJson);

            if (parsedJson.type === 'final' && parsedJson.data?.project) {
              const projectInfo = parsedJson.data.project;
              setProjectData(projectInfo);
              setOriginalData(JSON.parse(JSON.stringify(projectInfo)));
              setHasProject(true);
              setView('structured');
              console.log('Project data set:', projectInfo);
            }

            collectingJson = false;
            jsonBuffer = '';
            setIsStreaming(false);
            setIsLoading(false);
            setIsComplete(true);
            setHasResponse(true);
            ws.close();
          } catch (err) {
            console.log('⏳ Buffering JSON chunk...');
          }
          return;
        }

        // Normal text streaming before __END__
        setStreamedResponse(prev => prev + chunk);
        setHasResponse(true);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(connectionTimeout);
        setIsStreaming(false);
        setIsLoading(false);
        setStreamedResponse('Connection error occurred. Please check your connection and try again.');
        setHasResponse(true);
        setIsComplete(true);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        clearTimeout(connectionTimeout);
        setWsConnection(null);

        if (event.code !== 1000 && isStreaming) {
          setStreamedResponse(prev => prev + '\n\n[Connection lost]');
          setIsStreaming(false);
          setIsLoading(false);
          setIsComplete(true);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setStreamedResponse('Failed to establish connection. Please try again later.');
      setHasResponse(true);
      setIsLoading(false);
      setIsStreaming(false);
      setIsComplete(true);
    }

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setStreamedResponse('');
    setHasResponse(false);
    setIsComplete(false);
    setProjectData(null);
    setOriginalData(null);
    setHasProject(false);
    setIsEdited(false);
    setIsLocked(false);
    setHasLockedOnce(false);
    setView('text');
    
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.close();
    }
  };

  const handleViewToggle = () => {
    setView(view === 'text' ? 'structured' : 'text');
  };

  const resetChanges = () => {
    if (originalData) {
      setProjectData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  const handleLockProject = () => {
    if (hasLockedOnce) return;
    // Here you would show lock confirmation dialog
    // For now, just lock directly
    setIsLocked(true);
    setHasLockedOnce(true);
    console.log('Project locked:', projectData);
  };

  // Status display helpers
  const getStatusClass = () => {
    if (isLocked) return 'text-red-600';
    if (isEdited) return 'text-orange-600';
    if (hasProject) return 'text-green-600';
    if (isStreaming) return 'text-yellow-600';
    if (hasResponse) return 'text-green-600';
    if (isLoading) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (isLocked) return 'bg-red-500';
    if (isEdited) return 'bg-orange-500';
    if (hasProject) return 'bg-green-500';
    if (isStreaming) return 'bg-yellow-500';
    if (hasResponse) return 'bg-green-500';
    if (isLoading) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isLocked) return 'Locked for review';
    if (isEdited) return 'Modified project';
    if (hasProject) return 'Project ready';
    if (isStreaming) return 'Generating response...';
    if (hasResponse) return 'Response ready';
    if (isLoading) return 'Connecting...';
    return 'Create amazing projects';
  };

  const renderStructuredProject = () => {
    if (!projectData) return null;

    return (
      <div className="space-y-3">
        {/* Project Header */}
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 text-sm">{projectData.project_title}</h3>
          <p className="text-xs text-purple-700 mt-1">Subject: {projectData.subject_domain}</p>
          <p className="text-xs text-purple-600 mt-1">{projectData.stages?.length || 0} stages</p>
        </div>

        {/* Stages */}
        {projectData.stages?.map((stage, index) => (
          <div key={stage.stage_id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 text-sm mb-2">
              Stage {stage.stage_order}: {stage.title}
            </h4>
            
            {/* Tasks */}
            <div className="space-y-2 mb-2">
              {stage.tasks?.map((task) => (
                <div key={task.task_id} className="bg-white p-2 rounded border border-gray-100">
                  <div className="font-medium text-xs text-gray-800">{task.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{task.description}</div>
                  {task.resource_id && (
                    <div className="text-xs text-blue-600 mt-1">
                      Resource: {task.resource_id.label}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Gate */}
            {stage.gate && (
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                <div className="font-medium text-xs text-yellow-800">{stage.gate.title}</div>
                <div className="text-xs text-yellow-700 mt-1">{stage.gate.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[300px] font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden transition-all duration-200">
        {/* Toggle Button */}
        <div 
          onClick={toggleExpanded} 
          className="w-full p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FolderPlus className={`w-5 h-5 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Project Generator</div>
                <div className="text-sm text-gray-500">
                  {getStatusText()}
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
              <div className="mb-3">
                <button
                  onClick={openDialog}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Generate Project</span>
                </button>
              </div>

              {/* Project Controls */}
              {hasProject && (
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={handleViewToggle}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {view === 'text' ? 'Structured' : 'Text'} View
                  </button>
                  
                  {isEdited && (
                    <button
                      onClick={resetChanges}
                      className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  
                  {!isLocked && hasProject && (
                    <button
                      onClick={handleLockProject}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Lock
                    </button>
                  )}
                </div>
              )}

              {/* Response Output */}
              {hasResponse && (
                <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-medium text-purple-900">
                      {hasProject ? 'Generated Project' : 'AI Response'}
                    </h4>
                    {isStreaming && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        Streaming...
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Complete
                      </span>
                    )}
                  </div>

                  {/* Response Content */}
                  <div className="p-3 max-h-80 overflow-y-auto">
                    {view === 'structured' && hasProject ? (
                      renderStructuredProject()
                    ) : (
                      <div 
                        ref={responseRef}
                        className="text-xs text-purple-800 whitespace-pre-line leading-relaxed"
                      >
                        {streamedResponse}
                        {isStreaming && (
                          <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1 align-middle"></span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-purple-200 p-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(hasProject && view === 'structured' ? JSON.stringify(projectData, null, 2) : streamedResponse)}
                      className="text-xs text-purple-600 hover:bg-purple-100 transition-colors px-1 py-0.5 rounded"
                    >
                      📋 Copy {hasProject && view === 'structured' ? 'project data' : 'response'}
                    </button>
                  </div>
                </div>
              )}

              {/* Tips */}
              {!hasResponse && !isLoading && (
                <div className="mt-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                  <h5 className="text-xs font-medium text-gray-900 mb-1">💡 Tips:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Be specific about what you want</li>
                    <li>• Mention your skill level</li>
                    <li>• Include preferred subjects</li>
                  </ul>
                </div>
              )}

              {/* Clear Button */}
              {hasResponse && (
                <div className="mt-3">
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg w-full max-w-sm mx-2">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Project Generator</h2>
              </div>
              <button
                onClick={closeDialog}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What project do you want to create?
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your project idea in detail..."
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Focus <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className={`w-full px-3 py-2 text-sm text-left border rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none flex items-center justify-between ${
                      subjectError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500'
                    }`}
                  >
                    <span className={selectedSubject ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedSubject ? subjects.find(s => s.value === selectedSubject)?.label : 'Select Subject'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {subjectError && (
                    <p className="mt-1 text-xs text-red-600">Please select a subject</p>
                  )}
                  
                  {showSubjectDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div className="py-1">
                        {subjects.map((subject) => (
                          <button
                            key={subject.value}
                            type="button"
                            onClick={() => {
                              setSelectedSubject(subject.value);
                              setShowSubjectDropdown(false);
                              setSubjectError(false);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                              selectedSubject === subject.value ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                            }`}
                          >
                            {subject.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Example:</strong> "Create a hands-on volcano project with experiments and presentations" or "Design a math curriculum for fractions with visual aids"
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                onClick={closeDialog}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim() || isLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}