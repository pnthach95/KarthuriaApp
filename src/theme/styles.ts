import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export const padding = 10;
export const borderRadius = 5;

export default StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  bigImg: {
    alignSelf: 'center',
    height: 216,
    width: 288,
  },
  borderRadius: {
    borderRadius,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  charaImgContainer: {
    borderRadius: responsiveWidth(6),
    marginBottom: padding / 2,
  },
  columnWrapper: {
    justifyContent: 'center',
  },
  contentBlock: {
    borderRadius,
    marginVertical: padding / 2,
    padding,
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
  listItem: {
    borderWidth: 1,
    flex: 1,
    padding: padding / 2,
  },
  marginBottom: {
    marginBottom: padding / 2,
  },
  marginRight: {
    marginRight: padding,
  },
  marginTop: {
    marginTop: 5 * padding,
  },
  padding: {
    padding,
  },
  paddingHorizontal: {
    paddingHorizontal: padding,
  },
  paddingVertical: {
    paddingVertical: padding,
  },
  rarityImg: {
    alignSelf: 'center',
    height: 14,
    width: 70,
  },
  rarityImgContainer: {
    borderRadius,
    padding: 2,
  },
  right0: {
    right: 0,
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
  selfCenter: {
    alignSelf: 'center',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  selfStart: {
    alignSelf: 'flex-start',
  },
  shadow: {
    elevation: 5,
  },
  smallImg: {
    height: 80,
    width: 72,
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
  square100: {
    height: 100,
    width: 100,
  },
  square112: {
    height: 112,
    width: 112,
  },
  square20: {
    height: 20,
    width: 20,
  },
  square28: {
    height: 28,
    width: 28,
  },
  square40: {
    height: 40,
    width: 40,
  },
  square78: {
    height: 78.4,
    width: 78.4,
  },
  squareW10: {
    height: responsiveWidth(10),
    width: responsiveWidth(10),
  },
  squareW12: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
  },
  stageGirlBottomLeft: {
    borderRadius,
    bottom: -5,
    height: 30,
    left: -5,
    width: 30,
  },
  whiteText: {
    color: Colors.white,
  },
});
