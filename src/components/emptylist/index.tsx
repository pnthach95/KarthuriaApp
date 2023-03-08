import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

const EmptyList = () => {
  const {t} = useTranslation();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>{t('no-data')}</Text>
    </View>
  );
};

export default EmptyList;
