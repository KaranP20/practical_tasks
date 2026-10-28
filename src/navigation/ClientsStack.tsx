import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors, strings } from '../constants';
import { ClientProgressScreen } from '../screens/ClientProgress';
import { ClientsListScreen } from '../screens/Clients';
import type { ClientsStackParamList } from './types';

const Stack = createNativeStackNavigator<ClientsStackParamList>();

export function ClientsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen
        component={ClientsListScreen}
        name="ClientsList"
        options={{ title: strings.clients.title }}
      />
      <Stack.Screen
        component={ClientProgressScreen}
        name="ClientProgress"
        options={({ route }) => ({ title: route.params.clientName })}
      />
    </Stack.Navigator>
  );
}
