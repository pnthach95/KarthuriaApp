import Space from 'components/separator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button, Colors, Text, Title} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppStyles from 'theme/styles';
import type {ErrorBoundaryProps} from 'react-native-error-boundary';

const CustomFallback: ErrorBoundaryProps['FallbackComponent'] = ({error}) => {
  const {t} = useTranslation();
  const restart = () => {
    RNRestart.Restart();
  };

  return (
    <View style={[AppStyles.flex1, AppStyles.justifyCenter, AppStyles.padding]}>
      <Icon
        color={Colors.red400}
        name="error"
        size={100}
        style={AppStyles.selfCenter}
      />
      <Title style={AppStyles.centerText}>{t('app_error')}</Title>
      <Space />
      <Text>{error.toString()}</Text>
      <Space />
      <Button mode="contained" onPress={restart}>
        <Text>{t('reopen_app')}</Text>
      </Button>
    </View>
  );
};

export default CustomFallback;
