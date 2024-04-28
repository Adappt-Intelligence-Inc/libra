import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';

const EventRecording = ({navigation}) => {
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Event Recording'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <Text style={styles.textStyle}>Record an event with camera</Text>

        <CategoryItem
          DeviceName={'People detection'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />

        <CategoryItem
          DeviceName={'Package detection'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />

        <CategoryItem
          DeviceName={'Pet detection'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />

        <CategoryItem
          DeviceName={'Vehicle detection'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />
        <CategoryItem
          DeviceName={'Face recognition'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />
      </ScrollView>
    </View>
  );
};

export default EventRecording;

const styles = StyleSheet.create({
  extraItemViewStyle: {
    marginBottom: 12,
    backgroundColor: color.GREEN,
    marginTop: 20,
  },
  extraItemStyle: {marginTop: 12},
  scrollView: {
    marginTop: 10,
  },
  textStyle: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_REGULAR,
    color: color.DARK_GRAY,
    marginTop: 10,
  },
});
