import React from 'react';
import { useTheme } from 'react-native-paper';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { View } from 'react-native';

const CustomBackground = ({
  style,
}: BottomSheetBackgroundProps): JSX.Element => {
  const { colors } = useTheme();

  return <View style={[style, { backgroundColor: colors.card }]} />;
};

export default CustomBackground;
