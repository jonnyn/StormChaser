import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as Device from 'expo-device';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { takePhoto } from '@/services/camera/take-photo';
import { isAppError } from '@/shared/lib/errors';

type CaptureCameraProps = {
  onCaptured: (uri: string) => void;
};

export function CaptureCamera({ onCaptured }: CaptureCameraProps) {
  const theme = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isFocused, setIsFocused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
        setIsReady(false);
      };
    }, [])
  );

  if (!Device.isDevice) {
    return (
      <ThemedView type="backgroundElement" style={styles.messageCard}>
        <ThemedText type="smallBold">Physical device required</ThemedText>
        <ThemedText themeColor="textSecondary">
          The iOS Simulator and Android Emulator cannot capture storm photos. Open Storm Chaser on a
          phone to use the camera.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView type="backgroundElement" style={styles.messageCard}>
        <ThemedText type="smallBold">Camera permission needed</ThemedText>
        <ThemedText themeColor="textSecondary">
          Storm Chaser needs camera access to photograph storms for your field log.
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void requestPermission();
          }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <ThemedText style={[styles.buttonLabel, { color: theme.onAccent }]}>
            Allow camera
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (mountError) {
    return (
      <ThemedView type="backgroundElement" style={styles.messageCard}>
        <ThemedText type="smallBold">Camera unavailable</ThemedText>
        <ThemedText themeColor="textSecondary">{mountError}</ThemedText>
      </ThemedView>
    );
  }

  async function handleShutter() {
    if (!cameraRef.current || !isReady || isCapturing) {
      return;
    }

    setIsCapturing(true);
    setCaptureError(null);

    try {
      const uri = await takePhoto(cameraRef.current);
      onCaptured(uri);
    } catch (error) {
      setCaptureError(
        isAppError(error) ? error.userMessage : 'Unable to capture a photo. Try again.'
      );
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <View style={styles.previewWrap}>
      {isFocused ? (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="picture"
          onCameraReady={() => setIsReady(true)}
          onMountError={(event) => setMountError(event.message)}
        />
      ) : (
        <ThemedView type="backgroundElement" style={styles.camera} />
      )}

      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Flip camera"
          onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
          style={styles.secondaryControl}
        >
          <ThemedText>Flip</ThemedText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          disabled={!isReady || isCapturing || !isFocused}
          onPress={() => {
            void handleShutter();
          }}
          style={({ pressed }) => [
            styles.shutter,
            {
              borderColor: theme.accent,
              opacity: !isReady || isCapturing || !isFocused ? 0.5 : pressed ? 0.85 : 1,
            },
          ]}
        />

        <View style={styles.secondaryControl} />
      </View>

      {captureError ? (
        <ThemedText themeColor="danger" style={styles.error}>
          {captureError}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    flex: 1,
    gap: Spacing.three,
  },
  camera: {
    flex: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    borderWidth: 4,
  },
  secondaryControl: {
    width: 64,
    alignItems: 'center',
  },
  messageCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  buttonLabel: {
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
  },
});
