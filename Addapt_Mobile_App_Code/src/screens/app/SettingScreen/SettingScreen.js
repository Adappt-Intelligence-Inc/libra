import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';

const SettingScreen = ({navigation, route}) => {
  const deviceName = route?.params?.deviceName;
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={deviceName + ' Settings'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryItem
          DeviceName={'Notifications'}
          extraItemViewStyle={styles.extraItemStyle}
          isDisabled
          onPress={() => {
            navigation.navigate('Notifications');
          }}
          isRightIcon={true}
        />

        <CategoryItem
          DeviceName={'Event Recording'}
          extraItemViewStyle={styles.extraItemStyle}
          isDisabled
          onPress={() => {
            navigation.navigate('EventRecording');
          }}
          isRightIcon={true}
        />

        {/* <CategoryItem
          DeviceName={'Familiar Faces'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {
            // navigation.navigate('FamilyFacesScreen');
          }}
          isRightIcon={true}
        /> */}

        <CategoryItem
          DeviceName={'Schedules & Automations'}
          extraItemViewStyle={styles.extraItemStyle}
          isDisabled
          onPress={() => {
            navigation.navigate('SchedulesAutomation');
          }}
          isRightIcon={true}
        />
        <CategoryItem
          DeviceName={'Sharing'}
          extraItemViewStyle={styles.extraItemStyle}
          isDisabled
          onPress={() => {
            navigation.navigate('SharingScreen');
          }}
          isRightIcon={true}
        />
      </ScrollView>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  extraItemViewStyle: {
    marginBottom: 12,
    backgroundColor: color.GREEN,
    marginTop: 20,
  },
  extraItemStyle: {marginTop: 12, opacity: 0.5},
});
