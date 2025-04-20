import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Wizard } from '../src/components/Wizard';
import { PersonalInfoStep } from './components/steps/PersonalInfoStep';
import { ContactInfoStep } from './components/steps/ContactInfoStep';
import { SecurityStep } from './components/steps/SecurityStep';
import { PreferencesStep } from './components/steps/PreferencesStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { Step } from '../src/types';
import { theme } from '../src/theme';

const App: React.FC = () => {
  const steps: Step[] = [
    {
      id: 'personalInfo',
      component: PersonalInfoStep,
      order: 1,
    },
    {
      id: 'contactInfo',
      component: ContactInfoStep,
      order: 2,
    },
    {
      id: 'security',
      component: SecurityStep,
      order: 3,
    },
    {
      id: 'preferences',
      component: PreferencesStep,
      order: 4,
    },
    {
      id: 'review',
      component: ReviewStep,
      order: 5,
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
        onComplete={handleComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
});

export default App;
