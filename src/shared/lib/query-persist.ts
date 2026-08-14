import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import type { Query } from '@tanstack/react-query';

import { WEATHER_CACHE_MS, shouldPersistQuery } from './persist-query-keys';

const PERSIST_KEY = 'stormchaser-query-cache';

export { WEATHER_CACHE_MS, shouldPersistQuery };

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: PERSIST_KEY,
});

export const queryPersistOptions = {
  persister: queryPersister,
  maxAge: WEATHER_CACHE_MS,
  dehydrateOptions: {
    shouldDehydrateQuery: (query: Query) => shouldPersistQuery(query.queryKey),
  },
};
