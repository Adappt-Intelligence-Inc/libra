import {StyleSheet} from 'react-native';
import {WINDOW_WIDTH, responsiveScale} from '../styles/mixins';
import {color} from './color';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  FONT_WEIGHT_REGULAR,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import {perfectSize} from '../styles/theme';

export const CommonStyle = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: color.GREEN},
  whiteContainer: {flex: 1, backgroundColor: color.WHITE},
  sectionContainer: {backgroundColor: color.WHITE, paddingHorizontal: 20},
  fullLoader: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adapptLogo: {
    height: 200,
    width: 300,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    height: 120,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adapptImg: {
    height: '100%',
    width: '40%',
    resizeMode: 'contain',
  },
  callBtn: {
    borderColor: color.GREEN,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: perfectSize(25),
    marginTop: 40,
  },
  socialLoginBtn: {
    width: '100%',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.5,
  },
  socialBtnText: {
    paddingLeft: 10,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(14),
  },
  smallGreyText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(12),
  },
  smallBlackBoldText: {
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(12),
  },
  mediumBlackText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(12),
  },
  smallGreenText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.GREEN,
    fontSize: responsiveScale(12),
  },
  smallBoldGreenText: {
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.GREEN,
    fontSize: responsiveScale(12),
  },
  smallBlackText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(10),
  },
  smallestGreyText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(10),
  },
  graphText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_3,
    fontSize: responsiveScale(10),
  },
  callBtnText: {
    paddingLeft: 10,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.GREEN,
    fontSize: responsiveScale(14),
  },
  linearGradient: {
    height: perfectSize(40),
    width: '100%',
    borderRadius: 25, // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    justifyContent: 'center',
  },
  inputTitle: {
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    paddingTop: 20,
    paddingBottom: 10,
  },
  blackTitle: {
    fontSize: responsiveScale(16),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    marginBottom: responsiveScale(10),
  },
  divider: {
    borderBottomWidth: 1,
    width: '30%',
    borderBottomColor: color.LIGHT_GRAY_1,
  },
  text: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.DARK_GRAY,
  },
  regularGreyText: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.DARK_GRAY,
  },
  regularText: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_REGULAR,
    fontFamily: TTNORMSPRO_REGULAR,
    color: color.DARK_GRAY,
    lineHeight: 22,
    marginBottom: 10,
  },
  loginContent: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
  },
  loginTitle: {
    fontSize: responsiveScale(20),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    paddingBottom: 10,
    paddingTop: 50,
  },
  hideExtraContent: {
    overflow: 'hidden',
    borderTopLeftRadius: 50,
    flex: 1,
  },
  BtnView: {width: '40%', marginTop: 35, marginBottom: 20},
  NavigateText: {
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    lineHeight: 24,
  },
  blackText14: {
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  greenText14: {
    fontSize: responsiveScale(14),
    color: color.GREEN,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  linkText: {
    color: color.GREEN,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    fontSize: responsiveScale(14),
  },
  Rectangle1: {
    position: 'absolute',
    height: perfectSize(180),
    width: WINDOW_WIDTH / 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  Rectangle2: {
    position: 'absolute',
    right: 0,
    top: 60,
    height: perfectSize(250),
    width: WINDOW_WIDTH / 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  greyText18: {
    color: color.DARK_GRAY,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  shadow: {
    shadowColor: color.LIGHT_GRAY_2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  position: {position: 'absolute', top: 10, right: 10},
  modelContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  modalContentStyle: {
    backgroundColor: color.WHITE,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modelBottomContainerStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  modalBottomContentStyle: {
    backgroundColor: color.WHITE,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    // alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: responsiveScale(20),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  headerTitle: {
    fontSize: responsiveScale(20),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  greyText20: {
    fontSize: responsiveScale(18),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  greenText20: {
    fontSize: responsiveScale(18),
    color: color.GREEN,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  lightGreyText20: {
    fontSize: responsiveScale(18),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  textInputWidth: {width: '85%'},
});
