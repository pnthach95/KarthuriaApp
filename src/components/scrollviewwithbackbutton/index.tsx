import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollViewProps,
} from 'react-native';

const ScrollViewWithBackButton = ({
  children,
  right,
  ...props
}: ScrollViewProps & {
  children?: React.ReactNode;
  right?: React.ReactNode;
}): JSX.Element => {
  const scrollAV = useRef(new Animated.Value(0)).current;
  const safeAreaInsets = useSafeAreaInsets();
  const [currentOffset, setCurrentOffset] = useState(0);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const top = {
    paddingTop: safeAreaInsets.top,
  };
  const bottom = {
    paddingBottom: safeAreaInsets.bottom,
  };
  const goBack = () => navigation.goBack();

  const translateX = scrollAV.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const translateY = scrollAV.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50 - safeAreaInsets.top],
    extrapolate: 'clamp',
  });

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.y;
    if (offset > 50) {
      const dif = offset - (currentOffset || 0);
      if (Math.abs(dif) > 10) {
        if (dif < 0) {
          Animated.timing(scrollAV, {
            duration: 100,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(scrollAV, {
            duration: 100,
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      }
    } else {
      Animated.timing(scrollAV, {
        duration: 100,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
    setCurrentOffset(offset);
  };

  return (
    <View style={styles.flex1}>
      <View style={top} />
      <ScrollView
        {...props}
        contentContainerStyle={[styles.scroll, bottom]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <Animated.View
        style={[styles.back, top, { transform: [{ translateX }] }]}>
        <IconButton
          icon='arrow-left'
          onPress={goBack}
          style={{ backgroundColor: colors.background }}
        />
      </Animated.View>
      <Animated.View
        style={[styles.right, top, { transform: [{ translateY }] }]}>
        {right}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
  },
  flex1: {
    flex: 1,
  },
  right: {
    position: 'absolute',
    right: 0,
  },
  scroll: {
    paddingTop: 50,
  },
});

export default ScrollViewWithBackButton;
