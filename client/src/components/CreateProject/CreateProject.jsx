import React, { useState, useEffect } from 'react';
import { FolderPlus, ChevronDown } from 'lucide-react';

import ProjectDialog from './ProjectDialog';
import ProjectControls from './ProjectControls';
import LockConfirmationDialog from './LockConfirmationDialog';
import useProjectEditor from '../../hooks/useProjectEditor';
import ProjectViewer from './ProjectViewer';

export default function CreateProject() {
  // Main UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Project state
  const [projectOutput, setProjectOutput] = useState('');
  const [projectData, setProjectData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasProject, setHasProject] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [hasLockedOnce, setHasLockedOnce] = useState(false);
  const [view, setView] = useState('text'); // 'text' or 'structured'
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [wsConnection, setWsConnection] = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected');

  // Custom hook for project editing functionality
  const projectEditor = useProjectEditor();

  // Check if data has been edited
  useEffect(() => {
    if (originalData && projectData) {
      const hasChanges = JSON.stringify(projectData) !== JSON.stringify(originalData);
      setIsEdited(hasChanges);
    }
  }, [projectData, originalData]);

  const handleProjectSubmit = async (userInput, selectedSubject) => {
  setIsLoading(true);
  setIsStreaming(true);
  setProjectOutput('');
  setStreamedContent('');
  setShowDialog(false);
  setWsStatus('connecting');

  try {
    const subjects = [
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'science', label: 'Science' },
      { value: 'english', label: 'English' },
      { value: 'history', label: 'History' },
      { value: 'art', label: 'Art' },
      { value: 'technology', label: 'Technology' },
      { value: 'other', label: 'Other' }
    ];

    // Get user email (replace with your actual user email retrieval)
    const userEmail = "mindspark.user1@schoolfuel.org";
    
    const subjectLabel = subjects.find(s => s.value === selectedSubject)?.label;
    const message = `${userInput}, Subject: ${subjectLabel}`;

    // WebSocket connection
    const ws = new WebSocket('wss://s7pmpoc37f.execute-api.us-west-1.amazonaws.com/prod/'); // Replace with your WebSocket URL
    setWsConnection(ws);

    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.close();
        setWsStatus('disconnected');
        setIsStreaming(false);
        setIsLoading(false);
        setProjectOutput("Connection timeout. Please try again.");
      }
    }, 10000); // 10 second timeout

    ws.onopen = () => {
      console.log('WebSocket connected');
      clearTimeout(connectionTimeout);
      setWsStatus('connected');
      
      // Send the request
      const requestPayload = {
        action: "testing",
        payload: {
          email_id: userEmail,
          message: message
        }
      };
      
      console.log('Sending WebSocket message:', requestPayload);
      ws.send(JSON.stringify(requestPayload));
    };

    ws.onmessage = (event) => {
      const chunk = event.data;
      console.log('WebSocket chunk received:', chunk);
      
      // Check for end marker
      if (chunk.includes('__END__')) {
        // Remove the end marker and add any remaining content
        const finalChunk = chunk.replace('__END__', '');
        if (finalChunk.trim()) {
          setStreamedContent(prev => {
            const newContent = prev + finalChunk;
            console.log('Final content:', newContent);
            return newContent;
          });
        }
        
        // Small delay to ensure final content is rendered
        setTimeout(() => {
          handleStreamComplete();
        }, 100);
        
        ws.close();
        return;
      }
      
      // Append chunk to streamed content with immediate state update
      setStreamedContent(prev => {
        const newContent = prev + chunk;
        console.log('Streaming content updated:', newContent.length, 'characters');
        return newContent;
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      clearTimeout(connectionTimeout);
      setWsStatus('disconnected');
      setProjectOutput("Connection error occurred. Please check your connection and try again.");
      setIsStreaming(false);
      setIsLoading(false);
      setHasProject(false);
      ws.close();
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      clearTimeout(connectionTimeout);
      setWsConnection(null);
      setWsStatus('disconnected');
      
      if (event.code !== 1000 && isStreaming) {
        // Abnormal closure during streaming
        setProjectOutput("Connection was lost. Please try again.");
        setIsLoading(false);
        setIsStreaming(false);
        setHasProject(false);
      }
    };

  } catch (error) {
    console.error('Error setting up WebSocket:', error);
    setWsStatus('disconnected');
    setProjectOutput("Failed to establish connection. Please try again later.");
    setHasProject(false);
    setIsLoading(false);
    setIsStreaming(false);
  }
};


const handleStreamComplete = () => {
  console.log('Stream completed, processing final content...');
  
  setIsStreaming(false);
  setIsLoading(false);
  setWsStatus('disconnected');
  
  // Get the complete streamed content
  setStreamedContent(currentContent => {
    console.log('Processing complete content:', currentContent);
    
    // Try to parse as JSON first
    let parsedData;
    let textOutput;
    
    try {
      parsedData = JSON.parse(currentContent);
      textOutput = `Generated project with ${parsedData.stages?.length || 0} stages`;
      setProjectData(parsedData);
      setOriginalData(JSON.parse(JSON.stringify(parsedData)));
      setView('structured');
      console.log('Successfully parsed JSON:', parsedData);
    } catch (parseError) {
      console.warn('Could not parse streamed content as JSON, treating as text:', parseError);
      textOutput = currentContent || "Project generated successfully";
      setView('text');
    }

    setProjectOutput(textOutput);
    setHasProject(true);
    
    return currentContent; // Return unchanged content
  });
};

// Add cleanup function for component unmount
useEffect(() => {
  return () => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      console.log('Cleaning up WebSocket connection');
      wsConnection.close();
      setWsStatus('disconnected');
    }
  };
}, [wsConnection]);

const debugStreamedContent = () => {
  console.log('Current streamed content:', streamedContent);
  console.log('Content length:', streamedContent.length);
  console.log('Is streaming:', isStreaming);
  console.log('WebSocket status:', wsStatus);
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
  };

  const handleLockProject = () => {
    if (hasLockedOnce) return;
    setShowLockDialog(true);
  };

  const confirmLockProject = (result) => {
    if (result && result.success){
      setIsLocked(true);
      setHasLockedOnce(true);
      setShowLockDialog(false);
      console.log('✅ Project locked and submitted:', result);
    } else {
    // Handle failure case - keep dialog open so user can see the error
    console.log('❌ Project lock failed:', result);
    // Don't close dialog here - let the dialog component handle showing the error
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

  // Status display helpers
  const getStatusClass = () => {
    if (isLocked) return 'text-red-600';
    if (isEdited) return 'text-orange-600';
    if (hasProject) return 'text-green-600';
    if (isLoading) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (isLocked) return 'bg-red-500';
    if (isEdited) return 'bg-orange-500';
    if (hasProject) return 'bg-green-500';
    if (isLoading) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isLocked) return 'Locked for review';
    if (isEdited) return 'Modified project';
    if (hasProject) return 'Project ready';
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

              {/* Project Controls */}
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

              {/* Project Output */}
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
              {!projectOutput && !isLoading && (
                <div className="mt-3 bg-gray-50 border border-gray-200 p-2 rounded-lg">
                  <h5 className="text-xs font-medium text-gray-900 mb-1">💡 Tips:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Be specific about what you want</li>
                    <li>• Mention your skill level</li>
                    <li>• Include preferred tech</li>
                  </ul>
                </div>
              )}

              {/* Clear Button */}
              {(projectOutput) && (
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

      {/* Dialogs */}
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