import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Colors } from 'react-native-paper';
import { NetworkConsumer } from 'react-native-offline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppStyles, { padding } from '~/theme/styles';

/**
 * Connect Status
 */
const ConnectStatus = (): React.ReactElement => {
  const insets = useSafeAreaInsets();
  const safeInsets = {
    paddingTop: insets.top,
  };

  return (
    <NetworkConsumer>
      {({ isConnected }) =>
        isConnected ? (
          <View style={safeInsets} />
        ) : (
          <View style={[styles.box, safeInsets]}>
            <Text style={AppStyles.whiteText}>No internet connection</Text>
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
