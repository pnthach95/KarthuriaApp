import {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {borderRadius} from 'theme/styles';

const styles = StyleSheet.create({
  radius: {
    borderTopLeftRadius: borderRadius * 2,
    borderTopRightRadius: borderRadius * 2,
  },
});

const CustomBackground = ({style}: BottomSheetBackgroundProps) => {
  const {colors} = useTheme();

  return (
    <View
      style={[style, styles.radius, {backgroundColor: colors.background}]}
    />
  );
};

CustomBackground.whyDidYouRender = true;

export default CustomBackground;
