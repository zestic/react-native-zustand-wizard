import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStepContext } from '../../../src/utils';
import { colors } from '../../../src/theme/colors';

interface SecurityData {
  username?: string;
  password?: string;
  confirmPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

interface SecurityErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export const SecurityStep = observer(() => {
  const { getStepData, updateField, canMoveNext } = useStepContext('security');
  const [formData, setFormData] = useState<SecurityData>({});
  const [errors, setErrors] = useState<SecurityErrors>({});

  useEffect(() => {
    const data = getStepData() as SecurityData;
    if (data) {
      setFormData(data);
    }
  }, [getStepData]);

  const validateField = (
    fieldName: keyof SecurityData,
    fieldValue: string
  ): string | undefined => {
    switch (fieldName) {
      case 'username':
        if (!fieldValue) return 'Username is required';
        if (fieldValue.length < 3)
          return 'Username must be at least 3 characters';
        break;
      case 'password':
        if (!fieldValue) return 'Password is required';
        if (fieldValue.length < 8)
          return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(fieldValue))
          return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(fieldValue))
          return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(fieldValue))
          return 'Password must contain at least one number';
        break;
      case 'confirmPassword':
        if (!fieldValue) return 'Please confirm your password';
        if (fieldValue !== formData.password) return 'Passwords do not match';
        break;
      case 'securityQuestion':
        if (!fieldValue) return 'Security question is required';
        if (fieldValue.length < 10)
          return 'Security question must be at least 10 characters';
        break;
      case 'securityAnswer':
        if (!fieldValue) return 'Security answer is required';
        if (fieldValue.length < 3)
          return 'Security answer must be at least 3 characters';
        break;
    }
    return undefined;
  };

  const handleFieldUpdate = (
    fieldName: keyof SecurityData,
    fieldValue: string
  ) => {
    const validationError = validateField(fieldName, fieldValue);
    const newFormData = { ...formData, [fieldName]: fieldValue };
    const newErrors = { ...errors, [fieldName]: validationError };

    // Special case for confirm password
    if (fieldName === 'password') {
      const confirmError = formData.confirmPassword
        ? validateField('confirmPassword', formData.confirmPassword)
        : undefined;
      newErrors.confirmPassword = confirmError;
    }

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
      <Text style={styles.title}>Security Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          value={formData.username || ''}
          onChangeText={(value) => handleFieldUpdate('username', value)}
          placeholder="Enter your username"
          autoCapitalize="none"
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          value={formData.password || ''}
          onChangeText={(value) => handleFieldUpdate('password', value)}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          value={formData.confirmPassword || ''}
          onChangeText={(value) => handleFieldUpdate('confirmPassword', value)}
          placeholder="Confirm your password"
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Security Question</Text>
        <TextInput
          style={[styles.input, errors.securityQuestion && styles.inputError]}
          value={formData.securityQuestion || ''}
          onChangeText={(value) => handleFieldUpdate('securityQuestion', value)}
          placeholder="Enter your security question"
        />
        {errors.securityQuestion && (
          <Text style={styles.errorText}>{errors.securityQuestion}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Security Answer</Text>
        <TextInput
          style={[styles.input, errors.securityAnswer && styles.inputError]}
          value={formData.securityAnswer || ''}
          onChangeText={(value) => handleFieldUpdate('securityAnswer', value)}
          placeholder="Enter your security answer"
          autoCapitalize="none"
        />
        {errors.securityAnswer && (
          <Text style={styles.errorText}>{errors.securityAnswer}</Text>
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
