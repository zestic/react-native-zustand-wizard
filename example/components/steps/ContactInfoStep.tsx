import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStepContext } from '../../../src/utils';
import { colors } from '../../../src/theme/colors';

interface ContactInfoData {
  email?: string;
  phone?: string;
  state?: string;
  zipCode?: string;
}

interface ContactInfoErrors {
  email?: string;
  phone?: string;
  state?: string;
  zipCode?: string;
}

export const ContactInfoStep = observer(() => {
  const { getStepData, updateField, canMoveNext } =
    useStepContext('contactInfo');
  const [formData, setFormData] = useState<ContactInfoData>({});
  const [errors, setErrors] = useState<ContactInfoErrors>({});

  useEffect(() => {
    const data = getStepData() as ContactInfoData;
    if (data) {
      setFormData(data);
    }
  }, [getStepData]);

  const validateField = (
    fieldName: keyof ContactInfoData,
    fieldValue: string
  ): string | undefined => {
    switch (fieldName) {
      case 'email':
        if (!fieldValue) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue))
          return 'Invalid email format';
        break;
      case 'phone':
        if (!fieldValue) return 'Phone number is required';
        if (!/^\d{10}$/.test(fieldValue.replace(/\D/g, '')))
          return 'Invalid phone number';
        break;
      case 'state':
        if (!fieldValue) return 'State is required';
        if (fieldValue.length < 2) return 'Invalid state';
        break;
      case 'zipCode':
        if (!fieldValue) return 'ZIP code is required';
        if (!/^\d{5}(-\d{4})?$/.test(fieldValue)) return 'Invalid ZIP code';
        break;
    }
    return undefined;
  };

  const handleFieldUpdate = (
    fieldName: keyof ContactInfoData,
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
      <Text style={styles.title}>Contact Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email || ''}
          onChangeText={(value) => handleFieldUpdate('email', value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          value={formData.phone || ''}
          onChangeText={(value) => handleFieldUpdate('phone', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>State</Text>
        <TextInput
          style={[styles.input, errors.state && styles.inputError]}
          value={formData.state || ''}
          onChangeText={(value) => handleFieldUpdate('state', value)}
          placeholder="Enter your state"
        />
        {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>ZIP Code</Text>
        <TextInput
          style={[styles.input, errors.zipCode && styles.inputError]}
          value={formData.zipCode || ''}
          onChangeText={(value) => handleFieldUpdate('zipCode', value)}
          placeholder="Enter your ZIP code"
          keyboardType="number-pad"
        />
        {errors.zipCode && (
          <Text style={styles.errorText}>{errors.zipCode}</Text>
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
