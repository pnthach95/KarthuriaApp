import {
  DarkTheme as reactNavigationDark,
  DefaultTheme as reactNavigationLight,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {useAppColor} from 'store';
import {CLAUDINE_DARK, CLAUDINE_LIGHT} from './claudine';
import {FUTABA_DARK, FUTABA_LIGHT} from './futaba';
import {HIKARI_DARK, HIKARI_LIGHT} from './hikari';
import {JUNNA_DARK, JUNNA_LIGHT} from './junna';
import {KAORUKO_DARK, KAORUKO_LIGHT} from './kaoruko';
import {KAREN_DARK, KAREN_LIGHT} from './karen';
import {MAHIRU_DARK, MAHIRU_LIGHT} from './mahiru';
import {MAYA_DARK, MAYA_LIGHT} from './maya';
import {NANA_DARK, NANA_LIGHT} from './nana';

const useLightColor = () => {
  const appColor = useAppColor();
  switch (appColor) {
    case 'karen':
      return KAREN_LIGHT;
    case 'hikari':
      return HIKARI_LIGHT;
    case 'claudine':
      return CLAUDINE_LIGHT;
    case 'futaba':
      return FUTABA_LIGHT;
    case 'junna':
      return JUNNA_LIGHT;
    case 'kaoruko':
      return KAORUKO_LIGHT;
    case 'mahiru':
      return MAHIRU_LIGHT;
    case 'maya':
      return MAYA_LIGHT;
    case 'nana':
      return NANA_LIGHT;
    default:
      return KAREN_LIGHT;
  }
};

const useDarkColor = () => {
  const appColor = useAppColor();
  switch (appColor) {
    case 'karen':
      return KAREN_DARK;
    case 'hikari':
      return HIKARI_DARK;
    case 'claudine':
      return CLAUDINE_DARK;
    case 'futaba':
      return FUTABA_DARK;
    case 'junna':
      return JUNNA_DARK;
    case 'kaoruko':
      return KAORUKO_DARK;
    case 'mahiru':
      return MAHIRU_DARK;
    case 'maya':
      return MAYA_DARK;
    case 'nana':
      return NANA_DARK;
    default:
      return KAREN_DARK;
  }
};

export const useAppTheme = () => {
  const materialLight = {...MD3LightTheme, colors: useLightColor()};
  const materialDark = {...MD3DarkTheme, colors: useDarkColor()};

  const {DarkTheme, LightTheme} = adaptNavigationTheme({
    reactNavigationLight,
    reactNavigationDark,
    materialLight,
    materialDark,
  });

  const appMaterialLight = {
    ...materialLight,
    colors: {
      ...materialLight.colors,
      ...LightTheme.colors,
    },
  };

  const appMaterialDark = {
    ...materialDark,
    colors: {
      ...materialDark.colors,
      ...DarkTheme.colors,
    },
  };

  return {DarkTheme, appMaterialDark, LightTheme, appMaterialLight};
};
