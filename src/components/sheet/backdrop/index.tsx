import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

const CustomBackdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps): JSX.Element => {
  const { colors } = useTheme();
  const { dismissAll } = useBottomSheetModal();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
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

  return <Animated.View onTouchEnd={dismissAll} style={containerStyle} />;
};

CustomBackdrop.whyDidYouRender = true;

export default CustomBackdrop;
