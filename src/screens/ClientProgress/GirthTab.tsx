import { useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import {
  AppLoader,
  EmptyState,
  ErrorState,
  MeasurementRow,
  ProgressSummary,
  SegmentedControl,
} from '../../components';
import { colors, GIRTH_SITES, strings } from '../../constants';
import { useGirthEntries } from '../../hooks';
import { spacing } from '../../theme';
import type { GirthEntry, GirthSite } from '../../types/api';
import {
  formatDate,
  formatGirth,
  formatGirthChange,
  getTotalChange,
  withChanges,
  type RangeKey,
} from '../../utils';
import { getEmptyText } from './emptyMessage';

const SITE_OPTIONS = GIRTH_SITES.map(site => ({ value: site, label: site }));

const getMm = (entry: GirthEntry) => entry.valueMm;

type GirthTabProps = {
  clientId: string;
  range: RangeKey;
  site: GirthSite;
  onSiteChange: (site: GirthSite) => void;
};

// Read only: no add, no delete.
export function GirthTab({ clientId, range, site, onSiteChange }: GirthTabProps) {
  const {
    entries,
    status,
    errorMessage,
    hasNoData,
    isRefreshing,
    reload,
    refresh,
  } = useGirthEntries(clientId, site, range);

  const rows = useMemo(() => withChanges(entries, getMm), [entries]);

  const renderContent = () => {
    if (status === 'loading') {
      return <AppLoader fullscreen />;
    }
    if (status === 'error') {
      return (
        <ErrorState
          message={errorMessage ?? strings.errors.generic}
          onRetry={reload}
        />
      );
    }

    const latest = entries[0];
    const totalChange = getTotalChange(entries, getMm);

    return (
      <>
        {latest ? (
          <ProgressSummary
            latest={formatGirth(latest.valueMm)}
            totalChange={
              totalChange === null ? null : formatGirthChange(totalChange)
            }
          />
        ) : null}
        <FlatList
          contentContainerStyle={rows.length === 0 && styles.emptyContainer}
          data={rows}
          keyExtractor={row => row.entry.id}
          ListEmptyComponent={
            <EmptyState
              {...getEmptyText(range, hasNoData, `${site} measurements`)}
            />
          }
          refreshControl={
            <RefreshControl onRefresh={refresh} refreshing={isRefreshing} />
          }
          renderItem={({ item }) => (
            <MeasurementRow
              change={item.change === null ? null : formatGirthChange(item.change)}
              date={formatDate(item.entry.dateISO)}
              value={formatGirth(item.entry.valueMm)}
            />
          )}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sites}>
        <SegmentedControl
          onChange={onSiteChange}
          options={SITE_OPTIONS}
          value={site}
        />
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sites: {
    padding: spacing.md,
    paddingTop: 0,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
