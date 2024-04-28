import {Dimensions, Platform} from 'react-native';
import {responsiveScale} from './mixins';
import {create} from 'react-native-pixel-perfect';

const white = '#FFFFFF';
const offWhite = '#e8e6e1';
const slateBlue = '#637381';
const black = '#000000';
const themeColor = '#00AB55';
const gainsboro = '#9da39f';
const darkgray = '#a9a9a9';
const tomato = '#DD5421';
const lightGrey = '#c0c0c0';

const colors = {
  primary: '#9ACD32',
  secondary: '#00CC79',
  black: '#222222',

  // Heading Text colors

  mainHeadingTextColor: black,
  mediumHeadingTextColor: slateBlue,
  subHeadingTextColor: gainsboro,

  // Normal Text colors

  normalTextColor: black,
  mediumTextColor: slateBlue,
  validatonTextColor: tomato,
  buttonTextColor: white,

  // Boader colors

  borderDarkColor: darkgray,
  lightBorderColor: lightGrey,

  // Buttons

  largeButtonColor: themeColor,
  mediumButtonColor: '',
  smallButtonColor: '',

  // Screen Background colors

  viewBackgroundColor: white,
  logoTextColor: themeColor,
  loaderColor: white,
  textInputBackgroundColor: white,
  dashboardItemMainViewColor: offWhite,
  shadowColor: black,
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var tabHeight = deviceHeight * 0.08;
var categoriesSpacing = 10;
var screenHeight = deviceHeight - deviceHeight * 0.13;

const designResolution = {
  width: deviceWidth,
  height: screenHeight,
}; //this size is the size that your design is made for (screen size)
const perfectSize = create(designResolution);

const sizes = {
  // global sizes
  base: 16,
  font: 14,
  radius: 10,
  padding: 25,
  heading: 15,
  inputHeight: 30,
  // font sizes
  h1: responsiveScale(26),
  h2: responsiveScale(20),
  h3: responsiveScale(18),
  title: responsiveScale(17),
  header: responsiveScale(16),
  body: responsiveScale(14),
  caption: responsiveScale(12),
  small: responsiveScale(10),
};

var isIos = Platform.OS === 'ios' ? true : false;

var font = {
  regular: 'SFProText-Regular',
  bold: 'SFProText-Bold',
  medium: 'SFProText-Semibold',
};

var mediumIcon = deviceWidth * 0.05;

var smallIcon = deviceWidth * 0.04;

var largeIcon = deviceWidth * 0.1;

const fonts = {
  h1: {
    fontSize: sizes.h1,
  },
  h2: {
    fontSize: sizes.h2,
  },
  h3: {
    fontSize: sizes.h3,
  },
  header: {
    fontSize: sizes.header,
  },
  heading: {
    fontSize: sizes.heading,
  },
  title: {
    fontSize: sizes.title,
  },
  body: {
    fontSize: sizes.body,
  },
  caption: {
    fontSize: sizes.caption,
  },
  small: {
    fontSize: sizes.small,
  },
};

export {
  colors,
  sizes,
  fonts,
  font,
  deviceWidth,
  deviceHeight,
  isIos,
  screenHeight,
  tabHeight,
  mediumIcon,
  smallIcon,
  largeIcon,
  categoriesSpacing,
  perfectSize,
};
