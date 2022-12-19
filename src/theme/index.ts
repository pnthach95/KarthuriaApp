import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      card: string;
      border: string;
    }
  }
}

const primary = '#FB5458';

export const Light = {
  ...DefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary,
  },
};

export const Dark = {
  ...DarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary,
  },
};
