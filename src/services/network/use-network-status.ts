import { useNetworkState } from 'expo-network';

import { isOffline } from './is-offline';

export function useNetworkStatus() {
  const state = useNetworkState();

  return {
    ...state,
    isOffline: isOffline(state),
  };
}
