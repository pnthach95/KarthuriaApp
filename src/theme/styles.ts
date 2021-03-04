import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';

export default StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  shadow: {
    elevation: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  whiteText: {
    color: Colors.white,
  },
});
