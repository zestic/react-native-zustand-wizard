import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();

// Always load Storybook
const StorybookUI = require('./.storybook').default;

export default StorybookUI;
