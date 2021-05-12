import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { borderRadius } from '~/theme/styles';

const styles = StyleSheet.create({
  radius: {
    borderTopLeftRadius: borderRadius * 2,
    borderTopRightRadius: borderRadius * 2,
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

CustomBackground.whyDidYouRender = true;

export default CustomBackground;
