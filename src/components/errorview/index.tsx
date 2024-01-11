import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ErrorView = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View className="flex-1 items-center justify-center">
      <Icon color={colors.error} name="alert-circle-outline" size={70} />
      <Text>{t('cannot-load-data')}</Text>
    </View>
  );
};

export default ErrorView;
