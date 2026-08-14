import { Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import {
  useCaptureObservation,
  type CaptureDraft,
} from '@/features/storms/hooks/use-capture-observation';
import { CaptureCamera } from '@/features/storms/ui/capture-camera';
import { CaptureForm } from '@/features/storms/ui/capture-form';
import type { CaptureFormValues } from '@/features/storms/model/capture-form-schema';
import { useTheme } from '@/hooks/use-theme';
import { isAppError } from '@/shared/lib/errors';
import { Screen } from '@/shared/ui/screen';

export default function CaptureScreen() {
  const theme = useTheme();
  const { prepareDraft, saveObservation, isSaving, errorMessage, clearError } =
    useCaptureObservation();
  const [draft, setDraft] = useState<CaptureDraft | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState<string | null>(null);

  async function handleCaptured(uri: string) {
    setIsPreparing(true);
    setPrepareError(null);
    clearError();

    try {
      const nextDraft = await prepareDraft(uri);
      setDraft(nextDraft);
    } catch (error) {
      setPrepareError(
        isAppError(error)
          ? error.userMessage
          : 'Unable to prepare this observation. Check location permission and try again.'
      );
    } finally {
      setIsPreparing(false);
    }
  }

  async function handleSubmit(values: CaptureFormValues) {
    if (!draft) {
      return;
    }

    try {
      await saveObservation(draft, values);
    } catch {
      // errorMessage is set inside the hook
    }
  }

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: 'Document storm', headerBackTitle: 'Back' }} />
      <ThemedText type="subtitle">Document storm</ThemedText>

      {isPreparing ? (
        <View style={styles.preparing}>
          <ActivityIndicator color={theme.accent} />
          <ThemedText themeColor="textSecondary">Attaching location and weather…</ThemedText>
        </View>
      ) : null}

      {!isPreparing && prepareError ? (
        <ThemedText themeColor="danger">{prepareError}</ThemedText>
      ) : null}

      {!isPreparing && !draft ? <CaptureCamera onCaptured={handleCaptured} /> : null}

      {!isPreparing && draft ? (
        <CaptureForm
          draft={draft}
          isSaving={isSaving}
          errorMessage={errorMessage}
          onRetake={() => {
            clearError();
            setPrepareError(null);
            setDraft(null);
          }}
          onSubmit={(values) => {
            void handleSubmit(values);
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  preparing: {
    gap: 12,
    paddingTop: 24,
  },
});
