import { Step } from '../../src/types/index';

// Step 1: Personal Information
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

// Step 2: Contact Information
export interface ContactInfoData {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

// Step 3: Account Security
export interface SecurityData {
  username: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

// Step 4: Preferences
export interface PreferencesData {
  newsletter: boolean;
  marketingEmails: boolean;
  language: string;
  theme: string;
}

// Step 5: Review
export interface ReviewData {
  // This step doesn't collect data, it just displays what was collected
  confirmed: boolean;
}

// Re-export the Step interface from the library
export { Step };
