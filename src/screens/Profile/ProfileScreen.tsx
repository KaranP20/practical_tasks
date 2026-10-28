import { ScrollView, StyleSheet, View } from 'react-native';

import { signOut } from '../../auth';
import { AppButton, AppLoader, AppText, ErrorState } from '../../components';
import { colors, dimensions, strings } from '../../constants';
import { useProfile } from '../../hooks';
import { spacing } from '../../theme';

export function ProfileScreen() {
  const { coach, isLoading, errorMessage, reload } = useProfile();

  if (isLoading) {
    return <AppLoader fullscreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {errorMessage || !coach ? (
        <ErrorState
          message={errorMessage ?? strings.errors.generic}
          onRetry={reload}
        />
      ) : (
        <View style={styles.card}>
          <AppText variant="title">{coach.name}</AppText>
          <AppText color="secondary" style={styles.role} variant="caption">
            {coach.role}
          </AppText>
          <InfoRow label={strings.profile.email} value={coach.email} />
          <InfoRow label={strings.profile.gym} value={coach.gymName} />
          <InfoRow
            label={strings.profile.clients}
            value={String(coach.clientCount)}
          />
        </View>
      )}
      <View style={styles.signOut}>
        <AppButton onPress={signOut} title={strings.profile.signOut} />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText color="secondary">{label}</AppText>
      <AppText>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.radiusMd,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
  },
  role: {
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  signOut: {
    marginTop: spacing.lg,
  },
});
