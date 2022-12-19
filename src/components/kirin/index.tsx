import logo from 'assets/common/kirin.png';
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
    <View className="flex-1 items-center justify-center">
      <Animated.View style={{transform: [{rotate}]}}>
        <Image className="h-28 w-28" resizeMode="contain" source={logo} />
      </Animated.View>
    </View>
  );
};

Kirin.whyDidYouRender = true;

export default React.memo(Kirin);
