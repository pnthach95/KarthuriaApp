import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

const CustomBackdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps): JSX.Element => {
  const { colors } = useTheme();
  const { dismissAll } = useBottomSheetModal();

  const animatedOpacity = useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex],
  );

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: colors.backdrop,
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity],
  );

  return <Animated.View onTouchEnd={dismissAll} style={containerStyle} />;
};

export default CustomBackdrop;
