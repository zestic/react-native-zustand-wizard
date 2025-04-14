import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { WizardStoreType } from '../../../src/types';

interface PersonalInfoStepProps {
  store: WizardStoreType;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = observer(({ store }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const data = store.getStepData('personalInfo');
    if (data) {
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
    }
  }, []);

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    store.setStepData('personalInfo', { ...store.getStepData('personalInfo'), firstName: value });
    store.getCurrentStep()?.setCanMoveNext(value.length > 0 && lastName.length > 0);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    store.setStepData('personalInfo', { ...store.getStepData('personalInfo'), lastName: value });
    store.getCurrentStep()?.setCanMoveNext(firstName.length > 0 && value.length > 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={handleFirstNameChange}
          placeholder="Enter your first name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={handleLastNameChange}
          placeholder="Enter your last name"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
});