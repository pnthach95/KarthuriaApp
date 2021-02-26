import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Button } from 'react-native-paper';
import RNBootSplash from 'react-native-bootsplash';
import FastImage from 'react-native-fast-image';
import logo from '~/assets/common/kirin.png';
import AppStyles from '~/theme/styles';

const styles = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
  textBox: {
    marginHorizontal: 10,
  },
});

/** Loading Screen */
const SplashScreen = (): JSX.Element => {
  const logoAV = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const rotate = logoAV.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    void RNBootSplash.hide({ fade: true });
    Animated.loop(
      Animated.timing(logoAV, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={[AppStyles.flex1, AppStyles.center]}>
      {loading && (
        <>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <FastImage source={logo} resizeMode='contain' style={styles.logo} />
          </Animated.View>
        </>
      )}
      {error && (
        <>
          <View style={styles.textBox}>
            <Text>
              {"Can't get data.\nCheck internet connection and retry."}
            </Text>
          </View>
          <Button>Retry</Button>
        </>
      )}
    </View>
  );
};

export default SplashScreen;
