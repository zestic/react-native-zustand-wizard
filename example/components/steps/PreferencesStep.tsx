import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../../src/types/store';
import { useStepContext } from '../../../src/utils/wizardUtils';

// Define validation schema (example without Yup)
const validatePreferences = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.language) {
    errors.language = 'Language is required';
  }

  if (!data.theme) {
    errors.theme = 'Theme is required';
  }

  return errors;
};

interface PreferencesStepProps {
  store: WizardStoreType;
  onComplete: () => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = observer(
  ({ store, onComplete }) => {
    // Use the step context hook to get the step ID and helper functions
    const { updateField, getStepData } = useStepContext('preferences');

    // Get the current step data from the store
    const stepData = getStepData();

    // State for validation errors
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Validate the form when data changes
    useEffect(() => {
      const validationErrors = validatePreferences(stepData);
      setErrors(validationErrors);
    }, [stepData]);

    // Handle form submission
    const handleSubmit = () => {
      const validationErrors = validatePreferences(stepData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onComplete();
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Preferences</Text>

        <Text style={styles.label}>Language</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              stepData.language === 'en' && styles.selectedOption,
            ]}
            onPress={() => updateField('language', 'en')}
          >
            <Text
              style={[
                styles.optionText,
                stepData.language === 'en' && styles.selectedOptionText,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              stepData.language === 'es' && styles.selectedOption,
            ]}
            onPress={() => updateField('language', 'es')}
          >
            <Text
              style={[
                styles.optionText,
                stepData.language === 'es' && styles.selectedOptionText,
              ]}
            >
              Spanish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              stepData.language === 'fr' && styles.selectedOption,
            ]}
            onPress={() => updateField('language', 'fr')}
          >
            <Text
              style={[
                styles.optionText,
                stepData.language === 'fr' && styles.selectedOptionText,
              ]}
            >
              French
            </Text>
          </TouchableOpacity>
        </View>
        {errors.language && (
          <Text style={styles.errorText}>{errors.language}</Text>
        )}

        <Text style={styles.label}>Theme</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              stepData.theme === 'light' && styles.selectedOption,
            ]}
            onPress={() => updateField('theme', 'light')}
          >
            <Text
              style={[
                styles.optionText,
                stepData.theme === 'light' && styles.selectedOptionText,
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              stepData.theme === 'dark' && styles.selectedOption,
            ]}
            onPress={() => updateField('theme', 'dark')}
          >
            <Text
              style={[
                styles.optionText,
                stepData.theme === 'dark' && styles.selectedOptionText,
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>
        </View>
        {errors.theme && <Text style={styles.errorText}>{errors.theme}</Text>}

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Subscribe to Newsletter</Text>
          <Switch
            value={stepData.newsletter || false}
            onValueChange={(value) => updateField('newsletter', value)}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Receive Marketing Emails</Text>
          <Switch
            value={stepData.marketing || false}
            onValueChange={(value) => updateField('marketing', value)}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            Object.keys(errors).length > 0 && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={Object.keys(errors).length > 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionButton: {
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
    padding: 12,
  },
  optionText: {
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: '#E6F2FF',
    borderColor: '#007AFF',
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  switchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
