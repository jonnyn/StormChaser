import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { StormObservation } from '../model/storm-observation';
import { ObservationListEmpty } from './observation-list-empty';
import { ObservationListItem } from './observation-list-item';

type ObservationListProps = {
  observations: StormObservation[];
  isLoading: boolean;
  errorMessage: string | null;
  onPressItem: (id: string) => void;
  onDocumentStorm: () => void;
};

export function ObservationList({
  observations,
  isLoading,
  errorMessage,
  onPressItem,
  onDocumentStorm,
}: ObservationListProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.accent} />
        <ThemedText themeColor="textSecondary">Loading field log…</ThemedText>
      </View>
    );
  }

  if (errorMessage) {
    return <ThemedText themeColor="danger">{errorMessage}</ThemedText>;
  }

  if (observations.length === 0) {
    return <ObservationListEmpty onDocumentStorm={onDocumentStorm} />;
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
        <ThemedText style={styles.headerButtonLabel}>Document storm</ThemedText>
      </Pressable>

      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ObservationListItem observation={item} onPress={onPressItem} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
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
    color: '#ffffff',
    fontWeight: '600',
  },
});
