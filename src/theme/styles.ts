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
  charaImgContainer: {
    borderRadius: responsiveWidth(6),
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  elementImgContainer: {
    borderRadius: responsiveWidth(6),
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  grow: {
    flexGrow: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: padding,
  },
  sheetItem: {
    width: (responsiveWidth(100) - 2 * padding) / 7,
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
