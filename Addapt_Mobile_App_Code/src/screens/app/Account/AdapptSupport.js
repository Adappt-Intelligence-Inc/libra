import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';

const AdapptSupport = ({navigation}) => {
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Adappt support'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
        <CategoryItem
          DeviceName={'Help center'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {
            // navigation.navigate('Notifications');
          }}
          isRightIcon={true}
        />

        <CategoryItem
          DeviceName={'Begin troubleshooting'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {
            // navigation.navigate('EventRecording');
          }}
          isRightIcon={true}
        />

        <CategoryItem
          DeviceName={'Submit a log'}
          extraItemViewStyle={styles.extraItemStyle}
          onPress={() => {
            // navigation.navigate('FamilyFacesScreen');
          }}
          isRightIcon={true}
        />
      </ScrollView>
    </View>
  );
};

export default AdapptSupport;

const styles = StyleSheet.create({
  extraItemViewStyle: {
    marginBottom: 12,
    backgroundColor: color.GREEN,
    marginTop: 20,
  },
  extraItemStyle: {marginTop: 12},
});
