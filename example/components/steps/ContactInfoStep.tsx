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

interface ContactInfoStepProps {
  store: WizardStoreType;
}

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

export const ContactInfoStep: React.FC<ContactInfoStepProps> = observer(
  ({ store }) => {
    const [formData, setFormData] = useState<ContactInfoData>({});
    const [errors, setErrors] = useState<ContactInfoErrors>({});

    useEffect(() => {
      const data = store.getStepData('contactInfo') as ContactInfoData;
      if (data) {
        setFormData(data);
      }
    }, []);

    const validateField = (
      name: keyof ContactInfoData,
      value: string
    ): string | undefined => {
      switch (name) {
        case 'email':
          if (!value) return 'Email is required';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return 'Invalid email format';
          break;
        case 'phone':
          if (!value) return 'Phone number is required';
          if (!/^\d{10}$/.test(value.replace(/\D/g, '')))
            return 'Invalid phone number';
          break;
        case 'state':
          if (!value) return 'State is required';
          if (value.length < 2) return 'Invalid state';
          break;
        case 'zipCode':
          if (!value) return 'ZIP code is required';
          if (!/^\d{5}(-\d{4})?$/.test(value)) return 'Invalid ZIP code';
          break;
      }
    };

    const updateField = (name: keyof ContactInfoData, value: string) => {
      const error = validateField(name, value);
      const newFormData = { ...formData, [name]: value };
      const newErrors = { ...errors, [name]: error };

      setFormData(newFormData);
      setErrors(newErrors);
      store.setStepData('contactInfo', newFormData);

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
        <Text style={styles.title}>Contact Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email || ''}
            onChangeText={(value) => updateField('email', value)}
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
            onChangeText={(value) => updateField('phone', value)}
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
            onChangeText={(value) => updateField('state', value)}
            placeholder="Enter your state"
          />
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={[styles.input, errors.zipCode && styles.inputError]}
            value={formData.zipCode || ''}
            onChangeText={(value) => updateField('zipCode', value)}
            placeholder="Enter your ZIP code"
            keyboardType="number-pad"
          />
          {errors.zipCode && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
