const React = require('react');

const colors = {
  primary: '#000000',
  background: '#ffffff',
  card: '#ffffff',
  text: '#000000',
  border: '#000000',
  notification: '#000000',
};

function NavigationContainer({ children }) {
  return React.createElement(React.Fragment, null, children);
}

module.exports = {
  DefaultTheme: {
    dark: false,
    colors,
  },
  NavigationContainer,
};
