import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import CustomCameraItem from '../../../components/CustomCameraItem';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import Image1 from '../../../assets/appImages/Image1.svg';
import Image2 from '../../../assets/appImages/Image2.svg';
import Frame2 from '../../../assets/appImages/Frame2.svg';
import Explore2 from '../../../assets/appImages/Explore2.svg';
import Group2 from '../../../assets/appImages/Group2.svg';
import NoFavorites from '../../../assets/appImages/NoFavorites.svg';
import NoCameraList from '../../../assets/appImages/NoCameraList.svg';
import UpdateLogo from '../../../assets/appImages/UpdateLogo.svg';
import NoDevice from '../../../assets/appImages/NoDevice.svg';
import ShadowBox from '../../../assets/appImages/ShadowBox.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import {perfectSize} from '../../../styles/theme';
import Button from '../../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllEvents,
  getAppVersions,
  getDevicesList,
  getInAppNotificationData,
  updateEmailPhone,
} from '../../../resources/baseServices/auth';
import {
  setDevicesListAction,
  setNotificationData,
  setVersionData,
  setVersionPopup,
} from '../../../store/devicesReducer';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';
import CustomDraw from '../../../components/CustomDraw';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import TextInputField from '../../../components/TextInputField';
import {CustomeToast} from '../../../components/CustomeToast';
import {setEditedUserDetailsAction} from '../../../store/authReducer';
import {setUserDetails} from '../../../helpers/auth';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? '');
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const [selectedDate, setSelectedDate] = useState(moment(new Date()));
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [seatsAdd, isSeatsAdd] = useState(true);
  const [start, setStart] = useState({x: null, y: null});
  const [end, setEnd] = useState({x: 0, y: 0});
  const [dimensions, setDimensions] = useState({w: 0, h: 0});
  const [addSeatsData, setAddSeatsData] = useState([]);
  const [seatsBox, setSeatsBox] = useState({});
  const vesrionPopup = useSelector(
    state => state?.devices?.vesrionPopup ?? false,
  );
  const notificationDataList = useSelector(
    state => state?.devices?.notificationData ?? [],
  );
  const Cameras = [
    {
      id: '1',
      image: <Image1 height="100%" width="100%" />,
      name: 'Outdoor camera',
      status: 'Package detected',
      time: '1 Minute ago',
    },
    {
      id: '2',
      image: <Image2 height="100%" width="100%" />,
      name: 'Pan tilt',
      status: 'Pet detected',
      time: '1 Minute ago',
    },
    {
      id: '3',
      image: <Image1 height="100%" width="100%" />,
      name: 'Outdoor camera',
      status: 'Package detected',
      time: '1 Minute ago',
    },
    {
      id: '4',
      image: <Image2 height="100%" width="100%" />,
      name: 'Pan tilt',
      status: 'Pet detected',
      time: '1 Minute ago',
    },
  ];
  useEffect(() => {
    Orientation.lockToPortrait();
    if (userDetails?.email == '') {
      setEmailModal(true);
    }
  }, []);

  const getAppVersion = async () => {
    const getBuildNumber = DeviceInfo.getVersion();
    try {
      const res = await getAppVersions();
      console.log('getAppVersion', res.data.data);
      if (res.data) {
        const Object = res.data.data.find(item => item.os === Platform.OS);
        if (Object.version > getBuildNumber) {
          dispatch(setVersionPopup(true));
        }
        dispatch(setVersionData(res.data.data));
      }
    } catch (error) {
      console.log('ee', error);
    }
  };

  const validateEmail = Email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(Email);
  };
  const onSaveEmail = async () => {
    if (email === '') {
      CustomeToast({type: 'error', message: 'Please enter email'});
    } else if (!validateEmail(email)) {
      CustomeToast({type: 'error', message: 'Please enter valid email !'});
    } else {
      const data = {
        phoneNumber: userDetails?.phoneNumber,
        missingEmail: email.toLowerCase(),
      };
      try {
        setBtnLoading(true);
        const res = await updateEmailPhone(data);
        if (res?.status === 200) {
          setBtnLoading(false);
          setEmailModal(false);
          dispatch(setEditedUserDetailsAction({email: email.toLowerCase()}));
          await setUserDetails(
            JSON.stringify({...userDetails, email: email.toLowerCase()}),
          );
        }
      } catch (error) {
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      }
    }
  };

  const onUpdateApp = () => {
    Platform.OS === 'android'
      ? Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.adapptcommissioning_new',
        )
      : Linking.openURL(
          'https://apps.apple.com/us/app/adappt-smart-home-solutions/id6474175199',
        );
  };

  const handleGetAllEvents = async () => {
    if (eventsData.length == 0) {
      setLoading(true);
    }
    try {
      const res = await getAllEvents(
        '',
        selectedDate
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')
          .replace('Z', '%2B05:30'),
        selectedDate
          .endOf('day')
          .format('YYYY-MM-DDTHH:mm:ss[Z]')
          .replace('Z', '%2B05:30'),
        userDetails?.email,
      );
      console.log('res--1111111-->', res.data?.data);
      if (res?.status === 200) {
        setEventsData(res.data?.data);
        setLoading(false);
      }
    } catch (err) {
      setEventsData([]);
      setLoading(false);
      console.log('err===>', err.response);
    }
  };

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getAppVersion();
        getNotificationData();
        const getList = await getDevicesList(userDetails?.email);
        const AddedDevice = getList.data.data;
        if (AddedDevice.length > 0) {
          dispatch(setDevicesListAction(AddedDevice));
        } else {
          dispatch(setDevicesListAction([]));
        }
        handleGetAllEvents();
      },
    );

    return getDashBoardAPIListener;
  }, [navigation]);

  const getNotificationData = async () => {
    try {
      const getData = await getInAppNotificationData(userDetails?.email);
      console.log('getNotificationData home', getData);
      const res = getData.data.data;
      if (res) {
        dispatch(setNotificationData(res));
      }
    } catch (error) {
      console.log('eee', error);
    }
  };

  const getName = key => {
    switch (key) {
      case 'PERSON':
        return 'People detected';
      case 'PET':
        return 'Pet detected';
      case 'VEHICLE':
        return 'Vehicle detected';
      case 'PACKAGE':
        return 'Package detected';
      case 'FACE':
        return 'Face detected';
      default:
        break;
    }
  };

  function timeAgo(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date(timestamp);
    const timeDifference = currentDate - targetDate;
    // console.log('timeDifference', timeDifference);

    // Calculate the time units
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} sec ago`;
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hr ago`;
    } else {
      return `${days} days ago`;
    }
  }

  const onPress = event => {
    const {x, y, translationX, translationY} = event.nativeEvent;
    if (!start.x && !start.y) setStart({x: y, y: x});
    setSeatsBox({
      startX: start.x,
      startY: start.y,
      w: dimensions.w,
      h: dimensions.h,
    });
    setDimensions({w: translationX, h: translationY});
  };

  const onEnd = event => {
    const newBlockAreasData = [
      // ...addSeatsData,
      {
        startX: start.x,
        startY: start.y,
        w: dimensions.w,
        h: dimensions.h,
      },
    ];
    setAddSeatsData(newBlockAreasData);
    if (!start.x && !start.y) return;
    setEnd(start);
    setStart({x: null, y: null});
  };

  const renderItem = ({item}) => (
    <View style={CommonStyle.shadow}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          navigation.navigate('CameraView', {
            response: item,
            isEvents: true,
          });
        }}>
        <View style={{height: perfectSize(88), width: perfectSize(111)}}>
          <Image source={{uri: item?.imageUrl}} style={styles.eventImage} />
        </View>
        <View style={styles.column}>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>{item?.deviceName}</Text>
          </View>
          <View>
            <Text style={styles.statusText}> {item?.eventName} detected</Text>
          </View>
          <View>
            <Text style={styles.timeText}>{timeAgo(item?.eventTime)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const favoriteRenderItem = ({item, index}) => (
    <CustomCameraItem
      isConnected
      title={item?.deviceDetails?.name}
      extraItemViewStyle={styles.cameraItem}
      onEventSelect={() => {
        navigation.navigate('Events', {response: item});
      }}
      onPress={() => {
        navigation.navigate('CameraView', {
          response: item,
          isLive: true,
        });
      }}
    />
  );
  const deviceVisible = devicesList.length === 0;
  const unreadCount = notificationDataList.filter(item => !item.isRead).length;
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        isDrawerIconVisible={true}
        isAdapptLogo
        isBellBtnVisible
        onBarIconPress={() => {
          navigation.openDrawer();
        }}
        onPressBellBtn={() => {
          navigation.navigate('NotificationScreen');
        }}
        notificationCount={unreadCount}
      />
      <View style={styles.cameraTitle}>
        <Text style={styles.sectionTitle}>Hi {userDetails?.firstName},</Text>
        <Text style={[CommonStyle.text, styles.titlePadding]}>
          Your journey to a secure home starts here!
        </Text>
      </View>
      {/* <View
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          height: 200,
        }}>
        <CustomDraw
          isAdd={seatsAdd}
          start={start}
          isBlock={true}
          end={end}
          dimensions={dimensions}
          onPress={onPress}
          blockAreasData={[...addSeatsData, seatsBox]}
          onEnd={seatsAdd && onEnd}
        />
      </View> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.titlePadding]}>
          <Text style={CommonStyle.sectionTitle}>
            {deviceVisible ? 'Device' : 'Favorites'}
          </Text>
        </View>
        {devicesList.filter(item => item.isFavourite).length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <FlatList
              data={devicesList.filter(item => item.isFavourite)}
              renderItem={favoriteRenderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            />
          </View>
        ) : (
          // <TouchableOpacity
          //   style={{paddingBottom: 20, alignItems: 'center'}}
          //   onPress={() => navigation.navigate('LiveViewScreen')}>
          //   <Text style={[CommonStyle.text, styles.titlePadding]}>
          //     There are no favorites. Add yours.
          //   </Text>
          // </TouchableOpacity>
          <View style={[styles.subscriptionSection, {marginTop: 20}]}>
            <View style={styles.shadowIcon}>
              <ShadowBox height="100%" width="100%" />
            </View>
            <View style={styles.subscribeView}>
              <View style={{width: '100%'}}>
                <Text style={styles.subscriptionText}>
                  {deviceVisible
                    ? 'Devices have not yet been installed.'
                    : `Don't have your favorite camera yet?`}
                </Text>
                <Button
                  name={deviceVisible ? 'Add device' : 'Add Here'}
                  extraBtnViewStyle={styles.subscribeButton}
                  extraBtnNameStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                  onPress={() => {
                    deviceVisible
                      ? navigation.navigate('Devices')
                      : navigation.navigate('LiveViewScreen');
                  }}
                />
              </View>
              <View style={styles.subscriptionImage}>
                {deviceVisible ? (
                  <NoDevice height="100%" width="100%" />
                ) : (
                  <NoFavorites height="100%" width="100%" />
                )}
              </View>
            </View>
          </View>
        )}

        {/* <FlatList
          data={[null]}
          renderItem={() => (
            <> */}
        {/* <View style={styles.titlePadding}>
                <Text style={CommonStyle.sectionTitle}>Favorites</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <CustomCameraItem
                isConnected
                title={'Baby room'}
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
              </View> */}
        <View
          style={[
            styles.cameraTitle,
            CommonStyle.row,
            {paddingTop: 10, paddingBottom: 0},
          ]}>
          <Text style={CommonStyle.sectionTitle}>Events</Text>
          {eventsData.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('EventsScreen')}>
              <Text
                style={[
                  CommonStyle.smallGreyText,
                  {textDecorationLine: 'underline'},
                ]}>
                See All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={color.GREEN} />
          </View>
        ) : eventsData.length > 0 ? (
          <View style={{backgroundColor: color.WHITE, marginTop: 20}}>
            <FlatList
              data={eventsData.slice(-3).reverse()}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={[styles.subscriptionSection, {marginTop: 20}]}>
            <View style={styles.shadowIcon}>
              <Group2 height="100%" width="100%" />
            </View>
            <View style={styles.subscribeView}>
              <View style={{width: '100%'}}>
                <Text style={styles.subscriptionText}>
                  Events have not been detected yet.
                </Text>
                <Text style={styles.noText}>
                  If you wish to set events, go to devices.
                </Text>
              </View>
              <View style={styles.subscriptionImage}>
                <NoCameraList height="100%" width="100%" />
              </View>
            </View>
          </View>
        )}
        {!userDetails?.viewOnly && (
          <View>
            <View style={styles.subscriptionTextView}>
              <Text style={CommonStyle.sectionTitle}>Explore App</Text>
            </View>

            <View style={[styles.subscriptionSection]}>
              <View style={styles.shadowIcon}>
                <ShadowBox height="100%" width="100%" />
              </View>
              <View style={styles.subscribeView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.subscriptionText}>
                    Explore Adappt with a quick tutorial!
                  </Text>
                  <Button
                    name={'Explore App'}
                    disabled={true}
                    extraBtnViewStyle={[
                      styles.subscribeButton,
                      {marginBottom: 20, backgroundColor: color.DARK_GRAY},
                    ]}
                    extraBtnNameStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                  />
                </View>
                <View style={[styles.subscriptionImage]}>
                  <Explore2 height="100%" width="100%" />
                </View>
              </View>
            </View>
            <View style={styles.subscriptionTextView}>
              <Text style={CommonStyle.sectionTitle}>Subscription</Text>
            </View>

            <View style={styles.subscriptionSection}>
              <View style={styles.shadowIcon}>
                <ShadowBox height="100%" width="100%" />
              </View>
              <View style={styles.subscribeView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.subscriptionText}>
                    Supercharge your protection-Subscribe today!
                  </Text>
                  <Button
                    name={'Subscribe'}
                    extraBtnViewStyle={[
                      styles.subscribeButton,
                      // {backgroundColor: color.DARK_GRAY},
                    ]}
                    // disabled={true}
                    onPress={() => navigation.navigate('SubscriptionScreen')}
                    extraBtnNameStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                  />
                </View>
                <View style={styles.subscriptionImage}>
                  <Frame2 height="100%" width="100%" />
                </View>
              </View>
            </View>
          </View>
        )}
        {/* </>
          )}
          showsVerticalScrollIndicator={false}
        /> */}
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={vesrionPopup}
        style={CommonStyle.modelContainerStyle}
        onBackdropPress={() => {
          // setModalVisible(false);
        }}>
        <View style={CommonStyle.modalContentStyle}>
          {/* <TouchableOpacity
            // onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity> */}
          <View style={{width: '80%', height: responsiveScale(160)}}>
            <UpdateLogo height={'100%'} width={'100%'} />
          </View>
          <Text style={[CommonStyle.greyText20, styles.deviceTitle]}>
            Update the app
          </Text>
          <Text style={[CommonStyle.text, styles.subText]}>
            To enjoy our newest features tap the button below
          </Text>
          <Button
            name={'Update Now'}
            extraBtnViewStyle={styles.extraBtnViewStyle}
            extraBtnNameStyle={{fontSize: responsiveScale(14)}}
            onPress={() => {
              onUpdateApp();
            }}
          />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={emailModal}
        // onBackdropPress={() => setEmailModal(false)}
      >
        <View style={CommonStyle.modalContentStyle}>
          {/* <TouchableOpacity
            onPress={() => setEmailModal(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity> */}
          <Text style={[CommonStyle.sectionTitle, {marginBottom: 20}]}>
            Enter your email address
          </Text>
          {/* <Text style={[CommonStyle.inputTitle, {alignSelf: 'flex-start'}]}>
            Enter your email address
          </Text> */}
          <TextInputField
            value={email}
            onchangeText={value => {
              setEmail(value);
            }}
            icon={<EmailIcon />}
            placeholder={'Email address'}
            placeholderTextColor={color.DARK_GRAY}
            // extraTextInputStyle={styles.locationTextInputWidth}
            extraInputViewStyle={styles.locationTextInputWidth}
            autoCapitalize={false}
            keyboardType={'email-address'}
          />
          <Button
            name={'Save'}
            extraBtnViewStyle={styles.extraModalBtnViewStyle}
            extraBtnNameStyle={{fontSize: responsiveScale(16)}}
            isLoading={btnLoading}
            disabled={btnLoading}
            onPress={() => {
              onSaveEmail();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: color.WHITE,
    marginBottom: 15,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 15,
  },
  eventImage: {height: '100%', width: '100%', borderRadius: 5},
  cameraItem: {
    width: '47%',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: responsiveScale(20),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.GREEN,
  },
  subscriptionImage: {
    width: responsiveScale(105),
    height: responsiveScale(109),
    paddingRight: 10,
    alignSelf: 'flex-end',
  },
  subscribeButton: {
    width: responsiveScale(125),
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  subscriptionText: {
    fontSize: responsiveScale(16),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  subscriptionSection: {
    marginBottom: 20,
    backgroundColor: color.LIGHT_GRAY_4,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shadowIcon: {
    position: 'absolute',
    width: perfectSize(260),
    top: 0,
    bottom: 0,
  },
  nameText: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(12),
    fontFamily: TTNORMSPRO_MEDIUM,
    backgroundColor: color.LIGHT_GREEN_5,
    padding: 10,
  },
  statusText: {
    color: color.DARK_GRAY_5,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    textTransform: 'capitalize',
  },
  noText: {
    color: color.DARK_GRAY,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    marginTop: 5,
  },
  timeText: {
    fontSize: responsiveScale(12),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  subscribeView: {
    flexDirection: 'row',
    width: '70%',
  },
  subscriptionTextView: {paddingTop: 10, paddingBottom: 20},
  cameraTitle: {paddingTop: 30, paddingBottom: 20},
  nameView: {borderRadius: 20, overflow: 'hidden'},
  titlePadding: {paddingTop: 10},
  loaderContainer: {
    height: responsiveScale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceTitle: {marginTop: 20},
  subText: {textAlign: 'center', marginTop: 10, marginBottom: 30},
  extraBtnViewStyle: {
    width: '50%',
  },
  locationTextInputWidth: {
    width: '100%',
  },
  extraModalBtnViewStyle: {width: '40%', marginTop: 30},
});
