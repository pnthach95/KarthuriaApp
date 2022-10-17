import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useStore from 'store';
import BlurView from '../blurview';

const BlurStatusBar = () => {
  const height = useSafeAreaInsets().top;
  const options = useStore(s => s.options);
  const statusBarStyle = options.isDark ? 'light-content' : 'dark-content';
  const style = {height, width: responsiveWidth(100)};

  return (
    <View style={[style, StyleSheet.absoluteFill]}>
      <BlurView />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={statusBarStyle}
      />
    </View>
  );
};

export default BlurStatusBar;
