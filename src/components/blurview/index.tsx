import {BlurView as RNBlurView} from '@react-native-community/blur';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useOptions} from 'store';

const BlurView = () => {
  const {isDark} = useOptions();

  return (
    <RNBlurView
      blurAmount={10}
      blurRadius={10}
      blurType={isDark ? 'dark' : 'light'}
      overlayColor="transparent"
      style={StyleSheet.absoluteFill}
    />
  );
};

export default BlurView;
