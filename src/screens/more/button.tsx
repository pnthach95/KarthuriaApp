import React from 'react';
import {View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
  color: string;
  icon: string;
  label: string;
};

const Button = ({color, icon, label, onPress}: Props) => {
  return (
    <TouchableRipple onPress={onPress}>
      <View className="flex-row items-center space-x-3 p-3">
        <Icon color={color} name={icon} size={32} />
        <Text>{label}</Text>
      </View>
    </TouchableRipple>
  );
};

export default Button;
