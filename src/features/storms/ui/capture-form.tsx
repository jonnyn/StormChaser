import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateTime } from '@/shared/lib/dates';
import { formatWeatherSummary } from '@/shared/lib/units';
import { useUnits } from '@/shared/units/units-context';

import type { CaptureDraft } from '../hooks/use-capture-observation';
import type { CaptureFormValues } from '../model/capture-form-schema';
import { STORM_TYPE_LABELS, STORM_TYPES, type StormType } from '../model/storm-type';

type CaptureFormProps = {
  draft: CaptureDraft;
  isSaving: boolean;
  errorMessage: string | null;
  onRetake: () => void;
  onSubmit: (values: CaptureFormValues) => void;
};

export function CaptureForm({
  draft,
  isSaving,
  errorMessage,
  onRetake,
  onSubmit,
}: CaptureFormProps) {
  const theme = useTheme();
  const { units } = useUnits();
  const [stormType, setStormType] = useState<StormType>('other');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Image
        source={{ uri: draft.photoCacheUri }}
        style={styles.preview}
        contentFit="cover"
        accessibilityLabel="Captured storm photo preview"
      />

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Captured details</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDateTime(draft.capturedAt)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {draft.location.latitude.toFixed(3)}, {draft.location.longitude.toFixed(3)}
        </ThemedText>
        {draft.weather ? (
          <ThemedText type="small" themeColor="textSecondary">
            {formatWeatherSummary(draft.weather, units)}
          </ThemedText>
        ) : (
          <ThemedText type="small" themeColor="warning">
            Weather unavailable at capture — you can still save.
          </ThemedText>
        )}
      </ThemedView>

      <View style={styles.section}>
        <ThemedText type="smallBold">Storm type</ThemedText>
        <View style={styles.chips}>
          {STORM_TYPES.map((type) => {
            const selected = type === stormType;
            return (
              <Pressable
                key={type}
                accessibilityRole="button"
                accessibilityLabel={`${STORM_TYPE_LABELS[type]} storm type`}
                accessibilityState={{ selected }}
                onPress={() => setStormType(type)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? theme.accent : theme.backgroundElement,
                  },
                ]}
              >
                <ThemedText type="small" style={{ color: selected ? '#ffffff' : theme.text }}>
                  {STORM_TYPE_LABELS[type]}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="smallBold">Notes</ThemedText>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          accessibilityLabel="Observation notes"
          placeholder="Describe what you see"
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[
            styles.notes,
            {
              color: theme.text,
              backgroundColor: theme.backgroundElement,
              borderColor: theme.backgroundSelected,
            },
          ]}
        />
      </View>

      {errorMessage ? <ThemedText themeColor="danger">{errorMessage}</ThemedText> : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retake photo"
          disabled={isSaving}
          onPress={onRetake}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: theme.backgroundSelected, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <ThemedText>Retake</ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save observation"
          disabled={isSaving}
          onPress={() => onSubmit({ stormType, notes })}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: theme.accent,
              opacity: isSaving ? 0.6 : pressed ? 0.85 : 1,
            },
          ]}
        >
          {isSaving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.primaryLabel}>Save observation</ThemedText>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  preview: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  notes: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    borderWidth: 1,
  },
  primaryButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    minHeight: 48,
  },
  primaryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
