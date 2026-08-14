import { useCallback, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { formatDateTime } from '@/shared/lib/dates';
import { Screen } from '@/shared/ui/screen';
import { Skeleton } from '@/shared/ui/skeleton';

import { regionForCoordinates } from '../lib/map-region';
import type { StormObservation } from '../model/storm-observation';
import { stormTypeLabel } from '../model/storm-type';
import { ObservationListEmpty } from './observation-list-empty';

const EDGE_PADDING = { top: 56, right: 40, bottom: 56, left: 40 };

type ObservationMapProps = {
  observations: StormObservation[];
  isLoading: boolean;
  errorMessage: string | null;
  onPressMarker: (id: string) => void;
  onDocumentStorm: () => void;
};

export function ObservationMap({
  observations,
  isLoading,
  errorMessage,
  onPressMarker,
  onDocumentStorm,
}: ObservationMapProps) {
  const mapRef = useRef<MapView>(null);
  const colorScheme = useColorScheme();
  const userInterfaceStyle = colorScheme === 'dark' ? 'dark' : 'light';

  const coordinates = useMemo(
    () =>
      observations.map((observation) => ({
        latitude: observation.location.latitude,
        longitude: observation.location.longitude,
      })),
    [observations]
  );
  const initialRegion = useMemo(() => regionForCoordinates(coordinates), [coordinates]);

  const fitMarkers = useCallback(() => {
    if (coordinates.length === 0) {
      return;
    }

    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: EDGE_PADDING,
      animated: false,
    });
  }, [coordinates]);

  if (Platform.OS === 'web') {
    return (
      <Screen>
        <ThemedText>Maps are available on iOS and Android.</ThemedText>
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <View
        accessibilityLabel="Loading map"
        accessibilityRole="progressbar"
        accessible
        style={styles.full}
      >
        <Skeleton width="100%" borderRadius={0} style={styles.fullBleedSkeleton} />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <Screen>
        <ThemedText themeColor="danger">{errorMessage}</ThemedText>
      </Screen>
    );
  }

  if (observations.length === 0 || !initialRegion) {
    return (
      <Screen>
        <ObservationListEmpty onDocumentStorm={onDocumentStorm} />
      </Screen>
    );
  }

  return (
    <View style={styles.full}>
      <MapView
        ref={mapRef}
        key={observations.map((observation) => observation.id).join(',')}
        style={styles.full}
        initialRegion={initialRegion}
        moveOnMarkerPress={false}
        rotateEnabled={false}
        userInterfaceStyle={userInterfaceStyle}
        onMapReady={fitMarkers}
        onLayout={() => {
          if (Platform.OS === 'android') {
            fitMarkers();
          }
        }}
      >
        {observations.map((observation) => (
          <Marker
            key={observation.id}
            identifier={observation.id}
            coordinate={{
              latitude: observation.location.latitude,
              longitude: observation.location.longitude,
            }}
            accessibilityLabel={`${stormTypeLabel(observation.stormType)}, ${formatDateTime(observation.capturedAt)}`}
            tracksViewChanges={false}
            onPress={() => onPressMarker(observation.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  fullBleedSkeleton: {
    flex: 1,
    height: '100%',
  },
});
