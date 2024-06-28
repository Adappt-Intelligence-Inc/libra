import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonStyle } from "../../../config/styles";
import CustomHeader from "../../../components/CustomHeader";
import CalendarStrip from "react-native-calendar-strip";
import { color } from "../../../config/color";
import { responsiveScale } from "../../../styles/mixins";
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from "../../../styles/typography";
import Frame3 from "../../../assets/appImages/Frame3.svg";
import NoteIcon from "../../../assets/appImages/NoteIcon.svg";
import Profile from "../../../assets/appImages/Profile.svg";
import ProfileOutlineIcon from "../../../assets/appImages/ProfileOutlineIcon.svg";
import PetOutloneIcon from "../../../assets/appImages/PetOutloneIcon.svg";
import CarOutlineIcon from "../../../assets/appImages/CarOutlineIcon.svg";
import BoxOutlineIcon from "../../../assets/appImages/BoxOutlineIcon.svg";
import FaceOutlineIcon from "../../../assets/appImages/FaceOutlineIcon.svg";
import Camera4 from "../../../assets/appImages/Camera4.svg";
import CameraWhite from "../../../assets/appImages/CameraWhite.svg";
import MoreGreen from "../../../assets/appImages/MoreGreen.svg";
import SoundOutlineIcon from "../../../assets/appImages/SoundOutlineIcon.svg";
import Close from "../../../assets/appImages/Close.svg";
import { perfectSize } from "../../../styles/theme";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { events, getAllEvents } from "../../../resources/baseServices/auth";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../../components/CustomDropdown";
import {
  setCameraFilterAction,
  setEventsFilterAction,
  setSelectedEventDateAction,
} from "../../../store/devicesReducer";
import {
  getSelectedDateInAsync,
  setSelectedDateInAsync,
} from "../../../helpers/auth";
import {
  CarColor,
  FaceColor,
  MotionColor,
  PackegeColor,
  PersonColor,
  PetColor,
} from "../../../assets/Icon";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

const EventsScreen = ({ navigation, route }) => {
  // const selectedDate = useSelector(state => state?.devices?.selectedEventDate);
  const [refreshing, setRefreshing] = React.useState(false);
  const devices = useSelector((state) => state?.devices?.devicesList ?? "");
  // const [selectedDate, setSelectedDate] = useState(moment(new Date()));
  const userDetails = useSelector((state) => state?.auth?.userDetails ?? "");
  const [eventsData, setEventsData] = useState([]); // Define the state variable
  const [insightEvents, setInsightEvents] = useState([]); // Define the state variable
  const devicesList = useSelector((state) => state?.devices?.devicesList ?? []);
  const faceEventsFromCamera = useSelector(
    (state) => state?.devices?.faceEventsFromCamera ?? []
  );
  const cameraFilter = useSelector(
    (state) => state?.devices?.cameraFilter ?? ""
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  // console.log('faceEventsFromCamera',faceEventsFromCamera);

  const defaultTimeFilter = useSelector(
    (state) => state?.devices?.timeFilter ?? ""
  );
  const selectedEventFilter = useSelector(
    (state) => state?.devices?.eventFilterList ?? []
  );
  const locationFilter = useSelector(
    (state) => state?.devices?.locationFilter ?? ""
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (route?.params?.insightEvents.length > 0) {
      setInsightEvents(route?.params?.insightEvents);
    }
  }, [route]);

  const getImage = (key) => {
    switch (key) {
      case "PERSON":
        return <ProfileOutlineIcon height={"100%"} width={"100%"} />;
      case "PET":
        return <PetOutloneIcon height={"100%"} width={"100%"} />;
      case "VEHICLE":
        return <CarOutlineIcon height={"100%"} width={"100%"} />;
      case "PACKAGE":
        return <BoxOutlineIcon height={"100%"} width={"100%"} />;
      case "FACE":
        return <FaceOutlineIcon height={"100%"} width={"100%"} />;
      case "SOUND":
        return <SoundOutlineIcon height={"100%"} width={"100%"} />;
      default:
        break;
    }
  };
  const handleGetAllEvents = async () => {
    // const date = await getSelectedDateInAsync();
    try {
      const forApiDate = selectedDate;
      // console.log('selectedDate12', date);
      console.log("forApiDate", forApiDate);
      const res = await getAllEvents(
        "",
        moment(forApiDate)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]")
          .replace("Z", "%2B05:30"),
        moment(forApiDate)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss[Z]")
          .replace("Z", "%2B05:30"),
        userDetails?.email
      );
      console.log("res--1111111-->", res.data?.data);
      if (res?.status === 200) {
        setEventsData(res.data?.data);
        // groupDataByTime(res.data?.data);
        setRefreshing(false);
        // dispatch(setSelectedEventDateAction(forApiDate));
        // await setSelectedDateInAsync(forApiDate);
        // setSelectedDate(forApiDate);
        // dispatch(setSelectedEventDateAction(forApiDate));
      }
    } catch (err) {
      setRefreshing(false);
      console.log("err===>", err.response);
      setEventsData([]);
      // dispatch(setSelectedEventDateAction(forApiDate));
    }
  };

  const TimeZones = [
    {
      key: "12:00 AM to 06:00 AM",
      startTime: 0,
      endTime: 6,
    },
    {
      key: "06:00 AM to 12:00 PM",
      startTime: 6,
      endTime: 12,
    },
    {
      key: "12:00 PM to 06:00 PM",
      startTime: 12,
      endTime: 18,
    },
    {
      key: "06:00 PM to 12:00 AM",
      startTime: 18,
      endTime: 24,
    },
  ];

  // const formatTime = dateString => {
  //   const date = new Date(dateString);
  //   return date.getHours();
  // };

  // const groupDataByTime = data => {
  //   const groupedData = {
  //     '06:00 PM to 12:00 AM': [],
  //     '12:00 PM to 06:00 PM': [],
  //     '06:00 AM to 12:00 PM': [],
  //     '12:00 AM to 06:00 AM': [],
  //   };

  //   data.forEach(item => {
  //     const hour = formatTime(item.eventTime);
  //     if (hour >= 0 && hour < 6) {
  //       groupedData['12:00 AM to 06:00 AM'].push(item);
  //     } else if (hour >= 6 && hour < 12) {
  //       groupedData['06:00 AM to 12:00 PM'].push(item);
  //     } else if (hour >= 12 && hour < 18) {
  //       groupedData['12:00 PM to 06:00 PM'].push(item);
  //     } else {
  //       groupedData['06:00 PM to 12:00 AM'].push(item);
  //     }
  //   });
  //   return groupedData;
  // };

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      "focus",
      async () => {
        handleGetAllEvents();
      }
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  useEffect(() => {
    handleGetAllEvents();
  }, [selectedDate, cameraFilter]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetAllEvents();
  }, []);

  const getName = (item) => {
    const foundObject = devicesList.find(
      (obj) => obj.deviceDetails && obj.deviceDetails.streamName === item
    );
    const deviceName = foundObject ? foundObject.deviceDetails.name : "";
    return deviceName;
  };
  const getName2 = (key) => {
    switch (key) {
      case "PERSON":
        return "Person";
      case "PET":
        return "Pet";
      case "VEHICLE":
        return "Vehicle";
      case "PACKAGE":
        return "Package";
      case "FACE":
        return "Face";
      default:
        break;
    }
  };

  const eventTypeIcon = (key, color, bgColor) => {
    switch (key) {
      case "PERSON":
        return <PersonColor height={"100%"} width={"100%"} color={color} />;
      case "PET":
        return <PetColor height={"100%"} width={"100%"} color={color} />;
      case "VEHICLE":
        return <CarColor height={"100%"} width={"100%"} color={color} />;
      case "MOTION":
        return <MotionColor height={"100%"} width={"100%"} color={color} />;
      case "PACKAGE":
        return (
          <PackegeColor
            height={"100%"}
            width={"100%"}
            color={color}
            bgColor={bgColor}
          />
        );
      case "FACE":
        return <FaceColor height={"100%"} width={"100%"} color={color} />;
      default:
        break;
    }
  };

  const renderItem = ({ section, item }) => {
    const startDate = moment(item?.startTime);
    const endDate = moment(item?.endTime);

    const duration = moment.duration(endDate.diff(startDate));

    const weeks = Math.floor(duration.asWeeks());
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let timeAgo = "";

    if (weeks > 0) {
      timeAgo = `${weeks}w${weeks > 1 ? "s" : ""}`;
    } else if (days > 0) {
      timeAgo = `${days}d${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      timeAgo = `${hours}h${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      timeAgo = `${minutes}m${minutes > 1 ? "s" : ""}`;
    } else if (seconds > 0) {
      timeAgo = `${seconds}s${seconds > 1 ? "s" : ""}`;
    }

    return (
      // <View style={[CommonStyle.shadow]}>
      <TouchableOpacity
        style={[styles.container, CommonStyle.shadow]}
        onPress={() => {
          navigation.navigate("CameraView", {
            response: item,
            isEvents: true,
          });
        }}
      >
        <View
          style={{
            height: perfectSize(88),
            width: perfectSize(111),
          }}
        >
          {/* <Image source={{ uri: item?.imageUrl }} style={styles.eventImage} /> */}
          <Image
            source={{ uri: `data:image/png;base64,${item?.imageUrl}` }}
            resizeMode="contain"
            style={styles.eventImage}
          />
        </View>
        <View style={styles.column}>
          <View style={[CommonStyle.row, styles.width]}>
            <Text style={styles.nameText}>{item?.deviceName}</Text>
            <Text style={styles.timeText}>
              {moment(item?.startTime).format("hh:mm A")}
            </Text>
          </View>
          {/* <View style={[CommonStyle.row, styles.width]}>
              <Text style={[styles.timeText, {textTransform: 'capitalize'}]}>
                {item?.eventName} detected
              </Text>
            </View> */}

          {/* <View style={[styles.shadowContainer, CommonStyle.row]}> */}
          {/* <View style={styles.timeAgo}>
                <Text
                  style={{
                    color: color.WHITE,
                    fontSize: responsiveScale(10),
                    fontWeight: FONT_WEIGHT_BOLD,
                  }}>
                  {timeAgo}
                </Text>
              </View> */}
          {/* {item.eventType.includes('PERSON') && ( */}
          <View style={[styles.innerContainer]}>
            {/* <Profile /> */}
            <View
              style={{
                height: perfectSize(20),
                width: perfectSize(20),
                marginRight: perfectSize(5),
              }}
            >
              {eventTypeIcon(item.eventType, color.DARK_GRAY_5, "#00937D1A")}
            </View>
            <Text
              numberOfLines={1}
              style={[
                CommonStyle.mediumBlackText,
                { textTransform: "capitalize" },
              ]}
            >
              {item?.eventName}{" detected"}
              {/* {item?.eventName === "UNFAMILIAR" ? "person" : "detected"} */}
              {/* {getName(item?.eventName)} */}
            </Text>
          </View>
          {/* <TouchableOpacity
              style={styles.moreIcon}
              disabled={true}
              hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
              onPress={() => {
              }}>
              <Menu>
                <MenuTrigger
                  style={{
                    padding: perfectSize(3),
                  }}>
                  <MoreGreen />
                </MenuTrigger>
                <MenuOptions customStyles={styles.menuStyles}>
                  <MenuOption
                    onSelect={() => {
                      // onEventSelect();
                    }}>
                    <Text style={styles.menuOptionText}>Add Identity</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => {
                      // onDeleteDevice();
                    }}>
                    <Text style={styles.menuOptionText}>Add Designation</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </TouchableOpacity> */}
          {/*  )} */}

          {/* {item.eventType.includes('PET') && (
                <View
                  style={[
                    styles.innerContainer,
                    {backgroundColor: color.GREEN},
                  ]}>
                  <NoteIcon />
                </View>
              )} */}
          {/* </View> */}
          {/* <View>
              <Text />
            </View> */}
        </View>
      </TouchableOpacity>
      // </View>
    );
  };
  const renderSectionHeader = ({ section }) => {
    if (section.data.length === 0) {
      return null; // Hide section header if there's no data
    }

    // return (
    //   <View style={styles.titleContainer}>
    //     <Text
    //       style={[CommonStyle.blackText14, {fontSize: responsiveScale(12)}]}>
    //       {section.title}
    //     </Text>
    //   </View>
    // );
    return null;
  };

  // const LocationFilteredData = locationFilter
  //   ? eventsData
  //       .slice()
  //       .reverse()
  //       .filter(item => selectedEventFilter.includes(item.eventType))
  //   : eventsData.slice().reverse();

  const cameraFilteredData =
    cameraFilter.length > 0
      ? eventsData
          .slice()
          .reverse()
          .filter((item) => cameraFilter.includes(item.streamName))
      : eventsData.slice().reverse();

  const newListData =
    selectedEventFilter.length > 0
      ? cameraFilteredData.filter((item) =>
          selectedEventFilter.includes(item.eventType)
        )
      : cameraFilteredData;

  const removeFilteredEvent = (eventName) => {
    if (selectedEventFilter.includes(eventName)) {
      dispatch(
        setEventsFilterAction(
          selectedEventFilter.filter((event) => event !== eventName)
        )
      );
    }
  };
  const removeCameraFiltered = (camera) => {
    if (cameraFilter.includes(camera)) {
      dispatch(
        setCameraFilterAction(cameraFilter.filter((item) => item !== camera))
      );
    }
  };

  const filteredData =
    defaultTimeFilter !== ""
      ? newListData.filter((item) => {
          const eventTime = new Date(item.eventTime || item.startTime);
          const hours = eventTime.getHours();
          return (
            hours >=
              TimeZones.find((zone) => zone.key === defaultTimeFilter)
                .startTime &&
            hours <
              TimeZones.find((zone) => zone.key === defaultTimeFilter).endTime
          );
        })
      : newListData;

  // const groupedData = groupDataByTime(newListData);

  // const sections = Object.keys(groupedData).map(key => ({
  //   title: key,
  //   data: groupedData[key],
  // }));
  // const newsections =
  //   defaultTimeFilter !== ''
  //     ? sections.filter(item => item.title === defaultTimeFilter)
  //     : sections;

  const dateSelection = async (date) => {
    // await setSelectedDateInAsync(date);
    setSelectedDate(date);
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={"Events"}
        isEventsIcon
        onFilterIconPress={() => {
          navigation.navigate("FilterScreen");
        }}
        onNoteIconPress={() => {
          navigation.navigate("ReportScreen");
        }}
        isDrawerIconVisible={true}
        onBarIconPress={() => {
          navigation.openDrawer();
        }}
        extraTitleStyle={{ flex: 0, marginLeft: perfectSize(30) }}
      />
      <View style={styles.topcontainer}>
        {/* <View style={{width: '45%', alignSelf: 'flex-end'}}>
          <CustomDropdown
            placeholder={'Camera'}
            extraInputViewStyle={{margin: 0}}
            onChangeValue={item => {
              if (item.value === 'all') {
                dispatch(setCameraFilterAction(''));
              } else {
                dispatch(setCameraFilterAction(item.value));
              }
            }}
            value={cameraFilter}
            icon={
              <View style={[styles.imageView, {backgroundColor: color.BLACK}]}>
                <Camera4 height={'100%'} width={'100%'} />
              </View>
            }
            data={[
              {label: 'All', value: 'all'},
              ...devicesList.map(item => {
                return {
                  label: item?.deviceDetails?.name,
                  value: item?.deviceDetails?.streamName,
                };
              }),
            ]}
          />
        </View> */}

        {(cameraFilter.length > 0 || selectedEventFilter.length > 0) && (
          <ScrollView
            horizontal
            // showsHorizontalScrollIndicator={false}
            style={styles.scrollable}
          >
            {cameraFilter.length > 0 &&
              cameraFilter.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.filterbtn,
                      index === cameraFilter.length - 1 && { marginRight: 0 },
                    ]}
                  >
                    <View
                      style={[
                        styles.imageView,
                        {
                          marginRight: 10,
                          backgroundColor: color.BLACK,
                        },
                      ]}
                    >
                      <CameraWhite height={"100%"} width={"100%"} />
                    </View>
                    <Text style={styles.selectedTextStyle}>
                      {getName(item)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeCameraFiltered(item)}
                      style={styles.imageView}
                    >
                      <Close />
                    </TouchableOpacity>
                  </View>
                );
              })}
            {selectedEventFilter.length > 0 && cameraFilter.length > 0 && (
              <View style={styles.verticalLine} />
            )}
            {selectedEventFilter.length > 0 &&
              selectedEventFilter.map((item) => {
                return (
                  <View style={styles.filterbtn}>
                    <View
                      style={[
                        styles.imageView,
                        {
                          marginRight: 10,
                          backgroundColor: color.BLACK,
                        },
                      ]}
                    >
                      {getImage(item)}
                    </View>
                    <Text style={styles.selectedTextStyle}>
                      {getName2(item)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFilteredEvent(item)}
                      style={styles.imageView}
                    >
                      <Close />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </ScrollView>
        )}
      </View>

      <CalendarStrip
        scrollable
        // selectedDate={selectedDate.toISOString().split('T')[0]}
        selectedDate={selectedDate}
        onDateSelected={(date) => {
          // setSelectedDate(date._d);
          console.log("date._d", date._d);

          // dispatch(setSelectedEventDateAction(date._d));
          dateSelection(date._d);
        }}
        highlightDateContainerStyle={styles.highlightDateContainerStyle}
        style={styles.customStyle}
        calendarColor={color.LIGHT_GRAY_4}
        dateNumberStyle={styles.dateNumberStyle}
        dateNameStyle={styles.dateNameStyle}
        highlightDateNumberStyle={styles.selectedItem}
        highlightDateNameStyle={styles.selectedItem}
        datesWhitelist={[
          {
            end: new Date(),
            start: new Date(new Date().setDate(new Date().getDate() - 6)),
          },
        ]}
        disabledDateNameStyle={styles.dateNameStyle}
        disabledDateNumberStyle={styles.dateNumberStyle}
        iconLeft={null}
        iconRight={null}
        showMonth={false}
        maxDate={new Date()}
        minDate={new Date(new Date().setDate(new Date().getDate() - 6))}
      />
      {/* {faceEventsFromCamera.length > 0 &&
        faceEventsFromCamera.map((item) => {
          return (
            <TouchableOpacity style={[styles.container, CommonStyle.shadow]}>
              <View
                style={{
                  height: perfectSize(88),
                  width: perfectSize(111),
                }}
              >
                <Image
                  source={{
                    uri: `data:image/png;base64,${item?.messagePayload?.registrationImage}`,
                  }}
                  style={styles.eventImage}
                />
              </View>
              <View style={styles.column}>
                <View style={[CommonStyle.row, styles.width]}>
                  <Text style={styles.nameText}>
                    {item?.messagePayload?.identityName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })} */}
      {insightEvents.length > 0 && (
        <View style={[styles.topcontainer]}>
          <Text style={CommonStyle.sectionTitle}>Insight Events</Text>
          {insightEvents.length > 0 && (
            // <TouchableOpacity
            //   onPress={() => setInsightEvents([])}
            //   style={[styles.closeIcon]}>
            //   <Close height="100%" width="100%" />
            // </TouchableOpacity>
            <LinearGradient
              start={{ x: 0.9, y: 0 }}
              end={{ x: 1, y: 1 }}
              colors={["#00937D80", "#00937D20"]}
              style={[styles.linearGradient, styles.margin0]}
            >
              <TouchableOpacity
                onPress={() => setInsightEvents([])}
                style={[
                  styles.innerContainer2,
                  { backgroundColor: color.WHITE },
                ]}
              >
                {/* <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => setInsightEvents([])}> */}
                <Close height="100%" width="100%" />
                {/* </TouchableOpacity> */}
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      )}

      {insightEvents.length > 0 || filteredData.length > 0 ? (
        <>
          <View style={styles.camerasView}>
            <FlatList
              data={insightEvents.length > 0 ? insightEvents : filteredData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            {/* <SectionList
              sections={sections}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item, index) => item + index}
              renderItem={renderItem}
              // renderSectionHeader={({section: {title}}) => (
              //   <Text style={styles.header}>{title}</Text>
              // )}
              renderSectionHeader={renderSectionHeader}
            /> */}
          </View>
        </>
      ) : (
        <>
          <View style={styles.mainView}>
            <View style={styles.notFoundImage}>
              <Frame3 height="100%" width="100%" />
            </View>
            <Text style={CommonStyle.title}>No event Found</Text>

            <Text style={[CommonStyle.text, styles.subContent]}>
              Check to see if your cam can record events.{" "}
              <Text style={{ color: color.GREEN }}>
                Go to camera setting &gt; Event recording
              </Text>
            </Text>

            <Text style={[CommonStyle.text, styles.petaContent]}>
              Otherwise, you may need to clear your event filters or wait for
              your camera to record events.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    padding: 10,
    backgroundColor: color.WHITE,
    marginBottom: 15,
  },
  column: {
    flexDirection: "column",
    // justifyContent: 'space-between',
    // alignItems: 'flex-start',
    paddingLeft: 15,
    flex: 1,
    paddingVertical: 5,
    // backgroundColor: 'red',
  },
  nameText: {
    color: color.DARK_GRAY_5,
    fontWeight: FONT_WEIGHT_BOLD,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_BOLD,
  },
  timeText: {
    fontSize: responsiveScale(10),
    color: color.DARK_GRAY_7,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  shadowContainer: {
    shadowColor: color.LIGHT_GRAY_2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 4,
  },
  linearGradient: {
    height: perfectSize(30),
    width: perfectSize(30),
    borderRadius: 20, // <-- Outer Border Radius
    marginRight: 10,
  },
  innerContainer: {
    borderRadius: 20, // <-- Inner Border Radius
    height: perfectSize(30),
    // aspectRatio: 1,
    // marginLeft: 10,
    backgroundColor: "#00937D1A",
    // justifyContent: 'center',
    alignItems: "center",
    padding: 5,
    borderColor: "#00937D1F",
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 10,
    overflow:'hidden'
  },
  innerContainer2: {
    borderRadius: perfectSize(30), // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  notFoundImage: {
    width: perfectSize(254),
    height: perfectSize(188),
    alignSelf: "center",
    marginBottom: 20,
  },
  selectedItem: {
    color: color.WHITE,
    fontSize: responsiveScale(12),
    textTransform: "capitalize",
  },
  dateNameStyle: {
    color: color.DARK_GRAY_2,
    fontSize: responsiveScale(11),
    fontWeight: FONT_WEIGHT_MEDIUM,
    textTransform: "capitalize",
  },
  selectedTextStyle: {
    color: color.BLACK,
    fontSize: responsiveScale(15),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    marginRight: 5,
  },
  dateNumberStyle: {
    color: color.DARK_GRAY_6,
    fontSize: responsiveScale(11),
  },
  highlightDateContainerStyle: {
    backgroundColor: color.GREEN,
    borderRadius: 4,
  },
  customStyle: {
    height: responsiveScale(55),
    borderRadius: 10,
    marginTop: 20,
  },
  camerasView: { flex: 1, paddingTop: 20, backgroundColor: color.WHITE },
  mainView: { flex: 1, justifyContent: "center", alignItems: "center" },
  subContent: {
    textAlign: "center",
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  petaContent: { textAlign: "center", marginHorizontal: 30 },
  width: { width: "100%" },
  timeAgo: {
    backgroundColor: color.GREEN,
    paddingHorizontal: 8,
    height: perfectSize(30),
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  eventImage: { height: "100%", width: "100%", borderRadius: 5 },
  filterbtn: {
    borderRadius: 25,
    backgroundColor: color.LIGHT_GRAY_4,
    height: perfectSize(40),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    minWidth: perfectSize(100),
    marginRight: 10,
  },
  verticalLine: {
    marginHorizontal: 10,
    height: perfectSize(20),
    width: perfectSize(1),
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
  },
  imageView: {
    height: perfectSize(27),
    width: perfectSize(27),
    borderRadius: perfectSize(27),
    padding: 5,
  },
  topcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  scrollable: {
    height: perfectSize(40),
    flexGrow: 0,
    zIndex: 9999,
  },
  titleContainer: {
    backgroundColor: color.LIGHT_GRAY_4,
    padding: 10,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: responsiveScale(50),
  },
  closeIcon: {
    width: responsiveScale(22),
    borderRadius: responsiveScale(22),
    aspectRatio: 1,
    backgroundColor: color.LIGHT_GRAY_4,
    padding: 2,
  },
  moreIcon: { position: 'absolute', right: 0, bottom: 0, zIndex: 1},
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
  menuOptionText: {
    color: color.DARK_GRAY,
    padding: 5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
});
