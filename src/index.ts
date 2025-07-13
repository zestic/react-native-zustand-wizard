// Main components
export { Wizard } from './components/Wizard';
export { WizardNavigation } from './components/navigation/WizardNavigation';
export { StepIndicator } from './components/navigation/StepIndicator';

// Utilities
export { useStepContext, useNavigationContext } from './utils';

// Context
export {
  WizardProvider,
  useWizardContext,
  useWizard,
} from './context/WizardContext';

// Types
export type {
  WizardProps,
  Step,
  NavigationContext,
  StepContext,
  WizardNavigationProps,
} from './types';

// Store (for advanced usage)
export { useWizardStore } from './stores/WizardStore';

// Theme
export { colors } from './theme/colors';
