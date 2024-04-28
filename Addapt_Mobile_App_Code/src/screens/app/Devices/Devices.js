import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import CarotDown from '../../../assets/appImages/CarotDown.svg';
import MoreBlack from '../../../assets/appImages/MoreBlack.svg';
import GreenEdit from '../../../assets/appImages/GreenEdit.svg';
import RightOutline from '../../../assets/appImages/RightOutline.svg';
import ConnectedHome from '../../../assets/appImages/ConnectedHome.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import AddLocation from '../../../assets/appImages/AddLocation.svg';
import Power from '../../../assets/appImages/Power.svg';
import Sensors from '../../../assets/appImages/Sensors.svg';
import RedDelete from '../../../assets/appImages/RedDelete.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import CustomCameraItem from '../../../components/CustomCameraItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  addLocation,
  deleteDevice,
  deleteLocation,
  getDevicesList,
  getLocationList,
  updateLocation,
} from '../../../resources/baseServices/auth';
import {
  setDevicesListAction,
  setLocationAction,
} from '../../../store/devicesReducer';
import {perfectSize} from '../../../styles/theme';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';
import _ from 'lodash';
import {CustomeToast} from '../../../components/CustomeToast';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Devices = ({navigation}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const locationList = useSelector(state => state?.devices?.locationList ?? []);
  const [isExpand, setIsExpand] = useState(0);
  const [editable, setEditable] = useState(-1);
  const [deleteLocationModal, setDeleteLocationModal] = useState(-1);
  const [deleteDeviceModal, setDeleteDeviceModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [addLocationModal, setAddLocationModal] = useState(false);
  const [value, setValue] = useState('');
  const [location, setLocation] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState([0]);

  useEffect(() => {
    if (locationList.length > 0) {
      for (var i = 0; i < locationList.length; i++) {
        const data = devicesList.find(
          c => c.deviceLocation === locationList[i]._id,
        );
        if (data) {
          setExpandedItems([i]);
          break;
        }
      }
    }
  }, [devicesList]);

  const AnimationIn = {
    duration: 500,
    create: {
      duration: 500,
      type: LayoutAnimation.Types.easeIn,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeIn,
    },
  };

  const AnimationOut = {
    duration: 500,
    create: {
      duration: 500,
      type: LayoutAnimation.Types.easeOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeOut,
    },
  };

  const onPressItem = id => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (isExpand === id) {
      LayoutAnimation.configureNext(AnimationOut);
      setIsExpand(-1);
    } else {
      LayoutAnimation.configureNext(AnimationIn);
      setIsExpand(id);
    }
  };
  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getAllLocation();
        getAllDevice();
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const getAllDevice = async () => {
    try {
      const getList = await getDevicesList(userDetails?.email);
      console.log('getList', getList);
      const AddedDevice = getList.data.data;
      if (AddedDevice.length > 0) {
        dispatch(setDevicesListAction(AddedDevice));
      } else {
        dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      dispatch(setDevicesListAction([]));
    }
  };

  const defaultAddLocation = async () => {
    const data = {
      email: userDetails.email,
      location: 'My Home',
    };
    try {
      const res = await addLocation(data);
      if (res?.status === 200) {
        setExpandedItems([locationList.length]);
        getAllLocation();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log('error-->', error?.response);
      }
    }
  };

  const toggleItemExpansion = itemId => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter(recordID => recordID !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const renderItem = ({item, index, disable}) => {
    return item._id === 'static' ? (
      <CustomCameraItem
        isNotConnected
        extraItemViewStyle={styles.cameraItem}
        disable={disable}
        onPress={() => {
          // navigation.navigate('AddCameraDevice', {
          //   location: locationList[index],
          // });
          // navigation.navigate('WifiScan', {
          //   location: locationList[index],
          // });
          navigation.navigate('ScanDevice', {
            location: locationList[index],
          });
        }}
      />
    ) : (
      <CustomCameraItem
        isConnected
        title={item?.deviceDetails?.name}
        extraItemViewStyle={styles.cameraItem}
        disable={disable}
        onEventSelect={() => {
          navigation.navigate('Events', {response: item});
        }}
        onDeleteDevice={() => {
          setSelectedDevice(item);
          setDeleteDeviceModal(true);
        }}
        onPress={() => {
          navigation.navigate('CameraView', {
            response: item,
            isLive: true,
          });
        }}
      />
    );
  };
  const renderSensorItem = ({item, index, disable}) =>
    item._id === 'static' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={disable}
        style={[
          styles.notConnectedContainer,
          disable && {backgroundColor: color.LIGHT_GRAY_3},
        ]}
        onPress={() => {
          // onPress();
        }}>
        {/* <View style={styles.camera2Icon}> */}
        <Sensors />
        {/* </View> */}
      </TouchableOpacity>
    ) : null;

  const renderConnectedHomeItem = ({item, index, disable}) =>
    item._id === 'static' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={disable}
        style={[
          styles.notConnectedContainer,
          disable && {backgroundColor: color.LIGHT_GRAY_3},
        ]}
        onPress={() => {
          // onPress();
        }}>
        {/* <View style={styles.camera2Icon}> */}
        <ConnectedHome />
        {/* </View> */}
      </TouchableOpacity>
    ) : null;
  const renderPowerItem = ({item, index, disable}) =>
    item._id === 'static' ? (
      <TouchableOpacity
        activeOpacity={1}
        disabled={disable}
        style={[
          styles.notConnectedContainer,
          disable && {backgroundColor: color.LIGHT_GRAY_3},
        ]}
        onPress={() => {
          // onPress();
        }}>
        {/* <View style={styles.camera2Icon}> */}
        <Power />
        {/* </View> */}
      </TouchableOpacity>
    ) : null;
  const staticItem = {_id: 'static', text: 'Static Component'};

  const lanesToFetch = [
    {
      stateName: devicesList[0]?.deviceDetails?.location,
      lastEvaluatedKey: '',
      lastEvaluatedSortKey: '',
    },
  ];

  const onEditDone = () => {
    setEditable(-1);
  };
  const getAllLocation = async () => {
    try {
      const getList = await getLocationList(userDetails?.email);
      const locations = getList.data.data;
      if (locations.length > 0) {
        dispatch(setLocationAction(locations));
      } else {
        defaultAddLocation();
        dispatch(setLocationAction([]));
      }
    } catch (error) {
      console.log('ee', error);
      defaultAddLocation();
      dispatch(setLocationAction([]));
    }
  };

  const onPressAddLocation = async () => {
    setLocationLoading(true);
    const data = {
      email: userDetails.email,
      location: location,
    };
    try {
      const res = await addLocation(data);

      if (res?.status === 200) {
        console.log('res---->', res);
        setLocationLoading(false);
        setAddLocationModal(false);
        CustomeToast({type: 'success', message: res?.data?.msg});
        setExpandedItems([locationList.length]);
        setLocation('');
        getAllLocation();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log('error-->', error?.response);
        setLocationLoading(false);
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  const onPressUpdateLocation = async item => {
    const data = {
      deviceLocationId: item._id,
      email: userDetails.email,
      location: value,
    };
    try {
      const res = await updateLocation(data);
      if (res?.status === 200) {
        console.log('res---->', res);
        CustomeToast({type: 'success', message: res?.data?.msg});
        setEditable(-1);
        getAllLocation();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log('error-->', error?.response);
        setEditable(-1);
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  const onPressDeleteLocation = async () => {
    setLocationLoading(true);
    const data = {
      deviceLocationId: locationList[deleteLocationModal]._id,
      email: userDetails.email,
    };
    try {
      const res = await deleteLocation(data);

      if (res?.status === 200) {
        console.log('res---->', res);
        setLocationLoading(false);
        setDeleteLocationModal(-1);
        CustomeToast({type: 'success', message: res?.data?.msg});

        getAllLocation();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log('error-->', error?.response);
        setDeleteLocationModal(-1);
        setLocationLoading(false);
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  const onPressDeleteDevice = async () => {
    setLocationLoading(true);
    const data = {
      email: userDetails.email,
      deviceId: selectedDevice?._id,
    };
    try {
      const res = await deleteDevice(data);

      if (res?.status === 200) {
        console.log('res---->', res);
        setLocationLoading(false);
        setDeleteDeviceModal(false);
        CustomeToast({type: 'success', message: res?.data?.msg});
        getAllDevice();
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        console.log('error-->', error?.response);
        setDeleteDeviceModal(false);
        setLocationLoading(false);
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  return (
    <View style={[CommonStyle.flex]}>
      <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
        <CustomHeader
          title={'Devices'}
          isExtraIconVisible
          extraIcon={<AddLocation />}
          onExtraIconPress={() => setAddLocationModal(true)}
          isDrawerIconVisible={true}
          onBarIconPress={() => {
            navigation.openDrawer();
          }}
          extraTitleStyle={{flex: 0}}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {locationList.map((item, index) => {
            const isExpanded = expandedItems.includes(index);
            return (
              <View key={index} style={{marginTop: 20}}>
                <TouchableOpacity
                  style={[
                    styles.renderMainView,
                    isExpanded && {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  ]}
                  onPress={() => {
                    // onPressItem(index);
                    toggleItemExpansion(index);
                  }}
                  activeOpacity={0.7}>
                  <View style={styles.titleTextView}>
                    {editable === index ? (
                      <TextInputField
                        value={value}
                        onchangeText={value => {
                          setValue(value);
                        }}
                        placeholder={'Location'}
                        placeholderTextColor={color.DARK_GRAY}
                        extraInputViewStyle={styles.textInputWidth}
                        extraTextInputStyle={styles.textInputWidth}
                        extraMainViewStyle={{paddingHorizontal: 0}}
                      />
                    ) : (
                      <Text style={styles.mainTitleTextStyle}>
                        {item.location}
                      </Text>
                    )}

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {editable === index ? (
                        <TouchableOpacity
                          style={[
                            styles.iconContainer,
                            {margin: perfectSize(7)},
                          ]}
                          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
                          onPress={() => onPressUpdateLocation(item)}>
                          <RightOutline height={'100%'} width={'100%'} />
                        </TouchableOpacity>
                      ) : (
                        <Menu style={{zIndex: 1}}>
                          <MenuTrigger
                            style={{
                              padding: perfectSize(7),
                            }}>
                            <MoreBlack />
                          </MenuTrigger>
                          <MenuOptions customStyles={styles.menuStyles}>
                            <MenuOption
                              style={styles.menuContainer}
                              onSelect={() => {
                                setValue(item.location);
                                setEditable(index);
                              }}>
                              <View style={styles.menuIcom}>
                                <GreenEdit height={'100%'} width={'100%'} />
                              </View>
                              <Text style={styles.sectionTitle}>Edit</Text>
                            </MenuOption>
                            <MenuOption
                              style={styles.menuContainer}
                              onSelect={() => {
                                setDeleteLocationModal(index);
                              }}>
                              <View style={styles.menuIcom}>
                                <RedDelete height={'100%'} width={'100%'} />
                              </View>
                              <Text
                                style={[
                                  styles.sectionTitle,
                                  {color: color.RED},
                                ]}>
                                Delete
                              </Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      )}
                      <View
                        style={[
                          styles.iconContainer,
                          isExpanded && {
                            transform: [{rotate: '180deg'}],
                          },
                        ]}>
                        <CarotDown height={'100%'} width={'100%'} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {isExpanded && <View style={styles.seperatorView} />}
                {isExpanded && (
                  <View style={styles.expandView}>
                    <Text style={styles.sectionTitle}>Cameras</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}>
                      <FlatList
                        data={[
                          ..._.filter(devicesList, {
                            deviceLocation: item._id,
                          }),
                          staticItem,
                        ]}
                        renderItem={({item}) =>
                          renderItem({item, index, disable: false})
                        }
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={{marginBottom: 20}}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                      />
                    </View>
                    <Text
                      style={[styles.sectionTitle, {color: color.DARK_GRAY_3}]}>
                      Sensors
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}>
                      <FlatList
                        data={[staticItem]}
                        renderItem={({item, index}) =>
                          renderSensorItem({item, index, disable: true})
                        }
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={{marginBottom: 20}}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                      />
                    </View>
                    <Text
                      style={[styles.sectionTitle, {color: color.DARK_GRAY_3}]}>
                      Connected home
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}>
                      <FlatList
                        data={[staticItem]}
                        renderItem={({item, index}) =>
                          renderConnectedHomeItem({item, index, disable: true})
                        }
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={{marginBottom: 20}}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                      />
                    </View>
                    <Text
                      style={[styles.sectionTitle, {color: color.DARK_GRAY_3}]}>
                      Power & lighting
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}>
                      <FlatList
                        data={[staticItem]}
                        renderItem={({item, index}) =>
                          renderPowerItem({item, index, disable: true})
                        }
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
          <View style={{height: 30}} />
        </ScrollView>
        {/* <View style={styles.deviceContainer}>
        <View style={[CommonStyle.row, styles.viewPadding]}>
          <Text style={CommonStyle.sectionTitle}>
            {devicesList[0]?.deviceDetails?.location}
          </Text>
        </View>
        <View style={styles.divider} />
        <ScrollView
          style={[styles.viewPadding]}
          showsVerticalScrollIndicator={false}>
          <Text style={CommonStyle.sectionTitle}>Cameras</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <FlatList
              data={[...devicesList, staticItem]}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
            />
          </View>
          <Text style={[CommonStyle.sectionTitle, styles.titlePadding]}>
            Sensors
          </Text>
          <View style={CommonStyle.row}>
            <CustomCameraItem
              isConnected
              title={'Stair area'}
              extraItemViewStyle={styles.cameraItem}
              onEventSelect={() => {
                navigation.navigate('Events');
              }}
            />
            <CustomCameraItem
              isConnected
              title={'Kitchen'}
              extraItemViewStyle={styles.cameraItem}
              onEventSelect={() => {
                navigation.navigate('Events');
              }}
            />
          </View>
          <CustomCameraItem
            isNotConnected
            extraItemViewStyle={styles.cameraItem}
            onPress={() => {
              navigation.navigate('AddDevice');
            }}
          />
          <Text style={[CommonStyle.sectionTitle, styles.titlePadding]}>
            Connected home
          </Text>
          <View style={[CommonStyle.row, styles.padding]}>
            <CustomCameraItem
              isConnected
              title={'Baby room'}
              extraItemViewStyle={styles.cameraItem}
              onEventSelect={() => {
                navigation.navigate('Events');
              }}
            />
            <CustomCameraItem
              isNotConnected
              extraItemViewStyle={styles.cameraItem}
              onPress={() => {
                navigation.navigate('AddDevice');
              }}
            />
          </View>
        </ScrollView>
      </View> */}
      </View>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={deleteLocationModal !== -1}
        onBackdropPress={() => setDeleteLocationModal(-1)}>
        <View style={CommonStyle.modalContentStyle}>
          <View style={styles.modalIcon}>
            <RedDelete height={'100%'} width={'100%'} />
          </View>
          <Text
            style={[
              styles.mainTitleTextStyle,
              {marginVertical: 10, fontSize: responsiveScale(18)},
            ]}>
            Delete Location?
          </Text>
          <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>
            If you delete this location you will lose all data associated with
            this camera.
          </Text>
          <View style={CommonStyle.row}>
            <Button
              name={'Delete'}
              extraBtnViewStyle={[styles.btnViewStyle, {marginRight: 20}]}
              extraBtnNameStyle={{
                fontSize: responsiveScale(14),
                color: color.GREEN,
              }}
              loadColor={color.GREEN}
              isLoading={locationLoading}
              disabled={locationLoading}
              onPress={() => {
                onPressDeleteLocation();
              }}
            />
            <Button
              name={'Cancel'}
              extraBtnViewStyle={styles.extraBtnViewStyle}
              extraBtnNameStyle={{fontSize: responsiveScale(14)}}
              onPress={() => {
                setDeleteLocationModal(-1);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={deleteDeviceModal}
        onBackdropPress={() => setDeleteDeviceModal(false)}>
        <View style={CommonStyle.modalContentStyle}>
          <View style={styles.modalIcon}>
            <RedDelete height={'100%'} width={'100%'} />
          </View>
          <Text
            style={[
              styles.mainTitleTextStyle,
              {marginVertical: 10, fontSize: responsiveScale(18)},
            ]}>
            Delete Device?
          </Text>
          <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>
            Are you sure you want to delete
          </Text>
          <Text style={[styles.sectionTitleGreen, {textAlign: 'center'}]}>
            {selectedDevice?.deviceDetails?.name}?
          </Text>
          <View style={CommonStyle.row}>
            <Button
              name={'Delete'}
              extraBtnViewStyle={[styles.btnViewStyle, {marginRight: 20}]}
              extraBtnNameStyle={{
                fontSize: responsiveScale(14),
                color: color.GREEN,
              }}
              loadColor={color.GREEN}
              isLoading={locationLoading}
              disabled={locationLoading}
              onPress={() => {
                onPressDeleteDevice();
              }}
            />
            <Button
              name={'Cancel'}
              extraBtnViewStyle={styles.extraBtnViewStyle}
              extraBtnNameStyle={{fontSize: responsiveScale(14)}}
              onPress={() => {
                setDeleteDeviceModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={addLocationModal}
        onBackdropPress={() => setAddLocationModal(false)}>
        <View style={CommonStyle.modalContentStyle}>
          <View
            style={[
              styles.modalIcon,
              {borderRadius: 30, backgroundColor: color.GREEN, padding: 7},
            ]}>
            <AddLocation height={'100%'} width={'100%'} />
          </View>
          <Text
            style={[
              styles.mainTitleTextStyle,
              {marginVertical: 10, fontSize: responsiveScale(18)},
            ]}>
            Add New Location
          </Text>
          <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>
            Enter a sweet name for your home
          </Text>
          <TextInputField
            value={location}
            onchangeText={value => {
              setLocation(value);
            }}
            placeholder={'Home Name *'}
            icon={<EmailIcon />}
            placeholderTextColor={color.DARK_GRAY}
            extraInputViewStyle={styles.locationTextInputWidth}
          />
          <Button
            name={'Save'}
            extraBtnViewStyle={styles.extraBtnViewStyle}
            extraBtnNameStyle={{fontSize: responsiveScale(14)}}
            isLoading={locationLoading}
            disabled={locationLoading}
            onPress={() => {
              onPressAddLocation();
              // onResetBtnPress();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Devices;

const styles = StyleSheet.create({
  deviceContainer: {
    flex: 1,
    backgroundColor: color.LIGHT_GRAY_4,
    borderRadius: 8,
    marginVertical: 20,
  },
  menuOptions: {
    optionsContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: color.LIGHT_GRAY_5,
      shadowColor: 'white',
      width: 150,
      marginTop: 20,
    },
  },
  menuText: {color: color.DARK_GRAY, padding: 5},
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: color.LIGHT_GRAY_3,
  },
  cameraItem: {
    width: '47%',
    marginTop: 10,
  },
  extraBtnViewStyle: {width: '40%', marginTop: 30},
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    width: '40%',
    marginTop: 30,
  },
  titlePadding: {paddingTop: 20},
  viewPadding: {padding: 20},
  padding: {paddingBottom: 30},
  notConnectedContainer: {
    height: perfectSize(90),
    width: '47%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
  camera2Icon: {
    height: responsiveScale(24),
    width: responsiveScale(28),
  },
  menuStyles: {
    optionsContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: color.LIGHT_GRAY_5,
      shadowColor: 'white',
      width: 150,
      marginTop: 20,
    },
  },
  menuOptionText: {color: color.DARK_GRAY, padding: 5},
  iconContainer: {
    height: 24,
    width: 24,
    // marginLeft: 10,
  },
  menuIcom: {
    height: 22,
    width: 22,
    marginRight: 5,
  },
  modalIcon: {
    height: 50,
    width: 50,
  },
  menuContainer: {flexDirection: 'row', alignItems: 'center', height: 45},
  sectionTitle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  sectionTitleGreen: {
    color: color.GREEN,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  seperatorView: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: color.LIGHT_GRAY_3,
    height: 1,
  },
  renderMainView: {
    backgroundColor: color.LIGHT_GRAY_4,
    width: '100%',
    justifyContent: 'center',
    height: perfectSize(50),
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  titleTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subRenderMainView: {
    backgroundColor: color.LIGHT_GRAY_4,
    width: '100%',
    alignSelf: 'center',
    // paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTitleText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 15,
    textTransform: 'capitalize',
    // fontFamily: font.medium,
    includeFontPadding: false,
  },
  descriptionText: {
    color: 'grey',
    fontWeight: '400',
    fontSize: 13,
    // fontFamily: font.regular,
    textTransform: 'capitalize',
    includeFontPadding: false,
  },
  mainTitleTextStyle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    textTransform: 'capitalize',
  },
  expandView: {
    backgroundColor: color.LIGHT_GRAY_4,
    width: '100%',
    alignSelf: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 20,
  },
  nameAndLostView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lostView: {
    backgroundColor: 'rgba(236, 57, 57, 0.04)',
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 8,
    paddingHorizontal: 7,
    borderColor: color.RED,
  },
  lostText: {
    color: color.RED,
    fontWeight: '400',
    fontSize: 12,
    // fontFamily: font.regular,
    includeFontPadding: false,
    textTransform: 'capitalize',
  },
  textInputWidth: {
    width: '70%',
    height: 40,
    paddingVertical: 0,
  },
  locationTextInputWidth: {
    width: '90%',
    marginTop: 20,
  },
});
