import {produce} from 'immer';
import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import {getLocales} from 'react-native-localize';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {StateStorage} from 'zustand/middleware';

export const MMKV = new MMKVLoader().withInstanceID('zustand').initialize();

const useStore = create<StoreState>()(
  persist(
    _ => ({
      mainRoute: 'SPLASH',
      options: {
        isDark: Appearance.getColorScheme() === 'dark',
        appColor: 'karen',
      },
      language: getLocales()[0].languageCode as 'en',
    }),
    {
      name: 'karthuria',
      version: 2,
      storage: createJSONStorage(() => MMKV as unknown as StateStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['mainRoute'].includes(key)),
        ),
    },
  ),
);

export const useAppColor = () => useStore(s => s.options.appColor);
export const useLanguage = () => useStore(s => s.language);
export const useOptions = () => useStore(s => s.options);

export const onSwitchMainRoute = (route: StoreState['mainRoute']) =>
  useStore.setState({mainRoute: route});

export const onSaveOptions = (options: AppOptions) =>
  useStore.setState({options});

export const setAppColor = (color: AppOptions['appColor']) =>
  useStore.setState(
    produce<StoreState>(draft => {
      draft.options.appColor = color;
    }),
  );

export const setLanguage = (language: StoreState['language']) =>
  useStore.setState({language});

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
