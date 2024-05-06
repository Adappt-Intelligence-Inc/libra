import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import Check from '../assets/appImages/Check.svg';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_MEDIUM} from '../styles/typography';

const customStyles = {
  stepIndicatorSize: responsiveScale(30),
  currentStepIndicatorSize: responsiveScale(30),
  separatorStrokeWidth: responsiveScale(2),
  currentStepStrokeWidth: responsiveScale(3),
  stepStrokeCurrentColor: color.LIGHT_BLUE,
  stepStrokeWidth: responsiveScale(3),
  stepStrokeFinishedColor: color.GREEN,
  stepStrokeUnFinishedColor: color.LIGHT_GRAY,
  separatorFinishedColor: color.GREEN,
  separatorUnFinishedColor: color.LIGHT_GRAY,
  stepIndicatorFinishedColor: color.GREEN,
  stepIndicatorUnFinishedColor: color.LIGHT_GRAY,
  stepIndicatorCurrentColor: color.WHITE,
  stepIndicatorLabelFontSize: responsiveScale(13),
  currentStepIndicatorLabelFontSize: responsiveScale(13),
  stepIndicatorLabelCurrentColor: color.LIGHT_BLUE,
  stepIndicatorLabelFinishedColor: color.WHITE,
  stepIndicatorLabelUnFinishedColor: color.WHITE,
  // labelColor: '#999999',
  // labelSize: 13,
  // currentStepLabelColor: color.LIGHT_BLUE,
};

export const Stepper = ({currentPosition = 0}) => {
  function renderStepIndicator(stepPosition) {
    return stepPosition.stepStatus === 'finished' ? (
      <View style={styles.icon}>
        <Check height={'100%'} width={'100%'} />
      </View>
    ) : (
      <Text
        style={[
          styles.text,
          stepPosition.stepStatus === 'current' && {color: color.LIGHT_BLUE},
        ]}>
        {stepPosition.position + 1}
      </Text>
    );
  }
  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={[]}
        stepCount={5}
        renderStepIndicator={stepPosition => renderStepIndicator(stepPosition)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: color.WHITE},
  text: {
    color: color.WHITE,
    fontSize: responsiveScale(13),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  icon: {
    height: responsiveScale(25),
    aspectRatio: 1,
  },
});
