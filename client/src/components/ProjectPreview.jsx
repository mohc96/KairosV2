import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lock, Unlock, Check, Plus, Trash2 } from 'lucide-react';
import InlineEditableField from './InlineEditableField';

const ProjectPreview = ({ project, isEditable = true, onProjectUpdate }) => {
  const [projectData, setProjectData] = useState(project);
  const [originalData, setOriginalData] = useState(project);
  const [isEdited, setIsEdited] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [expandedStages, setExpandedStages] = useState({});
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);


  // Use passed project or sample data
  const displayProject = project ;
  
  // Initialize project data if not set
  useEffect(() => {
    if (!projectData && displayProject) {
      setProjectData(displayProject);
      setOriginalData(JSON.parse(JSON.stringify(displayProject)));
    }
  }, [displayProject, projectData]);

  // Check if data has been edited
  useEffect(() => {
    if (originalData && projectData) {
      const hasChanges = JSON.stringify(projectData) !== JSON.stringify(originalData);
      setIsEdited(hasChanges);
      if (onProjectUpdate) {
        onProjectUpdate(projectData, hasChanges, isLocked);
      }
    }
  }, [projectData, originalData, isLocked, onProjectUpdate]);

  // Event handlers
  const toggleProjectExpansion = () => {
    setIsProjectExpanded(prev => !prev);
  };

  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const lockProject = () => {
    const confirmed = window.confirm(
      "Are you sure you want to lock this project?\n\n⚠️ No further edits will be allowed."
    );
    if (confirmed) {
      setIsLocked(true);
    }
  };

  const unlockProject = () => {
    setIsLocked(false);
  };

  const resetChanges = () => {
    if (originalData) {
      setProjectData(JSON.parse(JSON.stringify(originalData)));
    }
  };

  // Update functions
  const updateProjectField = (field, value) => {
    if (isLocked) return;
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const updateStageField = (stageId, field, value) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { ...stage, [field]: value }
          : stage
      )
    }));
  };

  const updateTaskField = (stageId, taskId, field, value) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? {
              ...stage,
              tasks: stage.tasks?.map(task => 
                task.task_id === taskId 
                  ? { ...task, [field]: value }
                  : task
              )
            }
          : stage
      )
    }));
  };

  const updateTaskResource = (stageId, taskId, field, value) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? {
              ...stage,
              tasks: stage.tasks?.map(task => 
                task.task_id === taskId 
                  ? { 
                      ...task, 
                      resource_id: { 
                        ...task.resource_id, 
                        [field]: value 
                      }
                    }
                  : task
              )
            }
          : stage
      )
    }));
  };

  const updateGateField = (stageId, field, value) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { ...stage, gate: { ...stage.gate, [field]: value } }
          : stage
      )
    }));
  };

  const updateGateChecklistItem = (stageId, itemIndex, value) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { 
              ...stage, 
              gate: { 
                ...stage.gate, 
                checklist: stage.gate.checklist.map((item, index) => 
                  index === itemIndex ? value : item
                )
              }
            }
          : stage
      )
    }));
  };

  const addGateChecklistItem = (stageId) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { 
              ...stage, 
              gate: { 
                ...stage.gate, 
                checklist: [...(stage.gate.checklist || []), 'New checklist item']
              }
            }
          : stage
      )
    }));
  };

  const removeGateChecklistItem = (stageId, itemIndex) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { 
              ...stage, 
              gate: { 
                ...stage.gate, 
                checklist: stage.gate.checklist.filter((_, index) => index !== itemIndex)
              }
            }
          : stage
      )
    }));
  };

  const addTask = (stageId) => {
    if (isLocked) return;
    const newTask = {
      task_id: `task_${Date.now()}`,
      title: 'New Task',
      description: 'Task description',
      academic_standard: 'Standard',
      resource_id: {
        label: 'Resource',
        url: 'https://example.com'
      }
    };

    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { ...stage, tasks: [...(stage.tasks || []), newTask] }
          : stage
      )
    }));
  };

  const removeTask = (stageId, taskId) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.map(stage => 
        stage.stage_id === stageId 
          ? { 
              ...stage, 
              tasks: stage.tasks?.filter(task => task.task_id !== taskId)
            }
          : stage
      )
    }));
  };

  const addStage = () => {
    if (isLocked) return;
    const newStage = {
      stage_id: `stage_${Date.now()}`,
      stage_order: (projectData.stages?.length || 0) + 1,
      title: 'New Stage',
      tasks: [],
      gate: {
        gate_id: `gate_${Date.now()}`,
        title: 'Stage Gate',
        description: 'Gate description',
        checklist: ['Complete all tasks']
      }
    };

    setProjectData(prev => ({
      ...prev,
      stages: [...(prev.stages || []), newStage]
    }));
  };

  const removeStage = (stageId) => {
    if (isLocked) return;
    setProjectData(prev => ({
      ...prev,
      stages: prev.stages?.filter(stage => stage.stage_id !== stageId)
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      {/* Collapsible Project Header */}
      <div 
        className="p-1 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={toggleProjectExpansion}
      >
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-200 rounded">
            {isProjectExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {projectData?.project_title || "Untitled Project"}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-blue-600 font-medium">
                {projectData?.subject_domain || "No Subject"}
              </span>
              <span className="text-xs text-gray-500">
                {projectData?.stages?.length || 0} stages
              </span>
              {isLocked && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  Locked
                </span>
              )}
              {isEdited && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  Modified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Project Content */}
      {isProjectExpanded && (
        <div className="p-1">
          {/* Project Details */}
          <div className="mb-4">
            <InlineEditableField
              value={projectData?.project_title || ""}
              onSave={(value) => updateProjectField('project_title', value)}
              placeholder="Click to edit project title"
              displayClassName="text-sm font-semibold text-gray-900"
              isEditable={isEditable}
              isLocked={isLocked}
            />
            
            <InlineEditableField
              value={projectData?.description || ""}
              onSave={(value) => updateProjectField('description', value)}
              placeholder="Click to edit project description"
              multiline={true}
              displayClassName="text-xs text-gray-600 mt-2"
              isEditable={isEditable}
              isLocked={isLocked}
            />
            
            <div className="mt-2">
              <span className="text-xs text-gray-500">Subject: </span>
              <InlineEditableField
                value={projectData?.subject_domain || ""}
                onSave={(value) => updateProjectField('subject_domain', value)}
                placeholder="Click to edit subject"
                displayClassName="text-xs text-blue-600 font-medium inline"
                isEditable={isEditable}
                isLocked={isLocked}
              />
            </div>
          </div>

          {/* Controls */}
          {isEditable && (
            <div className="mb-4 flex gap-2 items-center flex-wrap">
              {isEdited && !isLocked && (
                <button
                  onClick={resetChanges}
                  className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
                  title="Reset Changes"
                >
                  Reset
                </button>
              )}
              <button
                onClick={isLocked ? unlockProject : lockProject}
                className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                  isLocked 
                    ? 'bg-red-100 hover:bg-red-200 text-red-700' 
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                {isLocked ? <Unlock size={10} /> : <Lock size={10} />}
                {isLocked ? 'Unlock' : 'Lock'}
              </button>
              {!isLocked && (
                <button
                  onClick={addStage}
                  className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center gap-1"
                >
                  <Plus size={10} />
                  Add Stage
                </button>
              )}
            </div>
          )}

          {/* Stages */}
          <div className="space-y-3">
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
                        onSave={(value) => updateStageField(stage.stage_id, 'title', value)}
                        placeholder="Click to edit stage title"
                        displayClassName="text-xs font-medium"
                        isEditable={isEditable}
                        isLocked={isLocked}
                      />
                    </div>

                    {isEditable && !isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStage(stage.stage_id);
                        }}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Remove Stage"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Stage Content */}
                {expandedStages[stage.stage_id] && (
                  <div className="p-1 space-y-3">
                    {/* Tasks */}
                    <div className="space-y-2">
                      {stage.tasks?.map((task) => (
                        <div key={task.task_id} className="p-1 bg-gray-50 rounded text-xs space-y-2 relative group">
                          {isEditable && !isLocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTask(stage.stage_id, task.task_id);
                              }}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
                              title="Remove Task"
                            >
                              <Trash2 size={8} />
                            </button>
                          )}

                          <div className="pr-6">
                            <InlineEditableField
                              value={task.title}
                              onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'title', value)}
                              placeholder="Click to edit task title"
                              displayClassName="font-medium text-xs"
                              isEditable={isEditable}
                              isLocked={isLocked}
                            />
                          </div>

                          <InlineEditableField
                            value={task.description}
                            onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'description', value)}
                            placeholder="Click to edit task description"
                            multiline={true}
                            displayClassName="text-gray-600 text-xs"
                            isEditable={isEditable}
                            isLocked={isLocked}
                          />

                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <span>Standard:</span>
                            <InlineEditableField
                              value={task.academic_standard}
                              onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'academic_standard', value)}
                              placeholder="Click to edit standard"
                              displayClassName="text-xs"
                              isEditable={isEditable}
                              isLocked={isLocked}
                            />
                          </div>
                          
                          {task.resource_id && (
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-1">
                                <span>📚</span>
                                <InlineEditableField
                                  value={task.resource_id.label}
                                  onSave={(value) => updateTaskResource(stage.stage_id, task.task_id, 'label', value)}
                                  placeholder="Click to edit resource label"
                                  displayClassName="text-blue-600 font-medium text-xs"
                                  isEditable={isEditable}
                                  isLocked={isLocked}
                                />
                              </div>
                              <div className="ml-4">
                                <span className="text-gray-500">URL:</span>
                                <InlineEditableField
                                  value={task.resource_id.url}
                                  onSave={(value) => updateTaskResource(stage.stage_id, task.task_id, 'url', value)}
                                  placeholder="Click to edit URL"
                                  displayClassName="text-blue-600 underline ml-1 break-all text-xs"
                                  isEditable={isEditable}
                                  isLocked={isLocked}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Task Button */}
                      {isEditable && !isLocked && (
                        <button
                          onClick={() => addTask(stage.stage_id)}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center gap-1"
                        >
                          <Plus size={10} />
                          Add Task
                        </button>
                      )}
                    </div>

                    {/* Gate */}
                    {stage.gate && (
                      <div className="p-1 bg-blue-50 rounded text-xs space-y-2">
                        <InlineEditableField
                          value={stage.gate.title}
                          onSave={(value) => updateGateField(stage.stage_id, 'title', value)}
                          placeholder="Click to edit gate title"
                          displayClassName="font-medium text-xs"
                          isEditable={isEditable}
                          isLocked={isLocked}
                        />
                        
                        <InlineEditableField
                          value={stage.gate.description}
                          onSave={(value) => updateGateField(stage.stage_id, 'description', value)}
                          placeholder="Click to edit gate description"
                          multiline={true}
                          displayClassName="text-gray-600 text-xs"
                          isEditable={isEditable}
                          isLocked={isLocked}
                        />
                        
                        <div className="space-y-1">
                          <div className="font-medium text-xs mb-1">Checklist:</div>
                          {stage.gate.checklist?.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                              <Check size={10} className="text-green-500 flex-shrink-0" />
                              <div className="flex-1">
                                <InlineEditableField
                                  value={item}
                                  onSave={(value) => updateGateChecklistItem(stage.stage_id, index, value)}
                                  placeholder="Click to edit checklist item"
                                  displayClassName="text-xs"
                                  isEditable={isEditable}
                                  isLocked={isLocked}
                                />
                              </div>
                              {isEditable && !isLocked && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeGateChecklistItem(stage.stage_id, index);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
                                  title="Remove Item"
                                >
                                  <Trash2 size={6} />
                                </button>
                              )}
                            </div>
                          ))}
                          
                          {/* Add Checklist Item */}
                          {isEditable && !isLocked && (
                            <button
                              onClick={() => addGateChecklistItem(stage.stage_id)}
                              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              <Plus size={8} />
                              Add checklist item
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default ProjectPreview;