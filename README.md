# React Native MST Wizard

A React Native wizard component powered by MobX-State-Tree (MST) for building complex, multi-step flows with robust state management.

## Features

- Type-safe wizard implementation with full TypeScript support
- MST-based state management for complex wizard flows
- Flexible step configuration and navigation
- Built-in transition animations
- Customizable UI components
- Comprehensive test coverage

## Installation

```bash
npm install react-native-mst-wizard
# or
yarn add react-native-mst-wizard
```

## Basic Usage

```tsx
import { Wizard } from 'react-native-mst-wizard';

const steps = [
  {
    id: 'step1',
    component: Step1Component,
    order: 0
  },
  {
    id: 'step2',
    component: Step2Component,
    order: 1
  }
];

const MyWizard = () => (
  <Wizard
    steps={steps}
    nextLabel="Next"
    previousLabel="Back"
    finishLabel="Done"
  />
);
```

## Development

### Setting Up Development Build

You'll need to set up a development build for Storybook development:

```bash
# Install dependencies
yarn install

# Start Storybook
yarn storybook
```

### Running Tests

```bash
yarn test
```

### Building

```bash
yarn build
```
# Start Storybook
yarn storybook

# For web version
yarn storybook:web

# For iOS (requires development build)
yarn storybook:ios

# For Android (requires development build)
yarn storybook:android
```
