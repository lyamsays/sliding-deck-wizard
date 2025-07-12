import React, { useEffect } from 'react';
import { useOnboarding, OnboardingFlow } from '@/hooks/useOnboarding';
import InteractiveGuide from './InteractiveGuide';
import { AnimatePresence } from 'framer-motion';

const OnboardingManager: React.FC = () => {
  const {
    state,
    registerFlow,
    nextStep,
    dismissFlow,
    getCurrentStep,
    isActive
  } = useOnboarding();

  // Register main onboarding flow
  useEffect(() => {
    const mainFlow: OnboardingFlow = {
      id: 'main',
      name: 'Welcome to Sliding.io',
      priority: 1,
      trigger: 'immediate',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to Sliding.io! 🎉',
          description: 'Transform your ideas into professional slide decks in seconds. Let\'s take a quick tour to get you started.',
          skippable: true
        },
        {
          id: 'content-input',
          title: 'Start with Your Content',
          description: 'Begin by entering your presentation content. You can paste notes, bullet points, or any text you want to turn into slides.',
          target: 'textarea',
          skippable: true
        },
        {
          id: 'profession-selection',
          title: 'Choose Your Profession',
          description: 'Select your profession to get tailored slide layouts and content suggestions that match your field.',
          target: '[data-profession-select]',
          skippable: true
        },
        {
          id: 'theme-selection',
          title: 'Pick a Theme',
          description: 'Choose from our professional themes to give your slides the perfect look for your presentation.',
          target: '[data-theme-select]',
          skippable: true
        },
        {
          id: 'generate-slides',
          title: 'Generate Your Slides',
          description: 'Click the Generate Slides button to let our AI transform your content into a beautiful presentation.',
          target: 'button[type="submit"]',
          action: {
            label: 'Try with Example Content',
            onClick: () => {
              const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
              if (textarea) {
                textarea.value = "Project Overview\n\nObjectives:\n• Define project scope and deliverables\n• Establish timeline and milestones\n• Assign roles and responsibilities\n\nKey Activities:\n• Research and analysis phase\n• Development and implementation\n• Testing and quality assurance\n• Deployment and monitoring";
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          },
          skippable: true
        },
        {
          id: 'complete',
          title: 'You\'re All Set! 🚀',
          description: 'You now know the basics of creating presentations with Sliding.io. Explore features like editing slides, changing themes, and exporting to PowerPoint as you create.',
          completed: true
        }
      ]
    };

    const slideEditingFlow: OnboardingFlow = {
      id: 'slide-editing',
      name: 'Slide Editing Tour',
      priority: 2,
      trigger: 'feature-access',
      steps: [
        {
          id: 'edit-slide',
          title: 'Edit Individual Slides',
          description: 'Click on any slide to edit its content, change the layout, or add images.',
          target: '.slide-preview',
          skippable: true
        },
        {
          id: 'reorder-slides',
          title: 'Reorder Your Slides',
          description: 'Drag and drop slides to change their order and perfect your presentation flow.',
          skippable: true
        },
        {
          id: 'export-options',
          title: 'Export Your Presentation',
          description: 'Export your slides as PowerPoint, PDF, or individual images when you\'re ready to present.',
          target: '[data-export-button]',
          skippable: true
        }
      ]
    };

    registerFlow(mainFlow);
    registerFlow(slideEditingFlow);
  }, [registerFlow]);

  const currentStep = getCurrentStep();

  if (!isActive || !currentStep) {
    return null;
  }

  const currentFlow = state.currentFlow ? 
    (() => {
      // Get total steps for current flow
      if (state.currentFlow === 'main') return 6;
      if (state.currentFlow === 'slide-editing') return 3;
      return 1;
    })() : 1;

  return (
    <AnimatePresence mode="wait">
      {currentStep && (
        <InteractiveGuide
          key={`${state.currentFlow}-${state.currentStep}`}
          step={currentStep}
          currentStepIndex={state.currentStep}
          totalSteps={currentFlow}
          onNext={nextStep}
          onDismiss={dismissFlow}
        />
      )}
    </AnimatePresence>
  );
};

export default OnboardingManager;