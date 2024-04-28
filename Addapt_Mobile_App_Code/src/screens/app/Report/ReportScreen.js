import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import {deviceWidth, perfectSize} from '../../../styles/theme';
import {color} from '../../../config/color';
import {WINDOW_WIDTH, responsiveScale} from '../../../styles/mixins';
import Image3 from '../../../assets/appImages/Image3.svg';
import Share from '../../../assets/appImages/Share.svg';
import Close from '../../../assets/appImages/Close.svg';
import AngleRight from '../../../assets/appImages/AngleRight.svg';
import ColorGraph from '../../../assets/appImages/ColorGraph.svg';
import ClockBlack from '../../../assets/appImages/ClockBlack.svg';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import Button from '../../../components/Button';
import CustomDropdown from '../../../components/CustomDropdown';
import {useDispatch, useSelector} from 'react-redux';
// import {BarChart} from 'react-native-chart-kit';
import {BarChart} from 'react-native-gifted-charts';
import Modal from 'react-native-modal';
import {
  getEventInsights,
  getEventTypesList,
  getEventsReport,
  getLocationList,
} from '../../../resources/baseServices/auth';
import {
  setEventsTypesAction,
  setLocationAction,
} from '../../../store/devicesReducer';
import moment from 'moment';

const ReportScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [insightsData, setInsightsData] = useState([]);
  const currentFilterDate = new Date().toLocaleDateString();

  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const eventTypesList = useSelector(
    state => state?.devices?.eventTypesList ?? [],
  );
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const locationList = useSelector(state => state?.devices?.locationList ?? []);

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getAllLocation();
        getAllEvents();
        // getDeviceEventsInsights();
        setSelectedCamera(locationList[0]._id);
        setSelectedEvent(eventTypesList[0].type);
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
  const getAllEvents = async () => {
    try {
      const getList = await getEventTypesList(userDetails?.email);
      const events = getList.data.data;
      if (events.length > 0) {
        dispatch(setEventsTypesAction(events));
        setSelectedEvent(events[0].type);
      } else {
        dispatch(setEventsTypesAction([]));
      }
    } catch (error) {
      console.log('ee', error);
      dispatch(setLocationAction([]));
    }
  };
  //   const [isModalVisible, setModalVisible] = useState(false);

  const data = {
    labels: ['Mo', 'Tu', 'Wed', 'Th', 'Fr', 'Sa', 'Su'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const getDeviceEventsReport = async () => {
    try {
      const getData = await getEventsReport(
        userDetails?.email,
        selectedCamera,
        selectedEvent.toUpperCase(),
      );
      const res = getData.data.data;
      // console.log('getDeviceEventsReport', res);
      if (res) {
        setReportData(res);

        // dispatch(setDevicesListAction(AddedDevice));
      } else {
        // dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      // dispatch(setDevicesListAction([]));
    }
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const dayStartTime = currentDate.toISOString().split('T')[0] + 'T00:00:00';
  currentDate.setHours(23, 59, 59, 999);
  const dayEndTime = currentDate.toISOString().split('T')[0] + 'T23:59:59';

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T23:59:59`;
  }

  const lastSeventhDay = new Date(currentDate);
  lastSeventhDay.setDate(currentDate.getDate() - 6);

  const formattedCurrentDate = formatDate(currentDate);
  const formattedLastSeventhDay = formatDate(lastSeventhDay);

  const getDeviceEventsInsights = async () => {
    try {
      const getData = await getEventInsights(
        userDetails?.email,
        selectedCamera,
        formattedLastSeventhDay,
        formattedCurrentDate,
      );
      const res = getData.data.data;
      console.log('getEventInsights', res);
      if (res.length > 0) {
        setInsightsData(res);
        // setModalVisible(true);
        // dispatch(setDevicesListAction(AddedDevice));
      } else {
        // dispatch(setDevicesListAction([]));
      }
    } catch (error) {
      console.log('eee', error);
      // dispatch(setDevicesListAction([]));
    }
  };

  useEffect(() => {
    if (selectedCamera !== '' && selectedEvent !== '') {
      getDeviceEventsReport();
      getDeviceEventsInsights();
    }
  }, [selectedCamera, selectedEvent]);

  const getAllData = key => {
    switch (key) {
      case 'earlyMorning':
        return {
          time: '12:00 AM to 06:00 AM',
          title: 'Early Morning',
          backgroundColor: '#11A9A0',
          borderColor: '#D0F9F6',
        };
      case 'morning':
        return {
          time: '06:00 AM - 12:00 PM',
          title: 'Morning',
          backgroundColor: '#FFCD4E',
          borderColor: '#FFF8E7',
        };
      case 'afternoon':
        return {
          time: '12:00 PM - 06:00 PM',
          title: 'Afternoon',
          backgroundColor: '#6DA9E4',
          borderColor: '#E1F0FF',
        };
      case 'night':
        return {
          time: '06:00 PM - 12:00 PM',
          title: 'Night',
          backgroundColor: '#F19898',
          borderColor: '#FFEBEB',
        };
      default:
        break;
    }
  };
  const stackData = [
    {
      stacks: [
        {value: 10, color: 'orange'},
        {value: 20, color: '#4ABFF4'},
      ],
      label: 'Mo',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 10, color: '#4ABFF4'},
        {value: 11, color: 'orange'},
        {value: 15, color: '#28B2B3'},
      ],
      label: 'Tu',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 14, color: 'orange'},
        {value: 18, color: '#4ABFF4'},
      ],
      label: 'We',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 7, color: '#4ABFF4'},
        {value: 11, color: 'orange'},
        {value: 10, color: '#28B2B3'},
      ],
      label: 'Th',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 10, color: '#4ABFF4'},
        {value: 11, color: 'orange'},
        {value: 15, color: '#28B2B3'},
      ],
      label: 'Fr',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 14, color: 'orange'},
        {value: 18, color: '#4ABFF4'},
      ],
      label: 'Sa',
      labelTextStyle: CommonStyle.graphText,
    },
    {
      stacks: [
        {value: 7, color: '#4ABFF4'},
        {value: 11, color: 'orange'},
        {value: 10, color: '#28B2B3'},
      ],
      label: 'Su',
      labelTextStyle: CommonStyle.graphText,
    },
  ];

  const getDayLabel = day => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return days.indexOf(day.substring(0, 2));
  };

  const transformedData = {};

  reportData?.forEach(item => {
    if (item.day) {
      const dayLabel = getDayLabel(item.day);
      if (!transformedData[dayLabel]) {
        transformedData[dayLabel] = {
          stacks: [],
          label:
            item.day.substring(0, 2) +
            '\n' +
            `${new Date(item.date).getDate()}`,
          labelTextStyle: CommonStyle.graphText,
        };
      }
      transformedData[dayLabel].stacks.push({
        value: item.totalMinutes / 60,
        color: getAllData(item.time).backgroundColor,
      });
    }
  });

  const resultArray = Object.values(transformedData);

  function formatMinutesToHoursAndMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0 && hours === 0) {
      return '- -';
    } else if (hours === 0) {
      return `${remainingMinutes}m`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  return (
    <View
      style={[CommonStyle.sectionContainer, CommonStyle.flex, styles.padding0]}>
      <View style={styles.headerStyle}>
        <CustomHeader
          title={'Event report'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
          // isSearchBtnVisible
          // onPressSearchBtn={() => setModalVisible(true)}
        />
      </View>
      <ScrollView
        style={styles.camerasView}
        showsVerticalScrollIndicator={false}>
        {insightsData.length > 0 && (
          <Text style={[CommonStyle.sectionTitle]}>Insights</Text>
        )}
        {insightsData.map(item => {
          return (
            item?.insight && (
              <TouchableOpacity
                style={styles.container}
                onPress={() =>
                  navigation.navigate('EventsScreen', {
                    insightEvents: item?.events,
                  })
                }>
                <View style={{width: '90%'}}>
                  <Text
                    style={[
                      CommonStyle.smallBoldGreenText,
                      {textTransform: 'capitalize'},
                    ]}>
                    {item?.events[0]?.eventType} detected
                  </Text>
                  <Text style={[CommonStyle.smallGreyText, {marginTop: 10}]}>
                    {item?.insight}
                  </Text>
                  <View style={[styles.timeContainer]}>
                    <View style={styles.iconView}>
                      <ClockBlack height="100%" width="100%" />
                    </View>
                    <Text style={styles.nameText}>
                      {moment(
                        item?.events[item?.events?.length - 1]?.startTime,
                      ).format('hh:mm A')}
                      {' to '}
                      {moment(item?.events[0]?.endTime).format('hh:mm A')}
                    </Text>
                  </View>
                </View>
                <AngleRight />
              </TouchableOpacity>
            )
          );
        })}
        <View
          style={[
            CommonStyle.row,
            {marginTop: insightsData.length > 0 ? 30 : 0},
          ]}>
          <CustomDropdown
            placeholder={'Location'}
            onChangeValue={item => {
              setSelectedCamera(item.value);
            }}
            extraInputViewStyle={{
              backgroundColor: color.WHITE,
              // paddingHorizontal: 20,
            }}
            extraLinearViewStyle={{
              width: '48%',
            }}
            value={selectedCamera}
            data={[
              // {label: 'All', value: 'all'},
              ...locationList.map(item => {
                return {
                  label: item?.location,
                  value: item?._id,
                };
              }),
            ]}
          />
          <CustomDropdown
            placeholder={'Events'}
            onChangeValue={item => {
              setSelectedEvent(item.type);
            }}
            extraInputViewStyle={{
              backgroundColor: color.WHITE,
              // paddingHorizontal: 20,
            }}
            labelField="type"
            valueField="type"
            extraLinearViewStyle={{
              width: '48%',
            }}
            value={selectedEvent}
            data={eventTypesList}
          />
        </View>
        {/* <View style={{marginTop: perfectSize(40), opacity: 0.3}}>
          <ColorGraph width={'100%'} />
        </View> */}
        <View style={{marginTop: 40, overflow: 'hidden'}}>
          <BarChart
            width={WINDOW_WIDTH - responsiveScale(90)}
            // rotateLabel
            barWidth={responsiveScale(10)}
            spacing={(WINDOW_WIDTH - responsiveScale(170)) / 7}
            noOfSections={5}
            // barBorderRadius={6}
            stackData={resultArray}
            stackBorderRadius={responsiveScale(10)}
            yAxisLabelSuffix={'h'}
            yAxisSide={'right'}
            yAxisTextStyle={CommonStyle.graphText}
            yAxisColor={color.LIGHT_GRAY}
            xAxisColor={color.LIGHT_GRAY}
            yAxisThickness={0.7}
            yAxisLabelWidth={responsiveScale(30)}
            xAxisTextNumberOfLines={2}
            disableScroll
            onPress={data => console.log('onPress', data)}
            onPressOut={() => console.log('onPressOut')}
          />
        </View>
        {/* <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '80%',
            }}>
            <View style={styles.dot}></View>
            <Text style={CommonStyle.blackText14} numberOfLines={1}>
              Day time(8:00 Am-11:59 Pm)
            </Text>
          </View>
          <Text style={CommonStyle.smallGreyText}>11 mins</Text>
        </View> */}
        {reportData.filter(
          item =>
            new Date(item.date).toLocaleDateString() === currentFilterDate,
        ).length > 0 &&
          reportData
            .filter(
              item =>
                new Date(item.date).toLocaleDateString() === currentFilterDate,
            )
            .map(item => {
              return (
                <View style={styles.container}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      width: '80%',
                    }}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: getAllData(item.time)
                            .backgroundColor,
                          borderColor: getAllData(item.time).borderColor,
                        },
                      ]}></View>
                    <View>
                      <Text style={CommonStyle.blackText14} numberOfLines={1}>
                        {getAllData(item.time).title}
                      </Text>
                      <Text
                        style={[CommonStyle.blackText14, {marginTop: 10}]}
                        numberOfLines={1}>
                        {getAllData(item.time).time}
                      </Text>
                    </View>
                  </View>
                  <Text style={CommonStyle.smallGreyText}>
                    {formatMinutesToHoursAndMinutes(
                      item.totalMinutes.toFixed(0),
                    )}
                  </Text>
                </View>
              );
            })}
        {/* <TouchableOpacity style={styles.container}>
          <View style={{width: '90%'}}>
            <Text style={CommonStyle.blackText14}>
              We’ve detected higher than normal activity on this camera during
              daytime
            </Text>
          </View>
          <AngleRight />
        </TouchableOpacity>
        <TouchableOpacity style={styles.container}>
          <View style={{width: '90%'}}>
            <Text style={CommonStyle.blackText14}>
              2 package-related events were captured on this camera
            </Text>
          </View>
          <AngleRight />
        </TouchableOpacity> */}
        {/* <BarChart
          data={data}
          width={deviceWidth}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
        {/* <BarChart
          touchEnabled={false}
          style={{
            height: 220,
            width: (SCREEN_WIDTH / 10) * 8.5,
            alignSelf: 'center',
          }}
          legend={{
            enabled: true,
            textSize: 12,
            form: 'CIRCLE',
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'BOTTOM',
            orientation: 'HORIZONTAL',
            wordWrapEnabled: true,
            fontFamily: FONT_POPPINS_MEDIUM,
          }}
          chartDescription={{text: ''}}
          data={{
            dataSets: [
              {
                values: invoice,
                label: MText({tid: 'invoice'}),
                config: {
                  colors: [processColor(PRIMARY)],
                  valueTextColor: processColor(BLACK),
                  valueFormatter: '#',
                  drawValues: false,
                  highlightColor: processColor('red'),
                  valueTextSize: 6,
                },
              },
              {
                values: payment,
                label: MText({tid: 'Payment'}),
                config: {
                  colors: [processColor('#077600')],
                  valueTextColor: processColor(BLACK),
                  valueFormatter: '#',
                  highlightColor: processColor('red'),
                  drawValues: false,
                  valueTextSize: 6,
                },
              },
            ],
            config: {
              barWidth: 0.2,
              group: {
                fromX: 0,
                groupSpace: 0.35,
                barSpace: 0.1,
              },
            },
          }}
          drawEntryLabels={false}
          usePercentValues={true}
          xAxis={{
            enabled: true,
            textColor: processColor(BLACK),
            textSize: 10,
            position: 'BOTTOM',
            drawGridLines: false,
            granularityEnabled: true,
            labelRotationAngle: 45,
            valueFormatter: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'June',
              'July',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            labelCount: 12,
          }}
          yAxis={{
            left: {
              enabled: true,
              // textColor: processColor(PRIMARY),
              // textSize: 11,
              // drawGridLines: false,
              // valueFormatter: '₹',
              // fontFamily: ,
            },
            right: {
              enabled: false,
            },
          }}
          drawValueAboveBar={true}
          styledCenterText={{
            text: '',
            color: processColor(WHITE),
            fontFamily: FONT_POPPINS_MEDIUM,
            size: 20,
          }}
          onSelect={() => console.log('press')}
          animation={{
            durationX: 0,
            durationY: 1000,
            easingY: 'EaseOutCirc',
            random: Math.random(),
          }}
          marker={{
            enabled: true,
            markerColor: processColor('#F0C0FF8C'),
            textColor: processColor('white'),
            markerFontSize: 14,
          }}
        /> */}
        <View style={{height: 40}} />
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        style={CommonStyle.modelContainerStyle}
        onBackdropPress={() => setModalVisible(false)}
        visible={isModalVisible}>
        <View style={CommonStyle.modalContentStyle}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Text style={[CommonStyle.greyText20]}>Insights</Text>
          {/* {insightsData.map(item => {
            return (
              <TouchableOpacity
                style={[
                  styles.container,
                  {paddingVertical: 10, width: '100%'},
                ]}>
                <View style={{width: '85%'}}>
                  <Text
                    style={[
                      CommonStyle.smallBoldGreenText,
                      {textTransform: 'capitalize'},
                    ]}>
                    {item?.events[0]?.eventType} detected
                  </Text>
                  <Text style={[CommonStyle.smallGreyText, {marginTop: 10}]}>
                    {item?.insight}
                    <Text style={[{color: color.DARK_GRAY_5}]}>
                      10:23 AM - 10:34 AM -{' '}
                    </Text>
                    <Text style={CommonStyle.smallGreyText}>
                      Your pet has been detected near the backyard.
                    </Text>
                  </Text>
                  <View style={[styles.timeContainer]}>
                    <View style={styles.iconView}>
                      <ClockBlack height="100%" width="100%" />
                    </View>
                    <Text style={styles.nameText}>
                      {moment(item?.events[0]?.eventTime).format('hh:mm A')}
                      {' to '}
                      {moment(
                        item?.events[item?.events?.length - 1]?.endTime,
                      ).format('hh:mm A')}
                    </Text>
                  </View>
                  <View style={[styles.timeContainer]}>
                <View style={styles.iconView}>
                  <ClockGrey height="100%" width="100%" />
                </View>
                <Text
                  style={[CommonStyle.text, {fontSize: responsiveScale(10)}]}>
                  {'10:00 Am to 10:20 Am'}
                </Text>
              </View>
                </View>
                <AngleRight />
              </TouchableOpacity>
            );
          })} */}

          {/* <TouchableOpacity
            style={[styles.container, {paddingVertical: 10, width: '100%'}]}>
            <View style={{width: '85%'}}>
              <Text style={CommonStyle.smallGreenText}>
                Instant Face Recognition -{' '}
                <Text style={[{color: color.DARK_GRAY_5}]}>06:30 PM - </Text>
                <Text style={CommonStyle.smallGreyText}>
                  Rohan's face recognized at the entrance.
                </Text>
              </Text>
            </View>
            <AngleRight />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.container, {paddingVertical: 10, width: '100%'}]}>
            <View style={{width: '85%'}}>
              <Text style={CommonStyle.smallGreenText}>
                Package Delivered Notification -{' '}
                <Text style={[{color: color.DARK_GRAY_5}]}>02:45 PM - </Text>
                <Text style={CommonStyle.smallGreyText}>
                  A package has just been delivered to your doorstep.
                </Text>
              </Text>
            </View>
            <AngleRight />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.container, {paddingVertical: 10, width: '100%'}]}>
            <View style={{width: '85%'}}>
              <Text style={CommonStyle.smallGreenText}>
                Person Approaching Alert -{' '}
                <Text style={[{color: color.DARK_GRAY_5}]}>04:12 PM - </Text>
                <Text style={CommonStyle.smallGreyText}>
                  Unfamiliar person detected near your property.
                </Text>
              </Text>
            </View>
            <AngleRight />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.container, {paddingVertical: 10, width: '100%'}]}>
            <View style={{width: '85%'}}>
              <Text style={CommonStyle.smallGreenText}>
                Vehicle Arrival Update -{' '}
                <Text style={[{color: color.DARK_GRAY_5}]}>12:37 PM - </Text>
                <Text style={CommonStyle.smallGreyText}>
                  A vehicle has arrived at your premises.
                </Text>
              </Text>
            </View>
            <AngleRight />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.container, {paddingVertical: 10, width: '100%'}]}>
            <View style={{width: '85%'}}>
              <Text style={CommonStyle.smallGreenText}>
                Unfamiliar Face Detected Warning -{' '}
                <Text style={[{color: color.DARK_GRAY_5}]}>08:18 AM - </Text>
                <Text style={CommonStyle.smallGreyText}>
                  Unfamiliar face detected on your property.
                </Text>
              </Text>
            </View>
            <AngleRight />
          </TouchableOpacity> */}
        </View>
      </Modal>
      {/* <View
        style={[
          {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            margin: 0,
            padding: 0,
            position: 'absolute',
            width: '100%',
            marginTop: 70,
          },
        ]}>
        <View
          style={[
            CommonStyle.modalContentStyle,
            {marginTop: -70, borderWidth: 0.5},
          ]}>
          <Text style={styles.comindSoon}>Coming soon</Text>
          <Text
            style={[
              CommonStyle.blackTitle,
              {marginTop: 20, marginBottom: 20, textAlign: 'center'},
            ]}>
            Work in progress. I'll be here soon, click on Notify me!
          </Text>
          <Button
            name={'Notify Me'}
            extraBtnViewStyle={styles.btnViewStyle}
            extraBtnNameStyle={styles.btnNameStyle}
            disabled={true}
          />
        </View>
      </View> */}
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    paddingVertical: 20,
    backgroundColor: color.WHITE,
    marginTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  dot: {
    backgroundColor: '#3FCEE5',
    height: perfectSize(18),
    width: perfectSize(18),
    borderRadius: perfectSize(16),
    borderWidth: perfectSize(4),
    borderColor: '#D7F9FF',
    marginRight: 10,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 10,
    flex: 1,
  },
  nameText: {
    color: color.DARK_GRAY_5,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    // marginVertical: 10,
  },
  timeText: {
    fontSize: responsiveScale(10),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  playTimeText: {
    fontSize: responsiveScale(10),
    color: color.GREEN,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  playTimeView: {
    backgroundColor: color.LIGHT_GREEN_5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  camerasView: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: color.WHITE,
    marginTop: 20,
    paddingHorizontal: 20,
    // opacity: 0.5,
  },
  width: {width: '100%'},
  tabButton: {
    fontSize: responsiveScale(16),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_REGULAR,
    color: color.DARK_GRAY,
    textAlign: 'center',
    width: perfectSize(120),
    lineHeight: 40,
  },
  selectedTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: color.GREEN,
    width: perfectSize(120),
  },
  selectedTabButtonText: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  tabContainer: {
    backgroundColor: color.LIGHT_GREEN_6,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    marginHorizontal: 20,
  },
  timeTextPadding: {paddingHorizontal: 20, paddingBottom: 10},
  padding0: {paddingHorizontal: 0},
  headerStyle: {marginHorizontal: 20},
  checkBox: {
    position: 'absolute',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
  },
  btnNameStyle: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontSize: responsiveScale(16),
  },
  comindSoon: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_BOLD,
    fontFamily: TTNORMSPRO_BOLD,
    fontSize: responsiveScale(28),
  },
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    width: '50%',
    opacity: 0.5,
  },
  deleteBtn: {width: '40%', marginRight: 20},
  paddingBottom: {paddingBottom: 20},
  flatListContainer: {
    paddingVertical: 10,
  },
  itemMargin: {marginTop: 15},

  iconView: {
    height: responsiveScale(18),
    width: responsiveScale(18),
    marginRight: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 5,
  },
});
