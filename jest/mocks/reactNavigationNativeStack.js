const React = require('react');

function createNativeStackNavigator() {
  function Navigator({ children }) {
    return React.createElement(React.Fragment, null, children);
  }

  function Screen({ component: Component }) {
    if (!Component) {
      return null;
    }

    return React.createElement(Component, {});
  }

  return { Navigator, Screen };
}

module.exports = { createNativeStackNavigator };
