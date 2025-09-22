import React, { useState } from 'react';
import { Search, Users, Download, Plus, Mail, ExternalLink, Loader2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function ExpertSearchComponent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [experts, setExperts] = useState([]);
  const [selectedExperts, setSelectedExperts] = useState(new Set());
  const [searchStatus, setSearchStatus] = useState('');
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Mock expert data for demonstration - using the JSON format
  const mockExpertsData = {
    "json": [
      {
        "full_name": "Dr. Sarah Johnson",
        "organization": "Arizona Water Institute",
        "bio": "Dr. Sarah Johnson is a water conservation specialist focusing on sustainable water management practices in Arizona.",
        "email": "sarah.johnson@azwaterinstitute.com",
        "skills": [
          "Water Conservation",
          "Sustainable Practices",
          "Research"
        ],
        "tags": [
          "Water Conservation",
          "Sustainability",
          "Arizona"
        ]
      },
      {
        "full_name": "Dr. Michael Rivera",
        "organization": "Arizona State University",
        "bio": "Dr. Michael Rivera is an expert in water resource management and community sustainability programs.",
        "email": "michael.rivera@asu.edu",
        "skills": [
          "Water Resource Management",
          "Community Sustainability",
          "Education"
        ],
        "tags": [
          "Water Management",
          "Community Programs",
          "Arizona State University"
        ]
      },
      {
        "full_name": "Emily Rodriguez",
        "organization": "Arizona Association of Conservation Districts",
        "bio": "Emily Rodriguez has extensive experience in implementing local sustainability programs across Arizona.",
        "email": "emily.rodriguez@azcd.org",
        "skills": [
          "Sustainability Programs",
          "Community Engagement",
          "Project Management"
        ],
        "tags": [
          "Local Sustainability",
          "Arizona Conservation",
          "Community Engagement"
        ]
      }
    ]
  };

  // Convert JSON format to component format
  const convertJsonToExperts = (jsonData) => {
    return jsonData.json.map((expert, index) => ({
      id: index + 1,
      name: expert.full_name,
      organization: expert.organization,
      bio: expert.bio,
      email: expert.email,
      skills: expert.skills,
      tags: expert.tags
    }));
  };

  const handleSearch = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setSearchStatus('Searching for experts...');
    setSearchCompleted(false);
    setExperts([]);
    
    try {
      setSearchStatus('Analyzing expertise...');
      
      // Call Google Apps Script function instead of direct fetch
      const result = await new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler(resolve)
          .withFailureHandler(reject)
          .findExperts(topic.trim());
      });

      setSearchStatus('Compiling results...');
      
      // Process the response
      let expertsList = [];
      if (result && result.json && Array.isArray(result.json)) {
        expertsList = convertJsonToExperts(result);
      } else if (result && Array.isArray(result)) {
        expertsList = result.map((expert, index) => ({
          id: index + 1,
          name: expert.full_name || expert.name || 'Unknown',
          organization: expert.organization || 'Unknown Organization',
          bio: expert.bio || 'No bio available',
          email: expert.email || 'No email provided',
          skills: expert.skills || [],
          tags: expert.tags || []
        }));
      }

      setExperts(expertsList);
      setSearchCompleted(true);
      setIsLoading(false);
      setSearchStatus('');

    } catch (error) {
      console.error('Error searching for experts:', error);
      setSearchStatus('');
      setIsLoading(false);
      setSearchCompleted(true);
      setExperts([]);
      
      // Show error message to user
      alert('Sorry, there was an error searching for experts. Please try again.');
    }
  };

  const toggleExpertSelection = (expertId) => {
    const newSelected = new Set(selectedExperts);
    if (newSelected.has(expertId)) {
      newSelected.delete(expertId);
    } else {
      newSelected.add(expertId);
    }
    setSelectedExperts(newSelected);
  };

  const handleAddToProject = () => {
    const selectedExpertsList = experts.filter(expert => selectedExperts.has(expert.id));
    console.log('Adding to project:', selectedExpertsList);
    // Here you would typically send to backend
    alert(`Added ${selectedExpertsList.length} expert(s) to project!`);
  };

  const handleDownloadPDF = () => {
    const selectedExpertsList = experts.filter(expert => selectedExperts.has(expert.id));
    console.log('Generating PDF for:', selectedExpertsList);
    // Here you would typically trigger PDF generation
    alert(`Generating PDF summary for ${selectedExpertsList.length} expert(s)!`);
  };

  const getStatusClass = () => {
    if (isLoading) return 'text-orange-500';
    if (searchCompleted && experts.length === 0) return 'text-red-500';
    if (experts.length > 0) return 'text-green-500';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (isLoading) return 'bg-orange-400';
    if (searchCompleted && experts.length === 0) return 'bg-red-400';
    if (experts.length > 0) return 'bg-green-400';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isLoading) return 'Searching...';
    if (searchCompleted && experts.length === 0) return 'No experts found';
    if (experts.length > 0) return 'Experts found!';
    return 'Find experts you need';
  };

  const ExpertCard = ({ expert }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{expert.name}</h3>
          <p className="text-sm text-blue-600 font-medium mb-2">{expert.organization}</p>
          <p className="text-gray-700 text-sm">{expert.bio}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <input
            type="checkbox"
            checked={selectedExperts.has(expert.id)}
            onChange={() => toggleExpertSelection(expert.id)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills & Expertise:</h4>
        <div className="flex flex-wrap gap-2">
          {expert.skills.map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {expert.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Contact:</h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-purple-200 text-purple-900 text-xs rounded-full">
            {expert.email}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50">
      {/* Collapsed Header - Always Visible */}
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
                  <Search className={`w-5 h-5 ${getStatusClass()}`} />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Find Experts</div>
                  <div className="text-sm text-gray-500">
                    {getStatusText()}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-white border border-gray-300 rounded-lg mt-2 overflow-hidden">
          {/* Header Section */}
          <div className="bg-purple-200 px-3 py-2">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 leading-loose">Tap In. Reach Out. Get Help.</h2>
                <p className="text-sm text-gray-700">
                  Help is everywhere! Let us help you find the experts you need.
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Tell us what kind of expert you're looking for. Be specific about the topic, skills, or experience you need help with. Include any preferences for location, availability, or background (e.g., "a hydrologist familiar with Arizona water laws" or "a person who specializes in non-profit management").
              </p>
            </div>

            {/* Input Form */}
            <div className="mb-6">
              <div className="relative">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Input your text here"
                  className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSearch}
              disabled={!topic.trim() || isLoading}
              className="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Experts</span>
                </>
              )}
            </button>

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-medium">{searchStatus}</span>
                </div>
              </div>
            )}

            {/* No Results Display */}
            {searchCompleted && experts.length === 0 && !isLoading && (
              <div className="mt-6">
                <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-red-600 mb-2">
                    <Search className="w-12 h-12 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-red-800 mb-2">No Experts Found</h3>
                  <p className="text-red-600 text-sm">
                    We couldn't find any experts matching your search criteria. Try adjusting your search terms or being more general in your request.
                  </p>
                </div>
              </div>
            )}

            {/* Results Display */}
            {experts.length > 0 && !isLoading && (
              <div className="mt-6">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-2">
                    Found {experts.length} Expert{experts.length !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    Select one or more experts for participation in a project!
                  </p>
                  <div className="text-sm text-gray-600 mt-2">
                    {selectedExperts.size} selected
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {experts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedExperts.size > 0 && (
              <div className="copy-section mt-6">
                <button
                  onClick={() => {
                    const selectedExpertsList = experts.filter(expert => selectedExperts.has(expert.id));
                    const expertsText = selectedExpertsList.map(expert => 
                      `${expert.name} - ${expert.organization}\nEmail: ${expert.email}\nBio: ${expert.bio}\nSkills: ${expert.skills.join(', ')}\nTags: ${expert.tags.join(', ')}`
                    ).join('\n\n');
                    
                    navigator.clipboard.writeText(expertsText).then(() => {
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    }).catch(() => {
                      // Fallback for older browsers or when clipboard API fails
                      const textArea = document.createElement('textarea');
                      textArea.value = expertsText;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    });
                  }}
                >
                  {copySuccess ? '✅ Copied!' : '📋 Copy experts to clipboard'}
                </button>
                <button
                  className="add-btn"
                  onClick={() => alert("✅ Added to your project!")}
                >
                  ➕ Add to Project
                </button>
                <button
                  className="pdf-btn"
                  onClick={() => alert("📄 PDF download is not available yet")}
                >
                  📄 Download as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}