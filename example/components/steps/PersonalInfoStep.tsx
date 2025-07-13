import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStepContext } from '../../../src/utils';
import { colors } from '../../../src/theme/colors';

interface PersonalInfoData {
  firstName?: string;
  lastName?: string;
}

interface PersonalInfoErrors {
  firstName?: string;
  lastName?: string;
}

export const PersonalInfoStep = observer(() => {
  const { getStepData, updateField, canMoveNext } =
    useStepContext('personalInfo');
  const [formData, setFormData] = useState<PersonalInfoData>({});
  const [errors, setErrors] = useState<PersonalInfoErrors>({});

  useEffect(() => {
    const data = getStepData() as PersonalInfoData;
    if (data) {
      setFormData(data);
    }
  }, [getStepData]);

  const validateField = (
    fieldName: keyof PersonalInfoData,
    fieldValue: string
  ): string | undefined => {
    if (!fieldValue) {
      return `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
    }
    if (fieldValue.length < 2) {
      return `${
        fieldName === 'firstName' ? 'First' : 'Last'
      } name must be at least 2 characters`;
    }
    return undefined;
  };

  const handleFieldUpdate = (
    fieldName: keyof PersonalInfoData,
    fieldValue: string
  ) => {
    const validationError = validateField(fieldName, fieldValue);
    const newFormData = { ...formData, [fieldName]: fieldValue };
    const newErrors = { ...errors, [fieldName]: validationError };

    setFormData(newFormData);
    setErrors(newErrors);
    updateField(fieldName, fieldValue);

    const hasErrors = Object.values(newErrors).some((err) => err !== undefined);
    const isComplete = Object.values(newFormData).every(
      (val) => val && val.length > 0
    );
    canMoveNext(!hasErrors && isComplete);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          value={formData.firstName || ''}
          onChangeText={(value) => handleFieldUpdate('firstName', value)}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          value={formData.lastName || ''}
          onChangeText={(value) => handleFieldUpdate('lastName', value)}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderColor: colors.gray300,
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    padding: 8,
  },
  inputError: {
    borderColor: colors.error,
  },
  label: {
    color: colors.gray800,
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    color: colors.gray800,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
