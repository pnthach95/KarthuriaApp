import { Appearance } from 'react-native';

import type { ActionType, AppState, AppOptions } from '~/typings';

const reducer: React.Reducer<AppState, ActionType> = (prevState, action) => {
  switch (action.type) {
    case 'SWITCH_MAIN_ROUTE':
      return {
        ...prevState,
        mainRoute: action.route,
      };
    case 'SAVE_OPTIONS':
      return {
        ...prevState,
        options: action.data,
      };
    default:
      return prevState;
  }
};

export const initAppOptions: AppOptions = {
  isDark: Appearance.getColorScheme() === 'dark',
};

/** Initial state */
export const initState: AppState = {
  mainRoute: 'SPLASH',
  /** App options */
  options: initAppOptions,
};

export default reducer;
