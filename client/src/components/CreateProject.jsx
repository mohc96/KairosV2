import React, { useState, useEffect } from 'react';
import {
  FolderPlus, ChevronDown, Send, Lightbulb, Loader2, X, Edit2, Save, 
  Lock, Unlock, ChevronRight, Check, RotateCcw, Eye, EyeOff
} from 'lucide-react';

export default function CreateProject() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [projectOutput, setProjectOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProject, setHasProject] = useState(false);
  const [hasLockedOnce, setHasLockedOnce] = useState(false);

  
  // New states for project editing
  const [projectData, setProjectData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});
  const [view, setView] = useState('text'); // 'text' or 'structured'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [subjectError, setSubjectError] = useState(false);

  // Add this subjects array after your state declarations
  const subjects = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' },
    { value: 'art', label: 'Art' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' }
  ];


  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => {
    setShowDialog(false);
    setUserInput('');
    setSelectedSubject('');
    setShowSubjectDropdown(false);
    setSubjectError(false);
  };

  // Check if data has been edited
  useEffect(() => {
    if (originalData && projectData) {
      const hasChanges = JSON.stringify(projectData) !== JSON.stringify(originalData);
      setIsEdited(hasChanges);
    }
  }, [projectData, originalData]);

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

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    if (!selectedSubject) {
      setSubjectError(true);
      return;
    }

    setIsLoading(true);
    setProjectOutput('');
    setShowDialog(false);
    setSubjectError(false);

    try {
      // Call your Google Apps Script function
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setProjectOutput('');
    setHasProject(false);
    setProjectData(null);
    setOriginalData(null);
    setIsEdited(false);
    setIsLocked(false);
    setEditingItem(null);
    setExpandedStages({});
    setView('text');
  };

  // Project editing functions
  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const updateTaskField = (stageId, taskId, field, value) => {
    if (isLocked) return;

    setProjectData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.stage_id === stageId 
          ? {
              ...stage,
              tasks: stage.tasks.map(task => 
                task.task_id === taskId 
                  ? { ...task, [field]: value }
                  : task
              )
            }
          : stage
      )
    }));
  };

  const updateStageTitle = (stageId, newTitle) => {
    if (isLocked) return;

    setProjectData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.stage_id === stageId 
          ? { ...stage, title: newTitle }
          : stage
      )
    }));
  };

  const updateGateField = (stageId, field, value) => {
    if (isLocked) return;

    setProjectData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.stage_id === stageId 
          ? { ...stage, gate: { ...stage.gate, [field]: value } }
          : stage
      )
    }));
  };

  const startEditing = (type, stageId, taskId = null, field = null) => {
    if (isLocked) return;
    setEditingItem({ type, stageId, taskId, field });
  };

  const stopEditing = () => {
    setEditingItem(null);
  };

  const lockProject = () => {
    if (hasLockedOnce) return; // Already locked, don’t allow again

  const confirmed = window.confirm(
    "Are you sure you want to lock and submit this project for teacher review?\n\n⚠️ You won’t be able to make any further edits."
  );

  if (!confirmed) return;

  setIsLocked(true);
  setHasLockedOnce(true);
  setEditingItem(null);
  console.log('✅ Project locked and submitted:', projectData);
  };

  const unlockProject = () => {
    if (hasLockedOnce) {
    alert("You can't unlock this project after submitting it for review.");
    return;
  }
    setIsLocked(false);
  };

  const resetChanges = () => {
    if (originalData) {
      setProjectData(JSON.parse(JSON.stringify(originalData)));
      setEditingItem(null);
    }
  };

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

  // Improved Inline Editable Field Component
    // Improved Inline Editable Field Component
  const InlineEditableField = ({ 
    value, 
    onSave, 
    multiline = false, 
    placeholder = "",
    className = "",
    displayClassName = "",
    disabled = false // Optional external lock
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    // Respect isLocked or any external disabled flag
    const isReadOnly = disabled || isLocked;

    const handleStart = () => {
      if (isReadOnly) return;
      setTempValue(value);
      setIsEditing(true);
    };

    const handleSave = () => {
      onSave(tempValue);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setTempValue(value);
      setIsEditing(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    if (isEditing) {
      return (
        <div className="flex items-start gap-1">
          {multiline ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              className={`flex-1 p-1 border rounded text-xs resize-none bg-white ${className}`}
              rows={2}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              placeholder={placeholder}
              className={`flex-1 p-1 border rounded text-xs bg-white ${className}`}
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Save"
            >
              <Save size={10} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Cancel"
            >
              <X size={10} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`group flex items-start gap-1 ${isReadOnly ? 'cursor-default opacity-70' : 'cursor-pointer'}`} 
        onClick={handleStart}
      >
        <div className={`flex-1 ${displayClassName}`}>
          {value || placeholder}
        </div>

        {!isReadOnly && (
          <button
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-opacity"
            title="Edit"
          >
            <Edit2 size={8} />
          </button>
        )}
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
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot()}`}></div>
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
                  onClick={openDialog}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Project Controls */}
              {hasProject && (
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() => setView(view === 'text' ? 'structured' : 'text')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    {view === 'text' ? <Eye size={10} /> : <EyeOff size={10} />}
                    {view === 'text' ? 'Structure' : 'Text'}
                  </button>
                  {view === 'structured' && projectData && (
                    <>
                      {!isLocked && isEdited && (
                        <button
                          onClick={resetChanges}
                          className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded transition-colors"
                          title="Reset Changes"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                      <button
                        onClick={isLocked ? unlockProject : lockProject}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          isLocked 
                            ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={isLocked ? 'Unlock Project' : 'Lock & Submit'}
                      >
                        {isLocked ? <Unlock size={12} /> : <Lock size={12} />}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Project Output */}
              {projectOutput && (
                <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <h4 className="text-sm font-medium text-purple-900">Your Project</h4>
                    {isEdited && (
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
                                    onSave={(value) => updateStageTitle(stage.stage_id, value)}
                                    placeholder="Stage title"
                                    displayClassName="text-xs font-medium truncate"
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
                                    {/* Task Title */}
                                    <InlineEditableField
                                      value={task.title}
                                      onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'title', value)}
                                      placeholder="Task title"
                                      displayClassName="font-medium"
                                    />

                                    {/* Task Description */}
                                    <InlineEditableField
                                      value={task.description}
                                      onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'description', value)}
                                      placeholder="Task description"
                                      multiline={true}
                                      displayClassName="text-gray-600 text-xs"
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
                                <div className="p-2 bg-blue-50 rounded text-xs space-y-1">
                                  <InlineEditableField
                                    value={stage.gate.title}
                                    onSave={(value) => updateGateField(stage.stage_id, 'title', value)}
                                    placeholder="Gate title"
                                    displayClassName="font-medium"
                                  />
                                  
                                  <InlineEditableField
                                    value={stage.gate.description}
                                    onSave={(value) => updateGateField(stage.stage_id, 'description', value)}
                                    placeholder="Gate description"
                                    multiline={true}
                                    displayClassName="text-gray-600 text-xs"
                                  />
                                  
                                  <div className="space-y-1">
                                    {stage.gate.checklist?.map((item, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Check size={10} className="text-green-500 flex-shrink-0" />
                                        <span className="text-xs">{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-purple-200 p-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(
                        view === 'text' ? projectOutput : JSON.stringify(projectData, null, 2)
                      )}
                      className="text-xs text-purple-600 hover:text-purple-900 transition-colors"
                    >
                      📋 Copy project
                    </button>
                  </div>
                </div>
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
              {(userInput || projectOutput) && (
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
                <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
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
                  What do you want to build?
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="I want to build a... / I'm interested in creating..."
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focussed Subject <span className="text-red-500">*</span>
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
                              setSubjectError(false); // Clear error when subject is selected
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
                  <strong>Example:</strong> "Website to explain Newton's Laws with animations" or "Quiz to test knowledge about U.S. presidents"
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
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Create</span>
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