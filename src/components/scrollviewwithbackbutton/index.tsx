import React, { useRef, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStyle } from 'react-native-style-utilities';
import AppStyles from '~/theme/styles';

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
  const top = useStyle(
    () => ({
      paddingTop: safeAreaInsets.top,
    }),
    [safeAreaInsets.top],
  );
  const contentContainerStyle = useStyle(
    () => [
      styles.scroll,
      {
        paddingBottom: safeAreaInsets.bottom,
      },
    ],
    [safeAreaInsets.bottom],
  );
  const backButtonStyle = useStyle(
    () => ({ backgroundColor: colors.background }),
    [colors.background],
  );
  const goBack = useCallback(() => navigation.goBack(), []);

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

  const translateXStyle = { transform: [{ translateX }] };
  const translateYStyle = { transform: [{ translateY }] };

  const backButtonAVStyle = useStyle(
    () => [
      AppStyles.absolute,
      {
        paddingTop: safeAreaInsets.top,
      },
    ],
    [safeAreaInsets.top],
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    },
    [currentOffset, scrollAV],
  );

  return (
    <View style={AppStyles.flex1}>
      <View style={top} />
      <ScrollView
        {...props}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <Animated.View style={[backButtonAVStyle, translateXStyle]}>
        <IconButton
          icon='arrow-left'
          onPress={goBack}
          style={backButtonStyle}
        />
      </Animated.View>
      <Animated.View
        style={[AppStyles.right0, AppStyles.absolute, top, translateYStyle]}>
        {right}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 50,
  },
});

ScrollViewWithBackButton.whyDidYouRender = true;

export default React.memo(ScrollViewWithBackButton);
