import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import CustomType from '../../../components/CustomType';
import HomeWhite from '../../../assets/appImages/HomeWhite.svg';
import HomeIcon from '../../../assets/appImages/Home.svg';
import Location from '../../../assets/appImages/Location.svg';
import LocationWhite from '../../../assets/appImages/LocationWhite.svg';
import Building from '../../../assets/appImages/Building.svg';
import BuildingWhite from '../../../assets/appImages/BuildingWhite.svg';
import {color} from '../../../config/color';
import CategoryItem from '../../../components/CategoryItem';
import {CommonStyle} from '../../../config/styles';
import {useSelector} from 'react-redux';

const AddDevice = ({navigation, route}) => {
  const authToken = useSelector(state => state.auth?.authToken);
  const devices = useSelector(state => state.devices?.devices ?? '');
  const [selectedItem, setSelectedItem] = useState('Home');
  const defaultLocation = route?.params?.location;

  const handleItemPress = itemName => {
    if (selectedItem === itemName) {
      setSelectedItem(itemName);
    } else {
      setSelectedItem(itemName);
    }
  };
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Add devices'}
        isBackBtnVisible={devices ? true : false}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      {/* <View style={styles.titlePadding}>
        <Text style={CommonStyle.sectionTitle}>Select Location Type</Text>
      </View> */}
      {/* <View style={styles.sectionType}>
        <CustomType
          name={'Home'}
          icon={selectedItem === 'Home' ? <HomeWhite /> : <HomeIcon />}
          onPress={() => handleItemPress('Home')}
          extraContainerStyle={{
            backgroundColor:
              selectedItem === 'Home' ? color.GREEN : color.WHITE,
            width: '30%',
          }}
          extraNameStyle={{
            color: selectedItem === 'Home' ? color.WHITE : color.DARK_GRAY,
          }}
        />
        <CustomType
          name={'Office'}
          icon={selectedItem === 'Office' ? <BuildingWhite /> : <Building />}
          onPress={() => handleItemPress('Office')}
          extraContainerStyle={{
            backgroundColor:
              selectedItem === 'Office' ? color.GREEN : color.WHITE,
            width: '30%',
          }}
          extraNameStyle={{
            color: selectedItem === 'Office' ? color.WHITE : color.DARK_GRAY,
          }}
        />
        <CustomType
          name={'Other'}
          icon={selectedItem === 'Other' ? <LocationWhite /> : <Location />}
          onPress={() => handleItemPress('Other')}
          extraContainerStyle={{
            backgroundColor:
              selectedItem === 'Other' ? color.GREEN : color.WHITE,
            width: '30%',
          }}
          extraNameStyle={{
            color: selectedItem === 'Other' ? color.WHITE : color.DARK_GRAY,
          }}
        />
      </View> */}
      {/* <View style={styles.devicePadding}>
        <Text style={CommonStyle.sectionTitle}>Devices</Text>
      </View> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.devicePadding}>
        <CategoryItem
          DeviceName={'Cameras'}
          extraItemViewStyle={styles.itemMargin}
          onPress={() => {
            navigation.navigate('AddCameraDevice', {location: defaultLocation});
          }}
          isRightIcon={true}
        />
        <CategoryItem
          DeviceName={'Sensors'}
          extraItemViewStyle={styles.itemMargin}
          isRightIcon={true}
        />
        <CategoryItem
          DeviceName={'Power & lighting'}
          extraItemViewStyle={styles.itemMargin}
          isRightIcon={true}
        />
        <CategoryItem
          DeviceName={'Home'}
          extraItemViewStyle={styles.itemMargin}
          isRightIcon={true}
        />
        <CategoryItem
          DeviceName={'Lifestyle'}
          extraItemViewStyle={styles.itemMargin}
          isRightIcon={true}
        />
      </ScrollView>
    </View>
  );
};

export default AddDevice;

const styles = StyleSheet.create({
  sectionType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  titlePadding: {paddingTop: 30, paddingBottom: 15},
  devicePadding: {paddingTop: 30},
  itemMargin: {marginBottom: 15},
});
