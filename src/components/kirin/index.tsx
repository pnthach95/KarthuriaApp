import logo from '~/assets/common/kirin.png';
import AppStyles from '~/theme/styles';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, View} from 'react-native';

const Kirin = () => {
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
      <Animated.View style={{transform: [{rotate}]}}>
        <Image resizeMode='contain' source={logo} style={AppStyles.square100} />
      </Animated.View>
    </View>
  );
};

Kirin.whyDidYouRender = true;

export default React.memo(Kirin);
