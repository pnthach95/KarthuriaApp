import React from 'react';
import { StyleSheet } from 'react-native';
import { Paragraph, Colors } from 'react-native-paper';

type Props = { info: string };

const styles = StyleSheet.create({
  tiva: {
    color: Colors.blue300,
  },
});

const TiVa = ({ info }: Props): JSX.Element => (
  <Paragraph>
    Ti/Va: <Paragraph style={styles.tiva}>{info}</Paragraph>
  </Paragraph>
);

export default TiVa;
