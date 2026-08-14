import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { CaptureFlowView } from '@/features/storms/ui/capture-flow-view';
import { Screen } from '@/shared/ui/screen';

export default function CaptureScreen() {
  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: 'Document storm', headerBackTitle: 'Back' }} />
      <CaptureFlowView />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
