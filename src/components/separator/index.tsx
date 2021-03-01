import React from 'react';
import { View } from 'react-native';

type Props = {
  height: number;
};

const Separator = ({ height }: Props): JSX.Element => {
  return <View style={{ height }} />;
};

export default Separator;
