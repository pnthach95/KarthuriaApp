import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Colors } from 'react-native-paper';
import { NetworkConsumer } from 'react-native-offline';
import AppStyles from '~/theme/styles';

/**
 * Connect Status
 */
const ConnectStatus = (): React.ReactElement => {
  return (
    <NetworkConsumer>
      {({ isConnected }) =>
        isConnected ? (
          <View style={styles.zero} />
        ) : (
          <View style={styles.box}>
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
    padding: 10,
  },
  zero: {
    height: 0,
  },
});

export default ConnectStatus;
