import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Colors } from 'react-native-paper';

type Props = { info: string };

const styles = StyleSheet.create({
  animation: {
    color: Colors.red300,
  },
});

const Animation = ({ info }: Props): JSX.Element => (
  <Text>
    Animation: <Text style={styles.animation}>{info}</Text>
  </Text>
);

export default Animation;
