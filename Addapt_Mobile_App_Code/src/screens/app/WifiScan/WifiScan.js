import {
  ActivityIndicator,
  Alert,
  FlatList,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WifiManager from 'react-native-wifi-reborn';
import Button from '../../../components/Button';
import {CommonStyle} from '../../../config/styles';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import TextInputField from '../../../components/TextInputField';
import Modal from 'react-native-modal';
import {color} from '../../../config/color';
import CustomHeader from '../../../components/CustomHeader';
import WifiDevice from '../../../assets/appImages/WifiDevice.svg';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import Unlock from '../../../assets/appImages/Unlock.svg';
import ConnectBanner from '../../../assets/appImages/ConnectBanner.svg';
import WifiDeviceBanner from '../../../assets/appImages/WifiDeviceBanner.svg';
import {responsiveScale} from '../../../styles/mixins';
import axios from 'axios';
import BarcodeModal from '../../../components/BarcodeModal';
import {CustomeToast} from '../../../components/CustomeToast';
// import {Event} from '@react-native-tethering/wifi';
// import WifiTethering from '@react-native-tethering/wifi';

const WifiScan = ({route, navigation}) => {
  const [wifiList, setWifiList] = useState([]);
  const [deviceWifiList, setDeviceWifiList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [first, setFirst] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedWifi, setSelectedWifi] = useState('');
  const [deviceData, setDeviceData] = useState({});
  const [deviceIP, setDeviceIP] = useState('');
  const [barcodeModalVisible, setbarcodeModalVisible] = useState(false);
  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const defaultLocation = route?.params?.location;

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        // if (Platform.OS === 'android') {
        //   const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //     {
        //       title: 'Location permission is required for WiFi connections',
        //       message:
        //         'This app needs location permission as this is required  ' +
        //         'to scan for wifi networks.',
        //       buttonNegative: 'DENY',
        //       buttonPositive: 'ALLOW',
        //     },
        //   );
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     getWifiList();
        //     // You can now use react-native-wifi-reborn
        //   } else {
        //     // Permission denied
        //   }
        // } else {
        //   requestLocationPermission();
        // }
        requestLocationPermission();
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const requestLocationPermission = async () => {
    try {
      let permissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permissionStatus = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        // permissionStatus = await check(
        //   PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        // );
        // permissionStatus = await check(PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES);
      }
      console.log('permissionStatus', permissionStatus);
      if (permissionStatus !== RESULTS.GRANTED) {
        const result = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        if (result === RESULTS.GRANTED) {
          getWifiList();
          // getSecondWifiList();
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
        }
      } else {
        console.log('Location permission already granted');
        getWifiList();
        // getSecondWifiList();
      }
    } catch (error) {
      console.error('Error checking or requesting location permission:', error);
    }
  };

  const getWifiList = async () => {
    const enabled =
      Platform.OS === 'ios' ? true : await WifiManager.isEnabled();
    if (enabled) {
      setListLoading(true);
      try {
        const list = await WifiManager.loadWifiList();
        console.log('list', list);
        setWifiList(list);
        setListLoading(false);
      } catch (error) {
        setListLoading(false);
        console.error('Error loading Wi-Fi list:', error);
      }
    } else {
      setListLoading(false);
      WifiManager.setEnabled(true);
      getWifiList();
    }
  };
  const getSecondWifiList = async () => {
    // const enabled =
    //   Platform.OS === 'ios' ? true : await Event.OnWifiScanResults();
    // if (enabled) {
    setListLoading(true);
    try {
      // const list = await WifiTethering.getWifiNetworks();
      // console.log('list', list);
      // setWifiList(list);
      // setListLoading(false);
    } catch (error) {
      setListLoading(false);
      console.error('Error getSecondWifiList', error);
    }
  };

  const connectToWifi = async () => {
    try {
      await WifiManager.connectToProtectedSSID(
        selectedWifi,
        password, // Replace with the password of the Wi-Fi network
        false,
        false,
      );
      const data = await WifiManager.getIP();
      console.log('data', data);
      // Alert.alert('Connected to Wi-Fi:');
      setModalVisible(false);
      setPassword('');
    } catch (error) {
      // Alert.alert('Error connecting to Wi-Fi:', error);
    }
  };
  const connectToDevice = async name => {
    console.log('name', name);
    // Alert.alert('name', name);
    try {
      await WifiManager.connectToProtectedSSID(
        name,
        '', // Replace with the password of the Wi-Fi network
        false,
        false,
      ).then(
        () => {
          // Alert.alert('Connected successfully!');
          setFirst(false);
          getWifiList();
          getDeviceInfo();
        },
        () => {
          CustomeToast({type: 'error', message: 'Connection failed!'});
          // Alert.alert('Connection failed!');
        },
      );
      // const data = await WifiTethering.connectToNetwork({
      //   ssid: name,
      //   password: 'dddddd66',
      //   isHidden: false,
      //   timeout: 6000,
      // });
      // console.log('hello', data);
      // const data = await WifiManager.getIP();
      // setDeviceIP(data);
      // console.log('data', data);
      // Alert.alert('Connected', 'you connect to device with IP' + data);
    } catch (error) {
      console.log('Error connecting to Device:', error);
      // Alert.alert('Error connecting to Wi-Fi:', error);
    }
  };
  // const searchTermRegex = /\b[a-zA-Z0-9]*\d{8}\.cam\b/;
  const wifiDeviceData = wifiList.filter(item => item.SSID.includes('.cam'));
  const wifiData = wifiList.filter(item => !item.SSID.includes('.cam'));

  const deviceListeData = deviceWifiList.filter(item => item.includes('.cam'));
  const deviceNetworkListData = deviceWifiList.filter(
    item => !item.includes('.cam'),
  );

  const getDeviceInfo = async () => {
    // Alert.alert('getDeviceInfo start');
    let config = {
      method: 'get',
      url: `http://10.0.0.5:8002/getDeviceInfo`,
      headers: {},
    };

    await axios
      .request(config)
      .then(response => {
        console.log('response.data', response.data);
        // Alert.alert('getDeviceInfo', JSON.stringify(response.data));
        setDeviceData(response.data);
        getDeviceList(response.data);
      })
      .catch(error => {
        // Alert.alert('Error12', error);
      });
  };

  const onScan = async val => {
    console.log('val--->', val);
    // Alert.alert('Scan Data1', JSON.stringify(val));
    setIsQRCodeModalVisible(false);
    const ssidRegex = /S:([^;]+)/;
    const match = val.match(ssidRegex);
    const ssid = match && match[1];
    connectToDevice(ssid);
  };

  const getDeviceList = async () => {
    // Alert.alert(`http://10.0.0.5:8002/getAvailableNetworks`);
    // if (data?.additionalDetails?.vpnIP) {
    // Alert.alert('getAvailableNetworks start');
    setListLoading(true);
    let config = {
      method: 'get',
      url: `http://10.0.0.5:8002/getAvailableNetworks`,
      headers: {},
    };

    await axios
      .request(config)
      .then(response => {
        setDeviceWifiList(response.data);
        setListLoading(false);
        // setDeviceData(response.data);
        // Alert.alert('getAvailableNetworks', JSON.stringify(response.data));
      })
      .catch(error => {
        // Alert.alert('Error getAvailableNetworks', error);
        console.log('Error getDeviceList', error);
        setListLoading(false);
      });
    // }
  };

  const registerNetworkToDevice = async () => {
    setLoading(true);
    let data = {
      ssid: selectedWifi,
      password: password,
      validate: true,
    };
    // Alert.alert('registerNetwork', JSON.stringify(data));
    let config = {
      method: 'post',
      url: 'http://10.0.0.5:8002/registerNetwork',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      await axios.request(config);
    } catch (error) {
      // setLoading(false);
      // Alert.alert('Error catch');
    } finally {
      setTimeout(() => {
        // Alert.alert('Go to AddSetUpDevice');

        // checkDeviceConnected();
        setLoading(false);
        setModalVisible(false);
        navigation.navigate('AddSetUpDevice', {
          selectedItems: [{count: 1, id: '1', name: 'Fixed Camera'}],
          location: defaultLocation,
          deviceData: deviceData,
        });
      }, 10000);
      // Alert.alert('finally');
      // setTimeout(() => {
      //   getDeviceInfo();
      // }, 10000);
    }
  };

  const checkDeviceConnected = async () => {
    // setListLoading(true);
    Alert.alert('api', `http://${deviceData?.additionalDetails?.vpnIP}:8002/`);
    // let config = {
    //   method: 'get',
    //   url: `http://${deviceData?.additionalDetails?.vpnIP}:8002/`,
    //   headers: {},
    // };
    try {
      await axios
        .get(`http://${deviceData?.additionalDetails?.vpnIP}:8002/`, {
          timeout: 2000,
          headers: {},
        })
        // await axios
        //   .request(config)
        .then(response => {
          Alert.alert('checkDeviceConnected', JSON.stringify(response));
          // if (response.data) {
          setLoading(false);
          setModalVisible(false);
          navigation.navigate('AddSetUpDevice', {
            selectedItems: [{count: 1, id: '1', name: 'Fixed Camera'}],
            location: defaultLocation,
            deviceData: deviceData,
          });
          // }
        })
        .catch(error => {
          Alert.alert(
            'Error checkDeviceConnected',
            JSON.stringify(error.message),
          );
          console.log('Error getDeviceList', error);
          // setListLoading(false);
          // setTimeout(() => {
          checkDeviceConnected();
          // }, 10000);
        });
    } catch (error) {
      Alert.alert('catch checkDeviceConnected', JSON.stringify(error));
      // setTimeout(() => {
      checkDeviceConnected();
      // }, 10000);
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={first ? 'Select Device' : 'Select WI-FI'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.banner}>
        <WifiDeviceBanner height={'100%'} width={'100%'} />
      </View>
      <Text
        style={[
          CommonStyle.text,
          {width: '85%', textAlign: 'center', alignSelf: 'center'},
        ]}>
        {first
          ? 'Choose the device that you want to connect'
          : 'Choose the WI-FI network you would like to use with your device'}
      </Text>
      {first && (
        <Button
          name={'Scan'}
          extraBtnViewStyle={[CommonStyle.BtnView, {marginBottom: 0}]}
          onPress={() => {
            setIsQRCodeModalVisible(true);
          }}
          isLoading={loading}
          disabled={loading}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={first ? getWifiList : getDeviceList}
          />
        }>
        {listLoading && <ActivityIndicator size={24} color={color.GREEN} />}
        {first ? (
          wifiDeviceData.length > 0 ? (
            wifiDeviceData.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    connectToDevice(item.SSID);
                  }}
                  style={styles.wifiContainer}>
                  <View style={styles.centerRow}>
                    <View style={styles.wifiIcon}>
                      <WifiDevice height={'100%'} width={'100%'} />
                    </View>
                    <Text style={[CommonStyle.text, {width: '75%'}]}>
                      {item.SSID}
                    </Text>
                  </View>
                  <View style={styles.lockIcon}>
                    <Unlock height={'100%'} width={'100%'} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text
              style={[
                CommonStyle.blackTitle,
                {width: '75%', textAlign: 'center', alignSelf: 'center'},
              ]}>
              No device found refresh it
            </Text>
          )
        ) : (
          deviceNetworkListData.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedWifi(item);
                  setModalVisible(true);
                }}
                style={styles.wifiContainer}>
                <View style={styles.centerRow}>
                  <View style={styles.wifiIcon}>
                    <WifiDevice height={'100%'} width={'100%'} />
                  </View>
                  <Text style={[CommonStyle.text, {width: '75%'}]}>{item}</Text>
                </View>
                <View style={styles.lockIcon}>
                  <LockIcon height={'100%'} width={'100%'} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{height: 50}} />
      </ScrollView>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={modalVisible}
        avoidKeyboard={true}
        onBackdropPress={() => {
          if (!loading) {
            setModalVisible(false);
            setPassword('');
          }
        }}>
        <View style={CommonStyle.modalContentStyle}>
          <Text style={[CommonStyle.blackTitle, {textAlign: 'center'}]}>
            {`Enter Password for ${selectedWifi}`}
          </Text>
          {/* <TextInputField
            value={password}
            onchangeText={value => {
              setPassword(value);
            }}
            placeholder={'Password'}
            // icon={<EmailIcon />}
            placeholderTextColor={color.DARK_GRAY}
            extraInputViewStyle={styles.locationTextInputWidth}
          /> */}
          <TextInputField
            value={password}
            onchangeText={value => {
              setPassword(value);
            }}
            icon={<LockIcon />}
            placeholder={'password'}
            placeholderTextColor={color.DARK_GRAY}
            secureTextEntry={true}
            isVisiblePassword={true}
            autoCapitalize={false}
            extraInputViewStyle={styles.locationTextInputWidth}
          />
          <Button
            name={'Connect'}
            extraBtnViewStyle={[CommonStyle.BtnView]}
            onPress={() => {
              registerNetworkToDevice();
            }}
            isLoading={loading}
            disabled={loading}
          />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        style={styles.qrContainer}
        visible={isQRCodeModalVisible}>
        {/* <View style={styles.qrContainer}> */}
        <View style={styles.divider} />
        <View style={styles.scanHeader}>
          <CustomHeader
            // title={'Scan'}
            title={'Scan QR code'}
            isBackBtnVisible={true}
            onPressBackBtn={() => {
              setIsQRCodeModalVisible(false);
            }}
          />
        </View>

        <View style={styles.qrCodeScannerContainer}>
          <BarcodeModal
            isvisible={barcodeModalVisible}
            onClosePress={() => setIsQRCodeModalVisible(false)}
            onBarcodeScan={val => {
              setIsQRCodeModalVisible(false);
              onScan(val);
            }}
          />
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};

export default WifiScan;

const styles = StyleSheet.create({
  locationTextInputWidth: {
    width: '100%',
    marginTop: 20,
  },
  banner: {
    height: responsiveScale(200),
    width: '85%',
    alignSelf: 'center',
  },
  scrollView: {
    marginTop: 20,
  },
  wifiContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerRow: {flexDirection: 'row', alignItems: 'center'},
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    height: '100%',
    width: '100%',
    margin: 0,
    backgroundColor: 'white',
  },
  divider: {marginTop: Platform.OS === 'android' ? 35 : 0},
  scanHeader: {paddingHorizontal: 20, zIndex: 2},
});
