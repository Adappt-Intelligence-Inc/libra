import {Dimensions, PixelRatio} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const IMAGE_ASPECT_RATIO = 16 / 9;
const GUIDELINE_BASE_WIDTH = 375;

export const scaleSize = size => (WINDOW_WIDTH / GUIDELINE_BASE_WIDTH) * size;

export const responsiveScale = fontSize => RFValue(fontSize);

export const scaleFont = size => size * PixelRatio.getFontScale();

export const userRoles = {
  normal: 10,
  builder: 2,
  subcontractor: 3,
  employee: 4,
  officeadmin: 5,
  supervisor: 6,
};

export function boxShadow(
  offset = {height: 2, width: 2},
  opacity = 0.2,
  radius = 8,
  color,
) {
  return {
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
    shadowColor: color,
  };
}

/* Print the console logs */
export function consoleLog(key, value) {
  const printLog = true;
  if (printLog) {
    console.log(key, value);
  }
}
