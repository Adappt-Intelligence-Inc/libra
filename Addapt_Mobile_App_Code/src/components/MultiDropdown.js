import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {MultiSelect} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import {perfectSize} from '../styles/theme';
import {color} from '../config/color';
import DropdownIcon from '../assets/appImages/DropdownIcon.svg';
import CheckBox from '../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../assets/appImages/CheckBoxBlank.svg';
import {responsiveScale} from '../styles/mixins';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_MEDIUM} from '../styles/typography';

// const data = [
//   { label: 'Item 1', value: '1' },
//   { label: 'Item 2', value: '2' },
//   { label: 'Item 3', value: '3' },
//   { label: 'Item 4', value: '4' },
//   { label: 'Item 5', value: '5' },
//   { label: 'Item 6', value: '6' },
//   { label: 'Item 7', value: '7' },
//   { label: 'Item 8', value: '8' },
// ];

const MultiDropdown = ({
  value,
  placeholder,
  onChangeValue = () => {},
  data = [],
  valueField = 'value',
  labelField = 'label',
  extraInputViewStyle,
}) => {
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <View style={styles.checkboxButton}>
          {value.includes(item?.value) ? (
            <CheckBox height={'100%'} width={'100%'} />
          ) : (
            <CheckBoxBlank height={'100%'} width={'100%'} />
          )}
        </View>
        <Text numberOfLines={2} style={[styles.selectedTextStyle, {flex: 1}]}>
          {item.label}
        </Text>
      </View>
    );
  };

  const index = data?.findIndex(item => item.value === value[0]);

  const newPlaceholder =
    value.length === 0
      ? placeholder
      : value.length === 1
      ? data[index].label
      : `${value.length} selected`;

  return (
    <LinearGradient
      start={{x: 0.9, y: 0}}
      end={{x: 1, y: 1}}
      colors={['#00937D80', '#00937D20']}
      style={[styles.linearGradient]}>
      {/* <View style={[styles.linearGradient]}> */}
      <View style={[styles.innerContainer, extraInputViewStyle]}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={
            value.length > 0
              ? styles.selectedTextStyle
              : styles.placeholderStyle
          }
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          labelField={labelField}
          valueField={valueField}
          placeholder={newPlaceholder}
          value={value}
          search={false}
          containerStyle={{marginTop: 1.2}}
          onChange={item => {
            // console.log('item', item);
            onChangeValue(item);
          }}
          renderItem={renderItem}
          visibleSelectedItem={false}
          renderRightIcon={() => <DropdownIcon />}
        />
      </View>
    </LinearGradient>
  );
};

export default MultiDropdown;

const styles = StyleSheet.create({
  linearGradient: {
    height: perfectSize(40),
    borderRadius: 25, // <-- Outer Border Radius
  },
  dropdown: {
    borderRadius: 25,
    // paddingHorizontal: 12,
    flex: 1,
  },
  innerContainer: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    // justifyContent: 'center',
    // height: perfectSize(40),
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: color.DARK_GRAY,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  selectedTextStyle: {
    color: color.BLACK,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  checkboxButton: {
    marginRight: 10,
    width: responsiveScale(20),
    height: responsiveScale(20),
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
