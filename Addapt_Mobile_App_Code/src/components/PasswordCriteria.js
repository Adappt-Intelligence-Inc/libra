import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color} from '../config/color';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {responsiveScale} from '../styles/mixins';

export const PasswordCriteriaComp = listProps => {
  const {isError, copy} = listProps;
  return (
    <View style={styles.main}>
      <Text
        style={[styles.text, {color: isError ? color.GREEN : color.DARK_GRAY}]}>
        {copy}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  imageView: {
    height: 20,
    aspectRatio: 1,
  },
  text: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.GREEN,
    includeFontPadding: false,
    marginLeft: 10,
  },
});
