import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStepContext } from '../../../src/utils';
import { colors } from '../../../src/theme/colors';

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
}

interface SecurityInfo {
  username?: string;
  password?: string;
  securityQuestion?: string;
}

interface Preferences {
  language?: string;
  theme?: string;
  newsletter?: boolean;
  marketing?: boolean;
}

interface StepData {
  contactInfo?: ContactInfo;
  security?: SecurityInfo;
  preferences?: Preferences;
}

export const ReviewStep = observer(() => {
  // Use the step context hook to get the step ID and helper functions
  const { getStepData, canMoveNext } = useStepContext('review');

  // Get the current step data from the store
  const stepData = getStepData() as StepData;

  // Validate the form when data changes
  useEffect(() => {
    canMoveNext(true);
  }, [canMoveNext]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{stepData.contactInfo?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{stepData.contactInfo?.email}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{stepData.contactInfo?.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{stepData.security?.username}</Text>

        <Text style={styles.label}>Password:</Text>
        <Text style={styles.value}>••••••••</Text>

        <Text style={styles.label}>Security Question:</Text>
        <Text style={styles.value}>{stepData.security?.securityQuestion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text style={styles.label}>Language:</Text>
        <Text style={styles.value}>{stepData.preferences?.language}</Text>

        <Text style={styles.label}>Theme:</Text>
        <Text style={styles.value}>{stepData.preferences?.theme}</Text>

        <Text style={styles.label}>Newsletter:</Text>
        <Text style={styles.value}>
          {stepData.preferences?.newsletter ? 'Yes' : 'No'}
        </Text>

        <Text style={styles.label}>Marketing Emails:</Text>
        <Text style={styles.value}>
          {stepData.preferences?.marketing ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    color: colors.gray600,
    fontSize: 14,
    marginBottom: 4,
  },
  section: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    color: colors.gray800,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  title: {
    color: colors.gray800,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  value: {
    color: colors.gray800,
    fontSize: 16,
    marginBottom: 12,
  },
});
