import {StyleSheet} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {ViewStyle} from 'react-native';

export const padding = 12;
export const borderRadius = 12;

export const useSafeAreaPaddingBottom = (offset = 0, style?: ViewStyle) => {
  const insets = useSafeAreaInsets();
  return StyleSheet.flatten([
    {
      paddingBottom: insets.bottom + offset,
    },
    style,
  ]);
};

export const useSafeAreaPaddingTop = (offset = 0, style?: ViewStyle) => {
  const insets = useSafeAreaInsets();
  return StyleSheet.flatten([
    {
      paddingTop: insets.top + offset,
    },
    style,
  ]);
};

const AppStyles = StyleSheet.create({
  grow: {
    flexGrow: 1,
  },
  margin: {
    margin: padding,
  },
  padding: {
    padding,
  },
  paddingHorizontal: {
    paddingHorizontal: padding,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  squareW10: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  squareW12: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
});

export default AppStyles;
