import React from 'react';
import { View } from 'react-native';

type Props = {
  height?: number;
};

const Separator = ({ height = 10 }: Props): JSX.Element => {
  return <View style={{ height }} />;
};

Separator.whyDidYouRender = true;

export default Separator;
