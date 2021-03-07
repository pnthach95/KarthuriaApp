import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { responsiveWidth } from 'react-native-responsive-dimensions';

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
  charaImg: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  charaImgContainer: {
    borderRadius: responsiveWidth(6),
    marginBottom: 5,
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
  rarityImgContainer: {
    borderRadius: 5,
    padding: 2,
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
  spaceHorizontal: {
    width: 10,
  },
  whiteText: {
    color: Colors.white,
  },
});
