import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DEFAULT_UNIT_SYSTEM,
  isUnitSystem,
  UNIT_SYSTEM_STORAGE_KEY,
  type UnitSystem,
} from '@/shared/lib/units';

type UnitsContextValue = {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  toggleUnits: () => void;
  isReady: boolean;
};

const UnitsContext = createContext<UnitsContextValue | null>(null);

export function UnitsProvider({ children }: PropsWithChildren) {
  const [units, setUnitsState] = useState<UnitSystem>(DEFAULT_UNIT_SYSTEM);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const stored = await AsyncStorage.getItem(UNIT_SYSTEM_STORAGE_KEY);
        if (!cancelled && stored && isUnitSystem(stored)) {
          setUnitsState(stored);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setUnits = useCallback((next: UnitSystem) => {
    setUnitsState(next);
    void AsyncStorage.setItem(UNIT_SYSTEM_STORAGE_KEY, next);
  }, []);

  const toggleUnits = useCallback(() => {
    setUnitsState((current) => {
      const next: UnitSystem = current === 'metric' ? 'imperial' : 'metric';
      void AsyncStorage.setItem(UNIT_SYSTEM_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      units,
      setUnits,
      toggleUnits,
      isReady,
    }),
    [units, setUnits, toggleUnits, isReady]
  );

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

export function useUnits(): UnitsContextValue {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within UnitsProvider');
  }
  return context;
}
