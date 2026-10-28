import { Pressable, StyleSheet, View } from 'react-native';

import { colors, dimensions } from '../../constants';
import { spacing } from '../../theme';
import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type SegmentedControlProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={option.value}
            onPress={() => {
              if (!selected) {
                onChange(option.value);
              }
            }}
            style={[styles.segment, selected && styles.selected]}
          >
            <AppText
              color={selected ? 'inverse' : 'secondary'}
              variant="caption"
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.xs / 2,
    borderRadius: dimensions.radiusSm,
    backgroundColor: colors.border,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: dimensions.radiusSm - 2,
  },
  selected: {
    backgroundColor: colors.primary,
  },
});
