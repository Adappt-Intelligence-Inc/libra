import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import SoundOutlineIcon from '../../../assets/appImages/SoundOutlineIcon.svg';
import CarOutlineIcon from '../../../assets/appImages/CarOutlineIcon.svg';
import ProfileOutlineIcon from '../../../assets/appImages/ProfileOutlineIcon.svg';
import PetOutloneIcon from '../../../assets/appImages/PetOutloneIcon.svg';
import BoxOutlineIcon from '../../../assets/appImages/BoxOutlineIcon.svg';
import FaceOutlineIcon from '../../../assets/appImages/FaceOutlineIcon.svg';
import Camera from '../../../assets/appImages/Camera.svg';
import VideoDoorbell from '../../../assets/appImages/VideoDoorbell.svg';
import PanTilt from '../../../assets/appImages/PanTilt.svg';
import Floodlight from '../../../assets/appImages/Floodlight.svg';
import HomeSecurity from '../../../assets/appImages/HomeSecurity.svg';
import BatteryCamera from '../../../assets/appImages/BatteryCamera.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import Moon from '../../../assets/appImages/Moon.svg';
import SunRise from '../../../assets/appImages/SunRise.svg';
import Sun from '../../../assets/appImages/Sun.svg';
import SunSet from '../../../assets/appImages/SunSet.svg';
import Button from '../../../components/Button';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import TextInputField from '../../../components/TextInputField';
import {
  setCameraFilterAction,
  setDevicesListAction,
  setEventsFilterAction,
  setEventsTypesAction,
  setLocationAction,
  setLocationFilterAction,
  setTimeFilterAction,
} from '../../../store/devicesReducer';
import {useDispatch, useSelector} from 'react-redux';
import {
  addEventsToDevice,
  getDevicesList,
  getEventTypesList,
  getLocationList,
} from '../../../resources/baseServices/auth';
import {perfectSize} from '../../../styles/theme';
import {FONT_WEIGHT_BOLD, TTNORMSPRO_BOLD} from '../../../styles/typography';
import MultiDropdown from '../../../components/MultiDropdown';
import CustomDropdown from '../../../components/CustomDropdown';
import _ from 'lodash';

const FilterScreen = ({navigation, route}) => {
  const selectedEventFilter = useSelector(
    state => state?.devices?.eventFilterList ?? [],
  );
  const locationFilter = useSelector(
    state => state?.devices?.locationFilter ?? '',
  );
  const defaultTimeFilter = useSelector(
    state => state?.devices?.timeFilter ?? '',
  );
  const cameraFilter = useSelector(state => state?.devices?.cameraFilter ?? '');
  const [selectedEvent, setSelectedEvent] = useState(selectedEventFilter);
  const [selectedCamera, setSelectedCamera] = useState(cameraFilter);
  const [timeFilter, setTimeFilter] = useState(defaultTimeFilter);
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const eventTypesList = useSelector(
    state => state?.devices?.eventTypesList ?? [],
  );
  const [slectedLocation, setSelectedLocation] = useState(locationFilter);
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const locationList = useSelector(state => state?.devices?.locationList ?? []);

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

  const getAllLocation = async () => {
    try {
      const getList = await getLocationList(userDetails?.email);
      const locations = getList.data.data;
      if (locations.length > 0) {
        dispatch(setLocationAction(locations));
      } else {
        dispatch(setLocationAction([]));
      }
    } catch (error) {
      console.log('ee', error);
      dispatch(setLocationAction([]));
    }
  };

  const response = route?.params?.response;

  const Cameras = [
    {
      id: '1',
      name: 'Fixed Camera',
      image: <Camera height={'100%'} width={'100%'} />,
    },
    // {
    //   id: '2',
    //   name: 'Video Doorbell',
    //   image: <VideoDoorbell height={'100%'} width={'100%'} />,
    // },
    // {
    //   id: '3',
    //   name: 'Pan tilt',
    //   image: <PanTilt height={'100%'} width={'100%'} />,
    // },
    // {
    //   id: '4',
    //   name: 'Floodlight camera',
    //   image: <Floodlight height={'100%'} width={'100%'} />,
    // },
    // {
    //   id: '5',
    //   name: 'Home Security System',
    //   image: <HomeSecurity height={'100%'} width={'100%'} />,
    // },
    // {
    //   id: '6',
    //   name: 'Battery camera',
    //   image: <BatteryCamera height={'100%'} width={'100%'} />,
    // },
  ];

  const handleCheckBoxPress = eventName => {
    if (selectedEvent.includes(eventName)) {
      setSelectedEvent(selectedEvent.filter(event => event !== eventName));
    } else {
      setSelectedEvent([...selectedEvent, eventName]);
    }
  };
  const TimeZones = [
    {
      key: '12:00 AM to 06:00 AM',
      icon: <Moon height={'100%'} width={'100%'} />,
      startTime: 0,
      endTime: 6,
    },
    {
      key: '06:00 AM to 12:00 PM',
      icon: <SunRise height={'100%'} width={'100%'} />,
      startTime: 6,
      endTime: 12,
    },
    {
      key: '12:00 PM to 06:00 PM',
      icon: <Sun height={'100%'} width={'100%'} />,
      startTime: 12,
      endTime: 18,
    },
    {
      key: '06:00 PM to 12:00 AM',
      icon: <SunSet height={'100%'} width={'100%'} />,
      startTime: 18,
      endTime: 24,
    },
  ];

  const onSelectTimeFilter = item => {
    if (item === timeFilter) {
      setTimeFilter('');
    } else {
      setTimeFilter(item);
    }
  };

  const handleCameraCheckBoxPress = index => {
    if (selectedCamera.includes(index)) {
      setSelectedCamera(selectedCamera.filter(event => event !== index));
    } else {
      setSelectedCamera([...selectedCamera, index]);
    }
  };

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        const getList = await getEventTypesList(userDetails?.email);
        const events = getList.data.data;
        console.log('events', events);
        if (events.length > 0) {
          dispatch(setEventsTypesAction(events));
        } else {
          dispatch(setEventsTypesAction([]));
        }
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  //   useEffect(() => {
  //     let defaultEventSelect = [];
  //     if (response?.cameraEventTypeId.length > 0) {
  //       response?.cameraEventTypeId.map(item => {
  //         const found = eventTypesList.find(el => el._id === item);
  //         if (found) {
  //           defaultEventSelect.push(found?.type);
  //         }
  //       });
  //       setSelectedEvent(defaultEventSelect);
  //     }
  //   }, [eventTypesList, route]);

  const getImage = key => {
    switch (key) {
      case 'PERSON':
        return <ProfileOutlineIcon height={'100%'} width={'100%'} />;
      case 'PET':
        return <PetOutloneIcon height={'100%'} width={'100%'} />;
      case 'VEHICLE':
        return <CarOutlineIcon height={'100%'} width={'100%'} />;
      case 'PACKAGE':
        return <BoxOutlineIcon height={'100%'} width={'100%'} />;
      case 'FACE':
        return <FaceOutlineIcon height={'100%'} width={'100%'} />;
      case 'SOUND':
        return <SoundOutlineIcon height={'100%'} width={'100%'} />;
      default:
        break;
    }
  };
  const getName = key => {
    switch (key) {
      case 'PERSON':
        return 'People detection';
      case 'PET':
        return 'Pet detection';
      case 'VEHICLE':
        return 'Vehicle detection';
      case 'PACKAGE':
        return 'Package detection';
      case 'FACE':
        return 'Face recognition';
      case 'SOUND':
        return 'Sound recognition';
      default:
        break;
    }
  };

  //   const handleSave = async () => {
  //     if (selectedEvent.length > 0) {
  //       try {
  //         const data = {
  //           email: userDetails?.email,
  //           eventType: selectedEvent,
  //           deviceId: response?._id,
  //         };
  //         const res = await addEventsToDevice(data);
  //         if (res?.status === 200) {
  //           console.log('res', res);
  //           navigation.goBack();
  //         }
  //       } catch (error) {
  //         console.log('error', error);
  //       }
  //     } else {
  //       console.log('error');
  //     }
  //   };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <View style={CommonStyle.flex}>
        <CustomHeader
          title={'Filter'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
          isClearBtnVisible={true}
          onClearBtnPress={() => {
            setSelectedEvent([]);
            setSelectedLocation('');
            setSelectedCamera([]);
            setTimeFilter('');
            dispatch(setEventsFilterAction([]));
            dispatch(setCameraFilterAction([]));
            dispatch(setLocationFilterAction(''));
            dispatch(setTimeFilterAction(''));
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false} style={{}}>
          <View style={{marginTop: 20}}>
            <Text style={[CommonStyle.blackTitle]}>Time zone</Text>
            <FlatList
              data={TimeZones}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.timeFilter,
                      item.key === timeFilter && {
                        borderColor: color.LIGHT_GREEN_8,
                        backgroundColor: color.LIGHT_GREEN_11,
                      },
                    ]}
                    onPress={() => onSelectTimeFilter(item.key)}>
                    <View style={styles.timeFilterIcon}>{item.icon}</View>
                    <Text style={[CommonStyle.smallBlackText, {width: '75%'}]}>
                      {item.key}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
              // style={{marginBottom: responsiveScale(20)}}
            />
          </View>
          <View style={styles.titlePadding}>
            <Text style={[CommonStyle.blackTitle]}>Location</Text>
          </View>
          <CustomDropdown
            placeholder={'Location'}
            onChangeValue={item => {
              setSelectedLocation(item._id);
              setSelectedCamera([]);
            }}
            extraInputViewStyle={{
              backgroundColor: color.WHITE,
            }}
            valueField={'_id'}
            labelField={'location'}
            value={slectedLocation}
            data={locationList}
          />
          <View style={styles.titlePadding}>
            <Text style={[CommonStyle.blackTitle]}>Devices</Text>
          </View>

          <MultiDropdown
            placeholder={'Device'}
            data={
              slectedLocation
                ? _.filter(devicesList, {
                    deviceLocation: slectedLocation,
                  }).map(item => {
                    return {
                      label: item?.deviceDetails?.name,
                      value: item?.deviceDetails?.streamName,
                    };
                  })
                : devicesList.map(item => {
                    return {
                      label: item?.deviceDetails?.name,
                      value: item?.deviceDetails?.streamName,
                    };
                  })
            }
            value={selectedCamera}
            onChangeValue={setSelectedCamera}
          />

          {/* {Cameras.map((item, index) => {
            return (
              <View style={styles.extraItemViewStyle}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.imageContainer}>{item.image}</View>
                  <Text style={[styles.itemText]}>{item.name}</Text>
                </View>
                <TouchableOpacity
                  style={CommonStyle.row}
                  onPress={() => {
                    handleCameraCheckBoxPress(index);
                  }}>
                  {selectedCamera.includes(index) ? (
                    <CheckBox />
                  ) : (
                    <CheckBoxBlank />
                  )}
                </TouchableOpacity>
              </View>
            );
          })} */}
          <View style={styles.titlePadding}>
            <Text style={[CommonStyle.blackTitle]}>Event Type</Text>
          </View>
          {eventTypesList.map((item, index) => {
            return (
              <CategoryItem
                DeviceName={getName(item.type)}
                icon={
                  <View style={styles.iconContainer}>
                    {getImage(item.type)}
                  </View>
                }
                isIcon={true}
                isCheckBox={true}
                isChecked={selectedEvent.includes(item.type)}
                onCheckBoxPress={() => {
                  handleCheckBoxPress(item.type);
                }}
                extraItemViewStyle={styles.viewMargin}
                extraItemTextStyle={{fontSize: responsiveScale(14)}}
                isDisabled={true}
              />
            );
          })}
        </ScrollView>
      </View>
      <Button
        name={'Apply'}
        extraBtnViewStyle={styles.extraBtnViewStyle}
        onPress={() => {
          dispatch(setEventsFilterAction(selectedEvent));
          dispatch(setCameraFilterAction(selectedCamera));
          dispatch(setLocationFilterAction(slectedLocation));
          dispatch(setTimeFilterAction(timeFilter));
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewMargin: {marginBottom: 10},
  titlePadding: {paddingTop: 20},
  extraBtnViewStyle: {width: '40%', marginBottom: 30, marginTop: 10},
  iconContainer: {
    borderRadius: 20,
    height: 28,
    aspectRatio: 1,
    backgroundColor: color.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  imageContainer: {
    borderRadius: 8,
    height: '100%',
    width: perfectSize(75),
    backgroundColor: color.LIGHT_GRAY_3,
    marginRight: 20,
    padding: 5,
  },
  extraItemViewStyle: {
    marginBottom: 10,
    height: perfectSize(70),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    paddingLeft: 5,
    paddingVertical: 5,
    paddingRight: 20,
  },
  itemText: {
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    fontSize: responsiveScale(14),
  },
  timeFilter: {
    height: responsiveScale(50),
    width: responsiveScale(120),
    borderRadius: 10,
    backgroundColor: '#E1E1E133',
    borderWidth: 1,
    borderColor: '#E1E1E133',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeFilterIcon: {
    height: responsiveScale(28),
    width: responsiveScale(28),
    borderRadius: responsiveScale(22),
    backgroundColor: color.GREEN,
    marginRight: responsiveScale(5),
    padding: responsiveScale(5),
  },
});
export default FilterScreen;
