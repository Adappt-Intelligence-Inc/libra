import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';
import Calender from '../../../assets/appImages/Calender.svg';
import ClockGreen from '../../../assets/appImages/ClockGreen.svg';
import CalenderGrey from '../../../assets/appImages/CalenderGrey.svg';
import {responsiveScale} from '../../../styles/mixins';
import {perfectSize} from '../../../styles/theme';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import {CommonStyle} from '../../../config/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputField from '../../../components/TextInputField';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Contacts from 'react-native-contacts';
import {
  setContactListAction,
  setLocationAction,
} from '../../../store/devicesReducer';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/Button';
import {CustomeToast} from '../../../components/CustomeToast';
import {
  createInvitees,
  getLocationList,
} from '../../../resources/baseServices/auth';
import CustomDropdown from '../../../components/CustomDropdown';
import _ from 'lodash';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AddShareDevice = ({navigation}) => {
  const [shareType, setShareType] = useState('email');
  const [accessType, setAccessType] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDevice, setSelectedDevice] = useState([]);
  const [durationSwitch, setDurationSwitch] = useState(false);
  const [contactExpand, setContactExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState('startDate');
  const [type, setType] = useState('');
  const [selectedDateAndTimes, setSelectedDateAndTimes] = useState({
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });
  const dispatch = useDispatch();
  const [dateOpen, setDateOpen] = useState(false);
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const contactList = useSelector(state => state?.devices?.contactList ?? []);
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [contacts, setContacts] = useState([]);
  const [slectedLocation, setSelectedLocation] = useState('');
  const locationList = useSelector(state => state?.devices?.locationList ?? []);

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getAllLocation();
        // PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        //   {
        //     title: 'Contacts',
        //     message: 'This app would like to view your contacts.',
        //     buttonPositive: 'Please accept bare mortal',
        //   },
        // )
        //   .then(res => {
        //     console.log('Permission: ', res);
        //     Contacts.getAll()
        //       .then(contacts => {
        //         // work with contacts
        //         console.log(contacts);
        //         dispatch(setContactListAction(contacts));
        //       })
        //       .catch(e => {
        //         console.log(e);
        //       });
        //   })
        //   .catch(error => {
        //     console.log('Permission error: ', error);
        //   });
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

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

  const onInvitePress = async () => {
    const dataEmail = {
      email: userDetails?.email,
      inviteesemail: email.toLowerCase(),
      accessibleIPCameras: selectedDevice,
      viewOnly: accessType === 'Admin' ? false : true,
    };
    const dataPhone = {
      email: userDetails?.email,
      inviteesPhoneNumber: parseInt(contact),
      accessibleIPCameras: selectedDevice,
      viewOnly: accessType === 'Admin' ? false : true,
    };

    if (shareType === 'email' && email === '') {
      CustomeToast({type: 'error', message: 'Please enter email'});
    } else if (shareType === 'contact' && contact === '') {
      CustomeToast({type: 'error', message: 'Please enter mobile number'});
    } else if (shareType === 'contact' && !validateMobile(contact)) {
      CustomeToast({type: 'error', message: 'Please enter valid phone no. !'});
    } else if (accessType === '') {
      CustomeToast({type: 'error', message: 'Please select access type'});
    } else if (selectedDevice.length === 0) {
      CustomeToast({type: 'error', message: 'Please select camera'});
    } else {
      setLoading(true);
      try {
        const data = shareType === 'email' ? dataEmail : dataPhone;
        const res = await createInvitees(data);
        if (res?.status === 200) {
          console.log('res', res);
          setLoading(false);
          CustomeToast({type: 'success', message: res?.data.msg});
          navigation.goBack();
        }
      } catch (error) {
        console.log('error', error);
        CustomeToast({type: 'error', message: error?.response?.data?.err});
        setLoading(false);
      }
    }
  };

  const validateMobile = Email => {
    var re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return re.test(Email);
  };

  const handleCheckBoxPress = eventName => {
    if (selectedDevice.includes(eventName)) {
      setSelectedDevice(selectedDevice.filter(event => event !== eventName));
    } else {
      setSelectedDevice([...selectedDevice, eventName]);
    }
  };
  const shareTypes = ['email', 'contact'];
  const accessTypes = ['View only', 'Admin'];

  const HandleDateTimeModal = (key, type) => {
    setType(type);
    setSelectedKey(key);
    setDateOpen(true);
  };

  const toggleSwitchExpansion = value => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDurationSwitch(value);
  };
  const toggleContactExpansion = value => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setContactExpand(value);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item?.phoneNumbers[0]?.number.includes('+91')) {
            setContact(item?.phoneNumbers[0]?.number.substring(3));
          } else {
            setContact(item?.phoneNumbers[0]?.number);
          }
          toggleContactExpansion(false);
        }}
        style={styles.renderItemStyle}>
        <Text style={CommonStyle.blackText14}>
          {item?.phoneNumbers[0]?.number}
        </Text>
        <Text style={[CommonStyle.smallGreyText, {marginTop: 3}]}>
          {Platform.OS === 'android'
            ? item?.displayName
            : `${item?.givenName} ${item?.middleName} ${item?.familyName}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerView}>
        <CustomHeader
          title={'Sharing camera'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
        <Text style={CommonStyle.blackTitle}>Location</Text>
        <CustomDropdown
          placeholder={'Location *'}
          onChangeValue={item => {
            setSelectedDevice([]);
            setSelectedLocation(item._id);
          }}
          extraInputViewStyle={{
            backgroundColor: color.WHITE,
            // paddingHorizontal: 20,
          }}
          valueField={'_id'}
          labelField={'location'}
          value={slectedLocation}
          // icon={
          //   <View style={[styles.imageView, {backgroundColor: color.BLACK}]}>
          //     <Camera4 height={'100%'} width={'100%'} />
          //   </View>
          // }
          data={locationList}
        />
        <Text style={[CommonStyle.blackTitle, {marginTop: 20}]}>
          Share device via
        </Text>
        <View style={CommonStyle.row}>
          {shareTypes.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setShareType(item);
                  setEmail('');
                  setContact('');
                }}
                // disabled={item === 'contact'}
                style={[
                  styles.radioContainer,
                  item === shareType && {borderWidth: 1},
                  // item === 'contact' && {opacity: 0.5},
                ]}>
                <View
                  style={[
                    styles.radioBorder,
                    item === shareType && {borderColor: color.GREEN},
                  ]}>
                  {item === shareType && <View style={styles.radio} />}
                </View>
                <Text
                  style={[
                    CommonStyle.text,
                    {textTransform: 'capitalize'},
                    item === shareType && {color: color.GREEN},
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{marginTop: 20}}>
          <Text style={[CommonStyle.blackTitle]}>
            {shareType === 'email' ? 'Email' : 'Contact number'}
          </Text>
          {shareType === 'email' ? (
            <TextInputField
              value={email}
              onchangeText={value => {
                setEmail(value);
              }}
              placeholder={'Eg. kartik@gmail.com'}
              placeholderTextColor={color.DARK_GRAY}
              keyboardType={'email-address'}
            />
          ) : (
            <TextInputField
              value={contact}
              onchangeText={value => {
                setContact(value);
                if (value !== '') {
                  const data = contactList.filter(item =>
                    item?.phoneNumbers[0]?.number?.includes(value),
                  );
                  setContacts(data);
                  toggleContactExpansion(true);
                } else {
                  toggleContactExpansion(false);
                  setContacts([]);
                }
              }}
              placeholder={'Eg. 95487 45784'}
              placeholderTextColor={color.DARK_GRAY}
              keyboardType={'number-pad'}
              maxLength={10}
            />
          )}
        </View>
        {shareType === 'contact' && contactExpand && contacts.length > 0 && (
          <LinearGradient
            start={{x: 0.9, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00937D80', '#00937D20']}
            style={[styles.linearGradient]}>
            <View style={styles.innerContainer}>
              <FlatList
                data={contacts}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </LinearGradient>
        )}
        <View style={{marginTop: 20}}>
          <Text style={CommonStyle.blackTitle}>Access type</Text>
          <View style={styles.accessTypeContainer}>
            {accessTypes.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setAccessType(item);
                  }}
                  style={[
                    styles.radioContainer,
                    {backgroundColor: color.WHITE},
                  ]}>
                  <View
                    style={[
                      styles.radioBorder,
                      item === accessType && {borderColor: color.GREEN},
                    ]}>
                    {item === accessType && <View style={styles.radio} />}
                  </View>
                  <Text
                    style={[
                      CommonStyle.text,
                      item === accessType && {color: color.GREEN},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={CommonStyle.blackTitle}>Cameras</Text>
          {slectedLocation
            ? _.filter(devicesList, {
                deviceLocation: slectedLocation,
              }).map((item, index) => {
                return (
                  <CategoryItem
                    DeviceName={item?.deviceDetails?.name}
                    // icon={getImage(item.type)}
                    // isIcon={true}
                    isCheckBox={true}
                    isChecked={selectedDevice.includes(item._id)}
                    onCheckBoxPress={() => {
                      handleCheckBoxPress(item._id);
                    }}
                    extraItemViewStyle={styles.viewMargin}
                    isDisabled={true}
                  />
                );
              })
            : devicesList.map((item, index) => {
                return (
                  <CategoryItem
                    DeviceName={item?.deviceDetails?.name}
                    // icon={getImage(item.type)}
                    // isIcon={true}
                    isCheckBox={true}
                    isChecked={selectedDevice.includes(item._id)}
                    onCheckBoxPress={() => {
                      handleCheckBoxPress(item._id);
                    }}
                    extraItemViewStyle={styles.viewMargin}
                    isDisabled={true}
                  />
                );
              })}
        </View>
        <View style={{marginTop: 20}}>
          <Text style={CommonStyle.blackTitle}>Duration</Text>
          <CategoryItem
            DeviceName={'Camera access duration'}
            isSwitchVisible={true}
            isSwithOn={durationSwitch}
            extraItemViewStyle={[
              {opacity: 0.5},
              durationSwitch && styles.expandSwitchContainer,
            ]}
            isDisabled={true}
            onSwitchChange={value => toggleSwitchExpansion(value)}
            disabledSwitch={true}
          />
          {durationSwitch && (
            <View style={[styles.expandContainer]}>
              <View>
                <Text
                  style={[
                    CommonStyle.blackText14,
                    {fontSize: responsiveScale(12), marginBottom: 10},
                  ]}>
                  Date
                </Text>
                <View style={CommonStyle.row}>
                  <TouchableOpacity
                    style={styles.CalenderView}
                    onPress={() => HandleDateTimeModal('startDate', 'date')}>
                    <View style={styles.iconView}>
                      <Calender height="100%" width="100%" />
                    </View>
                    <Text
                      style={[
                        CommonStyle.blackText14,
                        {fontSize: responsiveScale(12)},
                      ]}>
                      {moment(selectedDateAndTimes.startDate).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.CalenderView}
                    onPress={() => HandleDateTimeModal('endDate', 'date')}>
                    <View style={styles.iconView}>
                      <Calender height="100%" width="100%" />
                    </View>
                    <Text
                      style={[
                        CommonStyle.blackText14,
                        {fontSize: responsiveScale(12)},
                      ]}>
                      {moment(selectedDateAndTimes.endDate).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[CommonStyle.blackText14, styles.extraTextStyle]}>
                  Time
                </Text>
                <View style={CommonStyle.row}>
                  <TouchableOpacity
                    style={styles.CalenderView}
                    onPress={() => HandleDateTimeModal('startTime', 'time')}>
                    <View style={styles.iconView}>
                      <ClockGreen height="100%" width="100%" />
                    </View>
                    <Text
                      style={[
                        CommonStyle.blackText14,
                        {fontSize: responsiveScale(12)},
                      ]}>
                      {moment(selectedDateAndTimes.startTime).format('hh:mm A')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.CalenderView}
                    onPress={() => HandleDateTimeModal('endTime', 'time')}>
                    <View style={styles.iconView}>
                      <ClockGreen height="100%" width="100%" />
                    </View>
                    <Text
                      style={[
                        CommonStyle.blackText14,
                        {fontSize: responsiveScale(12)},
                      ]}>
                      {moment(selectedDateAndTimes.endTime).format('hh:mm A')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <DatePicker
                  modal
                  mode={type}
                  open={dateOpen}
                  date={selectedDateAndTimes[selectedKey]}
                  onConfirm={date => {
                    console.log('date', date);
                    //   setSelectedDate(new Date(date));
                    var newObj = selectedDateAndTimes;
                    newObj[selectedKey] = new Date(date);
                    setSelectedDateAndTimes({...newObj});
                    setDateOpen(false);
                  }}
                  onCancel={() => {
                    setDateOpen(false);
                  }}
                  // maximumDate={new Date()}
                />
              </View>
            </View>
          )}
        </View>
        <Button
          name={'Invite'}
          extraBtnViewStyle={styles.extraBtnViewStyle}
          isLoading={loading}
          disabled={loading}
          extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          onPress={() => {
            onInvitePress();
          }}
        />
        <View style={{height: 30}} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddShareDevice;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: color.WHITE,
  },
  headerView: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    backgroundColor: color.LIGHT_GRAY_7,
    padding: 20,
    borderRadius: 8,
    borderColor: color.LIGHT_GRAY_8,
  },
  radioBorder: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.DARK_GRAY,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: color.GREEN,
  },
  viewMargin: {marginBottom: 10},
  CalenderView: {
    borderWidth: 1,
    borderColor: '#00937D33',
    borderRadius: 50,
    paddingVertical: 7,
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.WHITE,
    paddingLeft: 10,
  },
  iconView: {
    height: responsiveScale(24),
    width: responsiveScale(24),
    marginRight: 5,
  },
  expandContainer: {
    padding: 20,
    borderWidth: 1,
    borderTopColor: color.LIGHT_GRAY_4,
    borderLeftColor: color.LIGHT_GREEN_5,
    borderRightColor: color.LIGHT_GREEN_5,
    borderBottomColor: color.LIGHT_GREEN_5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  expandSwitchContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  renderItemStyle: {
    height: responsiveScale(60),
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: color.LIGHT_GRAY_7,
  },
  linearGradient: {
    maxHeight: responsiveScale(180),
    borderRadius: 8,
    marginTop: 5,
  },
  innerContainer: {
    margin: 1,
    backgroundColor: color.WHITE,
    borderRadius: 8,
  },
  extraTextStyle: {
    maxHeight: responsiveScale(180),
    borderRadius: 8,
    marginTop: 5,
  },
  extraBtnViewStyle: {width: '40%', marginTop: 30},
  accessTypeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 8,
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
  },
});
