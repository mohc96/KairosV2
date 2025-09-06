import React from 'react';
import { Sunrise, CheckCircle } from 'lucide-react';
import { CollapsibleHeader } from './ui/CollapsibleHeader';
import { MorningPulseForm } from './forms/MorningPulseForm';
import { DashboardView } from './dashboard/DashboardView';
import { useMorningPulseState } from '../hooks/useMorningPulseState';


<<<<<<< HEAD
// Motivation array
const MOTIVATIONS = [
  "Unleash your full potential like a superhero, and tackle today's challenges with electrifying energy! You've got the power to conquer any obstacle that comes your way. Go shine bright!",
  "Push a little harder today for a better tomorrow.",
  "You're stronger than you think.",
  "Keep going, success is around the corner!"
];


// Default data constants
const DEFAULT_EMOJIS = [
  { emoji: '😔', level: 1, label: 'Low Energy' },
  { emoji: '😌', level: 2, label: 'Calm' },
  { emoji: '😁', level: 3, label: 'Good' },
  { emoji: '😎', level: 4, label: 'Strong' },
  { emoji: '🤩', level: 5, label: 'High Energy' }
];

const DEFAULT_DASHBOARD_DATA = {
  "ActiveProjects": [
    "Climate Change in Arcadia, AZ",
    "Displacement of People Impacted by Climate Disasters",
    "Urban Heat Islands"
  ],
  "Peers": [
    "Diego Lopez completed a major project assessment!",
    "Aiden Smith is working on a task similar to yours.",
    "Fatima Patel is looking for experts in the area of climate change.",
    "Liam O'Connor just started a new project.",
    "Sofia Martinez is looking to put together a reading group.",
    "Jin Yamamoto is new to your class group."
  ],
  "ValueMessage": [
    "Great work yesterday! You accomplished a lot. This certainly will lead you to an amazing project outcome. Continue to focus on being self-aware of anything that may get in your way. You are on your way to becoming your \"best self\"."
  ]
};

export default function SidebarMorningPulse({
  // Data props
  emojis = DEFAULT_EMOJIS,
  dashboardData = DEFAULT_DASHBOARD_DATA,
  
  // API props
  onSubmitPulse = null,
  userEmail = 'user@example.com',
  
  // Text customization props
  pulseHeaderTitle = "🌿 Breathe In, Begin Now 🚀",
  emojiSelectorTitle = "How are you feeling today?",
  textInputTitle = "What's your energy focused on today?",
  textInputPlaceholder = "Today I'm feeling... / My energy is directed toward... / I'm focusing on...",
  submitButtonText = "Submit Morning Pulse",
  dashboardWelcomeTitle = "Welcome to Your Day!",
  dashboardWelcomeSubtitle = "Here's what's happening in your learning community",
  resetButtonText = "Submit New Morning Pulse",
  
  // Header text props
  pulseHeaderText = "Start Your Day!",
  pulseSubtext = "It's your moment to reflect",
  dashboardHeaderText = "Your Daily Dashboard",
  dashboardSubtext = "Pulse submitted successfully",
  loadingSubtext = "Submitting pulse...",
  
  // Styling props
  sectionsConfig = null,
  className = "bg-white border border-gray-200 rounded-lg",
  
  // State control props (for external state management)
  initialState = {},
  externalState = null,
  
  // Feature flags
  enableValidation = true,
  showResetButton = true,
  autoExpand = false
}) {
  // Use external state if provided, otherwise use internal hook
  const internalState = useMorningPulseState(initialState);
  const state = externalState || internalState;

  const {
    isExpanded,
    setIsExpanded,
    selectedEmoji,
    setSelectedEmoji,
    textInput,
    setTextInput,
    isLoadingPulse,
    setIsLoadingPulse,
    currentStep,
    setResponseMessage,
    setCurrentStep,
    resetForm
  } = state;

  const [motivation, setMotivation] = React.useState("");  
  // Auto-expand functionality
  React.useEffect(() => {
    if (autoExpand && !isExpanded) {
      setIsExpanded(true);
||||||| b9f5cb3
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
=======
// Motivation array
const MOTIVATIONS = [
  "Unleash your full potential like a superhero, and tackle today's challenges with electrifying energy! You've got the power to conquer any obstacle that comes your way. Go shine bright!",
  "Push a little harder today for a better tomorrow.",
  "You're stronger than you think.",
  "Keep going, success is around the corner!"
];


// Default data constants
const DEFAULT_EMOJIS = [
  { emoji: '😔', level: 1, label: 'Low Energy' },
  { emoji: '😌', level: 2, label: 'Calm' },
  { emoji: '😁', level: 3, label: 'Good' },
  { emoji: '😎', level: 4, label: 'Strong' },
  { emoji: '🤩', level: 5, label: 'High Energy' }
];

const DEFAULT_DASHBOARD_DATA = {
  "ValueMessage": [
    
  ],
  "Peers": [
    "Diego Lopez completed a major project assessment!",
    "Aiden Smith is working on a task similar to yours.",
    "Fatima Patel is looking for experts in the area of climate change.",
    "Liam O'Connor just started a new project.",
    "Sofia Martinez is looking to put together a reading group.",
    "Jin Yamamoto is new to your class group."
  ],
  "ActiveProjects": [
    "Climate Change in Arcadia, AZ",
    "Displacement of People Impacted by Climate Disasters",
    "Urban Heat Islands"
  ]  
};

export default function SidebarMorningPulse({
  // Data props
  emojis = DEFAULT_EMOJIS,
  dashboardData = DEFAULT_DASHBOARD_DATA,
  
  // API props
  onSubmitPulse = null,
  userEmail = 'user@example.com',
  
  // Text customization props
  pulseHeaderTitle = "Breathe In, Begin Now",
  emojiSelectorTitle = "How are you feeling today?",
  textInputTitle = "What's your energy focused on today?",
  textInputPlaceholder = "Today I'm feeling... / My energy is directed toward... / I'm focusing on...",
  submitButtonText = "Submit Morning Pulse",
  dashboardWelcomeTitle = "Welcome to Your Day!",
  dashboardWelcomeSubtitle = "Here's what's happening in your learning community",
  resetButtonText = "Submit New Morning Pulse",
  
  // Header text props
  pulseHeaderText = "Start Your Day!",
  pulseSubtext = "It's your moment to reflect",
  dashboardHeaderText = "Your Daily Dashboard",
  dashboardSubtext = "Pulse submitted successfully",
  loadingSubtext = "Submitting pulse...",
  
  // Styling props
  sectionsConfig = null,
  className = "bg-white border border-gray-200 rounded-lg",
  
  // State control props (for external state management)
  initialState = {},
  externalState = null,
  
  // Feature flags
  enableValidation = true,
  showResetButton = true,
  autoExpand = false
}) {
  // Use external state if provided, otherwise use internal hook
  const internalState = useMorningPulseState(initialState);
  const state = externalState || internalState;

  const {
    isExpanded,
    setIsExpanded,
    selectedEmoji,
    setSelectedEmoji,
    textInput,
    setTextInput,
    isLoadingPulse,
    setIsLoadingPulse,
    currentStep,
    setResponseMessage,
    setCurrentStep,
    resetForm
  } = state;

  const [motivation, setMotivation] = React.useState(""); 
  const [updatedDashboardData, setUpdatedDashboardData] = React.useState(dashboardData);
   

  // Auto-expand functionality
  React.useEffect(() => {
    if (autoExpand && !isExpanded) {
      setIsExpanded(true);
>>>>>>> staging
    }
  }, [autoExpand, isExpanded, setIsExpanded]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

<<<<<<< HEAD
const handlePulseSubmit = () => {
  // Validation check
  if (enableValidation && (!selectedEmoji || !textInput.trim())) {
    return;
  }
||||||| b9f5cb3
  const handleSubmit = async () => {
    if (!selectedEmoji || !textInput.trim() || !userEmail) return;
=======
  React.useEffect(() => {
    console.log('Dashboard data updated:', updatedDashboardData);
  }, [updatedDashboardData]);
>>>>>>> staging

<<<<<<< HEAD
  setIsLoadingPulse(true);
||||||| b9f5cb3
    setIsLoading(true);
=======
const handlePulseSubmit = () => {
  // Validation check
  if (enableValidation && (!selectedEmoji || !textInput.trim())) {
    return;
  }
>>>>>>> staging

<<<<<<< HEAD
  const userInput = {
    emoji: selectedEmoji,
    message: textInput.trim()
  };
 
||||||| b9f5cb3
    const payload = {
      student_id: userEmail,
      emoji: selectedEmoji,
      text_input: textInput.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Using Google Apps Script to make the API call
=======
  setIsLoadingPulse(true);

  const userInput = {
    emoji: selectedEmoji,
    message: textInput.trim()
  };
 
>>>>>>> staging
      google.script.run
<<<<<<< HEAD
        .withSuccessHandler((motivationText) => {
          // Set the motivation message
          setMotivation(motivationText || "Stay motivated and keep going!");
          
          // Update state to show dashboard
          setIsLoadingPulse(false);
          setCurrentStep('dashboard');
||||||| b9f5cb3
        .withSuccessHandler((result) => {
        console.log(payload)
          console.log('Daily check-in submitted:', result);
          setIsSubmitted(true);
          setIsLoading(false);
          // Reset form after successful submission
          setTimeout(() => {
            setSelectedEmoji('');
            setTextInput('');
            setIsSubmitted(false);
          }, 2000);
=======
        .withSuccessHandler((motivationText) => {
          // Set the motivation message
          //setMotivation(motivationText || "Stay motivated and keep going!");
          console.log('Received inspiration text:', motivationText);
          const newDashboardData = {
            ...updatedDashboardData,
            ValueMessage: [motivationText || "Stay motivated and keep going!"]
          };
          setUpdatedDashboardData(newDashboardData);
          
          // Update state to show dashboard
          setIsLoadingPulse(false);
          setCurrentStep('dashboard');
>>>>>>> staging
        })
        .withFailureHandler((error) => {
          console.error('Error submitting Morning Pulse:', error);
          alert("Something went wrong. Check console.");
          setIsLoadingPulse(false);
        })
<<<<<<< HEAD
        .processDailyCheckin(userInput);
};

  const handleReset = () => {
    resetForm();
    setMotivation("");
||||||| b9f5cb3
        .processDailyCheckin(payload);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
=======
        .processDailyCheckin(userInput);
};

  const handleReset = () => {
    resetForm();
    //setMotivation("");
    setUpdatedDashboardData(dashboardData);
>>>>>>> staging
  };

  const getStatusIcon = () => {
    return currentStep === 'dashboard' ? CheckCircle : Sunrise;
  };

  const getHeaderMessage = () => {
    return currentStep === 'dashboard' ? dashboardHeaderText : pulseHeaderText;
  };

  const getSubMessage = () => {
    if (currentStep === 'dashboard') return dashboardSubtext;
    if (isLoadingPulse) return loadingSubtext;
    return pulseSubtext;
  };

  const getIconColor = () => {
    return currentStep === 'dashboard' ? "text-emerald-600" : "text-gray-600";
  };

  const StatusIcon = getStatusIcon();

  const getStatusDot = () => {
    // map to whatever flags you actually have
    // (kept your original ordering; tweak as you wish)
    if (isLoadingPulse) return 'bg-yellow-500';
    if (currentStep === 'dashboard') return 'bg-green-500';
    return 'bg-gray-400';
  };

<<<<<<< HEAD
const StatusIconWithDot = () => (
    <div className="relative inline-flex">
      <StatusIcon className={`h-5 w-5 ${getIconColor()}`} />
      <span
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white ${getStatusDot()}`}
      />
    </div>
  );

||||||| b9f5cb3
=======
const StatusIconWithDot = () => (
    <div className="relative inline-flex">
      <StatusIcon className={`h-5 w-5 ${getIconColor()}`} />
      <span
        className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${getStatusDot()}`}
      />
    </div>
  );

>>>>>>> staging
  return (
<<<<<<< HEAD
    <div className={className}>
      <CollapsibleHeader
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
        icon={StatusIconWithDot}
        title={getHeaderMessage()}
        subtitle={getSubMessage()}
        iconColor={getIconColor()}
      />

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          {currentStep === 'pulse' && (
            <MorningPulseForm
              emojis={emojis}
              selectedEmoji={selectedEmoji}
              onEmojiSelect={setSelectedEmoji}
              textInput={textInput}
              onTextChange={setTextInput}
              onSubmit={handlePulseSubmit}
              isLoading={isLoadingPulse}
              emojiTitle={emojiSelectorTitle}
              textTitle={textInputTitle}
              textPlaceholder={textInputPlaceholder}
              submitButtonText={submitButtonText}
              headerTitle={pulseHeaderTitle}
              validation={enableValidation}
            />
          )}

          {currentStep === 'dashboard' && (
            <>
            {motivation && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-center font-semibold">
                  {motivation}
||||||| b9f5cb3
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
=======
    <div className={className}>
      <CollapsibleHeader
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
        icon={StatusIconWithDot}
        title={getHeaderMessage()}
        subtitle={getSubMessage()}
        iconColor={getIconColor()}
      />

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          {currentStep === 'pulse' && (
            <MorningPulseForm
              emojis={emojis}
              selectedEmoji={selectedEmoji}
              onEmojiSelect={setSelectedEmoji}
              textInput={textInput}
              onTextChange={setTextInput}
              onSubmit={handlePulseSubmit}
              isLoading={isLoadingPulse}
              emojiTitle={emojiSelectorTitle}
              textTitle={textInputTitle}
              textPlaceholder={textInputPlaceholder}
              submitButtonText={submitButtonText}
              headerTitle={pulseHeaderTitle}
              validation={enableValidation}
            />
          )}

          {currentStep === 'dashboard' && (
            <>
            {/* {motivation && (
                <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 rounded-lg text-center font-semibold">
                  {motivation}
>>>>>>> staging
                </div>
<<<<<<< HEAD
              )}
            <DashboardView
              dashboardData={dashboardData}
              onReset={showResetButton ? handleReset : null}
              welcomeTitle={dashboardWelcomeTitle}
              welcomeSubtitle={dashboardWelcomeSubtitle}
              resetButtonText={resetButtonText}
              sectionsConfig={sectionsConfig}
              showResetButton={showResetButton}
              responseMessage={state.responseMessage}
            />
            </>

          )}
||||||| b9f5cb3
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
=======
              )} */}
            <DashboardView
              dashboardData={updatedDashboardData}
              onReset={showResetButton ? handleReset : null}
              welcomeTitle={dashboardWelcomeTitle}
              welcomeSubtitle={dashboardWelcomeSubtitle}
              resetButtonText={resetButtonText}
              sectionsConfig={sectionsConfig}
              showResetButton={showResetButton}
              responseMessage={state.responseMessage}
            />
            </>

          )}
>>>>>>> staging
        </div>
      )}
    </div>
  );
}