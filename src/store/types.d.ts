import type { SetState, GetState } from 'zustand';
import type { AppOptions } from '~/typings';

type StoreState = {
  mainRoute: 'SPLASH' | 'MAIN';
  options: AppOptions;
  onSwitchMainRoute: (route: StoreState['mainRoute']) => void;
  onSaveOptions: (options: AppOptions) => void;
};

type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>,
) => T;
