import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import React, {useMemo} from 'react';
import {useTheme} from 'react-native-paper';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';

const CustomBackdrop = ({animatedIndex, style}: BottomSheetBackdropProps) => {
  const {colors} = useTheme();
  const {dismissAll} = useBottomSheetModal();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: colors.backdrop,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} onTouchEnd={dismissAll} />;
};

CustomBackdrop.whyDidYouRender = true;

export default CustomBackdrop;
