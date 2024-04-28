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

const Notifications = ({navigation}) => {
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Notifications'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <CategoryItem
          DeviceName={'Notification'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />
        <Text style={styles.textStyle}>
          Notify me when an event is recorded
        </Text>
        <CategoryItem
          DeviceName={'Adappt Ai detection'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />

        <CategoryItem
          DeviceName={'All other motion'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />

        <CategoryItem
          DeviceName={'Sound'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {}}
          isSwitchVisible={true}
          isDisabled={true}
        />
      </ScrollView>
    </View>
  );
};

export default Notifications;

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
    marginTop: 25,
  },
});
