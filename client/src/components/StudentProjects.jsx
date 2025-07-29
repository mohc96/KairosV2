import React, { useState, useEffect } from 'react';
import {
  FolderOpen, ChevronDown, ChevronRight, Eye, BookOpen, 
  CheckCircle, Clock, Target, ExternalLink, Search, Filter
} from 'lucide-react';


export default function StudentProjects() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedStages, setExpandedStages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load projects when component expands
    useEffect(() => {
        if (isExpanded && projects.length === 0) {
            setIsLoading(true);

            // Call the Apps Script function
            google.script.run
            .withSuccessHandler((studentProjects) => {
                setProjects(studentProjects);
                setIsLoading(false);
            })
            .withFailureHandler((error) => {
                console.error('Error loading projects:', error);
                setIsLoading(false);
            })
            .getStudentProjects();
        }
    }, [isExpanded, projects.length]);

  // Get unique subjects for filtering
  const subjects = [...new Set(projects.map(p => p.subject_domain))];

  // Filter projects based on search and subject
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !selectedSubject || project.subject_domain === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleStageExpansion = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'English': 'bg-green-100 text-green-800',
      'History': 'bg-purple-100 text-purple-800',
      'Science': 'bg-orange-100 text-orange-800',
      'Art': 'bg-yellow-100 text-yellow-800',
      'Technology': 'bg-red-100 text-red-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[subject] || colors.default;
  };

  const getStatusText = () => {
    if (isLoading) return 'Loading projects...';
    if (projects.length === 0) return 'No projects yet';
    return `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`;
  };

  const getStatusClass = () => {
    if (isLoading) return 'text-blue-600';
    if (projects.length === 0) return 'text-gray-600';
    return 'text-purple-600';
  };

  const getStatusDot = () => {
    if (isLoading) return 'bg-blue-500';
    if (projects.length === 0) return 'bg-gray-400';
    return 'bg-purple-500';
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
                <FolderOpen className={`w-5 h-5 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">My Projects</div>
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
              {/* Search and Filter Controls */}
              {projects.length > 0 && (
                <div className="mb-3 space-y-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Subject Filter */}
                  {subjects.length > 1 && (
                    <div className="relative">
                      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                      >
                        <option value="">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading your projects...
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && projects.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">No projects yet</p>
                  <p className="text-xs text-gray-400">Create your first project to get started!</p>
                </div>
              )}

              {/* No Results State */}
              {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
                <div className="text-center py-6">
                  <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No matching projects</p>
                  <p className="text-xs text-gray-400">Try adjusting your search or filter</p>
                </div>
              )}

              {/* Projects List */}
              {!isLoading && filteredProjects.length > 0 && (
                <div className="space-y-2">
                  {filteredProjects.map((project) => (
                    <div key={project.project_id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Project Header */}
                      <div 
                        className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleProjectExpansion(project.project_id)}
                      >
                        <div className="flex items-start gap-2">
                          <button className="p-1 hover:bg-gray-200 rounded mt-0.5">
                            {expandedProjects[project.project_id] ? (
                              <ChevronDown size={12} />
                            ) : (
                              <ChevronRight size={12} />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {project.project_title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getSubjectColor(project.subject_domain)}`}>
                                {project.subject_domain}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Target size={10} />
                                {project.stages?.length || 0} stage{(project.stages?.length || 0) !== 1 ? 's' : ''}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                {project.stages?.reduce((total, stage) => total + (stage.tasks?.length || 0), 0) || 0} task{(project.stages?.reduce((total, stage) => total + (stage.tasks?.length || 0), 0) || 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Project Content */}
                      {expandedProjects[project.project_id] && (
                        <div className="border-t border-gray-200">
                          <div className="p-3 space-y-2">
                            {project.stages?.map((stage) => (
                              <div key={stage.stage_id} className="border border-gray-200 rounded overflow-hidden">
                                {/* Stage Header */}
                                <div 
                                  className="p-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => toggleStageExpansion(stage.stage_id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                      {expandedStages[stage.stage_id] ? (
                                        <ChevronDown size={10} />
                                      ) : (
                                        <ChevronRight size={10} />
                                      )}
                                    </button>
                                    <div className="flex-1">
                                      <h4 className="text-xs font-medium text-gray-900">
                                        {stage.title}
                                      </h4>
                                    </div>
                                  </div>
                                </div>

                                {/* Stage Content */}
                                {expandedStages[stage.stage_id] && (
                                  <div className="border-t border-gray-200 p-2 space-y-2">
                                    {/* Tasks */}
                                    {stage.tasks?.map((task) => (
                                      <div key={task.task_id} className="p-2 bg-blue-50 rounded text-xs space-y-1">
                                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                                        <p className="text-gray-600">{task.description}</p>
                                        <div className="text-gray-500">
                                          Standard: {task.academic_standard}
                                        </div>
                                        
                                        {task.resource_id && (
                                          <div>
                                            <a 
                                              href={task.resource_id.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                                            >
                                              <BookOpen size={10} />
                                              {task.resource_id.label}
                                              <ExternalLink size={8} />
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))}

                                    {/* Gate */}
                                    {stage.gate && (
                                      <div className="p-2 bg-green-50 rounded text-xs space-y-1">
                                        <h5 className="font-medium text-gray-900 flex items-center gap-1">
                                          <CheckCircle size={10} className="text-green-600" />
                                          {stage.gate.title}
                                        </h5>
                                        <p className="text-gray-600">{stage.gate.description}</p>
                                        
                                        {stage.gate.checklist && stage.gate.checklist.length > 0 && (
                                          <div className="space-y-1 mt-2">
                                            {stage.gate.checklist.map((item, index) => (
                                              <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                                                <span className="text-xs text-gray-700">{item}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
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
                  ))}
                </div>
              )}

              {/* Status Summary */}
              <div className={`text-center py-1 px-2 rounded-full text-xs font-medium inline-block mt-3 ${
                isLoading ? 'bg-blue-100 text-blue-800' :
                projects.length === 0 ? 'bg-gray-100 text-gray-700' :
                'bg-purple-100 text-purple-800'
              }`}>
                {isLoading ? '🔄 Loading...' :
                 projects.length === 0 ? '📁 Empty' :
                 `📚 ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}