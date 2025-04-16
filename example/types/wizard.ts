import { types } from 'mobx-state-tree';
import { StepConfig } from '../../src/types/index';

// Step 1: Personal Information
export const PersonalInfoData = types.model({
  firstName: types.optional(types.string, ''),
  lastName: types.optional(types.string, ''),
  dateOfBirth: types.optional(types.string, ''),
});

// Step 2: Contact Information
export const ContactInfoData = types.model({
  email: types.optional(types.string, ''),
  phone: types.optional(types.string, ''),
  address: types.optional(types.string, ''),
  city: types.optional(types.string, ''),
  state: types.optional(types.string, ''),
  zipCode: types.optional(types.string, ''),
});

// Step 3: Account Security
export const SecurityData = types.model({
  username: types.optional(types.string, ''),
  password: types.optional(types.string, ''),
  confirmPassword: types.optional(types.string, ''),
  securityQuestion: types.optional(types.string, ''),
  securityAnswer: types.optional(types.string, ''),
});

// Step 4: Preferences
export const PreferencesData = types.model({
  newsletter: types.optional(types.boolean, false),
  marketingEmails: types.optional(types.boolean, false),
  language: types.optional(types.string, 'en'),
  theme: types.optional(types.string, 'light'),
});

// Step 5: Review
export const ReviewData = types.model({
  // This step doesn't collect data, it just displays what was collected
  confirmed: types.optional(types.boolean, false),
});

// Re-export the StepConfig interface from the library
export { StepConfig };
