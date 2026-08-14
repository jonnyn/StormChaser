import { fireEvent, render } from '@testing-library/react-native';

import type { StormObservation } from '../model/storm-observation';
import { ObservationListEmpty } from './observation-list-empty';
import { ObservationListItem } from './observation-list-item';

jest.mock('@/services/files/photo-store', () => ({
  resolvePhotoUri: (relativePath: string) => `file:///mock/${relativePath}`,
}));

const fixture: StormObservation = {
  id: 'obs-1',
  createdAt: '2026-08-13T18:00:00.000Z',
  capturedAt: '2026-08-13T17:55:00.000Z',
  notes: 'Shelf cloud',
  stormType: 'wall_cloud',
  location: {
    latitude: 35.2,
    longitude: -97.4,
    accuracyMeters: 10,
  },
  weather: {
    temperatureC: 28.9,
    windSpeedKmh: 40.2,
    precipitationMm: 5.1,
    weatherCode: 95,
    observedAt: '2026-08-13T17:45:00.000Z',
  },
  photoRelativePath: 'storms/obs-1.jpg',
};

describe('ObservationListEmpty', () => {
  it('renders a call to action to document a storm', async () => {
    const onDocumentStorm = jest.fn();
    const { getByText, getByLabelText } = await render(
      <ObservationListEmpty onDocumentStorm={onDocumentStorm} />
    );

    expect(getByText('No storms logged yet')).toBeTruthy();
    fireEvent.press(getByLabelText('Document a storm'));
    expect(onDocumentStorm).toHaveBeenCalledTimes(1);
  });
});

describe('ObservationListItem', () => {
  it('renders a fixture observation row', async () => {
    const onPress = jest.fn();
    const { getByText, getByLabelText } = await render(
      <ObservationListItem observation={fixture} onPress={onPress} />
    );

    expect(getByText('Wall cloud')).toBeTruthy();
    expect(getByText('35.200, -97.400')).toBeTruthy();
    fireEvent.press(getByLabelText('Wall cloud observation'));
    expect(onPress).toHaveBeenCalledWith('obs-1');
  });
});
