import React, { useState, useEffect } from 'react';
import { ChevronDown, Send, Loader2, Sunrise, Sparkles, X } from 'lucide-react';

export default function SidebarMorningPulse() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [motivationResponse, setMotivationResponse] = useState(null);

  // Energy-based emojis from 1 (low energy) to 5 (high energy)
  const emojis = [
    { emoji: '😔', level: 1, label: 'Low Energy' },
    { emoji: '😌', level: 2, label: 'Calm' },
    { emoji: '😁', level: 3, label: 'Good' },
    { emoji: '😎', level: 4, label: 'Strong' },
    { emoji: '🤩', level: 5, label: 'High Energy' }
  ];
  const Tooltip = ({ text }) => (
  <div className="-top-full mb-1 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-sm z-1 whitespace-nowrap">
    {text}
  </div>
);


  // Get user email on component mount
  useEffect(() => {
    if (window.google?.script?.run) {
      google.script.run
        .withSuccessHandler((email) => {
          setUserEmail(email || '');
        })
        .withFailureHandler((err) => {
          console.error('Error fetching email:', err);
          setUserEmail('');
        })
        .getUserEmail();
    }
  }, []);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleSubmit = async () => {
    if (!selectedEmoji || !textInput.trim() || !userEmail) return;

    setIsLoading(true);

    const payload = {
      action: "morningpulse",
      payload: {
        email_id: userEmail,
        emoji: selectedEmoji,
        route: "daily-checkin",
        message: textInput.trim()
      }
    };

    try {
      // Using Google Apps Script to make the API call
      google.script.run
        .withSuccessHandler((result) => {
          console.log('Payload sent:', payload);
          console.log('Daily check-in submitted:', result);
          console.log('Full API response:', JSON.stringify(result, null, 2));
          setIsSubmitted(true);
          setIsLoading(false);
          setMotivationResponse(result);
          // Reset form after successful submission
          setSelectedEmoji('');
          setTextInput('');
        })
        .withFailureHandler((error) => {
          console.error('Error submitting daily check-in:', error);
          setIsLoading(false);
          // Handle error state here
        })
        .callMorningPulseAPI(payload);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const dismissMotivation = () => {
    setMotivationResponse(null);
    setIsSubmitted(false);
  };

  const formatGeneratedTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Just now';
    }
  };

  const getMotivationText = (response) => {
    if (!response) return 'No motivation available';
    
    // Try different possible response structures
    if (response.motivation) {
      return response.motivation;
    }
    
    if (response.message) {
      return response.message;
    }
    
    if (response.text) {
      return response.text;
    }
    
    if (response.recommendation) {
      return response.recommendation;
    }
    
    if (typeof response === 'string') {
      return response;
    }
    
    // If it's an object with nested structure, try to find motivation
    if (response.data && response.data.motivation) {
      return response.data.motivation;
    }
    
    if (response.result && response.result.motivation) {
      return response.result.motivation;
    }
    
    // Fallback: return the stringified response for debugging
    console.warn('Could not find motivation text in response:', response);
    return 'Motivation text not found in response';
  };

  const getStatusClass = () => {
    if (isSubmitted) return 'text-green-600';
    if (isLoading) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getStatusDot = () => {
    if (isSubmitted) return 'bg-green-500';
    if (isLoading) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <div className="w-full font-sans">
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200">
        {/* Header Area */}
        <div
          onClick={toggleExpanded}
          className="p-3 cursor-pointer hover:bg-gray-50 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sunrise className={`w-6 h-6 ${getStatusClass()}`} />
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}></div>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-base">Morning Pulse</div>
                <div className="text-sm text-gray-500">
                  {isLoading ? 'Submitting...' : 
                   isSubmitted ? 'Submitted today' : 
                   'Start your day!'}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Expanded Section */}
        {isExpanded && (
          <div className="p-4 border-t border-gray-100">
            {/* Show motivation response if available */}
            {motivationResponse ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Your Daily Motivation</h3>
                  </div>
                </div>
                
                {/* Motivation Card */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-4 relative">
                  {/* Close button */}
                  <button
                    onClick={dismissMotivation}
                    className="absolute top-3 right-3 p-1 hover:bg-orange-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-orange-600" />
                  </button>
                  
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Sunrise className="w-8 h-8 text-orange-500" />
                    <span className="text-3xl">{selectedEmoji}</span>
                  </div>
                  <p className="text-gray-800 text-lg font-medium leading-relaxed italic">
                    "{getMotivationText(motivationResponse)}"
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    Generated at {formatGeneratedTime(motivationResponse.generatedAt)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✨ Daily pulse submitted successfully!
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header Message */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Ignite Your Spark — One Goal at a Time!</h3>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">It's time to start your day!</p>
                </div>

                {/* Emoji Selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">How are you feeling today?</h4>
                  <div className="flex justify-center space-x-2">
                    {emojis.map((item) => (
                      <div key={item.level} className="text-center relative group">
                        <button
                          onClick={() => setSelectedEmoji(item.emoji)}
                          className={`w-12 h-12 rounded-full text-2xl transition-all duration-200 ${
                            selectedEmoji === item.emoji
                              ? 'bg-orange-100 ring-2 ring-orange-500 scale-110'
                              : 'hover:bg-gray-100 hover:scale-105'
                          }`}
                          disabled={isLoading}
                        >
                          {item.emoji}
                        </button>
                        {/* Custom tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 hidden group-hover:block">
                          <Tooltip text={item.label} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{item.level}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span>Low Energy</span>
                    <span>High Energy</span>
                  </div>
                </div>

                {/* Daily Reflection */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Daily Reflection</h4>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">What Matters Most to You Today?</h5>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Today I want to focus on... / My main priority is... / I'm excited about..."
                    rows="4"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mb-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedEmoji || !textInput.trim() || !userEmail || isLoading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      !selectedEmoji || !textInput.trim() || !userEmail || isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Daily Pulse</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Message */}
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isSubmitted
                      ? 'bg-green-100 text-green-800'
                      : isLoading
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {isSubmitted ? '✨ Daily pulse submitted!' : 
                     isLoading ? '⏰ Submitting...' : 
                     '🌅 Ready to capture your morning pulse'}
                  </div>
                </div>

                {/* Tips */}
                {!isSubmitted && !isLoading && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h6 className="text-xs font-semibold text-gray-700 mb-2">💡 Tips for a great daily pulse:</h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Be honest about how you're feeling</li>
                      <li>• Focus on 1-2 key priorities for the day</li>
                      <li>• Think about what energizes you most</li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}