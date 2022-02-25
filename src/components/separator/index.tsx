import React from 'react';
import { View } from 'react-native';

type Props = {
  height?: number;
  width?: number;
};

const Separator = ({ height = 10, width }: Props) => {
  return <View style={{ height, width }} />;
};

export default Separator;
