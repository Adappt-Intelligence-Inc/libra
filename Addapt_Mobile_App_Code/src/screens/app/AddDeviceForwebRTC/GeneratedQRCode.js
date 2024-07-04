import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../../../components/CustomHeader";
import { CommonStyle } from "../../../config/styles";
import QRCode from "react-native-qrcode-svg";
import { WINDOW_WIDTH, responsiveScale } from "../../../styles/mixins";
import Button from "../../../components/Button";
import { color } from "../../../config/color";
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
} from "../../../styles/typography";
import Step1 from "../../../assets/appImages/Step1.svg";
import WebRTCStreamView from "../../../components/WebRTCStreamView";
import { createWebRTCDevice } from "../../../resources/baseServices/auth";
import { CustomeToast } from "../../../components/CustomeToast";

const GeneratedQRCode = ({ navigation, route }) => {
  const QRcodeData = route?.params?.QRcodeData;
  const APIData = route?.params?.APIData;
  const [loading, setLoading] = useState(false);
  const [playStream, setPlayStream] = useState(false);
  // const [seconds, setSeconds] = useState(30);

  const onPressDone = () => {
    console.log("onPressDone");
    // setLoading(true);
    setPlayStream(false);
    setTimeout(() => {
      console.log("playStream");
      setPlayStream(true);
    }, 300);
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      onPressDone();
      // setElapsedSeconds(prevElapsedSeconds => prevElapsedSeconds + 1);
    }, 10000);

    return () => clearInterval(timerId); // Cleanup the interval on component unmount
  }, []);

  const onSuccess = async () => {
    console.log("onSuccess");
    setLoading(true);
    try {
      const res = await createWebRTCDevice(APIData);
      console.log("res", res?.data);
      if (res?.status === 200) {
        CustomeToast({
          type: "success",
          message: "Device registerd & activated successfully",
        });
        setLoading(false);
        navigation.navigate("Devices");
        // setEditNameModal(false);
        // CustomeToast({ type: "success", message: error?.response?.data?.err });
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      navigation.navigate("Devices");
      CustomeToast({ type: "error", message: "Please try again!" });
    }
  };

  const onFailed = () => {
    console.log("onFailed");
    setLoading(false);
    // navigation.navigate("Devices");
    // CustomeToast({ type: "error", message: "Please try again!" });
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={"QR Code"}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        style={{ marginTop: 20, flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={CommonStyle.text}>
          place the QR code in front of the camera and keep it 20-30cm away.
        </Text>
        <View style={styles.container}>
          <QRCode
            logoBackgroundColor="transparent"
            value={JSON.stringify(QRcodeData)}
            size={WINDOW_WIDTH - responsiveScale(40)}
            ecl="L"
          />
        </View>
        <Text style={styles.text}>How to Use</Text>
        <View style={styles.stepContainer}>
          <Step1 height={"100%"} />
        </View>
        {/* <Button
          name={"Done"}
          extraBtnViewStyle={[styles.BtnView]}
          onPress={() => {
            // navigation.navigate("Devices");
            onPressDone();
          }}
          isLoading={loading}
          disabled={loading}
        /> */}
        {playStream && (
          <View style={{ height: 0, width: 0, overflow: "hidden" }}>
            <WebRTCStreamView
              roomName={APIData?.deviceId}
              extraVideoStyle={styles.extraVideoStyle}
              onSuccess={onSuccess}
              onFailed={onFailed}
            />
          </View>
        )}
      </ScrollView>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color.GREEN} />
          <Text style={styles.loadingText}>wait for a minute</Text>
        </View>
      ) : null}
    </View>
  );
};

export default GeneratedQRCode;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    paddingTop: 40,
  },
  BtnView: { width: "40%", marginVertical: 40 },
  stepContainer: {
    height: responsiveScale(140),
    alignItems: "center",
    justifyContent: "center",
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    overflow: "hidden",
    paddingVertical: 10,
  },
  extraVideoStyle: {
    backgroundColor: "black",
    height: 0,
    width: 0,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingTop: responsiveScale(120),
  },
  loadingText: {
    fontSize: responsiveScale(20),
    color: color.GREEN,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    alignSelf: "center",
    textAlign: "center",
    // marginTop: 10,
    // position: 'absolute',
    // bottom: responsiveScale(150),
  },
});
