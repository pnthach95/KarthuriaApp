import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import logo from '~/assets/common/kirin.png';
import AppStyles from '~/theme/styles';

const Kirin = (): JSX.Element => {
  const logoAV = useRef(new Animated.Value(0)).current;

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
  }, []);

  return (
    <View style={[AppStyles.flex1, AppStyles.center]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <FastImage
          source={logo}
          resizeMode='contain'
          style={AppStyles.square100}
        />
      </Animated.View>
    </View>
  );
};

export default Kirin;
