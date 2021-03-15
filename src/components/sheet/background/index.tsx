import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { View } from 'react-native';

const styles = StyleSheet.create({
  radius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

const CustomBackground = ({
  style,
}: BottomSheetBackgroundProps): JSX.Element => {
  const { colors } = useTheme();

  return (
    <View style={[style, styles.radius, { backgroundColor: colors.card }]} />
  );
};

export default CustomBackground;
