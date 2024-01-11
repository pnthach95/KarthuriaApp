import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {NetworkConsumer} from 'react-native-offline';
import {Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * Connect Status
 */
const ConnectStatus = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const errorBox = {
    backgroundColor: colors.errorContainer,
  };
  const errorBoxText = {
    color: colors.onErrorContainer,
  };

  return (
    <SafeAreaView edges={['top']}>
      <NetworkConsumer>
        {({isConnected}) =>
          !isConnected && (
            <View className="p-3" style={errorBox}>
              <Text style={errorBoxText}>{t('no-internet-connection')}</Text>
            </View>
          )
        }
      </NetworkConsumer>
    </SafeAreaView>
  );
};

export default React.memo(ConnectStatus);
