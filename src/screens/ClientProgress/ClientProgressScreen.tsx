import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SegmentedControl } from '../../components';
import { colors, strings } from '../../constants';
import type { ClientsStackParamList } from '../../navigation/types';
import { spacing } from '../../theme';
import type { GirthSite } from '../../types/api';
import { GirthTab } from './GirthTab';
import { WeightTab } from './WeightTab';

type Props = NativeStackScreenProps<ClientsStackParamList, 'ClientProgress'>;

type ProgressTab = 'weight' | 'girth';

type RangeKey = '7D' | '30D' | '90D' | 'ALL';

type WeightUnit = 'kg' | 'lb';

const TAB_OPTIONS: { value: ProgressTab; label: string }[] = [
  { value: 'weight', label: strings.progress.weightTab },
  { value: 'girth', label: strings.progress.girthTab },
];

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: '7D', label: '7D' },
  { value: '30D', label: '30D' },
  { value: '90D', label: '90D' },
  { value: 'ALL', label: 'All' },
];

export function ClientProgressScreen({ route }: Props) {
  const { clientId } = route.params;

  const [tab, setTab] = useState<ProgressTab>('weight');
  const [range, setRange] = useState<RangeKey>('90D');
  const [unit, setUnit] = useState<WeightUnit>('kg');
  const [site, setSite] = useState<GirthSite>('waist');

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <SegmentedControl onChange={setTab} options={TAB_OPTIONS} value={tab} />
        <View style={styles.gap} />
        <SegmentedControl
          onChange={setRange}
          options={RANGE_OPTIONS}
          value={range}
        />
      </View>
      {tab === 'weight' ? (
        <WeightTab
          clientId={clientId}
          onUnitChange={setUnit}
          range={range}
          unit={unit}
        />
      ) : (
        <GirthTab
          clientId={clientId}
          onSiteChange={setSite}
          range={range}
          site={site}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  controls: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  gap: {
    height: spacing.sm,
  },
});
