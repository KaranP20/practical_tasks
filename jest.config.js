module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    // Keep the render test off native navigation modules.
    '^@react-navigation/native$':
      '<rootDir>/jest/mocks/reactNavigationNative.js',
    '^@react-navigation/native-stack$':
      '<rootDir>/jest/mocks/reactNavigationNativeStack.js',
  },
};
