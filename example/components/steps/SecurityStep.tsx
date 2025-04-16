import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../../src/types';

interface SecurityStepProps {
  store: WizardStoreType;
}

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

export const SecurityStep = observer(({ store }: SecurityStepProps) => {
  const [formData, setFormData] = useState<SecurityData>({});
  const [errors, setErrors] = useState<SecurityErrors>({});

  useEffect(() => {
    const data = store.getStepData('security') as SecurityData;
    if (data) {
      setFormData(data);
    }
  }, []);

  const validateField = (
    name: keyof SecurityData,
    value: string
  ): string | undefined => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value))
          return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value))
          return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value))
          return 'Password must contain at least one number';
        break;
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'securityQuestion':
        if (!value) return 'Security question is required';
        if (value.length < 10)
          return 'Security question must be at least 10 characters';
        break;
      case 'securityAnswer':
        if (!value) return 'Security answer is required';
        if (value.length < 3)
          return 'Security answer must be at least 3 characters';
        break;
    }
    return undefined;
  };

  const updateField = (name: keyof SecurityData, value: string) => {
    const error = validateField(name, value);
    const newFormData = { ...formData, [name]: value };
    const newErrors = { ...errors, [name]: error };

    // Special case for confirm password
    if (name === 'password') {
      const confirmError = formData.confirmPassword
        ? validateField('confirmPassword', formData.confirmPassword)
        : undefined;
      newErrors.confirmPassword = confirmError;
    }

    setFormData(newFormData);
    setErrors(newErrors);
    store.setStepData('security', newFormData);

    const hasErrors = Object.values(newErrors).some(
      (error) => error !== undefined
    );
    const isComplete = Object.values(newFormData).every(
      (value) => value && value.length > 0
    );
    store.getCurrentStep()?.setCanMoveNext(!hasErrors && isComplete);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Information</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, errors.username && styles.inputError]}
          value={formData.username || ''}
          onChangeText={(value) => updateField('username', value)}
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
          onChangeText={(value) => updateField('password', value)}
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
          onChangeText={(value) => updateField('confirmPassword', value)}
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
          onChangeText={(value) => updateField('securityQuestion', value)}
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
          onChangeText={(value) => updateField('securityAnswer', value)}
          placeholder="Enter your security answer"
          autoCapitalize="none"
        />
        {errors.securityAnswer && (
          <Text style={styles.errorText}>{errors.securityAnswer}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          Object.keys(errors).length > 0 && styles.buttonDisabled,
        ]}
        onPress={() => console.log('Continue pressed')}
        disabled={Object.keys(errors).length > 0}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    padding: 8,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});
