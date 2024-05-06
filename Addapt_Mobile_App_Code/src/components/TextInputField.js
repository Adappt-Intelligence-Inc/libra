import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Eye from '../assets/appImages/Eye.svg';
import RightIcon from '../assets/appImages/RightIcon.svg';
import {responsiveScale} from '../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';
import {color} from '../config/color';
import {perfectSize} from '../styles/theme';

export default function TextInputField({
  value,
  icon,
  placeholder,
  onchangeText = () => {},
  onPressRightIcon = () => {},
  onExtraBtnIcon = () => {},
  onBlurPress = () => {},
  onFocus = () => {},
  extraTextInputStyle,
  multiline,
  keyboardType,
  maxLength,
  editable,
  isVisiblePassword,
  isRightIcon,
  isIconVisible,
  selection,
  textAlignVertical = 'center',
  placeholderTextColor,
  autoCapitalize,
  secureTextEntry = false,
  extraInputViewStyle,
  extraMainViewStyle,
  ref,
  isExtraBtn,
  extraBtn,
}) {
  const [hideAndShowPassword, setHideAndShowPassword] =
    useState(secureTextEntry);
  const [hide, setHide] = useState(true);
  const handleHideShowPassword = () => {
    setHide(!hide);
    setHideAndShowPassword(!hideAndShowPassword);
  };
  return (
    <>
      <LinearGradient
        start={{x: 0.9, y: 0}}
        end={{x: 1, y: 1}}
        colors={['#00937D80', '#00937D20']}
        style={[styles.linearGradient, extraInputViewStyle]}>
        <View style={styles.innerContainer}>
          <View style={[styles.mainView, extraMainViewStyle]}>
            {icon && <View style={{}}>{icon}</View>}
            <TextInput
              ref={ref}
              style={[styles.textInputStyle, extraTextInputStyle]}
              value={value}
              multiline={multiline}
              placeholder={placeholder}
              onChangeText={value => onchangeText(value)}
              placeholderTextColor={placeholderTextColor}
              secureTextEntry={hideAndShowPassword}
              keyboardType={keyboardType}
              maxLength={maxLength}
              editable={editable}
              selection={selection}
              textAlignVertical={textAlignVertical}
              autoCapitalize={autoCapitalize}
              onBlur={res => {
                console.log('res=>>', res?._targetInst?.memoizedProps?.text);
                onBlurPress(res?._targetInst?.memoizedProps?.text);
              }}
              onFocus={() => {
                onFocus();
              }}
            />

            {isVisiblePassword && (
              <TouchableOpacity
                hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
                style={styles.alignCenter}
                onPress={() => handleHideShowPassword()}>
                {hideAndShowPassword ? <Eye /> : <Eye />}
              </TouchableOpacity>
            )}
            {isRightIcon && (
              <TouchableOpacity
                style={styles.alignCenter}
                onPress={() => {
                  onPressRightIcon();
                }}>
                <RightIcon />
              </TouchableOpacity>
            )}
            {isExtraBtn && extraBtn}
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({
  textInputStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 32,
    paddingLeft: 15,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  alignCenter: {alignItems: 'center', justifyContent: 'center'},

  linearGradient: {
    height: perfectSize(40),
    borderRadius: 25, // <-- Outer Border Radius
  },
  innerContainer: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    justifyContent: 'center',
  },
});
