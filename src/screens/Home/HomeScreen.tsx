import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../components';
import { colors, dimensions, strings } from '../../constants';
import type { RootStackParamList } from '../../navigation/types';
import { spacing } from '../../theme';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen(_props: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.accent} />
          <AppText variant="heading">{strings.home.title}</AppText>
          <AppText color="secondary" style={styles.description} variant="body">
            {strings.home.description}
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: dimensions.maxContentWidth,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: dimensions.radiusLg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  accent: {
    width: dimensions.accentWidth,
    height: dimensions.accentHeight,
    borderRadius: dimensions.radiusSm,
    backgroundColor: colors.primary,
    marginBottom: spacing.md,
  },
  description: {
    marginTop: spacing.sm,
  },
});
