import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppLoader,
  AppText,
  EmptyState,
  ErrorState,
} from '../../components';
import { colors, GOAL_LABELS, strings } from '../../constants';
import { useClients } from '../../hooks';
import type { ClientsStackParamList } from '../../navigation/types';
import { spacing } from '../../theme';
import type { Client } from '../../types/api';
import { daysSince } from '../../utils';

type Props = NativeStackScreenProps<ClientsStackParamList, 'ClientsList'>;

const AVATAR_SIZE = 44;

export function ClientsListScreen({ navigation }: Props) {
  const { clients, isLoading, isRefreshing, errorMessage, reload, refresh } =
    useClients();

  if (isLoading) {
    return <AppLoader fullscreen />;
  }
  if (errorMessage || !clients) {
    return (
      <ErrorState
        message={errorMessage ?? strings.errors.generic}
        onRetry={reload}
      />
    );
  }

  const openClient = (client: Client) =>
    navigation.navigate('ClientProgress', {
      clientId: client.id,
      clientName: client.name,
    });

  return (
    <FlatList
      contentContainerStyle={clients.length === 0 && styles.emptyContainer}
      data={clients}
      keyExtractor={client => client.id}
      ListEmptyComponent={<EmptyState title={strings.clients.empty} />}
      refreshControl={
        <RefreshControl
          onRefresh={refresh}
          refreshing={isRefreshing}
        />
      }
      renderItem={({ item }) => (
        <ClientRow client={item} onPress={() => openClient(item)} />
      )}
    />
  );
}

function ClientRow({ client, onPress }: { client: Client; onPress: () => void }) {
  const days = daysSince(client.startDateISO);
  const started = days === 0 ? 'started today' : `started ${days}d ago`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={[styles.avatar, { backgroundColor: client.avatarColor }]}>
        <AppText color="inverse" variant="title">
          {client.name.charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View style={styles.info}>
        <AppText variant="title">{client.name}</AppText>
        <AppText color="secondary" variant="caption">
          {GOAL_LABELS[client.goal]} · {started}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.background,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
});
