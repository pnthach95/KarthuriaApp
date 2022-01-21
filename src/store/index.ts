import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { SetState, GetState } from 'zustand';
import type { StateStorage, StoreApiWithPersist } from 'zustand/middleware';
import type { StoreState } from './types';

const MMKV = new MMKVStorage.Loader().withInstanceID('zustand').initialize();

const zustandStorage: StateStorage = {
  setItem: (key, value) => {
    MMKV.setString(key, value);
  },
  getItem: (key) => {
    const value = MMKV.getString(key);
    return value || null;
  },
  removeItem: (key) => {
    MMKV.removeItem(key);
  },
};

const useStore = create(
  persist<
    StoreState,
    SetState<StoreState>,
    GetState<StoreState>,
    StoreApiWithPersist<StoreState>
  >(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      mainRoute: 'SPLASH',
      options: {
        isDark: Appearance.getColorScheme() === 'dark',
      },
      onSwitchMainRoute: (route) => set({ mainRoute: route }),
      onSaveOptions: (options) => set({ options }),
    }),
    {
      name: 'karthuria',
      version: 1,
      getStorage: () => zustandStorage,
      partialize: (state) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['mainRoute'].includes(key)),
        ),
    },
  ),
);

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false));
    const unsubFinishHydration = useStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};

export default useStore;
