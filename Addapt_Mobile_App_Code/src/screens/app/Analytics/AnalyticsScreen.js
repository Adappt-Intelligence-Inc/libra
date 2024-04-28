import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import CustomDropdown from '../../../components/CustomDropdown';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveScale} from '../../../styles/mixins';
import CCTV from '../../../assets/appImages/CCTV.svg';
import CameraGreen from '../../../assets/appImages/CameraGreen.svg';
import Group from '../../../assets/appImages/Group.svg';
import GroupBlack from '../../../assets/appImages/GroupBlack.svg';
import LiveCamera from '../../../assets/appImages/LiveCamera.svg';
import LiveCameraGreen from '../../../assets/appImages/LiveCameraGreen.svg';
import OfflineCamera from '../../../assets/appImages/OfflineCamera.svg';
import OfflineCameraGreen from '../../../assets/appImages/OfflineCameraGreen.svg';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import {perfectSize} from '../../../styles/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getBasicAnalytics,
  getDeviceBasicAnalytics,
  getDevicesList,
  getEventDurations,
} from '../../../resources/baseServices/auth';
import {setDevicesListAction} from '../../../store/devicesReducer';

const AnalyticsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [slectedDevice, setSelectedDevice] = useState('');
  const [type, setType] = useState('Daily');
  const locationList = useSelector(state => state?.devices?.locationList ?? []);
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const qualityData = useSelector(
    state => state?.devices?.devicesQualityList ?? [],
  );
  const [selected, setSelected] = useState(0);
  const [slectedCamera, setSelectedCamera] = useState([]);
  const [slectedWeek, setSelectedWeek] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [deviceNumberdata, setDeviceNumberdata] = useState({});
  const [slectedLocation, setSelectedLocation] = useState('');

  const currentDate = new Date();
  const dayStartTime = currentDate.toISOString().split('T')[0] + 'T00:00:00';
  const dayEndTime = currentDate.toISOString().split('T')[0] + 'T23:59:59';

  function getStartAndEndOfWeek() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = currentDay - 1; // Calculate the difference from the first day of the week (assuming Monday is the first day)

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0); // Set to the beginning of the day

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Set to the end of the day

    return {
      startOfWeek: startOfWeek.toISOString().split('T')[0] + 'T00:00:00', // Format as 'YYYY-MM-DD'
      endOfWeek: endOfWeek.toISOString().split('T')[0] + 'T23:59:59', // Format as 'YYYY-MM-DD'
    };
  }

  const {startOfWeek, endOfWeek} = getStartAndEndOfWeek();

  function getStartAndEndOfMonth() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    return {
      startOfMonth: firstDayOfMonth.toISOString().split('T')[0] + 'T23:59:59', // Format as 'YYYY-MM-DD'
      endOfMonth: lastDayOfMonth.toISOString().split('T')[0] + 'T23:59:59', // Format as 'YYYY-MM-DD'
    };
  }
  const {startOfMonth, endOfMonth} = getStartAndEndOfMonth();

  const activeDate = [
    {
      title: 'Total camera',
      total: deviceNumberdata?.totalDevices || '00',
      seletedIcon: <CameraGreen height={'100%'} width={'100%'} />,
      icon: <CCTV height={'100%'} width={'100%'} />,
    },
    {
      title: 'Active camera',
      total: deviceNumberdata?.activeDevices || '00',
      seletedIcon: <LiveCameraGreen height={'100%'} width={'100%'} />,
      icon: <LiveCamera height={'100%'} width={'100%'} />,
    },
    {
      title: 'Offline camera',
      total: deviceNumberdata?.inactiveDevices || '00',
      seletedIcon: <OfflineCameraGreen height={'100%'} width={'100%'} />,
      icon: <OfflineCamera height={'100%'} width={'100%'} />,
    },
  ];
  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getAllDevice();
        getAllBasicAnalytics();
        setSelectedDevice(devicesList[0]?._id);
        EventDurations(devicesList[0]?._id, dayStartTime, dayEndTime);
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const getAllBasicAnalytics = async () => {
    try {
      const getData = await getBasicAnalytics(userDetails?.email);
      console.log('getBasicAnalytics', getData);
      const res = getData.data.data;
      if (res) {
        setDeviceNumberdata(res[0]);
        // dispatch(setDevicesListAction(AddedDevice));
      } else {
        // dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      // dispatch(setDevicesListAction([]));
    }
  };

  const DeviceBasicAnalytics = async () => {
    try {
      const getData = await getDeviceBasicAnalytics(userDetails?.email);
      console.log('getDeviceBasicAnalytics', getData);
      const res = getData.data.data;
      if (res) {
        setDeviceNumberdata(res[0]);
        // dispatch(setDevicesListAction(AddedDevice));
      } else {
        // dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      // dispatch(setDevicesListAction([]));
    }
  };

  const EventDurations = async (id, startDate, endDate) => {
    const data = devicesList.find(d => d._id === id);
    try {
      const getData = await getEventDurations(
        userDetails?.email,
        data?._id,
        data?.deviceLocation,
        startDate,
        endDate,
      );
      const res = getData.data.data;
      console.log('getEventDurations', res);
      if (res) {
        setTypeData(res);
        // setDeviceNumberdata(res[0]);
        // dispatch(setDevicesListAction(AddedDevice));
      } else {
        setTypeData([]);
        // dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      setTypeData([]);
      // dispatch(setDevicesListAction([]));
    }
  };

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
  const networkData = [
    {value: 'Wi-Fi', label: 'Connection type'},
    {value: 'connected', label: 'Internet  status'},
    {value: 'ON', label: 'Active'},
    {value: '16ms', label: 'Network delay'},
  ];
  const videoData = [
    {value: 'resolution', label: 'Resolution :'},
    {value: 'refresh_rate', label: 'Frame rate :'},
    {value: 'max_bitrate', label: 'Max Bitrate :'},
    {value: 'hdr_support', label: 'HDR support :'},
  ];

  const convertToKbps = num => {
    return (num * 1) / 1024;
  };

  const getAllData = (id, key) => {
    const data = qualityData.find(d => d.id === id);
    switch (key) {
      case 'resolution':
        return getResolution(data?.quality) || '';
      case 'refresh_rate':
        return '0Hz';
      case 'max_bitrate':
        return data?.bandwidth
          ? convertToKbps(data?.bandwidth).toFixed(0) + 'Kbps'
          : '0Kbps';
      case 'hdr_support':
        return 'N/A';
      default:
        break;
    }
  };
  const getResolution = key => {
    switch (key) {
      case 480:
        return 'SD';
      case 720:
        return 'HD';
      case 1080:
        return 'FHD';
      case 1440:
        return '2K';
      case 2160:
        return '4K';
      case 4320:
        return '8K';
      default:
        return 'NA';
    }
  };
  const Types = ['Daily', 'Weekly', 'Monthly'];
  const {top} = useSafeAreaInsets();
  const weeksInMonth = getWeeksInMonth();
  const monthsInYear = getMonthsInYear();

  function getMonthsInYear() {
    const currentYear = new Date().getFullYear();
    const months = [];

    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(currentYear, month, 1);
      const lastDayOfMonth = new Date(currentYear, month + 1);

      const monthName = new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(firstDayOfMonth);

      const formattedStartDate = `${currentYear}-${('0' + (month + 1)).slice(
        -2,
      )}-01`;

      months.push({
        month: monthName,
        startDate: formattedStartDate + 'T00:00:00',
        endDate: lastDayOfMonth.toISOString().split('T')[0] + 'T23:59:59',
      });
    }

    return months;
  }

  function getWeeksInMonth() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1);

    const weeks = [];
    let currentWeek = [];
    let currentDay = firstDayOfMonth;

    while (currentDay <= lastDayOfMonth) {
      currentWeek.push(new Date(currentDay));

      if (currentDay.getDay() === 6) {
        // Saturday, end of the week
        const weekStartDate = new Date(currentWeek[0]);
        const weekEndDate = new Date(currentWeek[currentWeek.length - 1]);

        weeks.push({
          startDate: weekStartDate.toISOString().split('T')[0] + 'T00:00:00',
          endDate: weekEndDate.toISOString().split('T')[0] + 'T23:59:59',
        });

        currentWeek = [];
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    // If the last week is not complete, add it
    if (currentWeek.length > 0) {
      const weekStartDate = new Date(currentWeek[0]);
      const weekEndDate = new Date(currentWeek[currentWeek.length - 1]);

      weeks.push({
        startDate: weekStartDate.toISOString().split('T')[0] + 'T00:00:00',
        endDate: weekEndDate.toISOString().split('T')[0] + 'T23:59:59',
      });
    }

    return weeks;
  }

  const convertHours = totalHours => {
    const hours = Math.floor(totalHours);
    const decimalPart = totalHours - hours;
    const minutes = Math.round(decimalPart * 60);
    const formattedTime = `${hours}h ${minutes}m`;
    return formattedTime;
  };

  return (
    <View style={[styles.mainContainer, {paddingTop: top + 20}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomDropdown
          placeholder={'Location'}
          extraInputViewStyle={{
            backgroundColor: color.WHITE,
            paddingHorizontal: 20,
          }}
          onChangeValue={item => {
            setSelectedLocation(item._id);
          }}
          valueField={'_id'}
          labelField={'location'}
          value={slectedLocation}
          data={locationList}
        />
        <View style={[CommonStyle.row, {marginVertical: 20}]}>
          {activeDate.map((item, index) => {
            return (
              <LinearGradient
                start={{x: 0.9, y: 0}}
                end={{x: 1, y: 1}}
                colors={
                  selected === index
                    ? ['#0CB69C', '#00927D']
                    : ['#F3F4F4', '#F3F4F4']
                }
                style={[styles.linearGradient]}>
                <TouchableOpacity disabled onPress={() => setSelected(index)}>
                  <View
                    style={{
                      position: 'absolute',
                      height: '100%',
                      width: '100%',
                    }}>
                    {selected === index ? (
                      <Group height="100%" width="100%" />
                    ) : (
                      <GroupBlack height="100%" width="100%" />
                    )}
                  </View>
                  <View style={{padding: responsiveScale(10)}}>
                    <View
                      style={[
                        styles.imageContainer,
                        selected === index && {backgroundColor: color.WHITE},
                      ]}>
                      {selected === index ? item.seletedIcon : item.icon}
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        CommonStyle.smallBlackText,
                        {marginVertical: responsiveScale(5)},
                        selected === index && {color: color.WHITE},
                      ]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        CommonStyle.blackText14,
                        selected === index && {color: color.WHITE},
                      ]}>
                      {item.total}
                    </Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </View>
        <Text style={CommonStyle.sectionTitle}>Device-Specific Analytics</Text>
        <View style={styles.deviceContainer}>
          <CustomDropdown
            placeholder={'Device'}
            extraInputViewStyle={{
              backgroundColor: color.WHITE,
              paddingHorizontal: 20,
            }}
            onChangeValue={item => {
              setSelectedDevice(item.value);
              EventDurations(item.value, dayStartTime, dayEndTime);
              setSelectedWeek(null);
              setSelectedMonth('');
              setType('Daily');
            }}
            value={slectedDevice}
            data={devicesList.map(item => {
              return {
                label: item?.deviceDetails?.name,
                value: item?._id,
              };
            })}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {Types.map(item => {
              return (
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item === 'Daily') {
                        EventDurations(slectedDevice, dayStartTime, dayEndTime);
                      }
                      if (item === 'Weekly') {
                        EventDurations(slectedDevice, startOfWeek, endOfWeek);
                      }
                      if (item === 'Monthly') {
                        EventDurations(slectedDevice, startOfMonth, endOfMonth);
                      }
                      setType(item);
                      setSelectedWeek(null);
                      setSelectedMonth('');
                      setTypeData([]);
                    }}
                    style={[
                      styles.radioBorder,
                      item === type && {borderColor: color.GREEN},
                    ]}>
                    {item === type && <View style={styles.radio} />}
                  </TouchableOpacity>
                  <Text
                    style={[
                      CommonStyle.text,
                      item === type && {color: color.GREEN},
                    ]}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
          {/* {type === 'Weekly' && weeksInMonth.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 20}}>
              {weeksInMonth.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      handleWeekSelection(index),
                        EventDurations(
                          slectedDevice,
                          item.startDate,
                          item.endDate,
                        );
                    }}
                    style={[
                      styles.selectContainer,
                      slectedWeek === index && {
                        borderColor: color.LIGHT_GREEN_8,
                        backgroundColor: color.LIGHT_GREEN_11,
                      },
                      {
                        paddingHorizontal:
                          type === 'Monthly'
                            ? perfectSize(20)
                            : perfectSize(10),
                      },
                    ]}>
                    <Text
                      style={[
                        CommonStyle.smallGreyText,
                        slectedWeek === index && {
                          color: color.GREEN,
                        },
                      ]}>
                      {`Week ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          {type === 'Monthly' && monthsInYear.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 20}}>
              {monthsInYear.map(item => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      setSelectedMonth(item.month);
                      EventDurations(
                        slectedDevice,
                        item.startDate,
                        item.endDate,
                      );
                    }}
                    style={[
                      styles.selectContainer,
                      selectedMonth === item.month && {
                        borderColor: color.LIGHT_GREEN_8,
                        backgroundColor: color.LIGHT_GREEN_11,
                      },
                      {
                        paddingHorizontal:
                          type === 'Monthly'
                            ? perfectSize(20)
                            : perfectSize(10),
                      },
                    ]}>
                    <Text
                      style={[
                        CommonStyle.smallGreyText,
                        selectedMonth === item.month && {
                          color: color.GREEN,
                        },
                      ]}>
                      {item.month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )} */}
          <FlatList
            data={typeData}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[styles.selectContainer5]}>
                  <Text
                    style={[
                      CommonStyle.smallGreenText,
                      {textTransform: 'capitalize'},
                    ]}
                    numberOfLines={1}>
                    {item.type} detection
                  </Text>
                  <Text
                    style={[[CommonStyle.smallGreyText, {marginTop: 5}]]}
                    numberOfLines={1}>
                    Duration :{' '}
                    {item.type === 'PACKAGE'
                      ? 'N/A'
                      : convertHours(item.totalHours)}
                  </Text>
                  <Text
                    style={[
                      CommonStyle.smallGreyText,
                      {color: color.DARK_GRAY_5, marginTop: 5},
                    ]}>
                    # Occurrence: {item.occurences}
                  </Text>
                </TouchableOpacity>
              );
            }}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
          />
        </View>
        <Text style={CommonStyle.sectionTitle}>Video Quality Diagnostics</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 20}}>
          {devicesList.map(item1 => {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.selectContainer3]}>
                <Text style={[CommonStyle.blackText14]}>
                  {item1?.deviceDetails?.name}
                </Text>
                <FlatList
                  data={videoData}
                  renderItem={({item}) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={[styles.selectContainer6]}>
                        <Text style={[CommonStyle.text]} numberOfLines={1}>
                          {item.label}
                        </Text>
                        <Text
                          style={[CommonStyle.blackText14, {marginTop: 5}]}
                          numberOfLines={1}>
                          {getAllData(item1?._id, item.value)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  numColumns={2}
                  style={{width: responsiveScale(240)}}
                  columnWrapperStyle={{justifyContent: 'space-between'}}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Text style={CommonStyle.sectionTitle}>Network Health</Text>
        <View style={styles.deviceContainer}>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {devicesList.map(item => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    handleCameraSelection(item?.deviceDetails?.name)
                  }
                  style={[
                    styles.selectContainer,
                    slectedCamera.includes(item?.deviceDetails?.name) && {
                      borderColor: color.LIGHT_GREEN_8,
                      backgroundColor: color.LIGHT_GREEN_11,
                    },
                  ]}>
                  <Text
                    style={[
                      CommonStyle.text,
                      slectedCamera.includes(item?.deviceDetails?.name) && {
                        color: color.GREEN,
                      },
                    ]}>
                    {item?.deviceDetails?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView> */}
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {Types.map(item => {
              return (
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    onPress={() => setType(item)}
                    style={[
                      styles.radioBorder,
                      item === type && {borderColor: color.GREEN},
                    ]}>
                    {item === type && <View style={styles.radio} />}
                  </TouchableOpacity>
                  <Text
                    style={[
                      CommonStyle.text,
                      item === type && {color: color.GREEN},
                    ]}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </View> */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 20}}>
            {[1, 2, 3, 4].map(item => {
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => handleWeekSelection(item)}
                  style={[
                    styles.selectContainer,
                    slectedWeek.includes(item) && {
                      borderColor: color.LIGHT_GREEN_8,
                      backgroundColor: color.LIGHT_GREEN_11,
                    },
                    {
                      paddingHorizontal: perfectSize(10),
                    },
                  ]}>
                  <Text
                    style={[
                      CommonStyle.smallGreyText,
                      slectedWeek.includes(item) && {
                        color: color.GREEN,
                      },
                    ]}>
                    {`Week ${item}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView> */}
          <CustomDropdown
            placeholder={'Living Room'}
            extraInputViewStyle={{
              backgroundColor: color.WHITE,
              paddingHorizontal: 20,
            }}
            onChangeValue={item => {
              // setSelectedDevice(item.value);
            }}
            value={slectedDevice}
            data={devicesList.map(item => {
              return {
                label: item?.deviceDetails?.name,
                value: item?.deviceDetails?.streamName,
              };
            })}
          />
          <View style={[styles.selectContainer2, {marginTop: 20}]}>
            <FlatList
              data={networkData}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.selectContainer4]}>
                    <Text style={[CommonStyle.smallGreyText]} numberOfLines={1}>
                      {item.label}
                    </Text>
                    <Text
                      style={[CommonStyle.smallBlackBoldText, {marginTop: 5}]}>
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              numColumns={2}
              columnWrapperStyle={{justifyContent: 'space-between'}}
            />
          </View>
        </View>
        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: color.WHITE,
    padding: 20,
  },
  linearGradient: {
    width: '32%',
    borderRadius: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    height: responsiveScale(90),
  },
  imageContainer: {
    height: responsiveScale(24),
    width: responsiveScale(24),
    borderRadius: responsiveScale(12),
    backgroundColor: color.GREEN,
    padding: responsiveScale(4),
  },
  label: {
    color: color.DARK_GRAY_3,
    fontSize: responsiveScale(10),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  selectContainer: {
    height: perfectSize(40),
    paddingHorizontal: perfectSize(25),
    alignItems: 'center',
    borderRadius: perfectSize(40),
    borderColor: '#E5E5E5',
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  selectContainer2: {
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    marginRight: 10,
    backgroundColor: color.LIGHT_GRAY_4,
  },
  selectContainer4: {
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    marginTop: 10,
    backgroundColor: color.WHITE,
    width: '48%',
  },
  selectContainer6: {
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    marginTop: 10,
    backgroundColor: color.LIGHT_GRAY_4,
    width: responsiveScale(115),
  },
  selectContainer5: {
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    marginTop: 10,
    backgroundColor: color.LIGHT_GRAY_4,
    width: '48%',
  },
  selectContainer3: {
    padding: perfectSize(10),
    borderRadius: perfectSize(8),
    marginRight: 10,
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
  },
  deviceContainer: {
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginRight: 20,
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
});
