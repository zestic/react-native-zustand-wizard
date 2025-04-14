import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Wizard } from '../../src/components/Wizard';
import { WizardStore } from '../../src/stores/WizardStore';
import { initializeWizardStore } from '../../src/utils/wizardUtils';
import { StepConfig } from '../../src/types/index';

// Import step components
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { SecurityStep } from './steps/SecurityStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { ReviewStep } from './steps/ReviewStep';

interface RegistrationWizardProps {
  onComplete?: (data: any) => void;
  preloadData?: boolean;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = observer(({ 
  onComplete,
  preloadData = false
}) => {
  const [isLoading, setIsLoading] = useState(preloadData);
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  // Define the steps for the wizard with proper typing
  const steps: StepConfig[] = [
    {
      id: 'personalInfo',
      component: PersonalInfoStep,
      order: 1
    },
    {
      id: 'contactInfo',
      component: ContactInfoStep,
      order: 2
    },
    {
      id: 'security',
      component: SecurityStep,
      order: 3
    },
    {
      id: 'preferences',
      component: PreferencesStep,
      order: 4
    },
    {
      id: 'review',
      component: ReviewStep,
      order: 5
    }
  ];
  
  // Sort steps by order
  const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Create a store instance
  const store = WizardStore.create({
    steps: sortedSteps,
    stepData: {},
  });
  
  // Initialize the wizard store for the utility function
  initializeWizardStore(store);
  
  // Preload data if needed
  useEffect(() => {
    if (preloadData && !isPreloaded) {
      const preloadWizardData = async () => {
        try {
          // Simulate API call to fetch initial data
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Set some initial data for each step
          store.updateField('personalInfo', 'firstName', 'John');
          store.updateField('personalInfo', 'lastName', 'Doe');
          store.updateField('personalInfo', 'dateOfBirth', new Date('1990-01-01'));
          
          store.updateField('contactInfo', 'email', 'john.doe@example.com');
          store.updateField('contactInfo', 'phone', '123-456-7890');
          store.updateField('contactInfo', 'address', '123 Main St');
          store.updateField('contactInfo', 'city', 'Anytown');
          store.updateField('contactInfo', 'state', 'CA');
          store.updateField('contactInfo', 'zipCode', '12345');
          
          store.updateField('preferences', 'language', 'en');
          store.updateField('preferences', 'theme', 'light');
          store.updateField('preferences', 'newsletter', true);
          store.updateField('preferences', 'marketing', false);
          
          setIsPreloaded(true);
          setIsLoading(false);
        } catch (error) {
          Alert.alert('Error', 'Failed to preload data. Please try again.');
          setIsLoading(false);
        }
      };
      
      preloadWizardData();
    }
  }, [preloadData, isPreloaded, store]);
  
  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all wizard data in a single call
      const registrationData = store.getWizardData();
      
      // Call the onComplete callback with the collected data
      if (onComplete) {
        onComplete(registrationData);
      } else {
        Alert.alert('Registration Complete', 'Your account has been created successfully!');
      }
      
      // Reset the store for future use
      store.reset();
    } catch (error) {
      Alert.alert('Error', 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Wizard
        store={store}
        steps={sortedSteps}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistrationWizard; 