module.exports = {
  name: "React Native MST Wizard",
  slug: "react-native-mst-wizard",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "ai.xaddax.mstwizard",
    // Enable Fabric
    newArchEnabled: true
  },
  android: {
    package: "ai.xaddax.mstwizard",
    // Enable Fabric
    newArchEnabled: true
  },
  web: {},
  extra: {
    storybookEnabled: "true"
  }
};
