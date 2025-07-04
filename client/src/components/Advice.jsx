import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, ChevronDown, X, Send, Lightbulb, Loader2 } from 'lucide-react';

export default function SidebarAdvice() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdvice, setHasAdvice] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setAdvice('');

    google.script.run
    .withSuccessHandler((result) => {
      const adviceText = result || "No response available";
      setAdvice(adviceText);
      setHasAdvice(true);
      setIsLoading(false);
    })
    .withFailureHandler((error) => {
      console.error('Error calling Apps Script:', error);
      setAdvice("I'm currently unable to connect to the advice service. Please try again later.");
      setHasAdvice(true);
      setIsLoading(false);
    })
    .callOpenAI(userInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setUserInput('');
    setAdvice('');
    setHasAdvice(false);
  };

  const getStatusColor = () => {
    if (hasAdvice) return 'text-green-600';
    if (isLoading) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (hasAdvice) return 'bg-green-500';
    if (isLoading) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full font-sans">
      {/* Sidebar Button */}
      <div
        onClick={toggleExpanded}
        className="w-full p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className={`w-6 h-6 ${getStatusColor()}`} />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusDot()}`}></div>
            </div>
            <div>
              <div className="font-medium text-gray-900 text-base">Get Advice</div>
              <div className="text-sm text-gray-500">
                {isLoading ? 'Getting advice...' : hasAdvice ? 'Advice ready' : 'Ask for guidance'}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} />
        </div>
      </div>

      {/* Expanded Advice Panel */}
      {isExpanded && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Get Advice</h3>
              </div>
              <button
                onClick={toggleExpanded}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Input Section */}
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like advice about?
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="I'm struggling with... / I need help deciding... / How do I..."
                  className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  rows="3"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Getting advice...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Get Advice</span>
                    </>
                  )}
                </button>
                
                {(userInput || advice) && (
                  <button
                    onClick={handleClear}
                    className="py-2 px-4 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Advice Display */}
            {advice && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-indigo-600 mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-indigo-900 mb-3">Advice for you:</h4>
                    <div className="text-sm text-indigo-800 leading-relaxed space-y-3 prose prose-indigo max-w-none">
                    <ReactMarkdown>{advice}</ReactMarkdown>
                    </div>
                </div>
                </div>

                {/* Copy button for longer responses */}
                <div className="mt-4 pt-3 border-t border-indigo-200">
                <button
                    onClick={() => navigator.clipboard.writeText(advice)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    📋 Copy advice to clipboard
                </button>
                </div>
            </div>
            )}


            {/* Status */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                hasAdvice
                  ? 'bg-green-100 text-green-800'
                  : isLoading
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {isLoading ? '🤔 Thinking...' : hasAdvice ? '💡 Advice received' : '💭 Ready to help'}
              </div>
            </div>

            {/* Tips */}
            {!advice && !isLoading && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <h5 className="text-xs font-medium text-gray-700 mb-2">💡 Tips for better advice:</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be specific about your situation</li>
                  <li>• Mention what you've already tried</li>
                  <li>• Ask about decisions, challenges, or goals</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}