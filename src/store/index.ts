import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { SetState, GetState, Mutate, StoreApi } from 'zustand';
import type { StateStorage } from 'zustand/middleware';
import type { StoreState } from './types';

const MMKV = new MMKVStorage.Loader().withInstanceID('zustand').initialize();

const useStore = create(
  persist<
    StoreState,
    SetState<StoreState>,
    GetState<StoreState>,
    Mutate<StoreApi<StoreState>, [['zustand/persist', Partial<StoreState>]]>
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
      getStorage: () => MMKV as StateStorage,
      partialize: (state) =>
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
