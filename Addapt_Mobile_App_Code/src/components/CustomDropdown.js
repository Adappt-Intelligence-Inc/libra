import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import {perfectSize} from '../styles/theme';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import DropdownIcon from '../assets/appImages/DropdownIcon.svg';

import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';

const CustomDropdown = ({
  value,
  placeholder,
  onChangeValue = () => {},
  data = [],
  valueField = 'value',
  labelField = 'label',
  extraInputViewStyle,
  extraLinearViewStyle,
  icon,
  disable = false,
  onFocus = () => {},
}) => {
  // const [selectedvalue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // const data = [
  //   {label: 'Item 1', value: '1'},
  //   {label: 'Item 2', value: '2'},
  //   {label: 'Item 3', value: '3'},
  //   {label: 'Item 4', value: '4'},
  //   {label: 'Item 5', value: '5'},
  //   {label: 'Item 6', value: '6'},
  //   {label: 'Item 7', value: '7'},
  //   {label: 'Item 8', value: '8'},
  // ];

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text numberOfLines={2} style={styles.selectedTextStyle}>
          {item[labelField]}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient
      start={{x: 0.9, y: 0}}
      end={{x: 1, y: 1}}
      colors={['#00937D80', '#00937D20']}
      style={[styles.linearGradient, extraLinearViewStyle]}>
      {/* <View style={[styles.linearGradient]}> */}
      <View style={[styles.innerContainer, extraInputViewStyle]}>
        {/* {icon && <View style={styles.icon}>{icon}</View>} */}
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField={labelField}
          valueField={valueField}
          placeholder={!isFocus ? placeholder : '...'}
          value={value}
          onFocus={() => {
            setIsFocus(true);
            onFocus();
          }}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            onChangeValue(item);
            setIsFocus(false);
          }}
          disable={disable}
          containerStyle={{marginTop: 1.2}}
          selectedTextProps={{numberOfLines: 1}}
          renderRightIcon={() => <DropdownIcon />}
          renderLeftIcon={() =>
            icon ? <View style={styles.icon}>{icon}</View> : null
          }
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
    // </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  linearGradient: {
    height: perfectSize(40),
    borderRadius: 25, // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.LIGHT_GRAY_4,
    justifyContent: 'center',
    // height: perfectSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dropdown: {
    borderRadius: 25,
    // paddingHorizontal: 12,
    flex: 1,
  },
  icon: {
    marginRight: 10,
    height: perfectSize(27),
    width: perfectSize(27),
    borderRadius: perfectSize(27),
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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
    textTransform: 'capitalize',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: responsiveScale(15),
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
});
