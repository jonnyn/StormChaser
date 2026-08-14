import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { isAppError } from '@/shared/lib/errors';
import { LoadingBlock } from '@/shared/ui/loading-block';

import { useCaptureObservation, type CaptureDraft } from '../hooks/use-capture-observation';
import type { CaptureFormValues } from '../model/capture-form-schema';
import { CaptureCamera } from './capture-camera';
import { CaptureForm } from './capture-form';

export function CaptureFlowView() {
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

  function handleRetake() {
    clearError();
    setPrepareError(null);
    setDraft(null);
  }

  return (
    <>
      <ThemedText type="subtitle">Document storm</ThemedText>

      {isPreparing ? <LoadingBlock message="Attaching location and weather…" /> : null}

      {!isPreparing && prepareError ? (
        <ThemedText themeColor="danger">{prepareError}</ThemedText>
      ) : null}

      {!isPreparing && !draft ? <CaptureCamera onCaptured={handleCaptured} /> : null}

      {!isPreparing && draft ? (
        <CaptureForm
          draft={draft}
          isSaving={isSaving}
          errorMessage={errorMessage}
          onRetake={handleRetake}
          onSubmit={(values) => {
            void handleSubmit(values);
          }}
        />
      ) : null}
    </>
  );
}
