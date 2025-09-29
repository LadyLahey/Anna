module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-clone-referenced-element|@react-navigation|react-native-gesture-handler|react-native-reanimated|react-native-screens|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo/.*|@unimodules/.*|unimodules-.*|sentry-expo|native-base|react-native-svg)/)'
  ]
};

