import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import FastImage from 'react-native-fast-image';
import logo from '~/assets/common/kirin.png';
import AppContext from '~/context';
import { getObject } from '~/mmkv';
import AppStyles from '~/theme/styles';

import type { AppOptions } from '~/typings';

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
});

/** Loading Screen */
const SplashScreen = (): JSX.Element => {
  const logoAV = useRef(new Animated.Value(0)).current;
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const rotate = logoAV.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(logoAV, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
    const getData = async () => {
      const options = await getObject<AppOptions>('options');
      if (options) {
        dispatch({ type: 'SAVE_OPTIONS', data: options });
      }
      await RNBootSplash.hide({ fade: true });
      setLoading(false);
    };
    void getData();
  }, []);

  useEffect(() => {
    if (!loading) {
      dispatch({ type: 'SWITCH_MAIN_ROUTE', route: 'MAIN' });
    }
  }, [loading]);

  return (
    <View style={[AppStyles.flex1, AppStyles.center]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <FastImage source={logo} resizeMode='contain' style={styles.logo} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
