export type NetworkConnectivity = {
  isConnected?: boolean;
  isInternetReachable?: boolean;
};

/** True when the device reports no usable network. Unknown state is treated as online. */
export function isOffline(state: NetworkConnectivity): boolean {
  if (state.isConnected === false) {
    return true;
  }

  if (state.isInternetReachable === false) {
    return true;
  }

  return false;
}
