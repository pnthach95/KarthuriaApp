import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Colors, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppStyles from 'theme/styles';

const ErrorView = () => {
  const {t} = useTranslation();
  return (
    <View style={[AppStyles.flex1, AppStyles.center]}>
      <Icon color={Colors.red600} name="alert-circle-outline" size={70} />
      <Text>{t('cannot-load-data')}</Text>
    </View>
  );
};

ErrorView.whyDidYouRender = true;

export default ErrorView;
