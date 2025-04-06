# React Native MST Wizard


### Setting Up Development Build

You'll need to set up a development build for Storybook development. Note that native build directories (`/ios` and `/android`) are git-ignored as they should be generated per environment.


```bash
# From your monorepo root, navigate to the UI components package
cd packages/ui-components

# Install dev client
npx expo install expo-dev-client

# Create development build
npx expo prebuild

# Build and run on Android
npx expo run:android

# Or for iOS
npx expo run:ios
```

### Running Storybook

From the UI components package directory:

```bash
# Start Storybook
yarn storybook

# For web version
yarn storybook:web

# For iOS (requires development build)
yarn storybook:ios

# For Android (requires development build)
yarn storybook:android
```
