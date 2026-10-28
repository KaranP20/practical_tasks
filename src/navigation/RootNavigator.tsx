import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStatus } from '../auth';
import { AppLoader } from '../components';
import { colors } from '../constants';
import { LoginScreen } from '../screens/Login';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const status = useAuthStatus();

  if (status === 'restoring') {
    return <AppLoader fullscreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {status === 'signedIn' ? (
          <Stack.Screen component={MainTabs} name="Main" />
        ) : (
          <Stack.Screen
            component={LoginScreen}
            name="Login"
            options={{ animationTypeForReplace: 'pop' }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
