import React from 'react';
import { Sunrise, CheckCircle } from 'lucide-react';
import { CollapsibleHeader } from './ui/CollapsibleHeader';
import { MorningPulseForm } from './forms/MorningPulseForm';
import { DashboardView } from './dashboard/DashboardView';
import { useMorningPulseState } from '../hooks/useMorningPulseState';

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
    setCurrentStep,
    resetForm
  } = state;

  // Auto-expand functionality
  React.useEffect(() => {
    if (autoExpand && !isExpanded) {
      setIsExpanded(true);
    }
  }, [autoExpand, isExpanded, setIsExpanded]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handlePulseSubmit = async () => {
    if (enableValidation && (!selectedEmoji || !textInput.trim())) return;

    setIsLoadingPulse(true);

    const payload = {
      student_id: userEmail,
      emoji: selectedEmoji,
      text_input: textInput.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      if (onSubmitPulse) {
        await onSubmitPulse(payload);
      } else {
        // Default simulation
        console.log('Submitting Morning Pulse:', payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Morning Pulse submitted successfully');
      }
      
      setIsLoadingPulse(false);
      setCurrentStep('dashboard');
    } catch (error) {
      console.error('Error submitting Morning Pulse:', error);
      setIsLoadingPulse(false);
    }
  };

  const handleReset = () => {
    resetForm();
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

const StatusIconWithDot = () => (
    <div className="relative inline-flex">
      <StatusIcon className={`h-5 w-5 ${getIconColor()}`} />
      <span
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white ${getStatusDot()}`}
      />
    </div>
  );

  return (
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
            <DashboardView
              dashboardData={dashboardData}
              onReset={showResetButton ? handleReset : null}
              welcomeTitle={dashboardWelcomeTitle}
              welcomeSubtitle={dashboardWelcomeSubtitle}
              resetButtonText={resetButtonText}
              sectionsConfig={sectionsConfig}
              showResetButton={showResetButton}
            />
          )}
        </div>
      )}
    </div>
  );
}