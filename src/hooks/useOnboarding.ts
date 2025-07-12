import { useState, useEffect, useCallback } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  content?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top' | 'bottom' | 'left' | 'right';
  skippable?: boolean;
  completed?: boolean;
}

export interface OnboardingFlow {
  id: string;
  name: string;
  steps: OnboardingStep[];
  trigger?: 'immediate' | 'feature-access' | 'manual';
  priority?: number;
}

interface OnboardingState {
  currentFlow: string | null;
  currentStep: number;
  completedFlows: string[];
  completedSteps: string[];
  dismissed: string[];
  showTooltips: boolean;
}

const DEFAULT_STATE: OnboardingState = {
  currentFlow: null,
  currentStep: 0,
  completedFlows: [],
  completedSteps: [],
  dismissed: [],
  showTooltips: true
};

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>(DEFAULT_STATE);
  const [availableFlows, setAvailableFlows] = useState<OnboardingFlow[]>([]);

  // Load onboarding state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('onboardingState');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState({ ...DEFAULT_STATE, ...parsedState });
      } catch (error) {
        console.error('Failed to parse onboarding state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  const saveState = useCallback((newState: OnboardingState) => {
    setState(newState);
    localStorage.setItem('onboardingState', JSON.stringify(newState));
  }, []);

  // Register an onboarding flow
  const registerFlow = useCallback((flow: OnboardingFlow) => {
    setAvailableFlows(prev => {
      const existing = prev.find(f => f.id === flow.id);
      if (existing) {
        return prev.map(f => f.id === flow.id ? flow : f);
      }
      return [...prev, flow].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    });
  }, []);

  // Start a specific onboarding flow
  const startFlow = useCallback((flowId: string) => {
    const flow = availableFlows.find(f => f.id === flowId);
    if (!flow || state.completedFlows.includes(flowId)) return;

    saveState({
      ...state,
      currentFlow: flowId,
      currentStep: 0
    });
  }, [availableFlows, state, saveState]);

  // Move to next step
  const nextStep = useCallback(() => {
    if (!state.currentFlow) return;

    const flow = availableFlows.find(f => f.id === state.currentFlow);
    if (!flow) return;

    const currentStepData = flow.steps[state.currentStep];
    if (currentStepData) {
      const stepId = `${state.currentFlow}.${currentStepData.id}`;
      const newCompletedSteps = [...state.completedSteps, stepId];
      
      if (state.currentStep + 1 >= flow.steps.length) {
        // Flow completed
        saveState({
          ...state,
          currentFlow: null,
          currentStep: 0,
          completedFlows: [...state.completedFlows, state.currentFlow],
          completedSteps: newCompletedSteps
        });
      } else {
        // Move to next step
        saveState({
          ...state,
          currentStep: state.currentStep + 1,
          completedSteps: newCompletedSteps
        });
      }
    }
  }, [state, availableFlows, saveState]);

  // Skip current step
  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  // Dismiss entire flow
  const dismissFlow = useCallback(() => {
    if (!state.currentFlow) return;

    saveState({
      ...state,
      currentFlow: null,
      currentStep: 0,
      dismissed: [...state.dismissed, state.currentFlow]
    });
  }, [state, saveState]);

  // Mark step as completed
  const completeStep = useCallback((flowId: string, stepId: string) => {
    const fullStepId = `${flowId}.${stepId}`;
    if (state.completedSteps.includes(fullStepId)) return;

    saveState({
      ...state,
      completedSteps: [...state.completedSteps, fullStepId]
    });
  }, [state, saveState]);

  // Check if user should see onboarding
  const shouldShowOnboarding = useCallback(() => {
    const isFirstVisit = !localStorage.getItem('hasSeenApp');
    const hasCompletedMainFlow = state.completedFlows.includes('main');
    return isFirstVisit && !hasCompletedMainFlow;
  }, [state.completedFlows]);

  // Reset all onboarding (for testing)
  const resetOnboarding = useCallback(() => {
    localStorage.removeItem('onboardingState');
    localStorage.removeItem('hasSeenApp');
    localStorage.removeItem('hasSeenOnboarding');
    setState(DEFAULT_STATE);
  }, []);

  // Get current step data
  const getCurrentStep = useCallback((): OnboardingStep | null => {
    if (!state.currentFlow) return null;
    
    const flow = availableFlows.find(f => f.id === state.currentFlow);
    if (!flow || state.currentStep >= flow.steps.length) return null;
    
    return flow.steps[state.currentStep];
  }, [state.currentFlow, state.currentStep, availableFlows]);

  // Check if step is completed
  const isStepCompleted = useCallback((flowId: string, stepId: string): boolean => {
    const fullStepId = `${flowId}.${stepId}`;
    return state.completedSteps.includes(fullStepId);
  }, [state.completedSteps]);

  // Check if flow is completed
  const isFlowCompleted = useCallback((flowId: string): boolean => {
    return state.completedFlows.includes(flowId);
  }, [state.completedFlows]);

  // Auto-start appropriate flow
  useEffect(() => {
    if (shouldShowOnboarding() && !state.currentFlow && availableFlows.length > 0) {
      const mainFlow = availableFlows.find(f => f.id === 'main');
      if (mainFlow) {
        startFlow('main');
      }
    }
  }, [shouldShowOnboarding, state.currentFlow, availableFlows, startFlow]);

  return {
    state,
    registerFlow,
    startFlow,
    nextStep,
    skipStep,
    dismissFlow,
    completeStep,
    getCurrentStep,
    isStepCompleted,
    isFlowCompleted,
    shouldShowOnboarding,
    resetOnboarding,
    isActive: !!state.currentFlow
  };
};