import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Skeleton } from '@/shared/ui/skeleton';

import type { StormObservation } from '../model/storm-observation';
import { ObservationListEmpty } from './observation-list-empty';
import { ObservationListItem } from './observation-list-item';

type ObservationListProps = {
  observations: StormObservation[];
  isLoading: boolean;
  isRefreshing: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onPressItem: (id: string) => void;
  onDocumentStorm: () => void;
};

export function ObservationList({
  observations,
  isLoading,
  isRefreshing,
  errorMessage,
  onRefresh,
  onPressItem,
  onDocumentStorm,
}: ObservationListProps) {
  const theme = useTheme();
  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      tintColor={theme.accent}
      colors={[theme.accent]}
    />
  );

  if (isLoading) {
    return (
      <View
        accessibilityLabel="Loading field log"
        accessibilityRole="progressbar"
        accessible
        style={styles.loading}
      >
        <Skeleton width={140} height={36} borderRadius={Spacing.two} />
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            style={[styles.rowSkeleton, { backgroundColor: theme.backgroundElement }]}
          >
            <Skeleton width={72} height={72} borderRadius={Spacing.two} />
            <View style={styles.rowMeta}>
              <Skeleton width="55%" height={14} />
              <Skeleton width="70%" height={12} />
              <Skeleton width="45%" height={12} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (errorMessage) {
    return (
      <ScrollView contentContainerStyle={styles.flexGrow} refreshControl={refreshControl}>
        <ThemedText themeColor="danger">{errorMessage}</ThemedText>
      </ScrollView>
    );
  }

  if (observations.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.flexGrow} refreshControl={refreshControl}>
        <ObservationListEmpty onDocumentStorm={onDocumentStorm} />
      </ScrollView>
    );
  }

  return (
    <View style={styles.listWrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Document a storm"
        onPress={onDocumentStorm}
        style={({ pressed }) => [
          styles.headerButton,
          { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <ThemedText style={[styles.headerButtonLabel, { color: theme.onAccent }]}>
          Document storm
        </ThemedText>
      </Pressable>

      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={refreshControl}
        renderItem={({ item }) => <ObservationListItem observation={item} onPress={onPressItem} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  rowSkeleton: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  rowMeta: {
    flex: 1,
    gap: Spacing.two,
  },
  flexGrow: {
    flexGrow: 1,
  },
  listWrap: {
    flex: 1,
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.six,
  },
  headerButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  headerButtonLabel: {
    fontWeight: '600',
  },
});
