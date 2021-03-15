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
  elementImg: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  elementImgContainer: {
    borderRadius: responsiveWidth(6),
    height: responsiveWidth(12),
    width: responsiveWidth(12),
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
  marginBottom: {
    marginBottom: 5,
  },
  marginTop: {
    marginTop: 50,
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
  rowSpaceBetween: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  selfFlexStart: {
    alignSelf: 'flex-start',
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
