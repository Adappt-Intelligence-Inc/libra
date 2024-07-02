import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import AngleRight from '../assets/appImages/AngleRight.svg';
import AngleRight2 from '../assets/appImages/AngleRight2.svg';
import CheckBox from '../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../assets/appImages/CheckBoxBlank.svg';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import {CommonStyle} from '../config/styles';

const CategoryItem = ({
  DeviceName,
  extraItemViewStyle,
  extraItemTextStyle,
  icon,
  isIcon = false,
  isRightIcon = false,
  isExtraRightIcon = false,
  isCheckBox = false,
  isUserNameVisible = false,
  isChecked,
  onPress = () => {},
  onCheckBoxPress = () => {},
  userName,
  isSwitchVisible = false,
  isSwithOn = false,
  onSwitchChange = () => {},
  isDisabled = false,
  isCheckBoxDisabled = false,
  disabledSwitch = false,
  rightIcon,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = value => {
    setIsEnabled(value);
    onSwitchChange(value);
  };

  return (
    <TouchableOpacity
      style={CommonStyle.shadow}
      disabled={isDisabled}
      onPress={() => {
        onPress();
      }}>
      <View style={[styles.itemContainer, extraItemViewStyle]}>
        <View style={CommonStyle.row}>
          {isIcon && <View style={styles.eventIcon}>{icon}</View>}
          <Text style={[styles.itemText, extraItemTextStyle]}>
            {DeviceName}
          </Text>
        </View>

        {isRightIcon && (
          <View style={CommonStyle.row}>
            <AngleRight />
          </View>
        )}

        {isExtraRightIcon && rightIcon && (
          <View style={[styles.eventIcon, {marginRight: 5}]}>{rightIcon}</View>
        )}

        {isUserNameVisible && (
          <View style={CommonStyle.row}>
            <Text style={styles.userName}>{userName}</Text>
            <AngleRight2 />
          </View>
        )}

        {isCheckBox && (
          <TouchableOpacity
          disabled={isCheckBoxDisabled}
            style={CommonStyle.row}
            onPress={() => {
              onCheckBoxPress();
            }}>
            {isChecked ? <CheckBox /> : <CheckBoxBlank />}
          </TouchableOpacity>
        )}

        {isSwitchVisible && (
          <Switch
            trackColor={{false: color.LIGHT_GRAY_6, true: color.GREEN}}
            thumbColor={isSwithOn ? color.WHITE : color.DARK_GRAY_5}
            ios_backgroundColor={color.LIGHT_GRAY_6}
            onValueChange={value => toggleSwitch(value)}
            value={isSwithOn}
            disabled={disabledSwitch}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemText: {
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
  },
  eventIcon: {
    paddingTop: 3,
    height: responsiveScale(20),
    width: responsiveScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  userName: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    marginRight: 10,
  },
});
