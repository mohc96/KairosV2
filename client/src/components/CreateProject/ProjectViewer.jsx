import React, { useRef, useEffect } from 'react';
import { Lightbulb, ChevronDown, ChevronRight, Check, Wifi, WifiOff } from 'lucide-react';
import InlineEditableField from '../InlineEditableField';

const ProjectViewer = ({ 
  projectOutput, 
  projectData, 
  view, 
  isEdited, 
  isLocked, 
  projectEditor,
  setProjectData,
  formatProjectForCopy,
  isStreaming = false,
  streamedContent = '',
  wsStatus = 'disconnected' // 'connecting', 'connected', 'disconnected'
}) => {
  const streamingContentRef = useRef(null);
  const {
    expandedStages,
    toggleStageExpansion,
    updateTaskField,
    updateStageTitle,
    updateGateField
  } = projectEditor;

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (isStreaming && streamingContentRef.current) {
      streamingContentRef.current.scrollTop = streamingContentRef.current.scrollHeight;
    }
  }, [streamedContent, isStreaming]);

  const getConnectionStatus = () => {
    switch (wsStatus) {
      case 'connecting':
        return { icon: <Wifi className="w-3 h-3 text-yellow-600 animate-pulse" />, text: 'Connecting...', color: 'yellow' };
      case 'connected':
        return { icon: <Wifi className="w-3 h-3 text-green-600" />, text: 'Connected', color: 'green' };
      default:
        return { icon: <WifiOff className="w-3 h-3 text-red-600" />, text: 'Disconnected', color: 'red' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
      <div className="bg-purple-50 p-2 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-purple-600" />
        <h4 className="text-sm font-medium text-purple-900">Your Project</h4>
        
        {/* WebSocket Status */}
        <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 bg-${connectionStatus.color}-100 text-${connectionStatus.color}-800`}>
          {connectionStatus.icon}
          {connectionStatus.text}
        </span>
        
        {/* Streaming indicator */}
        {isStreaming && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            Streaming...
          </span>
        )}
        
        {isEdited && !isStreaming && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Modified
          </span>
        )}
        
        {isLocked && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            Locked
          </span>
        )}
      </div>

      {/* Project Content */}
      <div className="p-3 max-h-80 overflow-y-auto">
        {isStreaming ? (
          /* Real-time Streaming Content Display */
          <div className="space-y-3">
            <div className="text-xs text-gray-600 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              Receiving data stream...
            </div>
            
            {/* Raw Stream Display */}
            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
              <div className="text-gray-500 mb-2">// Raw WebSocket Data Stream:</div>
              <div 
                ref={streamingContentRef}
                className="max-h-40 overflow-y-auto whitespace-pre-wrap break-all"
              >
                {streamedContent}
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1 align-middle"></span>
              </div>
            </div>

            {/* JSON Preview (if parseable) */}
            {streamedContent && (() => {
              try {
                // Try to parse what we have so far
                const parsed = JSON.parse(streamedContent);
                return (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="text-xs font-medium text-blue-800 mb-2">JSON Preview:</div>
                    <pre className="text-xs text-blue-700 whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(parsed, null, 2)}
                    </pre>
                  </div>
                );
              } catch (e) {
                // If not valid JSON yet, show partial content info
                return (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="text-xs font-medium text-yellow-800 mb-1">Parsing Status:</div>
                    <div className="text-xs text-yellow-700">
                      Receiving... ({streamedContent.length} characters)
                      <br />
                      {streamedContent.includes('{') ? '✓ JSON start detected' : '⏳ Waiting for JSON start'}
                      <br />
                      {streamedContent.split('{').length - 1} opening braces, {streamedContent.split('}').length - 1} closing braces
                    </div>
                  </div>
                );
              }
            })()}

            {/* Connection Stats */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <div>Bytes received: {new Blob([streamedContent]).size}</div>
              <div>Characters: {streamedContent.length}</div>
              <div>Lines: {streamedContent.split('\n').length}</div>
            </div>
          </div>
        ) : (
          /* Final Content Display */
          <>
            {view === 'text' ? (
              <div className="text-xs text-purple-800 whitespace-pre-line leading-relaxed">
                {projectOutput}
              </div>
            ) : (
              /* Structured Project View */
              <div className="space-y-2">
                {projectData?.stages?.map((stage) => (
                  <div key={stage.stage_id} className="border border-gray-200 rounded overflow-hidden">
                    {/* Stage Header */}
                    <div className="p-2 bg-gray-50 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStageExpansion(stage.stage_id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedStages[stage.stage_id] ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronRight size={12} />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <InlineEditableField
                            value={stage.title}
                            onSave={(value) => updateStageTitle(projectData, setProjectData, stage.stage_id, value, isLocked)}
                            placeholder="Stage title"
                            displayClassName="text-xs font-medium truncate"
                            isLocked={isLocked}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Stage Content */}
                    {expandedStages[stage.stage_id] && (
                      <div className="p-2 space-y-2">
                        {/* Tasks */}
                        {stage.tasks?.map((task) => (
                          <div key={task.task_id} className="p-2 bg-gray-50 rounded text-xs space-y-1">
                            <InlineEditableField
                              value={task.title}
                              onSave={(value) => updateTaskField(projectData, setProjectData, stage.stage_id, task.task_id, 'title', value, isLocked)}
                              placeholder="Task title"
                              displayClassName="font-medium"
                              isLocked={isLocked}
                            />

                            <InlineEditableField
                              value={task.description}
                              onSave={(value) => updateTaskField(projectData, setProjectData, stage.stage_id, task.task_id, 'description', value, isLocked)}
                              placeholder="Task description"
                              multiline={true}
                              displayClassName="text-gray-600 text-xs"
                              isLocked={isLocked}
                            />

                            <div className="text-gray-500 text-xs">
                              Standard: {task.academic_standard}
                            </div>
                            
                            {task.resource_id && (
                              <div className="text-xs">
                                <a 
                                  href={task.resource_id.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  📚 {task.resource_id.label}
                                </a>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Gate */}
                        {stage.gate && (
                          <div className="p-2 bg-blue-50 rounded text-xs space-y-1">
                            <InlineEditableField
                              value={stage.gate.title}
                              onSave={(value) => updateGateField(projectData, setProjectData, stage.stage_id, 'title', value, isLocked)}
                              placeholder="Gate title"
                              displayClassName="font-medium"
                              isLocked={isLocked}
                            />
                            
                            <InlineEditableField
                              value={stage.gate.description}
                              onSave={(value) => updateGateField(projectData, setProjectData, stage.stage_id, 'description', value, isLocked)}
                              placeholder="Gate description"
                              multiline={true}
                              displayClassName="text-gray-600 text-xs"
                              isLocked={isLocked}
                            />
                            
                            <div className="space-y-1">
                              <div className="font-medium text-xs mb-1">Checklist:</div>
                              {stage.gate.checklist?.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Check size={10} className="text-green-500 flex-shrink-0" />
                                  <span className="text-xs">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!isStreaming && (projectOutput || projectData) && (
        <div className="border-t border-purple-200 p-2">
          <button 
            onClick={() => {
              const textToCopy = view === 'text' ? projectOutput : formatProjectForCopy(projectData);
              navigator.clipboard.writeText(textToCopy);
            }}
            className="text-xs text-purple-600 hover:bg-purple-100 transition-colors px-2 py-1 rounded"
          >
            📋 Copy project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectViewer;