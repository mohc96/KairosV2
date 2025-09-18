import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { FolderPlus, ChevronDown, Lightbulb, RefreshCw } from 'lucide-react';

import ProjectDialog from './ProjectDialog';
import ProjectControls from './ProjectControls';
import LockConfirmationDialog from './LockConfirmationDialog';
import useProjectEditor from '../../hooks/useProjectEditor';
import ProjectViewer from './ProjectViewer';

// Streaming state management with useReducer
const initialStreamingState = {
  isStreaming: false,
  streamedResponse: '',
  isComplete: false,
  hasResponse: false,
  error: null
};

const streamingReducer = (state, action) => {
  switch (action.type) {
    case 'START_STREAMING':
      return {
        ...initialStreamingState,
        isStreaming: true
      };
    case 'APPEND_CONTENT':
      return {
        ...state,
        streamedResponse: state.streamedResponse + action.payload,
        hasResponse: true
      };
    case 'COMPLETE_STREAMING':
      return {
        ...state,
        isStreaming: false,
        isComplete: true
      };
    case 'SET_ERROR':
      return {
        ...state,
        isStreaming: false,
        error: action.payload,
        isComplete: true
      };
    case 'RESET':
      return initialStreamingState;
    default:
      return state;
  }
};

export default function CreateProjectAI() {
  // Main UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Project state (keeping original structure)
  const [projectOutput, setProjectOutput] = useState('');
  const [projectData, setProjectData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasProject, setHasProject] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasLockedOnce, setHasLockedOnce] = useState(false);
  const [view, setView] = useState('text'); // 'text' or 'structured'

  // Streaming state
  const [streamingState, streamingDispatch] = useReducer(streamingReducer, initialStreamingState);
  const [wsConnection, setWsConnection] = useState(null);
  const [connectionMode, setConnectionMode] = useState('rest'); // 'rest' or 'websocket'
  const maxRetries = 3;

  // Custom hook for project editing functionality
  const projectEditor = useProjectEditor();
  const responseRef = useRef(null);

  // Auto-scroll effect for streaming
  useEffect(() => {
    if (responseRef.current && streamingState.isStreaming) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [streamingState.streamedResponse, streamingState.isStreaming]);

  // Check if data has been edited
  useEffect(() => {
    if (originalData && projectData) {
      const hasChanges = JSON.stringify(projectData) !== JSON.stringify(originalData);
      setIsEdited(hasChanges);
    }
  }, [projectData, originalData]);

  // Cleanup WebSocket
  useEffect(() => {
    return () => {
      if (wsConnection?.readyState === WebSocket.OPEN) {
        wsConnection.close();
      }
    };
  }, [wsConnection]);

  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'art', label: 'Art' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' }
  ];

  // WebSocket connection with retry logic
  const connectWebSocket = useCallback((message, retryCount = 0) => {
    if (retryCount >= maxRetries) {
      streamingDispatch({ type: 'SET_ERROR', payload: 'Failed to connect after multiple attempts' });
      setIsLoading(false);
      return;
    }

    const ws = new WebSocket('wss://s7pmpoc37f.execute-api.us-west-1.amazonaws.com/prod/');
    setWsConnection(ws);

    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.close();
        if (retryCount < maxRetries - 1) {
          console.log(`Connection timeout, retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => connectWebSocket(message, retryCount + 1), 1000);
        } else {
          streamingDispatch({ type: 'SET_ERROR', payload: 'Connection timeout' });
          setIsLoading(false);
        }
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
          email_id: "mindspark.user1@schoolfuel.org",
          message: message
        }
      };

      ws.send(JSON.stringify(requestPayload));
    };

    ws.onmessage = (event) => {
      const chunk = event.data.trim();

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
            // Use the same structure as REST API response
            const projectInfo = parsedJson.data.project;
            setProjectData(projectInfo);
            setOriginalData(JSON.parse(JSON.stringify(projectInfo)));
            setHasProject(true);
            setView('structured');
            
            // Set project output for compatibility with existing components
            const textOutput = `Subject: ${projectInfo.subject_domain}\nGenerated project: ${projectInfo.project_title}\n\nProject includes ${projectInfo.stages?.length || 0} stages with structured tasks and gates.`;
            setProjectOutput(textOutput);
          }

          streamingDispatch({ type: 'COMPLETE_STREAMING' });
          setIsLoading(false);
          ws.close();
        } catch (err) {
          console.log('⏳ Buffering JSON chunk...');
        }
        return;
      }

      streamingDispatch({ type: 'APPEND_CONTENT', payload: chunk });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      clearTimeout(connectionTimeout);
      
      if (retryCount < maxRetries - 1) {
        console.log(`Connection error, retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => connectWebSocket(message, retryCount + 1), 1000);
      } else {
        streamingDispatch({ type: 'SET_ERROR', payload: 'Connection error occurred' });
        setIsLoading(false);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      clearTimeout(connectionTimeout);
      setWsConnection(null);

      if (event.code !== 1000 && streamingState.isStreaming && retryCount < maxRetries - 1) {
        console.log(`Connection closed unexpectedly, retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => connectWebSocket(message, retryCount + 1), 1000);
      } else if (event.code !== 1000 && streamingState.isStreaming) {
        streamingDispatch({ type: 'SET_ERROR', payload: 'Connection lost' });
        setIsLoading(false);
      }
    };
  }, [streamingState.isStreaming, maxRetries]);

  // WebSocket submission handler
  const handleWebSocketSubmit = async (userInput, selectedSubject) => {
    setIsLoading(true);
    setProjectOutput('');
    setShowDialog(false);

    // Reset states
    streamingDispatch({ type: 'START_STREAMING' });
    setHasProject(false);
    setProjectData(null);
    setOriginalData(null);
    setIsEdited(false);
    setView('text');
    
    const subjectLabel = subjects.find(s => s.value === selectedSubject)?.label;
    const message = `${userInput}, Subject: ${subjectLabel}`;
    
    connectWebSocket(message);
  };

  // Original REST API submission handler
  const handleRestSubmit = async (userInput, selectedSubject) => {
    setIsLoading(true);
    setProjectOutput('');
    setShowDialog(false);

    try {
      const promptWithSubject = `${userInput} (Subject: ${subjects.find(s => s.value === selectedSubject)?.label})`;
      const result = await new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.script) {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(reject)
            .generateProject(promptWithSubject);
        } 
      });

      // Parse the result
      let parsedData;
      let textOutput;
      
      try {
        parsedData = JSON.parse(result);
        textOutput = `Subject: ${selectedSubject}\nGenerated project for: ${userInput}\n\nProject includes ${parsedData.stages?.length || 0} stages with structured tasks and gates.`;
        setProjectData(parsedData);
        setOriginalData(JSON.parse(JSON.stringify(parsedData)));
        setView('structured');
      } catch (parseError) {
        console.warn('Could not parse as JSON, treating as text:', parseError);
        textOutput = result || "Project generated successfully";
        setView('text');
      }

      setProjectOutput(textOutput);
      setHasProject(true);
      
    } catch (error) {
      console.error('Error calling generateProject:', error);
      setProjectOutput("I'm currently unable to connect to the project service. Please try again later.");
      setHasProject(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Main submission handler - choose between REST and WebSocket
  const handleProjectSubmit = async (userInput, selectedSubject) => {
    // Reset streaming state when using REST
    if (connectionMode === 'rest') {
      streamingDispatch({ type: 'RESET' });
      await handleRestSubmit(userInput, selectedSubject);
    } else {
      await handleWebSocketSubmit(userInput, selectedSubject);
    }
  };

  const handleRetry = () => {
    // Retry with last known good state if available
    if (streamingState.error && connectionMode === 'websocket') {
      // For retry, we'd need to store the last request - for now just show dialog again
      setShowDialog(true);
    }
  };

  const handleClear = () => {
    setProjectOutput('');
    setHasProject(false);
    setProjectData(null);
    setOriginalData(null);
    setIsEdited(false);
    setIsLocked(false);
    setHasLockedOnce(false);
    setView('text');
    streamingDispatch({ type: 'RESET' });
    
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.close();
    }
  };

  const handleLockProject = () => {
    if (hasLockedOnce) return;
    setShowLockDialog(true);
  };

  const confirmLockProject = (result) => {
    if (result && result.success) {
      setIsLocked(true);
      setHasLockedOnce(true);
      setShowLockDialog(false);
      console.log('✅ Project locked and submitted:', result);
    } else {
      console.log('❌ Project lock failed:', result);
    }
  };

  const resetChanges = () => {
    if (originalData) {
      setProjectData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  const handleViewToggle = () => {
    setView(view === 'text' ? 'structured' : 'text');
  };

  // Status display helpers - updated to include streaming states
  const getStatusClass = () => {
    if (isLocked) return 'text-red-600';
    if (isEdited) return 'text-orange-600';
    if (hasProject) return 'text-green-600';
    if (streamingState.isStreaming) return 'text-yellow-600';
    if (streamingState.error) return 'text-red-600';
    if (isLoading) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (isLocked) return 'bg-red-500';
    if (isEdited) return 'bg-orange-500';
    if (hasProject) return 'bg-green-500';
    if (streamingState.isStreaming) return 'bg-yellow-500';
    if (streamingState.error) return 'bg-red-500';
    if (isLoading) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isLocked) return 'Locked for review';
    if (isEdited) return 'Modified project';
    if (hasProject) return 'Project ready';
    if (streamingState.isStreaming) return 'Generating response...';
    if (streamingState.error) return 'Connection error';
    if (isLoading) return 'Generating project...';
    return 'Build something amazing';
  };

  return (
    <div className="w-full max-w-[300px] font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden transition-all duration-200">
        {/* Toggle Button */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="w-full p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FolderPlus className={`w-5 h-5 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Create Project</div>
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
              {/* Connection Mode Toggle */}
              <div className="mb-3 flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setConnectionMode('rest')}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    connectionMode === 'rest' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  REST API
                </button>
                <button
                  onClick={() => setConnectionMode('websocket')}
                  className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                    connectionMode === 'websocket' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  WebSocket
                </button>
              </div>

              <div className="mb-3">
                <button
                  onClick={() => setShowDialog(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Project Controls - Reusing existing component */}
              <ProjectControls
                view={view}
                onViewToggle={handleViewToggle}
                isLocked={isLocked}
                isEdited={isEdited}
                onLockProject={handleLockProject}
                onResetChanges={resetChanges}
                hasProject={hasProject}
                projectData={projectData}
              />

              {/* Streaming Error Display with Retry */}
              {streamingState.error && connectionMode === 'websocket' && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-800">Connection Error</span>
                  </div>
                  <p className="text-xs text-red-700 mb-2">{streamingState.error}</p>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                </div>
              )}

              {/* Streaming Response Display */}
              {streamingState.hasResponse && !streamingState.error && connectionMode === 'websocket' && !hasProject && (
                <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-medium text-purple-900">AI Response</h4>
                    {streamingState.isStreaming && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        Streaming...
                      </span>
                    )}
                    {streamingState.isComplete && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Complete
                      </span>
                    )}
                  </div>

                  <div className="p-3 max-h-80 overflow-y-auto">
                    <div 
                      ref={responseRef}
                      className="text-xs text-purple-800 whitespace-pre-line leading-relaxed"
                    >
                      {streamingState.streamedResponse}
                      {streamingState.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1 align-middle"></span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-purple-200 p-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(streamingState.streamedResponse)}
                      className="text-xs text-purple-600 hover:bg-purple-100 transition-colors px-1 py-0.5 rounded"
                    >
                      📋 Copy response
                    </button>
                  </div>
                </div>
              )}

              {/* Project Output - Reusing existing ProjectViewer component */}
              {projectOutput && (
                <ProjectViewer
                  projectOutput={projectOutput}
                  projectData={projectData}
                  view={view}
                  isEdited={isEdited}
                  isLocked={isLocked}
                  projectEditor={projectEditor}
                  setProjectData={setProjectData}
                  formatProjectForCopy={projectEditor.formatProjectForCopy}
                />
              )}

              {/* Tips */}
              {!projectOutput && !isLoading && !streamingState.hasResponse && !streamingState.error && (
                <div className="mt-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                  <h5 className="text-xs font-medium text-gray-900 mb-1">💡 Tips:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Be specific about what you want</li>
                    <li>• Mention your skill level</li>
                    <li>• Include preferred tech</li>
                    {connectionMode === 'websocket' && (
                      <li>• WebSocket provides real-time streaming</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Clear Button */}
              {(projectOutput || streamingState.hasResponse || streamingState.error) && (
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

      {/* Dialogs - Reusing existing components */}
      <ProjectDialog
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
        onSubmit={handleProjectSubmit}
        isLoading={isLoading}
      />

      <LockConfirmationDialog
        showDialog={showLockDialog}
        onConfirm={confirmLockProject}
        onCancel={() => setShowLockDialog(false)}
        projectData={projectData}
      />
    </div>
  );
}