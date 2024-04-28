/* eslint-disable react-native/no-color-literals */
/* eslint-disable no-dupe-keys */
import React from 'react';
import {Keyboard, StyleSheet, Text} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {color} from '../config/color';
import {WINDOW_WIDTH, responsiveScale} from '../styles/mixins';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {perfectSize} from '../styles/theme';

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    borderColor: color.LIGHT_GREEN,
    borderRadius: 12,
    borderWidth: 1,
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_REGULAR,
    fontSize: responsiveScale(24),
    height: perfectSize(55),
    justifyContent: 'center',
    lineHeight: perfectSize(50),
    textAlign: 'center',
    marginVertical: 20,
    width: perfectSize(55),
    fontWeight: FONT_WEIGHT_MEDIUM,
    includeFontPadding: false,
  },
  focusCell: {
    borderColor: color.LIGHT_GREEN,
  },
});

export const MyCodeField = ({
  isArabic,
  value,
  onChangeText,
  cellCount,
  ...rest
}) => {
  const ref = useBlurOnFulfill({value, cellCount});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChangeText,
  });

  return (
    <CodeField
      ref={ref}
      {...props}
      {...rest}
      value={value}
      onChangeText={data => {
        onChangeText(data);
      }}
      cellCount={cellCount}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      //   returnKeyType={'done'}
      onSubmitEditing={() => Keyboard.dismiss()}
      caretHidden={false}
      renderCell={({index, symbol, isFocused}) => (
        <Text
          key={index}
          style={[
            styles.cell,
            isFocused && styles.focusCell,
            {transform: [{scaleX: isArabic ? -1 : 1}]},
          ]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};
