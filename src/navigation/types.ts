import type { NavigatorScreenParams } from '@react-navigation/native';

export type ClientsStackParamList = {
  ClientsList: undefined;
  ClientProgress: { clientId: string; clientName: string };
};

export type MainTabParamList = {
  ClientsTab: NavigatorScreenParams<ClientsStackParamList>;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
