import {
  BackHandler,
  FlatList,
  Image,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import { CommonStyle } from "../../../config/styles";
import { perfectSize } from "../../../styles/theme";
import { color } from "../../../config/color";
import { WINDOW_WIDTH, responsiveScale } from "../../../styles/mixins";
import Image3 from "../../../assets/appImages/Image3.svg";
import Share from "../../../assets/appImages/Share.svg";
import DeleteIcon from "../../../assets/appImages/DeleteIcon.svg";
import CheckBoxBlank from "../../../assets/appImages/CheckBoxBlank.svg";
import Maximize from "../../../assets/appImages/Maximize.svg";
import Minimize from "../../../assets/appImages/Minimize.svg";
import CheckBox from "../../../assets/appImages/CheckBox.svg";
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from "../../../styles/typography";
import Button from "../../../components/Button";
import WebRTCStreamView from "../../../components/WebRTCStreamView";
import WebRTCStream from "../../../components/WebRTCStream";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../../components/CustomDropdown";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import NetInfo from "@react-native-community/netinfo";
import Orientation from "react-native-orientation-locker";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "./image";

const LibraryScreen = ({ navigation }) => {
  const numColumn = 3;
  const space = 20;
  const Total = (WINDOW_WIDTH - (numColumn + 1) * space) / numColumn;

  const [selectedTab, setSelectedTab] = useState("Videos");
  const [selectAll, setSelectAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [date, setDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [oldDate, setOldDate] = useState("");
  const devicesList = useSelector((state) => state?.devices?.devicesList ?? []);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [refreshed, setRefreshed] = useState(true);

  const onStreamRefresh = () => {
    setRefreshed(false);
    setTimeout(() => {
      setRefreshed(true);
    }, 300);
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack);
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
    setOrientation("PORTRAIT");
    Orientation.lockToPortrait();
    return true;
  };

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

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };
  const Cameras = [
    {
      title: "08 oct, 2023",
      data: [
        {
          id: "1",
          image: <Image3 height="100%" width="100%" />,
          name: "Manual Recording",
          time: "09:30PM",
          playTime: "01:20",
        },
        {
          id: "2",
          image: <Image3 height="100%" width="100%" />,
          name: "Manual Recording",
          time: "09:30PM",
          playTime: "01:20",
        },
      ],
    },
    {
      title: "04 oct, 2023",
      data: [
        {
          id: "3",
          image: <Image3 height="100%" width="100%" />,
          name: "Manual Recording",
          time: "09:30PM",
          playTime: "01:20",
        },
      ],
    },
  ];
  const Photos = [
    // {
    //   title: "08 oct, 2023",
    //   data: [
    //     {
    //       id: "1",
    //       image: (
    //         <Image
    //           source={{
    //             uri: `data:image/png;base64,${data.looselyCroppedImage}`,
    //           }}
    //           style={{ height: "100%" }}
    //         />
    //       ),
    //     },
    //     {
    //       id: "2",
    //       image: (
    //         <Image
    //           resizeMode="contain"
    //           source={{
    //             uri: `data:image/png;base64,${data.registrationImage}`,
    //           }}
    //           style={{ height: "100%" }}
    //         />
    //       ),
    //     },
    //     {
    //       id: "3",
    //       image: (
    //         <Image
    //           source={{
    //             uri: `data:image/png;base64,${data.looselyCroppedImage}`,
    //           }}
    //           style={{ height: "100%" }}
    //         />
    //       ),
    //     },
    //   ],
    // },
    // {
    //   title: "03 oct, 2023",
    //   data: [
    //     {
    //       id: "1",
    //       image: (
    //         <Image
    //           source={{
    //             uri: `data:image/png;base64,${data.looselyCroppedImage}`,
    //           }}
    //           style={{ height: "100%" }}
    //         />
    //       ),
    //     },
    //   ],
    // },
  ];

  const videoRenderItem = ({ item }) => (
    <View style={[CommonStyle.shadow]}>
      {isEditing && (
        <TouchableOpacity
          onPress={() => handleItemSelect(item.id)}
          style={styles.checkBox}
        >
          {selectedItems.includes(item.id) ? <CheckBox /> : <CheckBoxBlank />}
        </TouchableOpacity>
      )}
      <View style={[styles.container, { marginLeft: isEditing ? 50 : 20 }]}>
        <View style={{ height: perfectSize(66), width: perfectSize(89) }}>
          {item?.image}
        </View>
        <View style={styles.column}>
          <View style={[CommonStyle.row, styles.width]}>
            <Text style={styles.nameText}>{item?.name}</Text>
            <Text style={styles.timeText}>{item?.time}</Text>
          </View>
          <View style={styles.playTimeView}>
            <Text style={styles.playTimeText}>01:20</Text>
          </View>
          <View>
            <Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      // Depending on the selectedTab, add all items to selectedItems
      const allItems = selectedTab === "Videos" ? Cameras : Photos;
      const allItemIds = allItems.reduce((ids, section) => {
        return ids.concat(section.data.map((item) => item.id));
      }, []);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };
  const handleItemSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  const photoRenderItem = ({ item }) => (
    <View
      style={{
        marginBottom: space,
        marginLeft: space,
        width: Total,
      }}
    >
      <View
        style={{
          height: perfectSize(80),
        }}
      >
        {item?.image}
      </View>
    </View>
  );

  function formatDateAndTime(dateString) {
    const [year, month, day, hour, minute, second] = dateString.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hour}:${minute}:${second}`;
    return { formattedDate, formattedTime };
  }

  const DateConvert = (timestamp) => {
    const date = new Date(parseInt(timestamp));

    // Format the date
    const formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;

    // Format the time
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Combine date and time
    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return { data: formattedDate, time: formattedTime };
  };
  const onChangeToPortrait = () => {
    setOldDate(selectedDate);
    setOrientation("PORTRAIT");
    Orientation.lockToPortrait();
    setSelectedDate("");
  };
  const onChangeToLandscape = () => {
    setOldDate(selectedDate);
    setOrientation("LANDSCAPE");
    Orientation.lockToLandscape();
    setSelectedDate("");
  };
  if (orientation === "PORTRAIT") {
    return (
      <View
        style={[
          CommonStyle.sectionContainer,
          CommonStyle.flex,
          styles.padding0,
        ]}
      >
        <View style={styles.headerStyle}>
          <CustomHeader
            title={selectedTab === "Videos" ? "Library" : "Album"}
            isBackBtnVisible={true}
            onPressBackBtn={() => {
              navigation.goBack();
            }}
            isSelectAllVisible={isEditing ? true : false}
            // isEditIconVisible={!isEditing}
            onEditBtnPress={() => {
              setIsEditing(!isEditing);
            }}
            onSelectAllPress={() => {
              handleSelectAll();
            }}
          />
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              handleTabPress("Videos");
              setSelectedDate("");
            }}
            style={[selectedTab === "Videos" && styles.selectedTabButton]}
          >
            <Text
              style={[
                styles.tabButton,
                selectedTab === "Videos" && styles.selectedTabButtonText,
              ]}
            >
              Videos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleTabPress("Photos");
              setSelectedDate("");
            }}
            style={[selectedTab === "Photos" && styles.selectedTabButton]}
          >
            <Text
              style={[
                styles.tabButton,
                selectedTab === "Photos" && styles.selectedTabButtonText,
              ]}
            >
              Photos
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.camerasView}>
          {selectedTab === "Videos" ? (
            // <SectionList
            //   sections={Cameras}
            //   renderItem={videoRenderItem}
            //   renderSectionHeader={({section: {title}}) => (
            //     <Text style={[CommonStyle.text, styles.timeTextPadding]}>
            //       {title}
            //     </Text>
            //   )}
            //   keyExtractor={item => item?.id}
            //   showsVerticalScrollIndicator={false}
            // />
            <View style={{ flex: 1 }}>
              <View style={{ paddingHorizontal: 20 }}>
                <CustomDropdown
                  placeholder={"Device"}
                  onChangeValue={(item) => {
                    setSelectedCamera(item.value);
                  }}
                  extraInputViewStyle={{
                    backgroundColor: color.WHITE,
                  }}
                  value={selectedCamera}
                  data={devicesList.map((item) => {
                    return {
                      label: item?.deviceDetails?.name,
                      value: item?.deviceDetails?.streamName,
                    };
                  })}
                  onFocus={() => {
                    setSelectedCamera("");
                    setDate([]);
                    setSelectedDate("");
                  }}
                />
              </View>
              <View style={{ marginTop: 20, height: responsiveScale(200) }}>
                {selectedCamera &&
                  (isConnected ? (
                    refreshed && (
                      <WebRTCStreamView
                        roomName={selectedCamera}
                        // setNext={setNext}
                        extraVideoStyle={[
                          {
                            backgroundColor: "black",
                            height: "100%",
                            width: "100%",
                          },
                        ]}
                        starttime={selectedDate}
                        hidebtn={true}
                        setDate={(data) => {
                          setDate(data);
                          // setSelectedDate(oldDate);
                        }}
                        selectedDate={selectedDate}
                      />
                    )
                  ) : (
                    <View style={[styles.emptyCircleContainer]}>
                      <AnimatedCircularProgress
                        size={responsiveScale(30)}
                        width={3}
                        fill={0}
                        tintColor={color.WHITE}
                        backgroundColor={color.DARK_GRAY_5}
                      >
                        {(fill) => (
                          <Text style={styles.loadingText}>
                            {parseInt(fill) + "%"}
                          </Text>
                        )}
                      </AnimatedCircularProgress>
                    </View>
                  ))}
                <TouchableOpacity
                  onPress={() => onChangeToLandscape()}
                  style={styles.maximizeIcon}
                >
                  <Maximize />
                </TouchableOpacity>
              </View>
              {date.length > 0 && (
                <ScrollView
                  style={{ marginTop: 20, paddingHorizontal: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={CommonStyle.blackTitle}>Recording List</Text>
                  <FlatList
                    data={date}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={[
                            styles.cardContainer,
                            selectedDate === item && {
                              backgroundColor: color.LIGHT_GREEN_5,
                            },
                          ]}
                          onPress={() => {
                            setSelectedDate(item);
                            onStreamRefresh();
                          }}
                        >
                          <View>
                            <Text style={styles.timeText}>Date</Text>
                            <Text style={styles.boldTimeText}>
                              {formatDateAndTime(item).formattedDate}
                            </Text>
                          </View>
                          <View style={styles.line} />
                          <View>
                            <Text style={styles.timeText}>Time</Text>
                            <Text style={styles.boldTimeText}>
                              {formatDateAndTime(item).formattedTime}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                  />
                </ScrollView>
              )}
            </View>
          ) : (
            // <SectionList
            //   sections={Photos}
            //   renderItem={({section}) => (
            //     <FlatList
            //       data={section?.data}
            //       style={{marginRight: space}}
            //       numColumns={numColumn}
            //       renderItem={({item}) => (
            //         <>
            //           <View
            //             style={{
            //               marginBottom: space,
            //               marginLeft: space,
            //               width: Total,
            //             }}>
            //             <View
            //               style={{
            //                 height: perfectSize(80),
            //               }}>
            //               {item?.image}
            //             </View>
            //           </View>
            //         </>
            //       )}
            //       keyExtractor={item => item.id}
            //     />
            //   )}
            //   renderSectionHeader={({section: {title}}) => (
            //     <Text style={[CommonStyle.text, styles.timeTextPadding]}>
            //       {title}
            //     </Text>
            //   )}
            //   keyExtractor={item => item?.id}
            //   showsVerticalScrollIndicator={false}
            // />
            <FlatList
              data={Photos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item: section }) => (
                <View>
                  <Text style={[CommonStyle.text, styles.timeTextPadding]}>
                    {section.title}
                  </Text>
                  <FlatList
                    data={section.data}
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={photoRenderItem}
                    contentContainerStyle={styles.flatListContainer}
                  />
                </View>
              )}
            />
          )}
          {/* <View style={{height: 50}} /> */}
        </View>
        {/* {selectedTab === 'Videos' && (
        <View style={[CommonStyle.row, styles.paddingBottom]}>
          <Button
            name={'Share'}
            image={<Share />}
            isIcon={true}
            extraBtnViewStyle={styles.btnViewStyle}
            extraBtnNameStyle={styles.btnNameStyle}
          />
          <Button
            name={'Delete'}
            image={<DeleteIcon />}
            isIcon={true}
            extraBtnViewStyle={styles.deleteBtn}
          />
        </View>
      )} */}
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container2}>
        <StatusBar hidden={true} />
        <View style={{ height: "100%", width: "100%" }}>
          {selectedCamera &&
            (isConnected ? (
              <WebRTCStreamView
                roomName={selectedCamera}
                // setNext={setNext}
                extraVideoStyle={[
                  {
                    backgroundColor: "black",
                    height: "100%",
                    width: "100%",
                  },
                ]}
                starttime={selectedDate}
                hidebtn={true}
                setDate={(data) => {
                  setDate(data);
                  // setSelectedDate(oldDate);
                }}
                selectedDate={selectedDate}
              />
            ) : (
              <View style={[styles.emptyCircleContainer]}>
                <AnimatedCircularProgress
                  size={responsiveScale(30)}
                  width={3}
                  fill={0}
                  tintColor={color.WHITE}
                  backgroundColor={color.DARK_GRAY_5}
                >
                  {(fill) => (
                    <Text style={styles.loadingText}>
                      {parseInt(fill) + "%"}
                    </Text>
                  )}
                </AnimatedCircularProgress>
              </View>
            ))}
          <TouchableOpacity
            onPress={() => onChangeToPortrait()}
            style={styles.maximizeIcon}
          >
            <Minimize />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    padding: 5,
    backgroundColor: color.WHITE,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  column: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 10,
    flex: 1,
  },
  nameText: {
    color: color.DARK_GRAY_5,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
  },
  timeText: {
    fontSize: responsiveScale(11),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_LIGHT,
  },
  boldTimeText: {
    fontSize: responsiveScale(11),
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    marginTop: 5,
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
    paddingTop: 20,
    backgroundColor: color.WHITE,
    // opacity: 0.5,
  },
  width: { width: "100%" },
  tabButton: {
    fontSize: responsiveScale(16),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_REGULAR,
    color: color.DARK_GRAY,
    textAlign: "center",
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
    marginHorizontal: 20,
  },
  timeTextPadding: { paddingHorizontal: 20, paddingBottom: 10 },
  padding0: { paddingHorizontal: 0 },
  headerStyle: { marginHorizontal: 20 },
  checkBox: {
    position: "absolute",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    left: 20,
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
    width: "40%",
    marginLeft: 20,
  },
  deleteBtn: { width: "40%", marginRight: 20 },
  paddingBottom: { paddingBottom: 20 },
  flatListContainer: {
    paddingVertical: 10,
  },
  cardContainer: {
    flexDirection: "row",
    width: "48%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: color.LIGHT_GRAY_4,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: "4%",
  },
  line: {
    height: 15,
    width: 1,
    backgroundColor: color.DARK_GRAY,
    opacity: 0.18,
  },
  maximizeIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
