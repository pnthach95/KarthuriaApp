import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Colors } from 'react-native-paper';

type Props = { info: string };

const styles = StyleSheet.create({
  tiva: {
    color: Colors.blue300,
  },
});

const TiVa = ({ info }: Props): JSX.Element => (
  <Text>
    Ti/Va: <Text style={styles.tiva}>{info}</Text>
  </Text>
);

export default TiVa;
