import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CommonStyle } from "../../../config/styles";
import CustomHeader from "../../../components/CustomHeader";
import {
  getInAppNotificationData,
  markReadAllNotification,
} from "../../../resources/baseServices/auth";
import { useDispatch, useSelector } from "react-redux";
import { color } from "../../../config/color";
import { setNotificationData } from "../../../store/devicesReducer";
import moment from "moment";
import Frame3 from "../../../assets/appImages/Frame3.svg";
import { perfectSize } from "../../../styles/theme";
import Orientation from "react-native-orientation-locker";

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state?.auth?.userDetails ?? {});
  const notificationDataList = useSelector(
    (state) => state?.devices?.notificationData ?? []
  );

  useEffect(() => {
    const getAPIListener = navigation.addListener("focus", async () => {
      Orientation.lockToPortrait();
      markAsReadAllNotication();
      getNotificationData();
    });
    return getAPIListener;
  }, [navigation]);

  const getNotificationData = async () => {
    try {
      const getData = await getInAppNotificationData(userDetails?.email);
      const res = getData.data.data;
      console.log("getInAppNotificationData res", res);
      if (res) {
        dispatch(setNotificationData(res));
      }
    } catch (error) {
      console.log("eee", error);
    }
  };

  const markAsReadAllNotication = async () => {
    try {
      const data = {
        email: userDetails?.email,
      };
      const res = await markReadAllNotification(data);
      if (res?.status === 200) {
        console.log("markReadAllNotification res", res);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={"Notifications"}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
        isSettingIconVisible
        onSettingIconPress={() => {
          navigation.navigate("NotificationSetting");
        }}
      />
      {notificationDataList.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 20 }}
        >
          {notificationDataList.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("CameraView", {
                    response: item,
                    isEvents: true,
                    isNotification: true,
                  });
                }}
                style={styles.cardContainer}
              >
                <View style={[CommonStyle.row, { marginBottom: 10 }]}>
                  <Text style={[CommonStyle.greenText14, { width: "80%" }]}>
                    {item?.deviceDetails[0]?.deviceName}
                  </Text>
                  <Text style={CommonStyle.smallBlackText}>
                    {moment(item?.time).format("hh:mm A")}
                  </Text>
                </View>
                <Text style={[CommonStyle.smallGreyText, { width: "85%" }]}>
                  {item?.message}
                </Text>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 50 }} />
        </ScrollView>
      ) : (
        <>
          <View style={styles.mainView}>
            <View style={styles.notFoundImage}>
              <Frame3 height="100%" width="100%" />
            </View>
            <Text style={CommonStyle.title}>No Notification</Text>

            <Text style={[CommonStyle.text, styles.subContent]}>
              you didn't have any notification yet!
            </Text>

            <Text style={[CommonStyle.text, styles.petaContent]}>
              we'll notify you when something arrives.
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  mainView: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFoundImage: {
    width: perfectSize(254),
    height: perfectSize(188),
    alignSelf: "center",
    marginBottom: 20,
  },
  subContent: { textAlign: "center", marginHorizontal: 20, paddingTop: 20 },
  petaContent: { textAlign: "center", marginHorizontal: 40 },
});
