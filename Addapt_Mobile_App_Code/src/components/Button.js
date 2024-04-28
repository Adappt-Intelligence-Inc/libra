import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import {perfectSize} from '../styles/theme';

export default function Button({
  name,
  extraBtnViewStyle,
  extraBtnNameStyle,
  disabled,
  isIcon = false,
  isLoading = false,
  image,
  loadColor = color.WHITE,
  onPress = () => {},
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onPress()}
      style={[styles.btnView, extraBtnViewStyle]}>
      {isIcon && <View style={styles.iconView}>{image}</View>}
      {isLoading ? (
        <ActivityIndicator size={'small'} color={loadColor} />
      ) : (
        <Text style={[styles.btnName, extraBtnNameStyle]}>{name}</Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btnView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.GREEN,
    width: '100%',
    borderRadius: 32,
    height: perfectSize(42),
    alignSelf: 'center',
    flexDirection: 'row',
  },
  btnName: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
    color: color.WHITE,
  },
  iconView: {marginRight: 10},
});
