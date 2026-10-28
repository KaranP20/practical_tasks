import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import { colors, strings } from '../constants';
import { ProfileScreen } from '../screens/Profile';
import { ClientsStack } from './ClientsStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderNoIcon = () => null;

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: renderNoIcon,
        tabBarIconStyle: styles.hiddenIcon,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        component={ClientsStack}
        name="ClientsTab"
        options={{ title: strings.clients.title, headerShown: false }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="ProfileTab"
        options={{ title: strings.profile.title }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  hiddenIcon: {
    display: 'none',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
