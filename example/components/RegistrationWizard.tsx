import React from 'react';
import { observer } from 'mobx-react-lite';
import { Step } from '../../src/types';
import { Wizard } from '../../src/components/Wizard';

// Import steps
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { SecurityStep } from './steps/SecurityStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ReviewStep } from './steps/ReviewStep';

interface RegistrationWizardProps {
  onComplete?: (data: Record<string, unknown>) => void;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = observer(() => {
  // Define the steps for the wizard with proper typing
  const steps: Step[] = [
    {
      id: 'personalInfo',
      order: 1,
      component: PersonalInfoStep,
      canMoveNext: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'contactInfo',
      order: 2,
      component: ContactInfoStep,
      canMoveNext: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'security',
      order: 3,
      component: SecurityStep,
      canMoveNext: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'preferences',
      order: 4,
      component: PreferencesStep,
      canMoveNext: false,
      nextLabel: 'Next',
      previousLabel: 'Back',
    },
    {
      id: 'review',
      order: 5,
      component: ReviewStep,
      canMoveNext: false,
      nextLabel: 'Submit',
      previousLabel: 'Back',
    },
  ];

  return (
    <Wizard
      steps={steps}
      nextLabel="Next"
      previousLabel="Back"
      finishLabel="Submit"
    />
  );
});

export default RegistrationWizard;
