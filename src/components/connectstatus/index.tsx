import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {NetworkConsumer} from 'react-native-offline';
import {Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Connect Status
 */
const ConnectStatus = () => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const safeInsets = {
    paddingTop: insets.top,
  };
  const box = {
    backgroundColor: colors.error,
  };

  return (
    <NetworkConsumer>
      {({isConnected}) =>
        isConnected ? (
          <View style={safeInsets} />
        ) : (
          <View className="p-3" style={[box, safeInsets]}>
            <Text className="text-white">{t('no-internet-connection')}</Text>
          </View>
        )
      }
    </NetworkConsumer>
  );
};

ConnectStatus.whyDidYouRender = true;

export default React.memo(ConnectStatus);
