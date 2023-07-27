import React, {useState} from 'react';
import {View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import type {LayoutChangeEvent, ViewStyle} from 'react-native';

type Props = {
  label: string;
  children?: string | number;
  hideDivider?: boolean;
  style?: ViewStyle;
};

const TextRow = ({children, label, hideDivider, style}: Props) => {
  const [firstHeight, setFirstHeight] = useState(1);
  const [secondHeight, setSecondHeight] = useState(1);

  const onLayoutFirst = ({
    nativeEvent: {
      layout: {height},
    },
  }: LayoutChangeEvent) => {
    setFirstHeight(height);
  };

  const onLayoutSecond = ({
    nativeEvent: {
      layout: {height},
    },
  }: LayoutChangeEvent) => {
    setSecondHeight(height);
  };

  const checkHeight = secondHeight / firstHeight >= 1.7;

  return (
    <View className="space-y-3" style={style}>
      <View
        className={`flex-row flex-wrap ${
          checkHeight ? 'items-start' : 'items-end'
        } justify-between space-x-3`}>
        <Text
          className="text-left"
          variant="labelMedium"
          onLayout={onLayoutFirst}>
          {label}
        </Text>
        <Text
          selectable
          className="flex-grow text-right"
          onLayout={onLayoutSecond}>
          {children}
        </Text>
      </View>
      {!hideDivider && <Divider />}
    </View>
  );
};

export default TextRow;
