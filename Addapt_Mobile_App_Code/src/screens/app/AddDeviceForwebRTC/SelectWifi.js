import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import WifiManager from "react-native-wifi-reborn";
import { CommonStyle } from "../../../config/styles";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { color } from "../../../config/color";
import CustomHeader from "../../../components/CustomHeader";
import WifiDeviceGreen from "../../../assets/appImages/WifiDeviceGreen.svg";
import CarotRightBlack from "../../../assets/appImages/CarotRightBlack.svg";
import SelectNetwork from "../../../assets/appImages/SelectNetwork.svg";
import { responsiveScale } from "../../../styles/mixins";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SelectWifi = ({ route, navigation }) => {
  const [wifiList, setWifiList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const { location, deviceId, name } = route?.params;

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      "focus",
      async () => {
        requestLocationPermission();
      }
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const requestLocationPermission = async () => {
    try {
      let permissionStatus;
      if (Platform.OS === "ios") {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permissionStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
      }
      console.log("permissionStatus", permissionStatus);
      if (permissionStatus !== RESULTS.GRANTED) {
        const result = await request(
          Platform.OS === "ios"
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
        if (result === RESULTS.GRANTED) {
          getWifiList();
          // getSecondWifiList();
          console.log("Location permission granted");
        } else {
          console.log("Location permission denied");
        }
      } else {
        console.log("Location permission already granted");
        getWifiList();
        // getSecondWifiList();
      }
    } catch (error) {
      console.error("Error checking or requesting location permission:", error);
    }
  };

  const getWifiList = async () => {
    if (Platform.OS === "ios") {
      const data = await WifiManager.getCurrentWifiSSID();
      console.log('data',data);
      setWifiList([{ SSID: data }]);
    } else {
      const enabled = await WifiManager.isEnabled();
      if (enabled) {
        setListLoading(true);
        try {
          const list = await WifiManager.loadWifiList();
          console.log("list", list);
          setWifiList(list);
          setListLoading(false);
        } catch (error) {
          setListLoading(false);
          console.error("Error loading Wi-Fi list:", error);
        }
      } else {
        setListLoading(false);
        WifiManager.setEnabled(true);
        getWifiList();
      }
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={"Select Network"}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.banner}>
        <SelectNetwork height={"100%"} width={"100%"} />
      </View>
      <Text
        style={[
          CommonStyle.text,
          { width: "85%", textAlign: "center", alignSelf: "center" },
        ]}
      >
        Choose the network this devices will connect to.
      </Text>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getWifiList} />
        }
      >
        {listLoading && <ActivityIndicator size={24} color={color.GREEN} />}
        {wifiList.length > 0 ? (
          <View style={styles.listContainer}>
            <Text style={CommonStyle.text}>Nearby Networks</Text>
            {wifiList.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("WifiPassword", {
                      selectedWifi: item,
                      deviceId: deviceId,
                      location: location,
                      name: name,
                    });
                  }}
                  style={[
                    styles.wifiContainer,
                    index === wifiList.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={styles.centerRow}>
                    <View style={styles.wifiIcon}>
                      <WifiDeviceGreen height={"100%"} width={"100%"} />
                    </View>
                    <Text style={[CommonStyle.sectionTitle, { width: "75%" }]}>
                      {item.SSID}
                    </Text>
                  </View>
                  <View style={styles.lockIcon}>
                    <CarotRightBlack height={"100%"} width={"100%"} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text
            style={[
              CommonStyle.blackTitle,
              { width: "75%", textAlign: "center", alignSelf: "center" },
            ]}
          >
            No network found refresh it
          </Text>
        )}
        <View style={{ height: 50 }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SelectWifi;

const styles = StyleSheet.create({
  locationTextInputWidth: {
    width: "100%",
    marginTop: 20,
  },
  banner: {
    height: responsiveScale(220),
    width: "85%",
    alignSelf: "center",
    marginVertical: 20,
  },
  scrollView: {
    marginTop: 20,
  },
  wifiContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: color.LIGHT_GRAY_4,
  },
  centerRow: { flexDirection: "row", alignItems: "center" },
  wifiIcon: {
    height: responsiveScale(32),
    width: responsiveScale(32),
    marginRight: 15,
  },
  lockIcon: {
    height: responsiveScale(22),
    width: responsiveScale(22),
  },
  qrCodeScannerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrContainer: {
    height: "100%",
    width: "100%",
    margin: 0,
    backgroundColor: "white",
  },
  divider: { marginTop: Platform.OS === "android" ? 35 : 0 },
  scanHeader: { paddingHorizontal: 20, zIndex: 2 },
  listContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: color.LIGHT_GREEN_5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
