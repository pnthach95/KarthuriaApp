import AppStyles from '~/theme/styles';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {Animated, ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStyle} from 'react-native-style-utilities';

import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';

const ScrollViewWithBackButton = ({
  children,
  right,
  ...props
}: ScrollViewProps & {
  children?: React.ReactNode;
  right?: React.ReactNode;
}) => {
  const scrollAV = useRef(new Animated.Value(0)).current;
  const safeAreaInsets = useSafeAreaInsets();
  const [currentOffset, setCurrentOffset] = useState(0);
  const {colors} = useTheme();
  const navigation = useNavigation();
  const contentContainerStyle = useStyle(
    () => [
      styles.scroll,
      {
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      },
    ],
    [safeAreaInsets.bottom, safeAreaInsets.top],
  );
  const backButtonStyle = useStyle(
    () => ({backgroundColor: colors.background}),
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

  const translateXStyle = {transform: [{translateX}]};
  const translateYStyle = {transform: [{translateY}]};

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
      <ScrollView
        {...props}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}>
        <View style={styles.top} />
        {children}
      </ScrollView>
      <Animated.View style={[backButtonAVStyle, translateXStyle]}>
        <IconButton
          icon='arrow-left'
          style={backButtonStyle}
          onPress={goBack}
        />
      </Animated.View>
      <Animated.View
        style={[
          AppStyles.right0,
          AppStyles.absolute,
          contentContainerStyle,
          translateYStyle,
        ]}>
        {right}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 50,
  },
  top: {
    height: 40,
  },
});

ScrollViewWithBackButton.whyDidYouRender = true;

export default React.memo(ScrollViewWithBackButton);
