import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonStyle } from "../../../config/styles";
import CustomHeader from "../../../components/CustomHeader";
import LikeIcon from "../../../assets/appImages/LikeIcon.svg";
import UnLikeIcon from "../../../assets/appImages/UnLikeIcon.svg";
import NoDevice from "../../../assets/appImages/NoDevice.svg";
import Live from "../../../assets/appImages/Live.svg";
import CarotDown from "../../../assets/appImages/CarotDown.svg";
import UpdateLogo from "../../../assets/appImages/UpdateLogo.svg";
import Close from "../../../assets/appImages/Close.svg";
import { color } from "../../../config/color";
import { perfectSize } from "../../../styles/theme";
import { responsiveScale } from "../../../styles/mixins";
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from "../../../styles/typography";
import KinesisStreamView from "../../../components/KinesisStreamView";
import { useFocusEffect } from "@react-navigation/native";
import {
  getAppVersions,
  getDevicesList,
  getLocationList,
  setFavouriteDevice,
} from "../../../resources/baseServices/auth";
import { setAddedDevices } from "../../../helpers/auth";
import {
  setDevicesListAction,
  setDevicesQualityListAction,
  setLocationAction,
  setVersionData,
  setVersionPopup,
} from "../../../store/devicesReducer";
import { useDispatch, useSelector } from "react-redux";
import { CustomeToast } from "../../../components/CustomeToast";
import moment from "moment";
import GetTimeForVideo from "../../../components/GetTimeForVideo";
import Button from "../../../components/Button";
import _ from "lodash";
import Orientation from "react-native-orientation-locker";
import DeviceInfo from "react-native-device-info";
import Modal from "react-native-modal";
import WebRTCStreamView from "../../../components/WebRTCStreamView";
import WebRTCStream from "../../../components/WebRTCStream";
import NetInfo from "@react-native-community/netinfo";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import WebRTCSocket from "../../../components/WebRTCSocket";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LiveViewScreen = ({ navigation }) => {
  const storeddevicesList = useSelector(
    (state) => state?.devices?.devicesList ?? []
  );
  // const qualityData = useSelector(
  //   state => state?.devices?.devicesQualityList ?? [],
  // );
  const [devicesList, setDevicesList] = useState(storeddevicesList);
  const dispatch = useDispatch();
  const [bandWidth, setBandWidth] = useState({});
  const [loading, setLoading] = useState(false);
  const locationList = useSelector(
    (state) => state?.devices?.locationList ?? []
  );
  const userDetails = useSelector((state) => state?.auth?.userDetails ?? {});
  const vesrionPopup = useSelector(
    (state) => state?.devices?.vesrionPopup ?? false
  );
  const [isExpand, setIsExpand] = useState(0);
  const [expandedItems, setExpandedItems] = useState([0]);
  const [qualityData, setQualityData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  // const [currentTime, setCurrentTime] = useState(new Date());

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000); // Update every 1000 milliseconds (1 second)

  //   // Clear the interval when the component is unmounted
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state?.type === "celluler") {
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
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    setDevicesList(storeddevicesList);
  }, [storeddevicesList]);

  const liveViews = [
    {
      _id: "1",
      deviceDetails: {
        streamName: "testing_1",
        name: "Living Room 1",
      },
      playbackMode: "LIVE",
    },
    {
      _id: "2",
      deviceDetails: {
        streamName: "testing_2",
        name: "Living Room 2",
      },
      playbackMode: "LIVE",
    },
    {
      _id: "3",
      deviceDetails: {
        streamName: "testing_3",
        name: "Living Room 3",
      },
      playbackMode: "LIVE",
    },
    {
      _id: "4",
      deviceDetails: {
        streamName: "testing_4",
        name: "Living Room 4",
      },
      playbackMode: "LIVE",
    },
  ];

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
      console.log("ee", error);
      dispatch(setLocationAction([]));
    }
  };

  const getAppVersion = async () => {
    const getBuildNumber = DeviceInfo.getVersion();
    // const getBuildNumber = DeviceInfo.getBuildNumber();
    try {
      const res = await getAppVersions();
      if (res.data) {
        const Object = res.data.data.find((item) => item.os === Platform.OS);
        if (Object.version > getBuildNumber) {
          dispatch(setVersionPopup(true));
        }
        dispatch(setVersionData(res.data.data));
      }
    } catch (error) {
      console.log("ee", error);
    }
  };

  const onUpdateApp = () => {
    Platform.OS === "android"
      ? Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.adapptcommissioning_new"
        )
      : Linking.openURL(
          "https://apps.apple.com/us/app/adappt-smart-home-solutions/id6474175199"
        );
  };

  useEffect(() => {
    if (locationList.length > 0) {
      for (var i = 0; i < locationList.length; i++) {
        const data = devicesList.find(
          (c) => c.deviceLocation === locationList[i]._id
        );
        if (data) {
          setExpandedItems([i]);
          break;
        }
      }
    }
  }, [locationList]);

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      "focus",
      async () => {
        getAppVersion();
        Orientation.lockToPortrait();
        getAllLocation();
        setLoading(true);
        try {
          const getList = await getDevicesList(userDetails?.email);
          console.log("getList", getList);
          const AddedDevice = getList.data.data;
          if (AddedDevice.length > 0) {
            setLoading(false);
            setDevicesList(AddedDevice);
            dispatch(setDevicesListAction(AddedDevice));
          } else {
            setLoading(false);
            setDevicesList([]);
            dispatch(setDevicesListAction([]));
          }
        } catch (error) {
          console.log("eee", error);
          setLoading(false);
          dispatch(setDevicesListAction([]));
        }
      }
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const handleLike = (id, value) => {
    const newArray = devicesList.map((item) => {
      if (item._id === id) {
        return { ...item, isFavourite: value };
      }
      return item;
    });
    console.log("newArray", newArray);
    dispatch(setDevicesListAction(newArray));
  };

  const hitLike = async (id) => {
    try {
      const data = {
        email: userDetails?.email,
        deviceId: id,
      };
      const res = await setFavouriteDevice(data);
      if (res?.status === 200) {
        if (res?.data.msg.includes("added")) {
          handleLike(id, true);
          CustomeToast({ type: "success", message: res?.data.msg });
        } else {
          CustomeToast({ type: "success", message: res?.data.msg });
          handleLike(id, false);
        }
      }
    } catch (error) {}
  };
  const convertToMbps = (num) => {
    return (num * 1) / 1024 / 1000;
  };

  const setBandWidthWithIndex = (id, data) => {
    var newObj = bandWidth;
    newObj[id] = data;
    setBandWidth({ ...newObj });
  };

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

  const onPressItem = (id) => {
    if (Platform.OS === "android") {
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

  const lanesToFetch = [
    {
      stateName: devicesList[0]?.deviceDetails?.location,
      lastEvaluatedKey: "",
      lastEvaluatedSortKey: "",
    },
  ];

  const toggleItemExpansion = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((recordID) => recordID !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  let myArray = qualityData;
  const updateArray = (newObject) => {
    myArray.push(newObject);
    setQualityData(myArray);
    if (myArray.length === devicesList.length) {
      dispatch(setDevicesQualityListAction(myArray));
    }
  };

  const newDeviceData = userDetails?.viewOnly
    ? devicesList.filter((item) =>
        userDetails?.accessibleIPCameras?.includes(item._id)
      )
    : devicesList;

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={"Live"}
        isGridIconVisible={
          locationList.length > 0 &&
          devicesList.length > 0 &&
          !userDetails?.viewOnly
        }
        onGridIconPress={() => navigation.navigate("GridViewScreen")}
      />
      <View style={{ flex: 1 }}>
        {locationList.length > 0 && devicesList.length > 0 ? (
          !loading && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={styles.contentContainer}>
                {locationList.map((item, index) => {
                  const isExpanded = expandedItems.includes(index);
                  return (
                    <View key={index} style={{ marginTop: 20 }}>
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
                        activeOpacity={0.7}
                      >
                        <View style={styles.titleTextView}>
                          <Text style={styles.mainTitleTextStyle}>
                            {item.location}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={[
                                styles.iconContainer,
                                isExpanded && {
                                  transform: [{ rotate: "180deg" }],
                                },
                              ]}
                            >
                              <CarotDown height={"100%"} width={"100%"} />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      {isExpanded && <View style={styles.seperatorView} />}
                      {isExpanded && (
                        <View style={styles.expandView}>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {_.filter(newDeviceData, {
                              deviceLocation: item._id,
                            })
                              .map((res, index) => {
                                return (
                                  <View style={styles.viewPadding}>
                                    <TouchableOpacity
                                      activeOpacity={0.8}
                                      onPress={() => {
                                        navigation.navigate("CameraView", {
                                          response: res,
                                          isLive: true,
                                        });
                                      }}
                                    >
                                      <View style={styles.imageContainer}>
                                        {/* <KinesisStreamView
                                        streamName={
                                          res?.deviceDetails?.streamName
                                        }
                                        playbackMode={'LIVE'}
                                        devicesList={devicesList}
                                        setBandWidth={data =>
                                          setBandWidthWithIndex(res?._id, data)
                                        }
                                        setQualityData={data =>
                                          updateArray({id: res?._id, ...data})
                                        }
                                        // startTimestamp={res?.startTimestamp}
                                        // endTimestamp={res?.endTimestamp}
                                        extraVideoStyle={styles.extraVideoStyle}
                                      /> */}
                                        {isConnected ? (
                                          <WebRTCStreamView
                                            roomName={
                                              res?.deviceDetails?.streamName
                                            }
                                            extraVideoStyle={
                                              styles.extraVideoStyle
                                            }
                                          />
                                        ) : (
                                          // <WebRTCSocket extraVideoStyle={styles.extraVideoStyle}/>
                                          // <WebRTCStream
                                          //   roomName={
                                          //     res?.deviceDetails?.streamName
                                          //   }
                                          //   extraVideoStyle={
                                          //     styles.extraVideoStyle
                                          //   }
                                          // />
                                          <View
                                            style={[
                                              styles.emptyCircleContainer,
                                            ]}
                                          >
                                            <AnimatedCircularProgress
                                              size={responsiveScale(30)}
                                              width={3}
                                              fill={0}
                                              tintColor={color.WHITE}
                                              backgroundColor={
                                                color.DARK_GRAY_5
                                              }
                                            >
                                              {(fill) => (
                                                <Text
                                                  style={styles.loadingText}
                                                >
                                                  {parseInt(fill) + "%"}
                                                </Text>
                                              )}
                                            </AnimatedCircularProgress>
                                          </View>
                                        )}
                                      </View>
                                      <View style={styles.topContainer}>
                                        <View style={[styles.badgeContainer2]}>
                                          <View style={styles.liveIcon}>
                                            <Live height="100%" width="100%" />
                                          </View>
                                          <View style={{ maxWidth: "90%" }}>
                                            <Text
                                              numberOfLines={1}
                                              style={[
                                                styles.titleText,
                                                { width: "100%" },
                                              ]}
                                            >
                                              {res?.deviceDetails?.name}{" "}
                                              <GetTimeForVideo />
                                            </Text>
                                          </View>
                                        </View>
                                        <TouchableOpacity
                                          hitSlop={{
                                            top: 10,
                                            right: 10,
                                            left: 10,
                                            bottom: 10,
                                          }}
                                          onPress={() => {
                                            hitLike(res._id);
                                          }}
                                          style={styles.likeIcon}
                                        >
                                          {res?.isFavourite ? (
                                            <LikeIcon
                                              height="100%"
                                              width="100%"
                                            />
                                          ) : (
                                            <UnLikeIcon
                                              height="100%"
                                              width="100%"
                                            />
                                          )}
                                        </TouchableOpacity>
                                      </View>
                                      <View
                                        style={[
                                          styles.badgeContainer,
                                          { bottom: 10 },
                                        ]}
                                      >
                                        <Text style={styles.titleText}>
                                          {convertToMbps(
                                            bandWidth[res?._id]
                                              ? bandWidth[res?._id]
                                              : 0
                                          ).toFixed(2)}{" "}
                                          MB/s
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                );
                              })}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
              <View style={{ height: 30 }} />
            </ScrollView>
          )
        ) : loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator color={color.GREEN} />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[CommonStyle.NavigateText, styles.extraFont]}>
              Devices have not been installed
            </Text>
            <View style={styles.noDataImage}>
              <NoDevice height="100%" width="100%" />
            </View>
            <Button
              name={"Add device"}
              extraBtnViewStyle={styles.extraBtnViewStyle}
              onPress={() => {
                navigation.navigate("Devices");
              }}
            />
          </View>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={vesrionPopup}
        style={CommonStyle.modelContainerStyle}
        onBackdropPress={() => {
          // setModalVisible(false);
        }}
      >
        {/* <View style={CommonStyle.modelContainerStyle}> */}
        <View style={CommonStyle.modalContentStyle}>
          {/* <TouchableOpacity
            // onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity> */}
          <View style={{ width: "80%", height: responsiveScale(160) }}>
            <UpdateLogo height={"100%"} width={"100%"} />
          </View>
          <Text style={[CommonStyle.greyText20, styles.deviceTitle]}>
            Update the app
          </Text>
          <Text style={[CommonStyle.text, styles.subText]}>
            To enjoy our newest features tap the button below
          </Text>
          <Button
            name={"Update Now"}
            extraBtnViewStyle={styles.extraBtnViewStyle}
            extraBtnNameStyle={{ fontSize: responsiveScale(14) }}
            onPress={() => {
              onUpdateApp();
            }}
          />
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // paddingTop: 20,
  },
  imageContainer: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  badgeContainer: {
    position: "absolute",
    // top: 10,
    left: 10,
    padding: 3,
    backgroundColor: "#00000066",
    paddingHorizontal: 7,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: color.LIGHT_GRAY_5,
    // width: '75%',
    // overflow: 'hidden',
  },
  badgeContainer2: {
    padding: 3,
    backgroundColor: "#00000066",
    paddingHorizontal: 7,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: color.LIGHT_GRAY_5,
    maxWidth: "90%",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 10,
    width: "96%",
    alignSelf: "center",
  },
  liveIcon: {
    paddingRight: 10,
    width: responsiveScale(22),
  },
  titleText: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  likeIcon: {
    // position: 'absolute',
    // top: 15,
    // right: 15,
    height: perfectSize(18),
    width: perfectSize(18),
  },
  extraVideoStyle: {
    backgroundColor: "black",
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
  emptyCircleContainer: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  loadingText: {
    fontSize: responsiveScale(8),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  viewPadding: { marginBottom: 20 },
  extraBtnViewStyle: {
    width: "50%",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  extraFont: {
    fontSize: responsiveScale(16),
    width: "75%",
    textAlign: "center",
  },
  noDataImage: {
    height: perfectSize(200),
    aspectRatio: 1,
    marginVertical: 20,
  },
  renderMainView: {
    backgroundColor: color.LIGHT_GRAY_4,
    width: "100%",
    justifyContent: "center",
    height: perfectSize(50),
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  titleTextView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mainTitleTextStyle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    textTransform: "capitalize",
  },
  expandView: {
    backgroundColor: color.LIGHT_GRAY_4,
    width: "100%",
    alignSelf: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
  },
  iconContainer: {
    height: 24,
    width: 24,
  },
  seperatorView: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: color.LIGHT_GRAY_3,
    height: 1,
  },
  deviceTitle: { marginTop: 20 },
  subText: { textAlign: "center", marginTop: 10, marginBottom: 30 },
});

export default LiveViewScreen;
