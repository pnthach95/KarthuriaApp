import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {NetworkConsumer} from 'react-native-offline';
import {Colors, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles, {padding} from 'theme/styles';

/**
 * Connect Status
 */
const ConnectStatus = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const safeInsets = {
    paddingTop: insets.top,
  };

  return (
    <NetworkConsumer>
      {({isConnected}) =>
        isConnected ? (
          <View style={safeInsets} />
        ) : (
          <View style={[styles.box, safeInsets]}>
            <Text style={AppStyles.whiteText}>
              {t('no-internet-connection')}
            </Text>
          </View>
        )
      }
    </NetworkConsumer>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: Colors.red600,
    padding,
  },
});

ConnectStatus.whyDidYouRender = true;

export default React.memo(ConnectStatus);
