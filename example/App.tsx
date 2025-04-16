import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Wizard } from '../src/components/Wizard';
import { PersonalInfoStep } from './components/steps/PersonalInfoStep';
import { ContactInfoStep } from './components/steps/ContactInfoStep';
import { SecurityStep } from './components/steps/SecurityStep';
import { PreferencesStep } from './components/steps/PreferencesStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { StepConfig } from '../src/types';

const App: React.FC = () => {
  const steps: StepConfig[] = [
    {
      id: 'personalInfo',
      component: PersonalInfoStep,
      order: 0,
    },
    {
      id: 'contactInfo',
      component: ContactInfoStep,
      order: 1,
    },
    {
      id: 'security',
      component: SecurityStep,
      order: 2,
    },
    {
      id: 'preferences',
      component: PreferencesStep,
      order: 3,
    },
    {
      id: 'review',
      component: ReviewStep,
      order: 4,
    },
  ];

  const handleComplete = () => {
    Alert.alert('Registration Complete', 'Thank you for registering!', [
      { text: 'OK' },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Registration</Text>
      <Wizard
        steps={steps}
        nextLabel="Next"
        previousLabel="Back"
        finishLabel="Complete"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  header: {
    backgroundColor: '#2196F3',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
});

export default App;
