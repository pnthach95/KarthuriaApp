import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button, MD2Colors, Text} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {ErrorBoundaryProps} from 'react-native-error-boundary';

const CustomFallback: ErrorBoundaryProps['FallbackComponent'] = ({error}) => {
  const {t} = useTranslation();
  const restart = () => {
    RNRestart.Restart();
  };

  return (
    <View className="flex-1 justify-center space-y-3 p-3">
      <View className="self-center">
        <Icon color={MD2Colors.red400} name="error" size={100} />
      </View>
      <Text className="text-center" variant="titleLarge">
        {t('app_error')}
      </Text>
      <Text>{error.toString()}</Text>
      <Button mode="contained" onPress={restart}>
        {t('reopen_app')}
      </Button>
    </View>
  );
};

export default CustomFallback;
