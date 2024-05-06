import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import React, {useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import Camera from '../../../assets/appImages/Camera.svg';
import PlusIcon from '../../../assets/appImages/PlusIcon.svg';
import PlusIconGray from '../../../assets/appImages/PlusIconGray.svg';
import Minus from '../../../assets/appImages/Minus.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import Close from '../../../assets/appImages/Close.svg';
import {color} from '../../../config/color';
import {CommonStyle} from '../../../config/styles';
import {WINDOW_WIDTH, responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import Button from '../../../components/Button';
import BatteryCamera from '../../../assets/appImages/BatteryCamera.svg';
import Floodlight from '../../../assets/appImages/Floodlight.svg';
import Camera6 from '../../../assets/appImages/Camera6.svg';
import HomeSecurity from '../../../assets/appImages/HomeSecurity.svg';
import PanTilt from '../../../assets/appImages/PanTilt.svg';
import VideoDoorbell from '../../../assets/appImages/VideoDoorbell.svg';

const AddCameraDevice = ({navigation, route}) => {
  const numColumn = 2;
  const space = 20;
  const Total = (WINDOW_WIDTH - (numColumn + 1) * space) / numColumn;
  const defaultLocation = route?.params?.location;

  const [checkedItems, setCheckedItems] = useState({1: true});
  const [itemCounts, setItemCounts] = useState({1: 1});
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const Cameras = [
    {id: '1', name: 'Fixed Camera', image: <Camera />},
    {id: '2', name: 'Video Doorbell', image: <VideoDoorbell />},
    {id: '3', name: 'Pan tilt', image: <PanTilt />},
    {id: '4', name: 'Floodlight camera', image: <Floodlight />},
    {id: '5', name: 'Home Security System', image: <HomeSecurity />},
    {id: '6', name: 'Battery camera', image: <BatteryCamera />},
  ];

  const handleCheckboxChange = itemId => {
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [itemId]: !prevCheckedItems[itemId],
    }));
    if (!checkedItems[itemId]) {
      handleIncrementCount(itemId);
    } else {
      handleDecrementCount(itemId);
    }
  };

  const handleIncrementCount = itemId => {
    setItemCounts(prevCounts => ({
      ...prevCounts,
      [itemId]: (prevCounts[itemId] || 0) + 1,
    }));
  };

  const handleDecrementCount = itemId => {
    if (itemCounts[itemId] > 0) {
      setItemCounts(prevCounts => ({
        ...prevCounts,
        [itemId]: prevCounts[itemId] - 1,
      }));
    }
  };

  const renderItem = ({item}) => (
    <View style={[CommonStyle.flex]}>
      <TouchableOpacity
        disabled
        onPress={() => {
          handleCheckboxChange(item?.id);
        }}
        style={[
          styles.itemContainer,
          CommonStyle.shadow,
          {
            width: Total,
            marginLeft: space,
            borderColor: checkedItems[item.id]
              ? color.LIGHT_GREEN
              : color.LIGHT_GRAY_3,
          },
        ]}>
        <View style={styles.itemHeight}>
          <View style={styles.cameraBackground}>{item.image}</View>
          <TouchableOpacity
            style={styles.checkboxButton}
            disabled={item?.id != 1 && true}
            onPress={() => {
              console.log(item?.id);
              handleCheckboxChange(item?.id);
            }}>
            {checkedItems[item?.id] ? <CheckBox /> : <CheckBoxBlank />}
          </TouchableOpacity>

          <Text style={styles.itemText}>{item?.name}</Text>
        </View>
        <View style={styles.countContainer}>
          <TouchableOpacity
            style={styles.minusIcon}
            onPress={() => {
              handleDecrementCount(item?.id);
            }}
            disabled={!checkedItems[item?.id]}
            hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}>
            <Minus />
          </TouchableOpacity>
          <Text style={styles.itemCountText}>
            {checkedItems[item?.id] ? itemCounts[item?.id] || 0 : 0}
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleIncrementCount(item?.id);
            }}
            disabled={!checkedItems[item?.id]}>
            {checkedItems[item?.id] ? <PlusIcon /> : <PlusIconGray />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <>
      <View style={CommonStyle.sectionContainer}>
        <CustomHeader
          title={defaultLocation?.location}
          isBackBtnVisible={true}
          isNextBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
          onNextBtnPress={() => {
            // toggleModal();
            const selectedItems = Cameras.filter(item => checkedItems[item.id]);
            const selectedItemsWithCounts = selectedItems.map(item => ({
              ...item,
              count: itemCounts[item.id] || 0,
            }));
            console.log('selectedItems', selectedItemsWithCounts);
            navigation.navigate('AddSetUpDevice', {
              selectedItems: selectedItemsWithCounts,
              location: defaultLocation,
            });
          }}
        />
        <View style={styles.titlePadding}>
          <Text style={CommonStyle.sectionTitle}>Select Devices</Text>
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={Cameras}
          renderItem={renderItem}
          style={{marginRight: space}}
          numColumns={numColumn}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        style={CommonStyle.modelContainerStyle}
        onBackdropPress={() => {
          setModalVisible(false);
        }}>
        <View style={CommonStyle.modalContentStyle}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Camera6 />
          <Button
            name={'Add Device'}
            extraBtnViewStyle={styles.addManuallyText}
            onPress={() => {
              const selectedItems = Cameras.filter(
                item => checkedItems[item.id],
              );
              const selectedItemsWithCounts = selectedItems.map(item => ({
                ...item,
                count: itemCounts[item.id] || 0,
              }));
              console.log('selectedItems', selectedItemsWithCounts);
              navigation.navigate('AddSetUpDevice', {
                selectedItems: selectedItemsWithCounts,
                location: defaultLocation,
              });
              setModalVisible(false);
            }}
            extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          />
        </View>
      </Modal>
    </>
  );
};

export default AddCameraDevice;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: color.WHITE},
  itemContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: color.WHITE,
  },
  itemCountContainer: {
    backgroundColor: color.LIGHT_GRAY_4,
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCountText: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(12),
    color: color.DARK_GRAY_5,
  },
  itemText: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_BOLD,
    textAlign: 'center',
    paddingTop: 10,
    color: color.DARK_GRAY_5,
  },
  cameraBackground: {
    backgroundColor: color.LIGHT_GRAY_3,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkboxButton: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  countContainer: {
    backgroundColor: color.LIGHT_GRAY_4,
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  btnNameStyle: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
  },
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    marginTop: 10,
  },
  deviceTitle: {
    fontSize: responsiveScale(18),
    paddingTop: 20,
    paddingBottom: 10,
    width: '80%',
    textAlign: 'center',
  },
  titlePadding: {paddingTop: 30, paddingBottom: 15},
  itemHeight: {height: 150},
  minusIcon: {paddingLeft: 8},
  addManuallyText: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: color.GREEN,
  },
});
