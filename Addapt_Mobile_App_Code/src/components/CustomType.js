import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {CommonStyle} from '../config/styles';

const CustomType = ({
  name,
  icon,
  extraContainerStyle,
  extraNameStyle,
  onPress,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.container, CommonStyle.shadow, extraContainerStyle]}>
        {icon}
        <Text style={[styles.text, extraNameStyle]}>{name}</Text>
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: color.LIGHT_GRAY_1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center',
  },
  text: {
    paddingTop: 5,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(10),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
});
export default CustomType;
