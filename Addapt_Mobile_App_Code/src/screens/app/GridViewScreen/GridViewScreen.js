import {
  BackHandler,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import KinesisStreamView from "../../../components/KinesisStreamView";
import Orientation from "react-native-orientation-locker";
import { useSelector } from "react-redux";
import { CommonStyle } from "../../../config/styles";
import { deviceHeight, deviceWidth } from "../../../styles/theme";
import Live from "../../../assets/appImages/Live.svg";
import GetTimeForVideo from "../../../components/GetTimeForVideo";
import { color } from "../../../config/color";
import { responsiveScale } from "../../../styles/mixins";
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from "../../../styles/typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebRTCStreamView from "../../../components/WebRTCStreamView";

const GridViewScreen = ({ navigation }) => {
  const deviceList = useSelector((state) => state?.devices?.devicesList ?? []);
  useEffect(() => {
    Orientation.lockToLandscape();
    BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack);
    };
  }, []);

  const goBack = () => {
    navigation.goBack();
    Orientation.lockToPortrait();
    return true;
  };
  const { top, bottom, left, right } = useSafeAreaInsets();
  console.log("bottom", bottom, top, left, right);
  return (
    <View
      style={[
        CommonStyle.whiteContainer,
        { paddingLeft: left, paddingRight: right },
      ]}
    >
      <StatusBar hidden={true} />

      <View style={{ paddingHorizontal: 50 }}>
        <FlatList
          data={deviceList}
          renderItem={({ item }) => {
            console.log("response", item);
            return (
              <View
                style={[
                  styles.videoContainer,
                  { width: (deviceHeight - 100 - left - right) / 2 },
                ]}
              >
                <WebRTCStreamView
                  roomName={item?.deviceDetails?.streamName || item?.streamName}
                  extraVideoStyle={styles.extraVideoStyle}
                />
                {/* <KinesisStreamView
                  streamName={
                    item?.deviceDetails?.streamName || item?.streamName
                  }
                  playbackMode={"LIVE"}
                  extraVideoStyle={styles.extraVideoStyle}
                  controls={false}
                  // startTimestamp={1698726600}
                  // endTimestamp={1698748200}
                  // startTimestamp={
                  //   isEvents && new Date(response?.startTime).getTime() / 1000
                  // }
                  // endTimestamp={
                  //   isEvents && new Date(response?.endTime).getTime() / 1000
                  // }
                  // setBandWidth={setBandWidth}
                  resizeMode={"stretch"}
                  // setVideoWidth={setVideoWidth}
                  // setVideoHeight={setVideoHeight}
                  videoTime={(res) => {
                    // const originalDateTime = response?.startTime;
                    // const newDateTime = moment(originalDateTime)
                    //   .add(res?.currentTime, 'seconds')
                    //   .format();
                    // const formattedDateTime = moment(newDateTime).format(
                    //   'hh:mm:ss A, DD MMM, YYYY',
                    // );
                    //   setTime(res);
                  }}
                /> */}
                <View style={styles.topContainer}>
                  <View style={[styles.badgeContainer2]}>
                    <View style={styles.liveIcon}>
                      <Live height="100%" width="100%" />
                    </View>
                    <View style={{ maxWidth: "90%" }}>
                      <Text
                        numberOfLines={1}
                        style={[styles.titleText, { width: "100%" }]}
                      >
                        {item?.deviceDetails?.name} <GetTimeForVideo />
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
          //   style={{marginRight: space}}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default GridViewScreen;

const styles = StyleSheet.create({
  extraVideoStyle: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  },
  videoContainer: {
    backgroundColor: "black",
    height: deviceWidth / 2,
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
    width: "100%",
    alignSelf: "center",
    left: 10,
  },
  liveIcon: {
    paddingRight: 10,
    width: responsiveScale(22),
  },
  titleText: {
    fontSize: responsiveScale(10),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
});
