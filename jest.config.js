module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    // Keep the render test off native navigation modules.
    '^@react-navigation/native$':
      '<rootDir>/jest/mocks/reactNavigationNative.js',
    '^@react-navigation/native-stack$':
      '<rootDir>/jest/mocks/reactNavigationNativeStack.js',
    '^@react-navigation/bottom-tabs$':
      '<rootDir>/jest/mocks/reactNavigationBottomTabs.js',
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^@react-native-community/datetimepicker$':
      '<rootDir>/jest/mocks/dateTimePicker.js',
  },
};
