import {BlurView as RNBlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet} from 'react-native';

const BlurView = () => {
  return (
    <RNBlurView
      blurAmount={10}
      blurRadius={10}
      blurType="light"
      overlayColor="transparent"
      style={StyleSheet.absoluteFill}
    />
  );
};

export default BlurView;
