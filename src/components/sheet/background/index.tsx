import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import type {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet';

const CustomBackground = ({style}: BottomSheetBackgroundProps) => {
  const {colors} = useTheme();
  const bg = {backgroundColor: colors.background};

  return <View className="rounded-tl-xl rounded-tr-xl" style={[style, bg]} />;
};

CustomBackground.whyDidYouRender = true;

export default CustomBackground;
