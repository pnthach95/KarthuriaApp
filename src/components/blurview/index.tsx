import {colord} from 'colord';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {BlurView as RNBlurView} from 'rn-id-blurview';

const BlurView = () => {
  const {colors} = useTheme();
  const backgroundColor = colord(colors.background).alpha(0.5).toHex();

  return (
    <RNBlurView
      blurAmount={10}
      blurRadius={10}
      blurType='light'
      overlayColor='transparent'
      style={[StyleSheet.absoluteFill, {backgroundColor}]}
    />
  );
};

export default BlurView;
