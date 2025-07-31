import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Edit2, Save, X, Lock, Unlock, Check, Plus, Trash2 } from 'lucide-react';

const ProjectPreview = ({ project, isEditable = false, onProjectUpdate }) => {
 const [projectData, setProjectData] = useState(project);
 const [originalData, setOriginalData] = useState(project);
 const [isEdited, setIsEdited] = useState(false);
 const [isLocked, setIsLocked] = useState(false);
 const [expandedStages, setExpandedStages] = useState({});

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

 const toggleStageExpansion = (stageId) => {
   setExpandedStages(prev => ({
     ...prev,
     [stageId]: !prev[stageId]
   }));
 };

 // Project level updates
 const updateProjectField = (field, value) => {
   if (isLocked) return;
   setProjectData(prev => ({ ...prev, [field]: value }));
 };

 // Stage level updates
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

 // Task level updates
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

 // Task resource updates
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

 // Gate level updates
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

 // Gate checklist updates
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

 // Add new checklist item
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

 // Remove checklist item
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

 // Add new task
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

 // Remove task
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

 // Add new stage
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

 // Remove stage
 const removeStage = (stageId) => {
   if (isLocked) return;
   setProjectData(prev => ({
     ...prev,
     stages: prev.stages?.filter(stage => stage.stage_id !== stageId)
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

 const InlineEditableField = ({ 
   value, 
   onSave, 
   multiline = false, 
   placeholder = "",
   className = "",
   displayClassName = ""
 }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [tempValue, setTempValue] = useState(value);

   const handleStart = () => {
     if (!isEditable || isLocked) return;
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
       className={`group flex items-start gap-1 ${(!isEditable || isLocked) ? 'cursor-default' : 'cursor-pointer'}`} 
       onClick={handleStart}
     >
       <div className={`flex-1 ${displayClassName}`}>
         {value || placeholder}
       </div>
       {isEditable && !isLocked && (
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
   <div className="bg-white border border-gray-100 rounded p-2">
     {/* Project Header */}
     <div className="mb-2">
       <InlineEditableField
         value={projectData.project_title}
         onSave={(value) => updateProjectField('project_title', value)}
         placeholder="Project title"
         displayClassName="text-sm font-semibold text-gray-900"
       />
       
       <InlineEditableField
         value={projectData.description}
         onSave={(value) => updateProjectField('description', value)}
         placeholder="Project description"
         multiline={true}
         displayClassName="text-xs text-gray-600 mt-1"
       />
       
       <div className="mt-1">
         <InlineEditableField
           value={projectData.subject_domain}
           onSave={(value) => updateProjectField('subject_domain', value)}
           placeholder="Subject domain"
           displayClassName="text-xs text-blue-600 font-medium"
         />
       </div>
     </div>

     {/* Controls */}
     {isEditable && (
       <div className="mb-2 flex gap-2 items-center flex-wrap">
         {isEdited && !isLocked && (
           <button
             onClick={resetChanges}
             className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded"
             title="Reset Changes"
           >
             Reset
           </button>
         )}
         <button
           onClick={isLocked ? unlockProject : lockProject}
           className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
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
             className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center gap-1"
           >
             <Plus size={10} />
             Add Stage
           </button>
         )}
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
     )}

     {/* Stages */}
     <div className="space-y-2">
       {projectData.stages?.map((stage) => (
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
                   placeholder="Stage title"
                   displayClassName="text-xs font-medium truncate"
                 />
               </div>

               {isEditable && !isLocked && (
                 <button
                   onClick={() => removeStage(stage.stage_id)}
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
             <div className="p-2 space-y-2">
               {/* Tasks */}
               <div className="space-y-2">
                 {stage.tasks?.map((task) => (
                   <div key={task.task_id} className="p-2 bg-gray-50 rounded text-xs space-y-1 relative group">
                     {isEditable && !isLocked && (
                       <button
                         onClick={() => removeTask(stage.stage_id, task.task_id)}
                         className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
                         title="Remove Task"
                       >
                         <Trash2 size={8} />
                       </button>
                     )}

                     <InlineEditableField
                       value={task.title}
                       onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'title', value)}
                       placeholder="Task title"
                       displayClassName="font-medium pr-6"
                     />

                     <InlineEditableField
                       value={task.description}
                       onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'description', value)}
                       placeholder="Task description"
                       multiline={true}
                       displayClassName="text-gray-600 text-xs"
                     />

                     <div className="text-gray-500 text-xs">
                       Standard: 
                       <InlineEditableField
                         value={task.academic_standard}
                         onSave={(value) => updateTaskField(stage.stage_id, task.task_id, 'academic_standard', value)}
                         placeholder="Academic standard"
                         displayClassName="inline ml-1"
                       />
                     </div>
                     
                     {task.resource_id && (
                       <div className="text-xs space-y-1">
                         <div className="flex items-center gap-1">
                           📚 
                           <InlineEditableField
                             value={task.resource_id.label}
                             onSave={(value) => updateTaskResource(stage.stage_id, task.task_id, 'label', value)}
                             placeholder="Resource label"
                             displayClassName="text-blue-600 font-medium"
                           />
                         </div>
                         <div className="ml-4">
                           URL: 
                           <InlineEditableField
                             value={task.resource_id.url}
                             onSave={(value) => updateTaskResource(stage.stage_id, task.task_id, 'url', value)}
                             placeholder="Resource URL"
                             displayClassName="text-blue-600 underline ml-1 break-all"
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
                     <div className="font-medium text-xs mb-1">Checklist:</div>
                     {stage.gate.checklist?.map((item, index) => (
                       <div key={index} className="flex items-center gap-2 group">
                         <Check size={10} className="text-green-500 flex-shrink-0" />
                         <div className="flex-1">
                           <InlineEditableField
                             value={item}
                             onSave={(value) => updateGateChecklistItem(stage.stage_id, index, value)}
                             placeholder="Checklist item"
                             displayClassName="text-xs"
                           />
                         </div>
                         {isEditable && !isLocked && (
                           <button
                             onClick={() => removeGateChecklistItem(stage.stage_id, index)}
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
 );
};

export default ProjectPreview;