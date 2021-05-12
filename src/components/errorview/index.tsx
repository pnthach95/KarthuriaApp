import React from 'react';
import { View } from 'react-native';
import { Text, Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyles from '~/theme/styles';

const ErrorView = (): JSX.Element => {
  return (
    <View style={[AppStyles.flex1, AppStyles.center]}>
      <Icon name='alert-circle-outline' size={70} color={Colors.red600} />
      <Text>{`Can't load data`}</Text>
    </View>
  );
};

ErrorView.whyDidYouRender = true;

export default ErrorView;
