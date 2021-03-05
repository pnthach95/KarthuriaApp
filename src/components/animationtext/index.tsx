import React from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph, Colors } from 'react-native-paper';

type Props = { info: string };

const styles = StyleSheet.create({
  animation: {
    color: Colors.red300,
  },
});

const Animation = ({ info }: Props): JSX.Element => (
  <Paragraph>
    Animation: <Paragraph style={styles.animation}>{info}</Paragraph>
  </Paragraph>
);

export default Animation;
