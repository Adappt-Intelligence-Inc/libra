/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useRef, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import CustomHeader from '../../../components/CustomHeader';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {color} from '../../../config/color';
import NightVision from '../../../assets/appImages/NightVision.svg';
import {deviceHeight, deviceWidth, perfectSize} from '../../../styles/theme';
import ArrowDown from '../../../assets/appImages/ArrowDown.svg';
import ArrowUp from '../../../assets/appImages/ArrowUp.svg';
import ArrowRight from '../../../assets/appImages/ArrowRight.svg';
import ArrowLeft1 from '../../../assets/appImages/ArrowLeft1.svg';
import Volume from '../../../assets/appImages/Volume.svg';
import More from '../../../assets/appImages/More.svg';
import Video from '../../../assets/appImages/Video.svg';
import MoreSquare from '../../../assets/appImages/MoreSquare.svg';
import Clock from '../../../assets/appImages/Clock.svg';
import Camera4 from '../../../assets/appImages/Camera4.svg';
import Microphone from '../../../assets/appImages/Microphone.svg';
import Event1 from '../../../assets/appImages/Event1.svg';
import PetIcon from '../../../assets/appImages/PetIcon.svg';
import VehicleIcon from '../../../assets/appImages/VehicleIcon.svg';
import PackageIcon from '../../../assets/appImages/PackageIcon.svg';
import FaceIcon from '../../../assets/appImages/FaceIcon.svg';
import Maximize from '../../../assets/appImages/Maximize.svg';
import Minimize from '../../../assets/appImages/Minimize.svg';
import Close from '../../../assets/appImages/Close.svg';
import LikeIcon from '../../../assets/appImages/LikeIcon.svg';
import UnLikeIcon from '../../../assets/appImages/UnLikeIcon.svg';
import AngleRight1 from '../../../assets/appImages/AngleRight1.svg';
import FilterIcon from '../../../assets/appImages/FilterIcon.svg';
import AngleLeft from '../../../assets/appImages/AngleLeft.svg';
import AngleRight from '../../../assets/appImages/AngleRight.svg';
import CarotRight from '../../../assets/appImages/CarotRight.svg';
import CarotLeft from '../../../assets/appImages/CarotLeft.svg';
import Calender from '../../../assets/appImages/Calender.svg';
import Live from '../../../assets/appImages/Live.svg';
import CloseWhite from '../../../assets/appImages/CloseWhite.svg';
import NoEvents from '../../../assets/appImages/NoEvents.svg';
import VideoCircle from '../../../assets/appImages/VideoCircle.svg';
import VideoPentagone from '../../../assets/appImages/VideoPentagone.svg';
import SetDetZone from '../../../assets/appImages/SetDetZone.svg';
import ZoneDetection from '../../../assets/appImages/ZoneDetection.svg';
import Backward from '../../../assets/appImages/Backward.svg';
import Forward from '../../../assets/appImages/Forward.svg';
import Next from '../../../assets/appImages/Next.svg';
import Previous from '../../../assets/appImages/Previous.svg';
import Pause from '../../../assets/appImages/Pause.svg';
import Play from '../../../assets/appImages/Play.svg';
import VolumeGreen from '../../../assets/appImages/VolumeGreen.svg';
import GreenLive from '../../../assets/appImages/GreenLive.svg';
import WhiteVideoCircle from '../../../assets/appImages/WhiteVideoCircle.svg';
import Library from '../../../assets/appImages/Library.svg';
import DeviceStorage from '../../../assets/appImages/DeviceStorage.svg';
import KinesisStreamView from '../../../components/KinesisStreamView';
import moment from 'moment';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  addDeviceZone,
  addEventsToDevice,
  events,
  getDevicesList,
  getEventTypesList,
  setFavouriteDevice,
} from '../../../resources/baseServices/auth';
import CarOutlineIcon from '../../../assets/appImages/CarOutlineIcon.svg';
import ProfileOutlineIcon from '../../../assets/appImages/ProfileOutlineIcon.svg';
import PetOutloneIcon from '../../../assets/appImages/PetOutloneIcon.svg';
import BoxOutlineIcon from '../../../assets/appImages/BoxOutlineIcon.svg';
import FaceOutlineIcon from '../../../assets/appImages/FaceOutlineIcon.svg';
import GreenZone from '../../../assets/appImages/GreenZone.svg';
import Moon from '../../../assets/appImages/Moon.svg';
import SunRise from '../../../assets/appImages/SunRise.svg';
import Sun from '../../../assets/appImages/Sun.svg';
import SunSet from '../../../assets/appImages/SunSet.svg';
import DropdownIconWhite from '../../../assets/appImages/DropdownIconWhite.svg';
import {CustomeToast} from '../../../components/CustomeToast';
import DatePicker from 'react-native-date-picker';
import Button from '../../../components/Button';
import CategoryItem from '../../../components/CategoryItem';
import {
  setDevicesListAction,
  setEventsPlayTimeAction,
  setEventsTypesAction,
} from '../../../store/devicesReducer';
import GetTimeForVideo from '../../../components/GetTimeForVideo';
import LinearGradient from 'react-native-linear-gradient';
import {
  CarColor,
  CloudColor,
  FaceColor,
  MotionColor,
  PackegeColor,
  PersonColor,
  PetColor,
  RamColor,
} from '../../../assets/Icon';
import Slider from 'react-native-slider';
import Orientation from 'react-native-orientation-locker';
import Svg, {Polygon} from 'react-native-svg';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';
import RecordScreen, {RecordingStartResponse} from 'react-native-record-screen';
import GetCustomTime from '../../../components/GetCustomTime';
import {Dropdown} from 'react-native-element-dropdown';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import WebRTCStreamView from '../../../components/WebRTCStreamView';
import WebRTCStream from '../../../components/WebRTCStream';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import NetInfo from '@react-native-community/netinfo';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CameraView = ({navigation, route}) => {
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const data = route?.params?.response;
  const isEvents = route?.params?.isEvents ?? false;
  const isLive = route?.params?.isLive ?? false;
  const [isLike, setLike] = useState(false);
  const [time, setTime] = useState(new Date());
  const userDetails = useSelector(state => state?.auth?.userDetails ?? '');
  const [eventsGroupData, setEventsGroupData] = useState({});
  const [eventsData, setEventsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMoonModalVisible, setMoonModalVisible] = useState(false);
  const [timeFilterVisible, setTimeFilterVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isEventsSelected, setTsEventsSelected] = useState(false);
  const [bandWidth, setBandWidth] = useState(0);
  const [selectedEventFilter, setSelectedEventFilter] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [playback, setPlayback] = useState(false);
  const [zoneActivate, setZoneActivate] = useState(false);
  const [liveVisible, setLiveVisible] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  const [selectedStorageOption, setSelectedStorageOption] = useState(0);
  const [orientation, setOrientation] = useState('PORTRAIT');
  const [isStoreModalVisible, setStoreModalVisible] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState('storage');
  const [capturedSnapShot, setCapturedSnapShot] = useState('');
  const [timeFilter, setTimeFilter] = useState(null);
  const [defaulttimeFilter, setDefaultTimeFilter] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [selectedQuality, setSelectedQuality] = useState('HD');
  const [selectedStore, setSelectedStore] = useState('Cloud');
  const [qualityExpand, setQualityExpand] = useState(false);
  const [recording, setRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state?.type === 'celluler') {
        setIsConnected(false);
        setTimeout(() => {
          setIsConnected(state?.isConnected);
        }, 300);
      } else {
        setIsConnected(state?.isConnected);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const SpeedData = [
    {label: '1x', value: '1x'},
    {label: '2x', value: '2x'},
    {label: '4x', value: '4x'},
  ];
  const QualityData = ['HD', 'SD', '360p'];
  const StoreData = ['SD Card', 'Cloud'];

  const videoRef = useRef();
  const viewShotRef = useRef();

  const convertObjectToArray = object => {
    const result = [];

    Object.keys(object).forEach(zoneKey => {
      const zoneArray = [];

      Object.keys(object[zoneKey]).forEach(pointKey => {
        const {x, y} = object[zoneKey][pointKey];
        zoneArray.push({x, y});
      });

      result.push(zoneArray);
    });

    return result;
  };
  const [detectionArray, setDetectionArray] = useState(
    data?.zoneCoordinates ? convertObjectToArray(data?.zoneCoordinates) : [],
  );
  // console.log('convertObjectToArray(data?.zoneCoordinates)', detectionArray);
  const [oneDetection, setOneDetection] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', goBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', goBack);
    };
  }, []);

  const onChangeToPortrait = () => {
    setOrientation('PORTRAIT');
    Orientation.lockToPortrait();
    setZoneActivate(false);
    // setDetectionArray([]);
    setOneDetection([]);
  };
  const onChangeToLandscape = () => {
    setOrientation('LANDSCAPE');
    Orientation.lockToLandscape();
    // setDetectionArray([]);
    setOneDetection([]);
  };
  const setupZoneInVideo = () => {
    setOrientation('LANDSCAPE');
    Orientation.lockToLandscape();
    setZoneActivate(true);
    // setDetectionArray([]);
    setOneDetection([]);
  };

  const goBack = () => {
    navigation.goBack();
    onChangeToPortrait();
    // setDetectionArray([]);
    setOneDetection([]);
    return true;
  };

  // console.log('orientation', orientation);
  const eventTypesList = useSelector(
    state => state?.devices?.eventTypesList ?? [],
  );
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  // const eventPlayTime = useSelector(
  //   state => state?.devices?.eventPlayTime ?? new Date(),
  // );
  // console.log('eventPlayTime', eventPlayTime);
  const response = devicesList.find(d => d._id === data?._id) || data;

  const fetchDevice = async () => {
    const getList = await getDevicesList(userDetails?.email);
    const AddedDevice = getList.data.data;
    if (AddedDevice.length > 0) {
      dispatch(setDevicesListAction(AddedDevice));
    } else {
      dispatch(setDevicesListAction([]));
    }
  };

  const handleGetAllEvents = async () => {
    if (response?.isFavourite) {
      setLike(response?.isFavourite);
    }
    try {
      const res = await events(
        response?.deviceDetails?.streamName || response?.streamName,
        moment(selectedDate)
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')
          .replace('Z', '%2B05:30'),
        moment(selectedDate)
          .endOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')
          .replace('Z', '%2B05:30'),
        userDetails?.email,
      );
      // console.log('res--1111111-->', res.data?.data);
      if (res?.status === 200) {
        setLoading(false);
        setRefreshing(false);
        setEventsData(res.data?.data);
        // const data = res.data?.data;
        // let grouped_data = _.groupBy(data, event => {
        //   const eventTime = moment(event.eventTime);
        //   const roundedTime = moment(
        //     Math.floor(eventTime / (10 * 60 * 1000)) * (10 * 60 * 1000),
        //   );
        //   return roundedTime.format('hh:mm A');
        // });
        // console.log('grouped_data', grouped_data);
        // setEventsGroupData(grouped_data);
      }
    } catch (err) {
      setLoading(false);
      setRefreshing(false);
      setEventsGroupData([]);
      setEventsData([]);
      console.log('err===>', err);
    }
  };
  useEffect(() => {
    isLive && setLoading(true);
    isLive && handleGetAllEvents();
  }, [selectedDate]);

  const handleCheckBoxPress = eventName => {
    if (selectedEvent.includes(eventName)) {
      setSelectedEvent(selectedEvent.filter(event => event !== eventName));
    } else {
      setSelectedEvent([...selectedEvent, eventName]);
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

  useEffect(() => {
    let defaultEventSelect = [];
    if (response?.cameraEventTypeId?.length > 0) {
      response?.cameraEventTypeId?.map(item => {
        const found = eventTypesList.find(el => el._id === item);
        if (found) {
          defaultEventSelect.push(found?.type);
        }
      });
      setSelectedEvent(defaultEventSelect);
      if (defaultEventSelect.length > 0) {
        setTsEventsSelected(true);
      }
    }
  }, [eventTypesList, route]);

  const handleSave = async () => {
    if (selectedEvent.length > 0) {
      try {
        const data = {
          email: userDetails?.email,
          eventType: selectedEvent,
          deviceId: response?._id,
        };
        const res = await addEventsToDevice(data);
        if (res?.status === 200) {
          console.log('res', res);
          fetchDevice();
          setModalVisible(false);
          setTsEventsSelected(true);
        }
      } catch (error) {
        console.log('error', error);
      }
    } else {
      console.log('error');
    }
  };

  const convertArrayToObject = array => {
    const result = {};

    array.forEach((zone, index) => {
      const zoneName = `Zone${index + 1}`;
      result[zoneName] = {};

      zone.forEach((point, pointIndex) => {
        const pointName = `S${pointIndex}`;
        result[zoneName][pointName] = {x: point.x, y: point.y};
      });
    });
    return _.isEmpty(result) ? null : result;
  };

  const handleSaveDetection = async () => {
    // if (detectionArray.length > 0) {
    try {
      const data = {
        email: userDetails?.email,
        deviceId: response?._id,
        zoneCoordinates: convertArrayToObject(detectionArray),
      };
      const res = await addDeviceZone(data);
      if (res?.status === 200) {
        console.log('res', res);
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      console.log('error', error);
      CustomeToast({type: 'error', message: error?.response?.data?.err});
    }
    // } else {
    //   console.log('error');
    // }
  };

  const hitLike = async id => {
    try {
      const data = {
        email: userDetails?.email,
        deviceId: id,
      };
      const res = await setFavouriteDevice(data);
      if (res?.data.msg.includes('added')) {
        setLike(true);
        CustomeToast({type: 'success', message: res?.data.msg});
      } else {
        setLike(false);
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {}
  };

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
      default:
        break;
    }
  };

  const eventTypeFilter = (key, color, bgColor) => {
    switch (key) {
      case 'PERSON':
        return <PersonColor height={'100%'} width={'100%'} color={color} />;
      case 'PET':
        return <PetColor height={'100%'} width={'100%'} color={color} />;
      case 'VEHICLE':
        return <CarColor height={'100%'} width={'100%'} color={color} />;
      case 'MOTION':
        return <MotionColor height={'100%'} width={'100%'} color={color} />;
      case 'PACKAGE':
        return (
          <PackegeColor
            height={'100%'}
            width={'100%'}
            color={color}
            bgColor={bgColor}
          />
        );
      case 'FACE':
        return <FaceColor height={'100%'} width={'100%'} color={color} />;
      default:
        break;
    }
  };

  const getTime = (startTime, endTime) => {
    const startDate = moment(startTime);
    const endDate = moment(endTime);

    const duration = moment.duration(endDate.diff(startDate));

    const weeks = Math.floor(duration.asWeeks());
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let timeAgo = '';

    if (weeks > 0) {
      timeAgo = `${weeks}w${weeks > 1 ? 's' : ''}`;
    } else if (days > 0) {
      timeAgo = `${days}d${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeAgo = `${hours}h${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      timeAgo = `${minutes}m${minutes > 1 ? 's' : ''}`;
    } else if (seconds > 0) {
      timeAgo = `${seconds}s${seconds > 1 ? 's' : ''}`;
    }
    return timeAgo;
  };
  const roundTimeToNearest10Minutes = () => {
    const time = new Date();
    const minutes = time.getMinutes();
    const roundedMinutes = Math.round(minutes / 10) * 10;
    time.setMinutes(roundedMinutes);
    const formattedTime = moment(time).format('hh:mm A');
    return formattedTime;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetAllEvents();
  }, []);

  const getbgColor = key => {
    switch (key) {
      case 'PERSON':
        return '#D2E0FBAA';
      case 'PET':
        return '#D6F8B8AA';
      case 'VEHICLE':
        return '#FFC2DDAA';
      case 'PACKAGE':
        return '#FEC8BCAA';
      case 'FACE':
        return '#F7E987AA';
      case 'MOTION':
        return '#AAD7D9AA';
      default:
        break;
    }
  };

  const getboderColor = key => {
    switch (key) {
      case 'PERSON':
        return '#4D79CD';
      case 'PET':
        return '#3AA645';
      case 'VEHICLE':
        return '#BD638B';
      case 'PACKAGE':
        return '#C66F5C';
      case 'FACE':
        return '#B49F19';
      case 'MOTION':
        return '#297D82';
      default:
        break;
    }
  };

  const getEventColor = key => {
    switch (key) {
      case 'PERSON':
        return ['#DAF7AB00', '#4D79CD80', '#DAF7AB00'];
      case 'PET':
        return ['#53DE6100', '#3AA64580', '#53DE6100'];
      case 'CAT':
        return ['#53DE6100', '#3AA64580', '#53DE6100'];
      case 'VEHICLE':
        return ['#53DE6100', '#BD638B80', '#53DE6100'];
      case 'PACKAGE':
        return ['#26F47800', '#C66F5C80', '#26F47800'];
      case 'FACE':
        return ['#CCFF0000', '#B49F1980', '#CCFF0000'];
      case 'MOTION':
        return ['#CCFF0000', '#297D8280', '#CCFF0000'];

      default:
        ['#CCFF0000', '#0000FF60', '#CCFF0000'];
        break;
    }
  };

  const TimeDifferenceForWidth = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const timeDifference = endDate - startDate;
    const secondsDifference = timeDifference / 1000;
    const minutesDifference = secondsDifference / 60;
    return minutesDifference;
  };

  const StartTimeForPosition = startTime => {
    const date = new Date(startTime);
    const totalMinutes =
      date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
    return totalMinutes;
  };

  const handleFilterPress = eventName => {
    if (selectedEventFilter.includes(eventName)) {
      setSelectedEventFilter(
        selectedEventFilter.filter(event => event !== eventName),
      );
    } else {
      setSelectedEventFilter([...selectedEventFilter, eventName]);
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
  const filteredData =
    timeFilter !== null &&
    eventsData.filter(item => {
      const eventTime = new Date(item.eventTime || item.startTime);
      const hours = eventTime.getHours();
      return (
        hours >= TimeZones[parseInt(timeFilter)].startTime &&
        hours < TimeZones[parseInt(timeFilter)].endTime
      );
    });

  const afterTimeFilter = timeFilter === null ? eventsData : filteredData;

  const newEventData =
    selectedEventFilter.length > 0
      ? afterTimeFilter.filter(item =>
          selectedEventFilter.includes(item.eventType),
        )
      : afterTimeFilter;

  const onSelectTimeFilter = index => {
    if (index === defaulttimeFilter) {
      setDefaultTimeFilter(null);
    } else {
      setDefaultTimeFilter(index);
    }
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Timeline2 = () => {
    const array = [1, 2, 3, 4, 5];
    const timeArray = [];

    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 10) {
        const hour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minutes.toString().padStart(2, '0');
        const amPm = hours < 12 ? 'AM' : 'PM';
        const time = `${hourStr}:${minuteStr} ${amPm}`;
        timeArray.push(time);
      }
    }
    timeArray.push('12:00 AM');

    const index = timeArray?.findIndex(
      item => item === roundTimeToNearest10Minutes(),
    );
    const offset = index * 60;

    // Object.keys(eventsGroupData).length > 0 ? (
    return (
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{}}
          alwaysBounceHorizontal={true}
          scrollEventThrottle={1}
          ref={scrollViewRef}
          // onScroll={event => {
          //   console.log('event', event.nativeEvent);
          // }}
          onMomentumScrollEnd={event => {
            setScrollOffset(event.nativeEvent.contentOffset.x);
            if (event.nativeEvent.contentOffset.x / 6 > 1440) {
              formatDuration(1439);
            } else {
              formatDuration(event.nativeEvent.contentOffset.x / 6);
            }
          }}
          contentOffset={{
            x: scrollOffset || 0,
          }}>
          {timeArray?.map((item, index) => {
            return (
              <View
                style={[
                  {
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: 70,
                  },
                ]}>
                <View
                  style={{
                    height: 40,
                    backgroundColor: color.LIGHT_GRAY_4,
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                  }}>
                  {index === 0 && (
                    <View
                      style={[
                        styles.line,
                        {height: 12, marginLeft: deviceWidth / 2},
                      ]}
                    />
                  )}
                  {timeArray.length - 1 != index &&
                    array.map((_item, i) => {
                      return <View style={[styles.line, {height: 5}]} />;
                    })}
                  {timeArray.length - 1 != index ? (
                    <View
                      style={[
                        styles.line,
                        {height: 12},
                        timeArray.length - 2 === index && {
                          marginRight: 0,
                        },
                      ]}
                    />
                  ) : (
                    <View style={[{marginRight: deviceWidth / 2}]} />
                  )}
                </View>

                {item.substring(3, 5) % 10 === 0 && (
                  <Text
                    style={[
                      styles.TimeText,
                      {
                        width: 50,
                        alignSelf: 'flex-start',
                        position: 'absolute',
                        left: -35,
                        bottom: 0,
                      },
                      index === 0 && {marginLeft: deviceWidth / 2 + 10},
                    ]}
                    numberOfLines={2}>
                    {item}
                  </Text>
                )}
              </View>
            );
          })}
          {newEventData.map(item => {
            return (
              <View
                // colors={getEventColor(item.eventType)}
                // start={{x: 0, y: 1}}
                // end={{x: 1, y: 1}}
                style={[
                  {
                    height: 40,
                    width:
                      TimeDifferenceForWidth(
                        item.startTime,
                        item.latestAppeared,
                      ) * 6 || 0,
                    position: 'absolute',
                    left:
                      deviceWidth / 2 +
                        StartTimeForPosition(item.startTime) * 6 || 0,
                    backgroundColor: getbgColor(item.eventType),
                    // opacity: 0.7,
                  },
                ]}>
                <TouchableOpacity
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                  onPress={() => {
                    let newData = item;
                    newData.deviceName =
                      response?.deviceDetails?.name || response?.deviceName;
                    navigation.push('CameraView', {
                      response: item,
                      isEvents: true,
                    });
                  }}></TouchableOpacity>
              </View>
              // <View
              //   style={{
              //     backgroundColor: '#FF000060',
              //     height: 75,
              //     width:
              //       TimeDifferenceForWidth(
              //         item.startTime,
              //         item.latestAppeared,
              //       ) * 10,
              //     position: 'absolute',
              //     left:
              //       deviceWidth / 2 + StartTimeForPosition(item.startTime) * 6,
              //   }}></View>
            );
          })}
        </ScrollView>
        <View
          style={{
            width: 2,
            height: 40,
            position: 'absolute',
            left: deviceWidth / 2,
            backgroundColor: color.GREEN,
            // marginTop: responsiveScale(102),
          }}>
          <View style={styles.triangle} />
          <View style={styles.triangle2} />
        </View>
        <View style={{flex: 1, paddingHorizontal: 20, marginTop: 20}}>
          <FlatList
            data={eventTypesList}
            renderItem={({item, index}) => {
              return (
                <View style={styles.filtercontainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleFilterPress(item.type);
                    }}
                    style={[
                      styles.filtercontainer2,
                      {
                        backgroundColor: getbgColor(item.type),
                        borderColor: getboderColor(item.type),
                        borderWidth: selectedEventFilter.includes(item.type)
                          ? 1
                          : 0,
                      },
                    ]}>
                    <View style={styles.eventTypeImage}>
                      {eventTypeFilter(
                        item.type,
                        selectedEventFilter.includes(item.type)
                          ? getboderColor(item.type)
                          : color.DARK_GRAY_5,
                        getbgColor(item.type),
                      )}
                    </View>
                    <Text
                      style={[
                        styles.filterText,
                        selectedEventFilter.includes(item.type) && {
                          color: getboderColor(item.type),
                        },
                      ]}>
                      {item.type}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            numColumns={3}
            columnWrapperStyle={{}}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
    // ) : (
    //   // ) : isEventsSelected ? (
    //   //   <View style={CommonStyle.socialBtn}>
    //   //     <Text
    //   //       style={[CommonStyle.inputTitle, {textAlign: 'center', width: '60%'}]}>
    //   //       No event found for{' '}
    //   //       <Text style={{color: color.GREEN, textAlign: 'center'}}>
    //   //         {moment(selectedDate).format('DD-MM-YYYY')}
    //   //       </Text>{' '}
    //   //       date
    //   //     </Text>
    //   //   </View>
    //   <View style={{paddingHorizontal: 20, marginBottom: 20}}>
    //     <View style={styles.AddView}>
    //       <Text style={styles.AddText}>
    //         The camera’s have not detected anything
    //       </Text>
    //       <NoEvents />
    //     </View>
    //   </View>
    // );
  };

  const getNextDate = () => {
    setLoading(true);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const getPreviousDate = () => {
    setLoading(true);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(nextDate);
  };

  useEffect(() => {
    setSelectedDate(selectedDate);
  }, [selectedDate]);

  const getImage2 = key => {
    switch (key) {
      case 'PERSON':
        return <Event1 />;
      case 'PET':
        return <PetIcon />;
      case 'VEHICLE':
        return <VehicleIcon />;
      case 'PACKAGE':
        return <PackageIcon />;
      case 'FACE':
        return <FaceIcon />;
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
      default:
        break;
    }
  };

  const convertToMbps = num => {
    return num / 1024 / 1000;
  };

  const formatDuration = totalMinutes => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    setHour(hours);
    setMinute(minutes);
    setSecond(seconds);
  };

  const storageOptions = ['card', 'cloud'];

  const startTime = new Date(selectedDate);
  startTime.setHours(hour, minute, second, 0);
  const endTime = new Date(selectedDate);
  endTime.setHours(23, 59, 59, 999);

  const handleCanvasPress = ({nativeEvent}) => {
    // console.log('nativeEvent', nativeEvent, deviceWidth, deviceHeight);
    const {locationX, pageY} = nativeEvent;

    const newClickPoints = [
      ...oneDetection,
      {
        x: (locationX / deviceHeight).toFixed(5),
        y: (pageY / deviceWidth).toFixed(5),
      },
    ];
    setOneDetection(newClickPoints);
    if (newClickPoints.length === 4) {
      setOneDetection([]);
      const newDetectionArray = [...detectionArray, newClickPoints];
      setDetectionArray(newDetectionArray);
    }
  };
  const takeSnapshot = async () => {
    try {
      if (viewShotRef.current) {
        // Capture the current frame of the video
        const uri = await viewShotRef.current.capture();
        console.log('Snapshot captured:', uri);
        setCapturedSnapShot(uri);
        setStoreModalVisible(true);

        // You can now save or process the captured snapshot URI as needed
        // For example, you might want to display it in an Image component
      }
    } catch (error) {
      console.error('Error capturing snapshot:', error);
    }
  };

  const startRecording = async () => {
    // recording start
    const res = RecordScreen.startRecording().catch(error =>
      console.error(error),
    );
    if (res === RecordingStartResponse.PermissionError) {
      // user denies access
    }
  };

  const stopRecording = async () => {
    console.log('da');
    try {
      const result = await RecordScreen.stopRecording();
      console.log('Recording stopped. Result:', result);
    } catch (error) {
      console.error('Stop recording failed', error);
    }
  };

  // const saveSnapshot = async uri => {
  //   try {
  //     // Request external storage permission (Android only)
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         {
  //           title: 'Storage Permission',
  //           message: 'App needs access to storage to save the snapshot.',
  //           buttonNeutral: 'Ask Me Later',
  //           buttonNegative: 'Cancel',
  //           buttonPositive: 'OK',
  //         },
  //       );
  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('Storage permission denied.');
  //         return;
  //       }
  //     }

  //     // Define the destination path for saving the image
  //     const destinationPath =
  //       RNFS.ExternalStorageDirectoryPath + '/snapshot.jpg';

  //     // Copy the file to the destination path
  //     await RNFS.copyFile(uri, destinationPath);

  //     console.log('Snapshot saved:', destinationPath);
  //   } catch (error) {
  //     console.error('Error saving snapshot:', error);
  //   }
  // };

  // const downloadSnapshot = async () => {
  //   setStoreLoading(true);
  //   try {
  //     if (capturedSnapShot) {
  //       // Get the base64 data of the image
  //       const base64Data = await RNFS.readFile(capturedSnapShot, 'base64');
  //       const imageUrl = base64Data?.replace(
  //         'data:application/octet-stream;base64,',
  //         '',
  //       );
  //       // Specify the directory and filename for the downloaded image
  //       const downloadPath =
  //         RNFS.DownloadDirectoryPath +
  //         `/${capturedSnapShot.split('/').pop().split('-').pop()}`;

  //       // Save the base64 data to the file
  //       await RNFS.writeFile(downloadPath, imageUrl, 'base64');
  //       setStoreLoading(false);
  //       setStoreModalVisible(false);
  //       setCapturedSnapShot('');
  //       console.log('Snapshot downloaded:', downloadPath);
  //     }
  //   } catch (error) {
  //     console.error('Error downloading snapshot:', error);
  //   }
  // };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download images.',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting storage permission:', err);
      return false;
    }
  };
  const toggleItemExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setQualityExpand(!qualityExpand);
  };

  const saveToLocalAlbum = async () => {
    setStoreLoading(true);
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]).then(
            statuses =>
              statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                PermissionsAndroid.RESULTS.GRANTED &&
              statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
                PermissionsAndroid.RESULTS.GRANTED,
          );
          if (!granted) {
            console.log('Storage permission denied.');
            return;
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to save the snapshot.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage permission denied.');
            return;
          }
        }
      }
      // Local image URI (replace with the actual path to your local image)
      const localImageUri = capturedSnapShot;

      // Save the local image to the device's camera roll
      const savedImage = await CameraRoll.save(localImageUri, {
        type: 'photo',
        album: 'Addapt Home',
      });
      console.log('Local image saved to camera roll:');

      if (savedImage) {
        console.log('Local image saved to camera roll:', savedImage);
        CustomeToast({
          type: 'success',
          message: 'Photo saved to your Gallery',
        });
        setStoreLoading(false);
        setStoreModalVisible(false);
        setCapturedSnapShot('');
      } else {
        console.error('Failed to save local image to camera roll.');
      }
    } catch (error) {
      console.error('Error saving local image:', error);
    }
  };
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text numberOfLines={2} style={styles.selectedTextStyle}>
          {item?.label}
        </Text>
      </View>
    );
  };

  // const saveImageToFS = async uri => {
  //   const response = await RNFetchBlob.config({
  //     fileCache: true,
  //   }).fetch('GET', uri);
  //   const savedImagePath = response.path();
  //   console.log('Image saved to:', savedImagePath);
  // };

  const storageSaveOptions = ['library', 'storage'];

  if (orientation === 'PORTRAIT') {
    return (
      <View style={styles.container}>
        <View style={styles.paddingBottom}>
          <CustomHeader
            title={response?.deviceDetails?.name || response?.deviceName}
            isBackBtnVisible={true}
            isSettingIconVisible={isLive && !userDetails?.viewOnly}
            isMoonIconVisible={isLive && true}
            onPressBackBtn={() => {
              navigation.goBack();
              onChangeToPortrait();
            }}
            onSettingIconPress={() => {
              navigation.navigate('SettingScreen', {
                deviceName:
                  response?.deviceDetails?.name || response?.deviceName,
              });
            }}
            onMoonPress={() => {
              setMoonModalVisible(true);
            }}
          />
          {playback ? (
            <View style={styles.storeContainer}>
              {StoreData.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedStore(item)}
                    disabled
                    style={[
                      styles.storeText,
                      item === selectedStore && {borderBottomWidth: 2},
                    ]}>
                    <Text
                      style={[
                        CommonStyle.smallGreyText,
                        item === selectedStore && CommonStyle.smallGreenText,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.btnView}>
              {/* <View style={CommonStyle.row}>
              <View style={styles.hdBadge}>
                <Text style={styles.hdBadgeText}>HD</Text>
                <Text style={styles.bitrateText}>99.5 KB/s</Text>
              </View>
              <TouchableOpacity style={styles.NightVisionButton}>
                <NightVision />
              </TouchableOpacity>
            </View> */}
            </View>
          )}
        </View>

        <View style={styles.liveView}>
          {playback ? (
            <KinesisStreamView
              streamName={
                response?.deviceDetails?.streamName || response?.streamName
              }
              playbackMode={'ON_DEMAND'}
              extraVideoStyle={styles.extraVideoStyle}
              controls={false}
              // startTimestamp={1698726600}
              // endTimestamp={1698748200}
              startTimestamp={
                new Date(startTime.toISOString()).getTime() / 1000
              }
              // videoRef={videoRef}
              // viewShotRef={viewShotRef}
              endTimestamp={new Date(endTime.toISOString()).getTime() / 1000}
              setBandWidth={setBandWidth}
              videoTime={res => {
                // const originalDateTime = response?.startTime;
                // const newDateTime = moment(originalDateTime)
                //   .add(res?.currentTime, 'seconds')
                //   .format();
                // const formattedDateTime = moment(newDateTime).format(
                //   'hh:mm:ss A, DD MMM, YYYY',
                // );
                // setTime(res);
              }}
            />
          ) : (
            <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
              {/* <KinesisStreamView
                streamName={
                  response?.deviceDetails?.streamName || response?.streamName
                }
                playbackMode={isLive ? 'LIVE' : 'ON_DEMAND'}
                extraVideoStyle={styles.extraVideoStyle}
                controls={isEvents && true}
                paused={videoPaused}
                setVideoPaused={setVideoPaused}
                videoRef={videoRef}
                // viewShotRef={viewShotRef}
                // startTimestamp={1698726600}
                // endTimestamp={1698748200}
                startTimestamp={
                  isEvents && new Date(response?.startTime).getTime() / 1000
                }
                endTimestamp={
                  isEvents && new Date(response?.endTime).getTime() / 1000
                }
                setBandWidth={setBandWidth}
                videoTime={res => {
                  // const originalDateTime = response?.startTime;
                  // const newDateTime = moment(originalDateTime)
                  //   .add(res?.currentTime, 'seconds')
                  //   .format();
                  // const formattedDateTime = moment(newDateTime).format(
                  //   'hh:mm:ss A, DD MMM, YYYY',
                  // );
                  setTime(res);
                }}
              /> */}

              {/* <WebRTCStreamView
                roomName={
                  '65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0'
                }
                extraVideoStyle={[styles.extraVideoStyle]}
                recording={recording}
                stopRecording={!recording}
              /> */}
              {isConnected ? (
                <WebRTCStreamView
                  roomName={
                    response?.deviceDetails?.streamName || response?.streamName
                  }
                  extraVideoStyle={[styles.extraVideoStyle]}
                  recording={recording}
                  stopRecording={!recording}
                />
              ) : (
                <View style={[styles.emptyCircleContainer]}>
                  <AnimatedCircularProgress
                    size={responsiveScale(30)}
                    width={3}
                    fill={0}
                    tintColor={color.WHITE}
                    backgroundColor={color.DARK_GRAY_5}>
                    {fill => (
                      <Text style={styles.loadingText}>
                        {parseInt(fill) + '%'}
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </View>
              )}
            </ViewShot>
          )}
          {playback && liveVisible && (
            <View style={styles.playBackVideoStyle}>
              <ViewShot
                ref={viewShotRef}
                options={{format: 'jpg', quality: 0.9}}>
                <KinesisStreamView
                  streamName={
                    response?.deviceDetails?.streamName || response?.streamName
                  }
                  playbackMode={'LIVE'}
                  extraVideoStyle={styles.extraVideoStyle}
                  controls={false}
                  // videoRef={videoRef}
                  // viewShotRef={viewShotRef}
                  // startTimestamp={1698726600}
                  // endTimestamp={1698748200}
                  startTimestamp={
                    isEvents && new Date(response?.startTime).getTime() / 1000
                  }
                  endTimestamp={
                    isEvents && new Date(response?.endTime).getTime() / 1000
                  }
                  setBandWidth={setBandWidth}
                  videoTime={res => {
                    // const originalDateTime = response?.startTime;
                    // const newDateTime = moment(originalDateTime)
                    //   .add(res?.currentTime, 'seconds')
                    //   .format();
                    // const formattedDateTime = moment(newDateTime).format(
                    //   'hh:mm:ss A, DD MMM, YYYY',
                    // );
                    setTime(res);
                  }}
                />
              </ViewShot>
              <View style={[styles.extraliveIcon]}>
                <Live height="100%" width="100%" />
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setLiveVisible(false)}
                style={[styles.closeIcon]}>
                <CloseWhite height="100%" width="100%" />
              </TouchableOpacity>
            </View>
          )}
          {/* <Slider
            value={0.5}
            minimumTrackTintColor={color.GREEN}
            maximumTrackTintColor={'#FFFFFF99'}
            onValueChange={value => console.log({value})}
            style={styles.slider}
            thumbTintColor={color.WHITE}
            thumbStyle={styles.thumbStyle}
          /> */}

          {isLive && !playback && (
            <>
              {/* <TouchableOpacity style={[styles.IconPosition, styles.arrowDown]}>
                <ArrowDown />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.IconPosition, styles.arrowUp]}>
                <ArrowUp />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.IconPosition, styles.arrowRight]}>
                <ArrowRight />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.IconPosition, styles.arrowLeft]}>
                <ArrowLeft1 />
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => onChangeToLandscape()}
                style={styles.maximizeIcon}>
                <Maximize />
              </TouchableOpacity>
            </>
          )}
          <View style={styles.topContainer}>
            {!playback ? (
              <View style={[styles.badgeContainer2]}>
                {isLive && (
                  <View style={[styles.liveIcon, {width: '10%'}]}>
                    <Live height="100%" width="100%" />
                  </View>
                )}
                <View style={{maxWidth: isLive ? '90%' : '100%'}}>
                  <Text
                    numberOfLines={1}
                    style={[styles.titleText, {width: '100%'}]}>
                    {response?.deviceDetails?.name || response?.deviceName}{' '}
                    {isLive ? (
                      <GetTimeForVideo />
                    ) : (
                      moment(time).format('hh:mm:ss A, D MMM YYYY')
                    )}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={[styles.badgeContainer2]}>
                <View>
                  <Text
                    numberOfLines={1}
                    style={[styles.titleText, {width: '100%'}]}>
                    <GetCustomTime date={startTime} />
                  </Text>
                </View>
              </View>
            )}
            <View style={CommonStyle.row}>
              {playback && (
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.placeholderStyle}
                  // inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={SpeedData}
                  labelField={'label'}
                  valueField={'value'}
                  placeholder={'1x'}
                  disable
                  value={playbackSpeed}
                  onChange={item => {
                    setPlayback(item.value);
                  }}
                  containerStyle={{marginTop: 1.2}}
                  selectedTextProps={{numberOfLines: 1}}
                  renderRightIcon={() => <DropdownIconWhite />}
                  renderItem={renderItem}
                />
              )}
              {isLive && (
                <TouchableOpacity
                  onPress={() => {
                    hitLike(response?._id);
                  }}
                  style={styles.likeIcon}>
                  {isLike ? <LikeIcon /> : <UnLikeIcon />}
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* <View style={[styles.badgeContainer, {top: 10}]}>
            {isLive && (
              <View style={styles.liveIcon}>
                <Live height="100%" width="100%" />
              </View>
            )}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={styles.titleText}>
                {response?.deviceDetails?.name || response?.deviceName}{' '}
                {isLive ? (
                  <GetTimeForVideo />
                ) : (
                  moment(time).format('hh:mm:ss A, D MMM YYYY')
                )}
              </Text>
            </View>
          </View>
          {isLive && (
            <TouchableOpacity
              onPress={() => {
                hitLike(response?._id);
              }}
              style={styles.likeIcon}>
              {isLike ? <LikeIcon /> : <UnLikeIcon />}
            </TouchableOpacity>
          )} */}
          {isLive && (
            <TouchableOpacity
              onPress={toggleItemExpansion}
              disabled
              style={[styles.dropDownContainer]}>
              <Text style={[styles.boldOptionText]}>{selectedQuality}</Text>
              <Text style={styles.optionText}>
                {convertToMbps(bandWidth).toFixed(2)} MB/s
              </Text>
              <View
                style={[
                  {height: responsiveScale(16), aspectRatio: 1},
                  qualityExpand && {
                    transform: [{rotate: '180deg'}],
                  },
                ]}>
                <DropdownIconWhite height={'100%'} width={'100%'} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {isLive && (
          <View style={{flex: 1}}>
            <View style={{backgroundColor: color.GREEN}}>
              <View style={styles.row}>
                <TouchableOpacity disabled style={styles.center}>
                  <Volume />
                  <Text style={styles.optionText}>Sound</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled
                  onPress={stopRecording}
                  style={styles.center}>
                  <Microphone />
                  <Text style={styles.optionText}>Speak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={startRecording}
                  onPress={() => {
                    setRecording(!recording);
                  }}
                  // disabled
                  style={[styles.center, {opacity: 1}]}>
                  <Video />
                  <Text style={styles.optionText}>
                    {recording ? 'Stop' : 'Record'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takeSnapshot}
                  disabled={Platform.OS === 'ios'}
                  style={[
                    styles.center,
                    Platform.OS === 'android' && {opacity: 1},
                  ]}>
                  <Camera4 />
                  <Text style={styles.optionText}>Take photo</Text>
                </TouchableOpacity>
                {!userDetails?.viewOnly && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                    }}
                    style={[styles.center, {opacity: 1}]}>
                    <Clock />
                    <Text style={styles.optionText}>Add events</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <View style={[[styles.row2]]}>
                <Button
                  name={playback ? 'Live View' : 'Playback events'}
                  isIcon={true}
                  image={<VideoCircle />}
                  extraBtnViewStyle={[
                    styles.playBackBtnViewStyle,
                    {width: '70%'},
                  ]}
                  extraBtnNameStyle={{
                    fontSize: responsiveScale(14),
                    color: color.GREEN,
                  }}
                  onPress={() => {
                    setPlayback(!playback);
                    setLiveVisible(true);
                    // handleSave();
                  }}
                />
                {/* <Button
                  name={'Set det... zone'}
                  isIcon={true}
                  image={<VideoPentagone />}
                  extraBtnViewStyle={styles.SetDetBtnViewStyle}
                  extraBtnNameStyle={{
                    fontSize: responsiveScale(14),
                    color: color.GREEN,
                  }}
                  onPress={() => {
                    // handleSave();
                  }}
                /> */}
                {playback && (
                  <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => {
                      setDefaultTimeFilter(timeFilter);
                      setTimeFilterVisible(true);
                    }}>
                    <FilterIcon height={'100%'} width={'100%'} />
                    {/* <AngleRight1 /> */}
                  </TouchableOpacity>
                  // <TouchableOpacity
                  //   activeOpacity={0.5}
                  //   onPress={() => {
                  //     if (selectedStorageOption === 0) {
                  //       setSelectedStorageOption(1);
                  //     } else {
                  //       setSelectedStorageOption(0);
                  //     }
                  //   }}
                  //   style={styles.storageContainer}>
                  //   {storageOptions.map((item, index) => {
                  //     const selectedColor =
                  //       selectedStorageOption === index
                  //         ? color.WHITE
                  //         : color.DARK_GRAY;
                  //     return (
                  //       <View
                  //         style={[
                  //           styles.storageImageContainer,
                  //           index === selectedStorageOption &&
                  //             styles.selectedStorageImageContainer,
                  //         ]}>
                  //         {item === 'card' ? (
                  //           <RamColor
                  //             height={'100%'}
                  //             width={'100%'}
                  //             color={selectedColor}
                  //           />
                  //         ) : (
                  //           <CloudColor
                  //             height={'100%'}
                  //             width={'100%'}
                  //             color={selectedColor}
                  //           />
                  //         )}
                  //       </View>
                  //     );
                  //   })}
                  // </TouchableOpacity>
                )}
              </View>
              {!playback && !userDetails?.viewOnly && (
                <View style={{paddingHorizontal: 20}}>
                  <View style={styles.subscriptionSection}>
                    <View style={styles.subscribeView}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          marginBottom: 10,
                        }}>
                        <View style={styles.zoneImage}>
                          <GreenZone height="100%" width="100%" />
                        </View>
                        <Text style={styles.subscriptionText}>
                          Zone detection
                        </Text>
                      </View>
                      <Button
                        name={'Setup'}
                        disabled={true}
                        onPress={setupZoneInVideo}
                        extraBtnViewStyle={[
                          styles.subscribeButton,
                          {opacity: 0.5},
                        ]}
                        extraBtnNameStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                      />
                    </View>
                    <View style={styles.subscriptionImage}>
                      <ZoneDetection height="100%" width="100%" />
                    </View>
                  </View>
                  <Text style={CommonStyle.blackTitle}>
                    Instruction for setup zone :
                  </Text>
                  <Text style={CommonStyle.regularText}>
                    1. Define your detection zone by tapping on specific point.
                  </Text>
                  <Text style={CommonStyle.regularText}>
                    2. Continue tapping to outline the desired area.
                  </Text>
                  <Text style={CommonStyle.regularText}>
                    3. Connect the last point to the first point to complete the
                    zone.
                  </Text>
                </View>
              )}
              {playback && (
                <View
                  style={[
                    styles.row,
                    CommonStyle.shadow,
                    {paddingHorizontal: 15, paddingTop: 20},
                  ]}>
                  <TouchableOpacity
                    disabled={
                      moment(selectedDate).format('DD-MM-YYYY') ==
                        moment(
                          new Date(
                            new Date().setDate(new Date().getDate() - 6),
                          ),
                        ).format('DD-MM-YYYY') || loading
                    }
                    style={[styles.filterBtn, {backgroundColor: color.WHITE}]}
                    onPress={getPreviousDate}>
                    <CarotLeft height={'100%'} width={'100%'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={loading}
                    style={styles.CalenderView}
                    onPress={() => setDateOpen(true)}>
                    <Calender />
                    <Text style={styles.CalenderText}>
                      {moment(selectedDate).format('DD-MM-YYYY')}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="date"
                    open={dateOpen}
                    date={selectedDate}
                    onConfirm={date => {
                      setLoading(true);
                      setDateOpen(false);
                      setSelectedDate(new Date(date));
                    }}
                    onCancel={() => {
                      setDateOpen(false);
                    }}
                    maximumDate={new Date()}
                    minimumDate={
                      new Date(new Date().setDate(new Date().getDate() - 6))
                    }
                  />
                  <TouchableOpacity
                    disabled={
                      moment(selectedDate).format('DD-MM-YYYY') ==
                        moment(new Date()).format('DD-MM-YYYY') || loading
                    }
                    style={[
                      styles.filterBtn,
                      {backgroundColor: color.LIGHT_GREEN_11},
                    ]}
                    onPress={getNextDate}>
                    <CarotRight height={'100%'} width={'100%'} />
                  </TouchableOpacity>
                </View>
              )}
              {playback && (
                <View
                  style={{flex: 1, paddingHorizontal: 0, marginVertical: 10}}>
                  {loading ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="large" color={color.GREEN} />
                    </View>
                  ) : (
                    <>
                      {/* <View style={{flex: 1, paddingHorizontal: 20}}>
                        <Text style={[CommonStyle.blackTitle]}>Time zone</Text>
                        <FlatList
                          data={TimeZones}
                          renderItem={({item, index}) => {
                            return (
                              <TouchableOpacity
                                style={[
                                  styles.timeFilter,
                                  index === timeFilter && {
                                    borderColor: color.LIGHT_GREEN_8,
                                    backgroundColor: color.LIGHT_GREEN_11,
                                  },
                                ]}
                                onPress={() => onSelectTimeFilter(index)}>
                                <View style={styles.timeFilterIcon}>
                                  {item.icon}
                                </View>
                                <Text
                                  style={[
                                    CommonStyle.smallBlackText,
                                    {width: '75%'},
                                  ]}>
                                  {item.key}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                          style={{marginBottom: responsiveScale(20)}}
                        />
                      </View> */}
                      <Timeline2 />
                    </>
                  )}
                </View>
              )}
              <View style={{height: 30}} />
            </ScrollView>
            {qualityExpand && (
              <View style={styles.dropDownItem}>
                {QualityData.map(item => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.textContainer,
                        item === selectedQuality && {
                          backgroundColor: color.LIGHT_GREEN_12,
                        },
                      ]}
                      onPress={() => {
                        setSelectedQuality(item);
                        toggleItemExpansion();
                      }}>
                      <Text
                        style={[
                          CommonStyle.smallGreyText,
                          item === selectedQuality &&
                            CommonStyle.smallBoldGreenText,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
        {isEvents && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnIcon}>
                <Backward height={'100%'} width={'100%'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnIcon}>
                <Previous height={'100%'} width={'100%'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => setVideoPaused(!videoPaused)}>
                {videoPaused ? (
                  <Play height={'100%'} width={'100%'} />
                ) : (
                  <Pause height={'100%'} width={'100%'} />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnIcon}>
                <Next height={'100%'} width={'100%'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnIcon}>
                <Forward height={'100%'} width={'100%'} />
              </TouchableOpacity>
            </View>
            <View style={[styles.btnContainer2, {opacity: 0.5}]}>
              <TouchableOpacity style={styles.center2}>
                <View style={styles.btnIcon2}>
                  <VolumeGreen height={'100%'} width={'100%'} />
                </View>
                <Text style={styles.greenOptionText}>Sound</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.center2}>
                <View style={styles.btnIcon2}>
                  <GreenLive height={'100%'} width={'100%'} />
                </View>
                <Text style={styles.greenOptionText}>Live</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.center2}
                onPress={() => {
                  // setPlayback(!playback);
                  // setLiveVisible(true);
                }}>
                <View style={[styles.btnIcon2, {backgroundColor: color.GREEN}]}>
                  <WhiteVideoCircle height={'100%'} width={'100%'} />
                </View>
                <Text style={styles.greenOptionText}>{'Playback'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          style={CommonStyle.modelContainerStyle}
          onBackdropPress={() => {
            setModalVisible(false);
          }}>
          {/* <View style={CommonStyle.modelContainerStyle}> */}
          <View style={CommonStyle.modalContentStyle}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={CommonStyle.position}>
              <Close />
            </TouchableOpacity>
            <Text style={[CommonStyle.sectionTitle, styles.modalTitle]}>
              Events
            </Text>
            <View style={{width: '100%'}}>
              {eventTypesList.map((item, _index) => {
                return (
                  <CategoryItem
                    DeviceName={getName(item.type)}
                    icon={getImage2(item.type)}
                    isIcon={true}
                    isCheckBox={true}
                    isChecked={selectedEvent.includes(item.type)}
                    onCheckBoxPress={() => {
                      handleCheckBoxPress(item.type);
                    }}
                    extraItemViewStyle={styles.viewMargin}
                    isDisabled={true}
                  />
                );
              })}
            </View>
            <Button
              name={'Save'}
              extraBtnViewStyle={styles.extraBtnViewStyle2}
              extraBtnNameStyle={{fontSize: responsiveScale(16)}}
              onPress={() => {
                handleSave();
              }}
            />
          </View>
          {/* </View> */}
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isMoonModalVisible}
          style={CommonStyle.modelContainerStyle}
          onBackdropPress={() => {
            setMoonModalVisible(false);
          }}>
          {/* <View style={CommonStyle.modelContainerStyle}> */}
          <View style={[CommonStyle.modalContentStyle]}>
            <Text
              style={[
                CommonStyle.greyText20,
                {textAlign: 'center', width: '80%', opacity: 0.5},
              ]}>
              Try leaving night vision mode off
            </Text>
            <Text
              style={[
                CommonStyle.text,
                {textAlign: 'center', marginVertical: 10, opacity: 0.5},
              ]}>
              Adappt camera lining room starlight sensor allows you to see
              clearly at night in color without using Night vision.
            </Text>
            <View style={[styles.imageContainer, {opacity: 0.5}]}>
              <Image
                source={require('../../../assets/appImages/LightMode.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#FFFFFF00', '#FFFFFF99', '#FFFFFF00']}
                style={styles.linearGradient}>
                <View style={styles.innerContainer}>
                  <Text style={styles.optionText}>Night vision : Off</Text>
                </View>
              </LinearGradient>
            </View>
            <View
              style={[styles.imageContainer, {marginTop: 20, opacity: 0.5}]}>
              <Image
                source={require('../../../assets/appImages/DarkMode.png')}
                style={{height: '100%', width: '100%'}}
                resizeMode="contain"
              />
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#FFFFFF00', '#FFFFFF99', '#FFFFFF00']}
                style={styles.linearGradient}>
                <View style={styles.innerContainer}>
                  <Text style={styles.optionText}>Night vision : On</Text>
                </View>
              </LinearGradient>
            </View>
            <Button
              name={'Ok'}
              extraBtnViewStyle={[styles.extraBtnViewStyle2, {opacity: 0.5}]}
              disabled={true}
              extraBtnNameStyle={{fontSize: responsiveScale(16)}}
              onPress={() => {
                setMoonModalVisible(false);
              }}
            />
          </View>
          {/* </View> */}
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={timeFilterVisible}
          style={CommonStyle.modelContainerStyle}
          onBackdropPress={() => {
            setTimeFilterVisible(false);
            setDefaultTimeFilter(null);
          }}>
          {/* <View style={CommonStyle.modelContainerStyle}> */}
          <View style={CommonStyle.modalContentStyle}>
            <TouchableOpacity
              onPress={() => {
                setTimeFilterVisible(false);
                setDefaultTimeFilter(null);
              }}
              style={CommonStyle.position}>
              <Close />
            </TouchableOpacity>
            <Text style={[CommonStyle.sectionTitle, styles.modalTitle]}>
              Filter
            </Text>
            <View style={{width: '100%'}}>
              <FlatList
                data={TimeZones}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.timeFilter,
                        index === defaulttimeFilter && {
                          borderColor: color.LIGHT_GREEN_8,
                          backgroundColor: color.LIGHT_GREEN_11,
                        },
                      ]}
                      onPress={() => onSelectTimeFilter(index)}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={styles.timeFilterIcon}>{item.icon}</View>
                        <Text
                          style={[
                            CommonStyle.blackText14,
                            {width: '75%'},
                            index === defaulttimeFilter && {
                              color: color.GREEN,
                            },
                          ]}>
                          {item.key}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioBorder,
                          index === defaulttimeFilter && {
                            borderColor: color.GREEN,
                          },
                        ]}>
                        {index === defaulttimeFilter && (
                          <View style={styles.radio} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                // horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                style={{marginBottom: responsiveScale(20)}}
              />
            </View>
            <Button
              name={'Done'}
              extraBtnViewStyle={[styles.extraBtnViewStyle2, {marginTop: 10}]}
              extraBtnNameStyle={{fontSize: responsiveScale(16)}}
              onPress={() => {
                setScrollOffset(defaulttimeFilter * 360 * 6);
                setTimeFilter(defaulttimeFilter);
                setTimeFilterVisible(false);
                setDefaultTimeFilter(null);
              }}
            />
          </View>
          {/* </View> */}
        </Modal>
        <Modal
          // animationType="fade"
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          animationInTiming={3000}
          animationOutTiming={3000}
          transparent={true}
          visible={isStoreModalVisible}
          style={CommonStyle.modelBottomContainerStyle}
          onBackdropPress={() => {
            setStoreModalVisible(false);
          }}>
          <View style={CommonStyle.modalBottomContentStyle}>
            {capturedSnapShot && (
              <Image
                source={{
                  uri: capturedSnapShot,
                }}
                style={styles.capturedImage}
                resizeMode="contain"
              />
            )}
            <View style={CommonStyle.row}>
              {storageSaveOptions.map(item => {
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedStorage(item)}
                    disabled={item === 'library'}
                    style={[
                      styles.mainContainer,
                      item === selectedStorage && {borderColor: color.GREEN},
                      item === 'library' && {opacity: 0.5},
                    ]}>
                    <View style={styles.iconContainer}>
                      {item === 'library' ? (
                        <Library height={'100%'} width={'100%'} />
                      ) : (
                        <DeviceStorage height={'100%'} width={'100%'} />
                      )}
                    </View>
                    <Text style={CommonStyle.blackText14}>
                      {item === 'library' ? 'Library' : 'Device Storage'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={CommonStyle.row}>
              <Button
                name={'Cancel'}
                extraBtnViewStyle={[styles.btnViewStyle]}
                extraBtnNameStyle={{
                  fontSize: responsiveScale(14),
                  color: color.GREEN,
                }}
                loadColor={color.GREEN}
                // isLoading={locationLoading}
                onPress={() => {
                  setStoreModalVisible(false);
                  setCapturedSnapShot('');
                }}
              />
              <Button
                name={'Save'}
                extraBtnViewStyle={styles.extraBtnViewStyleModal}
                extraBtnNameStyle={{fontSize: responsiveScale(14)}}
                onPress={() => {
                  // setDeleteLocationModal(-1);
                  saveToLocalAlbum();
                }}
                isLoading={storeLoading}
                disabled={storeLoading}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        <View style={{paddingHorizontal: 0}}>
          <TouchableOpacity
            activeOpacity={1}
            disabled={!zoneActivate}
            onPress={handleCanvasPress}>
            {isConnected ? (
              <WebRTCStreamView
                roomName={
                  response?.deviceDetails?.streamName || response?.streamName
                }
                extraVideoStyle={[styles.extraVideoStyle]}
                recording={recording}
                stopRecording={!recording}
              />
            ) : (
              <View style={[styles.emptyCircleContainer]}>
                <AnimatedCircularProgress
                  size={responsiveScale(30)}
                  width={3}
                  fill={0}
                  tintColor={color.WHITE}
                  backgroundColor={color.DARK_GRAY_5}>
                  {fill => (
                    <Text style={styles.loadingText}>
                      {parseInt(fill) + '%'}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            )}
            {/* <KinesisStreamView
              streamName={
                response?.deviceDetails?.streamName || response?.streamName
              }
              playbackMode={isLive ? 'LIVE' : 'ON_DEMAND'}
              extraVideoStyle={styles.extraVideoStyle}
              controls={isEvents && false}
              // videoRef={videoRef}
              // viewShotRef={viewShotRef}
              // startTimestamp={1698726600}
              // endTimestamp={1698748200}
              startTimestamp={
                isEvents && new Date(response?.startTime).getTime() / 1000
              }
              endTimestamp={
                isEvents && new Date(response?.endTime).getTime() / 1000
              }
              setBandWidth={setBandWidth}
              resizeMode={'stretch'}
              // setVideoWidth={setVideoWidth}
              // setVideoHeight={setVideoHeight}
              videoTime={res => {
                // const originalDateTime = response?.startTime;
                // const newDateTime = moment(originalDateTime)
                //   .add(res?.currentTime, 'seconds')
                //   .format();
                // const formattedDateTime = moment(newDateTime).format(
                //   'hh:mm:ss A, DD MMM, YYYY',
                // );
                setTime(res);
              }}
            /> */}
            <View style={styles.topContainer}>
              {!playback ? (
                <View
                  style={[styles.badgeContainer2, {height: perfectSize(30)}]}>
                  {isLive && (
                    <View style={[styles.liveIcon, {width: '10%'}]}>
                      <Live height="100%" width="100%" />
                    </View>
                  )}
                  <View style={{maxWidth: isLive ? '90%' : '100%'}}>
                    <Text
                      numberOfLines={1}
                      style={[styles.titleText, {width: '100%'}]}>
                      {response?.deviceDetails?.name || response?.deviceName}{' '}
                      {isLive ? (
                        <GetTimeForVideo />
                      ) : (
                        moment(time).format('hh:mm:ss A, D MMM YYYY')
                      )}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.emptyBadgeContainer]} />
              )}
              {/* {detectionArray.length > 0 && ( */}
              {zoneActivate && (
                <Button
                  name={'Save'}
                  extraBtnViewStyle={styles.extraBtnLandscapeViewStyle}
                  extraBtnNameStyle={{fontSize: responsiveScale(13)}}
                  onPress={() => {
                    handleSaveDetection();
                  }}
                />
              )}
              {/* )} */}
            </View>
            <TouchableOpacity
              onPress={() => onChangeToPortrait()}
              // hitSlop={{top: 10, right: 10, left: 10, bottom: 10}}
              style={styles.minimizeIcon}>
              <Minimize />
            </TouchableOpacity>
            {zoneActivate &&
              detectionArray.map((points, index) => {
                const pointsString = points
                  .map(
                    point =>
                      `${point.x * deviceHeight},${point.y * deviceWidth}`,
                  )
                  .join(' ');
                return (
                  <View style={styles.polygon}>
                    <TouchableOpacity
                      onPress={() => {
                        const newData = detectionArray;
                        newData.splice(index, 1);
                        setDetectionArray([...newData]);
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.closeCanvasBtb,
                        {
                          top: points[0].y * deviceWidth - 10,
                          left: points[0].x * deviceHeight - 10,
                        },
                      ]}>
                      <CloseWhite height="100%" width="100%" />
                    </TouchableOpacity>
                    <Svg height="100%" width="100%">
                      <Polygon
                        points={pointsString}
                        fill={color.LIGHT_GREEN_8} // Fill color
                        stroke={color.GREEN} // Border color
                        strokeWidth="2" // Border width
                      />
                    </Svg>
                  </View>
                );
              })}
            {zoneActivate &&
              oneDetection.map(item => {
                return (
                  <View
                    style={{
                      backgroundColor: color.RED,
                      height: 5,
                      width: 5,
                      borderRadius: 5,
                      position: 'absolute',
                      top: item.y * deviceWidth,
                      left: item.x * deviceHeight,
                    }}
                  />
                );
              })}
            {/* <View
            style={{
              flex: 1,
              position: 'absolute',
              height: '100%',
              width: '100%',
            }}>
            <Svg height="100%" width="100%">
              <Polygon
                points={pointsString}
                fill={color.LIGHT_GREEN_8} // Fill color
                stroke={color.GREEN} // Border color
                strokeWidth="2" // Border width
              />
            </Svg>
          </View> */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default CameraView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  optionText: {
    color: color.WHITE,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontSize: responsiveScale(10),
  },
  boldOptionText: {
    color: color.WHITE,
    fontWeight: FONT_WEIGHT_BOLD,
    fontFamily: TTNORMSPRO_BOLD,
    fontSize: responsiveScale(10),
    padding: 3,
    backgroundColor: '#FFFFFF61',
    borderRadius: 3,
  },
  IconPosition: {
    position: 'absolute',
    backgroundColor: '#00000066',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  badgeContainer: {
    position: 'absolute',
    // top: 10,
    left: 10,
    backgroundColor: '#00000066',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 60,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.LIGHT_GRAY_5,
  },
  dropDownContainer: {
    position: 'absolute',
    // top: 10,
    left: 10,
    backgroundColor: '#00000066',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.LIGHT_GRAY_5,
    width: responsiveScale(130),
    justifyContent: 'space-between',
    bottom: 10,
  },
  badgeContainer2: {
    padding: 3,
    backgroundColor: '#00000066',
    paddingHorizontal: 7,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.LIGHT_GRAY_5,
    maxWidth: '90%',
  },
  emptyBadgeContainer: {
    backgroundColor: '#00000066',
    paddingHorizontal: 7,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: color.LIGHT_GRAY_5,
    maxWidth: '90%',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    width: '96%',
    alignSelf: 'center',
    zIndex: 1,
  },
  liveIcon: {
    marginRight: 5,
    width: responsiveScale(22),
  },
  extraliveIcon: {
    position: 'absolute',
    width: responsiveScale(10),
    aspectRatio: 1,
    top: 10,
    left: 10,
    zIndex: 1,
  },
  closeIcon: {
    position: 'absolute',
    width: responsiveScale(20),
    borderRadius: responsiveScale(20),
    aspectRatio: 1,
    top: 5,
    right: 5,
    zIndex: 1,
    backgroundColor: color.RED,
    padding: 3,
  },
  titleText: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  CalenderText: {
    paddingLeft: 20,
    fontFamily: TTNORMSPRO_REGULAR,
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY_5,
  },
  TimeText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontSize: 14,
    color: color.DARK_GRAY,
    lineHeight: 26,
    textAlign: 'center',
  },
  CalenderView: {
    borderWidth: 1,
    borderColor: color.LIGHT_BORDER,
    borderRadius: 50,
    // paddingVertical: 10,
    // paddingHorizontal: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.WHITE,
    height: responsiveScale(38),
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  AddView: {
    // borderWidth: 1,
    // borderColor: color.LIGHT_GRAY_3,
    // borderRadius: 8,
    // padding: 40,
    alignItems: 'center',
    backgroundColor: color.WHITE,
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 40,
    width: '100%',
  },
  AddText: {
    color: color.DARK_GRAY,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    width: '85%',
    textAlign: 'center',
    marginVertical: 10,
  },
  extraBtnViewStyle: {width: '50%', marginTop: 20},
  extraBtnLandscapeViewStyle: {
    width: '12%',
    height: perfectSize(30),
    zIndex: 1,
  },
  extraBtnViewStyle2: {width: '40%', marginTop: 30},
  playBackBtnViewStyle: {
    width: '40%',
    backgroundColor: '#E6F5F2',
    borderColor: color.GREEN,
    borderWidth: 1,
    zIndex: 1,
  },
  SetDetBtnViewStyle: {
    width: '50%',
    backgroundColor: color.WHITE,
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: responsiveScale(20),
  },
  viewMargin: {marginTop: 10},
  NightVisionButton: {
    shadowColor: color.LIGHT_GRAY_2,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 4,
    backgroundColor: color.WHITE,
    borderRadius: 90,
    padding: 10,
    height: perfectSize(36),
    width: perfectSize(36),
    alignItems: 'center',
  },
  hdBadge: {
    backgroundColor: '#E6F5F2',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  hdBadgeText: {
    fontSize: responsiveScale(12),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.WHITE,
    backgroundColor: color.GREEN,
    padding: 5,
  },
  bitrateText: {
    color: color.GREEN,
    fontSize: responsiveScale(12),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
    paddingLeft: 8,
  },
  paddingBottom: {paddingHorizontal: 20},
  extraVideoStyle: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
  },
  playBackVideoStyle: {
    backgroundColor: 'red',
    height: '40%',
    width: '40%',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  center: {alignItems: 'center', opacity: 0.7},
  marginTop: {marginTop: 10},
  filterBtn: {
    backgroundColor: color.GREEN,
    borderRadius: responsiveScale(38),
    height: responsiveScale(38),
    width: responsiveScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: responsiveScale(7),
    borderWidth: 1,
    borderColor: color.LIGHT_BORDER,
  },
  likeIcon: {
    // position: 'absolute',
    // top: 20,
    // right: 20,
  },
  maximizeIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  minimizeIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1,
  },
  polygon: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  closeCanvasBtb: {
    position: 'absolute',
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: color.GREEN,
    padding: 3,
    zIndex: 1,
  },
  arrowLeft: {
    left: 20,
    top: '40%',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  arrowRight: {
    right: 20,
    top: '40%',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  arrowDown: {bottom: 20, left: '45%'},
  arrowUp: {top: 40, left: '45%'},
  liveView: {
    width: '100%',
    height: perfectSize(230),
  },
  btnView: {paddingTop: 15, paddingBottom: 10},
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 30,
    flexWrap: 'wrap',
  },
  eventImage: {
    borderRadius: 20,
    height: 25,
    aspectRatio: 1,
    backgroundColor: '#000',
    marginRight: 5,
    padding: 5,
  },
  eventTypeImage: {
    height: perfectSize(24),
    aspectRatio: 1,
  },
  filtercontainer: {
    height: perfectSize(38),
    // paddingHorizontal: perfectSize(10),
    borderRadius: perfectSize(20),
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'row',
    width: '30%',
    marginBottom: 10,
    marginRight: '5%',
    backgroundColor: color.LIGHT_GRAY_4,
  },
  filtercontainer2: {
    height: perfectSize(38),
    // paddingHorizontal: perfectSize(10),
    borderRadius: perfectSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    marginRight: '5%',
    // opacity: 0.7,
  },
  filterText: {
    fontSize: responsiveScale(10),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    textTransform: 'capitalize',
    marginLeft: responsiveScale(5),
  },
  triangle: {
    position: 'absolute',
    top: 28,
    left: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color.GREEN,
  },
  triangle2: {
    position: 'absolute',
    top: 0,
    left: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color.GREEN,
  },
  line: {width: 1, backgroundColor: color.GREEN, marginRight: 9},
  slider: {
    // backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  thumbStyle: {
    backgroundColor: color.GREEN,
    borderColor: color.WHITE,
    borderWidth: 4,
  },
  subscriptionImage: {
    width: '40%',
    height: '100%',
    alignSelf: 'flex-end',
  },
  subscribeButton: {
    width: responsiveScale(125),
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    fontSize: responsiveScale(16),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    width: '80%',
  },
  subscriptionSection: {
    marginTop: 20,
    backgroundColor: color.LIGHT_GREEN_10,
    borderRadius: 8,
    paddingLeft: 20,
    paddingTop: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderColor: color.LIGHT_GREEN_9,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: responsiveScale(125),
  },
  shadowIcon: {
    position: 'absolute',
    width: perfectSize(260),
    top: 0,
    bottom: 0,
  },
  subscribeView: {
    width: '60%',
  },
  storageContainer: {
    flexDirection: 'row',
    backgroundColor: color.WHITE,
    height: perfectSize(40),
    alignItems: 'center',
    justifyContent: 'space-between',
    width: perfectSize(80),
    borderRadius: perfectSize(40),
    // paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: color.LIGHT_GRAY_10,
  },
  storageImageContainer: {
    backgroundColor: color.WHITE,
    height: perfectSize(34),
    width: perfectSize(34),
    borderRadius: perfectSize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedStorageImageContainer: {
    backgroundColor: color.GREEN,
    height: perfectSize(42),
    width: perfectSize(42),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveScale(70),
    alignItems: 'center',
    marginVertical: 20,
  },
  btnContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: responsiveScale(65),
    borderRadius: responsiveScale(70),
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: responsiveScale(25),
    backgroundColor: color.LIGHT_GREEN_2,
    paddingVertical: responsiveScale(5),
  },
  btnIcon: {
    height: responsiveScale(22),
    width: responsiveScale(22),
  },
  btnIcon2: {
    height: responsiveScale(30),
    width: responsiveScale(30),
    borderRadius: responsiveScale(30),
    padding: responsiveScale(4),
  },
  playBtn: {
    height: responsiveScale(40),
    width: responsiveScale(40),
    backgroundColor: color.GREEN,
    borderRadius: responsiveScale(40),
    padding: responsiveScale(10),
  },
  greenOptionText: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontSize: responsiveScale(10),
  },
  center2: {alignItems: 'center', width: '33%'},
  zoneImage: {
    height: responsiveScale(28),
    width: responsiveScale(28),
    backgroundColor: color.LIGHT_BORDER,
    borderRadius: responsiveScale(28),
    marginRight: responsiveScale(10),
    padding: responsiveScale(4),
  },
  extraBtnViewStyleModal: {width: '47%', marginTop: 30},
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    width: '47%',
    marginTop: 30,
  },
  mainContainer: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.LIGHT_GRAY_5,
    width: '47%',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    // marginTop: 30,
  },
  iconContainer: {
    height: responsiveScale(45),
    width: responsiveScale(45),
    borderRadius: responsiveScale(45),
    padding: responsiveScale(10),
    backgroundColor: color.GREEN,
    marginBottom: responsiveScale(5),
  },
  capturedImage: {
    height: responsiveScale(200),
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  timeFilter: {
    height: responsiveScale(50),
    width: '100%',
    borderRadius: 10,
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  timeFilterIcon: {
    height: responsiveScale(28),
    width: responsiveScale(28),
    borderRadius: responsiveScale(22),
    backgroundColor: color.GREEN,
    marginRight: responsiveScale(5),
    padding: responsiveScale(5),
  },
  radioBorder: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.DARK_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: color.GREEN,
  },
  dropdown: {
    borderRadius: 6,
    paddingHorizontal: 8,
    // flex: 1,
    width: responsiveScale(60),
    backgroundColor: '#0C0C0C66',
    marginRight: 15,
  },
  placeholderStyle: {
    color: color.WHITE,
    fontSize: responsiveScale(12),
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  selectedTextStyle: {
    color: color.BLACK,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    marginRight: 5,
  },
  iconStyle: {
    width: responsiveScale(20),
    height: responsiveScale(20),
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    height: responsiveScale(30),
    justifyContent: 'center',
    paddingLeft: 20,
  },
  dropDownItem: {
    backgroundColor: color.WHITE,
    height: responsiveScale(90),
    width: responsiveScale(130),
    position: 'absolute',
    zIndex: 1,
    bottom: -responsiveScale(85),
    left: 10,
    borderRadius: 8,
    overflow: 'hidden',
    top: -5,
  },
  storeContainer: {
    width: responsiveScale(180),
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: color.LIGHT_GREEN_13,
    paddingHorizontal: responsiveScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginBottom: 10,
  },
  storeText: {
    paddingVertical: responsiveScale(6),
    width: responsiveScale(75),
    alignItems: 'center',
    borderColor: color.GREEN,
  },
  imageContainer: {
    height: responsiveScale(130),
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  linearGradient: {
    borderRadius: 50,
    // height: perfectSize(34),
    // width: perfectSize(100),
    position: 'absolute',
    top: 10,
    left: 10,
  },
  innerContainer: {
    borderRadius: perfectSize(34), // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
