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
  fab: {
    bottom: 0,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
  flex1: {
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  shadow: {
    elevation: 5,
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  whiteText: {
    color: Colors.white,
  },
});
