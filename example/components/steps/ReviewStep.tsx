import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../../src/types/store';
import { useStepContext } from '../../../src/utils/wizardUtils';

// Define validation schema (example without Yup)
const validateReview = (data: any) => {
  const errors: Record<string, string> = {};
  
  // Check if all required steps have data
  if (!data.personalInfo || !data.personalInfo.firstName || !data.personalInfo.lastName) {
    errors.personalInfo = 'Personal information is incomplete';
  }
  
  if (!data.contactInfo || !data.contactInfo.email) {
    errors.contactInfo = 'Contact information is incomplete';
  }
  
  if (!data.security || !data.security.username || !data.security.password) {
    errors.security = 'Security information is incomplete';
  }
  
  if (!data.preferences || !data.preferences.language || !data.preferences.theme) {
    errors.preferences = 'Preferences are incomplete';
  }
  
  return errors;
};

interface ReviewStepProps {
  store: WizardStoreType;
  onComplete: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = observer(({ store, onComplete }) => {
  // Use the step context hook to get the step ID and helper functions
  const { getStepData } = useStepContext('review');
  
  // Get all wizard data
  const wizardData = store.getWizardData();
  
  // State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Validate the form when data changes
  useEffect(() => {
    const validationErrors = validateReview(wizardData);
    setErrors(validationErrors);
  }, [wizardData]);
  
  // Handle form submission
  const handleSubmit = () => {
    const validationErrors = validateReview(wizardData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onComplete();
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Review Your Information</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {errors.personalInfo ? (
          <Text style={styles.errorText}>{errors.personalInfo}</Text>
        ) : (
          <>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {wizardData.personalInfo?.firstName} {wizardData.personalInfo?.lastName}
            </Text>
            
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{wizardData.personalInfo?.dateOfBirth}</Text>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {errors.contactInfo ? (
          <Text style={styles.errorText}>{errors.contactInfo}</Text>
        ) : (
          <>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{wizardData.contactInfo?.email}</Text>
            
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{wizardData.contactInfo?.phone}</Text>
            
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {wizardData.contactInfo?.address}, {wizardData.contactInfo?.city}, {wizardData.contactInfo?.state} {wizardData.contactInfo?.zipCode}
            </Text>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        {errors.security ? (
          <Text style={styles.errorText}>{errors.security}</Text>
        ) : (
          <>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{wizardData.security?.username}</Text>
            
            <Text style={styles.label}>Security Question:</Text>
            <Text style={styles.value}>{wizardData.security?.securityQuestion}</Text>
          </>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        {errors.preferences ? (
          <Text style={styles.errorText}>{errors.preferences}</Text>
        ) : (
          <>
            <Text style={styles.label}>Language:</Text>
            <Text style={styles.value}>
              {wizardData.preferences?.language === 'en' ? 'English' : 
               wizardData.preferences?.language === 'es' ? 'Spanish' : 
               wizardData.preferences?.language === 'fr' ? 'French' : ''}
            </Text>
            
            <Text style={styles.label}>Theme:</Text>
            <Text style={styles.value}>
              {wizardData.preferences?.theme === 'light' ? 'Light' : 
               wizardData.preferences?.theme === 'dark' ? 'Dark' : ''}
            </Text>
            
            <Text style={styles.label}>Newsletter:</Text>
            <Text style={styles.value}>{wizardData.preferences?.newsletter ? 'Yes' : 'No'}</Text>
            
            <Text style={styles.label}>Marketing Emails:</Text>
            <Text style={styles.value}>{wizardData.preferences?.marketing ? 'Yes' : 'No'}</Text>
          </>
        )}
      </View>
      
      <TouchableOpacity
        style={[styles.button, Object.keys(errors).length > 0 && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={Object.keys(errors).length > 0}
      >
        <Text style={styles.buttonText}>Complete Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 