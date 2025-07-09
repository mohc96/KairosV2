import React, { useState } from 'react';
import {
  FolderPlus, ChevronDown, Send, Lightbulb, Loader2, X
} from 'lucide-react';

export default function CreateProject() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [projectOutput, setProjectOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProject, setHasProject] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => {
    setShowDialog(false);
    setUserInput('');
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setProjectOutput('');
    setShowDialog(false);

    // Replace with your Google Apps Script call
    // google.script.run
    //   .withSuccessHandler((result) => {
    //     const projectText = result || "No response available";
    //     setProjectOutput(projectText);
    //     setHasProject(true);
    //     setIsLoading(false);
    //   })
    //   .withFailureHandler((error) => {
    //     console.error('Error calling Apps Script:', error);
    //     setProjectOutput("I'm currently unable to connect to the project service. Please try again later.");
    //     setHasProject(true);
    //     setIsLoading(false);
    //   })
    //   .generateProject(userInput);

    // Demo simulation
    setTimeout(() => {
      const mockProject = `Here's a personalized project for you based on "${userInput}":

**Project Title:** ${userInput} Management System

**Description:** 
A comprehensive web application that helps users manage and track their ${userInput.toLowerCase()} activities. This project will include user authentication, dashboard, data visualization, and reporting features.

**Key Features:**
- User registration and login system
- Interactive dashboard with charts and graphs
- Add, edit, and delete ${userInput.toLowerCase()} entries
- Search and filter functionality
- Export data to CSV/PDF
- Mobile-responsive design

**Technologies Recommended:**
- Frontend: React.js, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB or PostgreSQL
- Authentication: JWT tokens
- Styling: Tailwind CSS or Bootstrap

**Learning Outcomes:**
- Full-stack web development
- Database design and management
- API development and integration
- User authentication and security
- Responsive web design

**Getting Started:**
1. Set up your development environment
2. Create the basic project structure
3. Implement user authentication
4. Build the dashboard interface
5. Add CRUD operations
6. Implement data visualization
7. Test and deploy your application

This project is perfect for building real-world development skills while working on something you're passionate about!`;

      setProjectOutput(mockProject);
      setHasProject(true);
      setIsLoading(false);
    }, 2000);
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
  };

  const getStatusClass = () => {
    if (hasProject) return 'text-green-600';
    if (isLoading) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (hasProject) return 'bg-green-500';
    if (isLoading) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full font-sans">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full overflow-hidden transition-all duration-200">
        {/* Toggle Button */}
        <div 
          onClick={toggleExpanded} 
          className="w-full p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FolderPlus className={`w-6 h-6 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Create Project</div>
                <div className="text-sm text-gray-500">
                  {isLoading ? 'Generating project...' : hasProject ? 'Project ready' : 'Build something amazing'}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-4">
              <div className="mb-4">
                <button
                  onClick={openDialog}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <FolderPlus className="w-5 h-5" />
                  <span>Create New Project</span>
                </button>
              </div>

              {/* Project Output */}
              {projectOutput && (
                <div className="mt-4 border border-purple-200 rounded-lg overflow-hidden">
                  <div className="bg-purple-50 p-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Your Project Plan</h4>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="text-sm text-purple-800 whitespace-pre-line">
                      {projectOutput}
                    </div>
                  </div>
                  <div className="border-t border-purple-200 p-3">
                    <button 
                      onClick={() => navigator.clipboard.writeText(projectOutput)}
                      className="text-sm text-purple-600 hover:text-purple-900 transition-colors"
                    >
                      📋 Copy project to clipboard
                    </button>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className={`text-center py-2 px-4 rounded-full text-sm font-medium inline-block mt-2 ${
                hasProject ? 'bg-green-100 text-green-800' : 
                isLoading ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {isLoading ? '🔄 Creating project...' : hasProject ? '✅ Project created' : '💡 Ready to create'}
              </div>

              {/* Tips */}
              {!projectOutput && !isLoading && (
                <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">💡 Tips for better projects:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Be specific about what you want to build</li>
                    <li>• Mention your current skill level</li>
                    <li>• Include any preferred technologies</li>
                    <li>• Think about your learning goals</li>
                  </ul>
                </div>
              )}

              {/* Clear Button */}
              {(userInput || projectOutput) && (
                <div className="mt-4">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Simple Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FolderPlus className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">What do you want to build?</h2>
              </div>
              <button
                onClick={closeDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your project idea
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="I want to build a... / I'm interested in creating... / Help me make..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Example:</strong> "I want to build a task management app for students" or "Help me create a portfolio website with React"
                </p>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim() || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium transition-colors hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Create Project</span>
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