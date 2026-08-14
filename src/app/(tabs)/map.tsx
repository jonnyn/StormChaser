import { useRouter } from 'expo-router';

import { useObservations } from '@/features/storms/hooks/use-observations';
import { ObservationMap } from '@/features/storms/ui/observation-map';

export default function MapScreen() {
  const router = useRouter();
  const { observations, isLoading, errorMessage } = useObservations();

  return (
    <ObservationMap
      observations={observations}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onPressMarker={(id) => router.push(`/observation/${id}`)}
      onDocumentStorm={() => router.push('/capture')}
    />
  );
}
