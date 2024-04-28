import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {color} from '../../../config/color';
import Frame from '../../../assets/appImages/Frame.svg';
import Close from '../../../assets/appImages/Close.svg';
import RedDelete from '../../../assets/appImages/RedDelete.svg';
import Scanner from '../../../assets/appImages/Scanner.svg';
import RightCircle from '../../../assets/appImages/RightCircle.svg';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import TextInputField from '../../../components/TextInputField';
import {responsiveScale} from '../../../styles/mixins';
import {CommonStyle} from '../../../config/styles';
import Button from '../../../components/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setAuthTokenAction} from '../../../store/authReducer';
import {useDispatch, useSelector} from 'react-redux';
import {
  getUserDetails,
  setAddedDevices,
  setAuthToken,
} from '../../../helpers/auth';
import BarcodeModal from '../../../components/BarcodeModal';
import {perfectSize} from '../../../styles/theme';
import LinearGradient from 'react-native-linear-gradient';
import {addDevice} from '../../../resources/baseServices/auth';
import {setDevicesAction} from '../../../store/devicesReducer';
import {CustomeToast} from '../../../components/CustomeToast';

const AddSetUpDevice = ({navigation, route}) => {
  const {selectedItems, location, deviceData} = route?.params;
  const [home, setHome] = useState(location?.location);
  const [camera, setCamera] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  const [scannedInputs, setScannedInputs] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);
  const [scannedData, setScannedData] = useState([]);
  const [barcodeModalVisible, setbarcodeModalVisible] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [auth_Token, setAuth_Token] = useState(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(false);
  const [seconds, setSeconds] = useState(150);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [start, seconds]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const authToken = useSelector(state => state.auth?.authToken ?? '');
  const devices = useSelector(state => state.devices?.devices ?? '');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? '');

  const Titles = selectedItems?.map(item => ({
    name: item.name,
    count: item.count || 0,
  }));

  const textInputRefs = useRef({});

  const dispatch = useDispatch();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    let total = 0;
    Titles.forEach(item => {
      total += item.count;
    });
    setTotalItems(total);
  }, [totalItems]);

  useEffect(() => {
    const getData = async () => {
      const userData = await getUserDetails();
      const userDataRes = JSON.parse(userData);
      setAuth_Token(userDataRes?.auth_token);
    };
    getData();
  }, []);

  // const {hasPermission, requestPermission} = useCameraPermission();

  // if (!hasPermission) {
  //   requestPermission()
  //     .then(permissionGranted => {
  //       if (permissionGranted) {
  //         // Permission has been granted
  //       } else {
  //         // Permission has been denied by the user
  //       }
  //     })
  //     .catch(error => {
  //       // Handle any errors that occur during the permission request process
  //     });
  // }

  // const device = useCameraDevice('back');

  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: codes => {
  //     console.log('Scanned==>>', codes?.[0]?.value);
  //     if (codes?.[0]?.value) {
  //       const scannedInputKey = focusedInput;
  //       setScannedInputs(prevScannedInputs => ({
  //         ...prevScannedInputs,
  //         [scannedInputKey]: true,
  //       }));
  //       setScannedCount(totalItems - 1);

  //       setTimeout(() => {
  //         setIsQRCodeModalVisible(false);
  //         setTimeout(() => {
  //           setModalVisible(true);
  //         }, 1000);
  //       }, 4000);
  //     }
  //   },
  // });

  function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;

    let randomCode = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }

    return randomCode;
  }
  const randomCode = generateRandomCode();

  const onScan = async val => {
    const data = {
      additionalDetails: {
        deviceType: val?.additionalDetails?.deviceType,
        deviceCategory: val?.additionalDetails?.deviceCategory,
        deviceId: val?.additionalDetails?.deviceId || randomCode,
        communicationProtocol: val?.additionalDetails?.communicationProtocol,
        vpnIP: val?.additionalDetails?.vpnIP,
      },
      deviceDetails: {
        name: camera,
        location: home,
        class: val?.deviceDetails?.class,
        posx: val?.deviceDetails?.posx,
        posy: val?.deviceDetails?.posy,
        height: val?.deviceDetails?.height,
        width: val?.deviceDetails?.width,
        zindex: val?.deviceDetails?.zindex,
        cielingHeight: val?.deviceDetails?.cielingHeight,
      },
      email: userDetails.email,
      bleAddr: val?.bleAddr,
      cameraEventTypeId: [],
      deviceTypeId: val?.deviceTypeId,
      deviceLocation: location?._id,
    };
    console.log('val--->', val);
    console.log('data--->', data);
    setLoading(true);
    setStart(true);
    if (val?.additionalDetails?.vpnIP) {
      try {
        const res = await addDevice(data);

        if (res?.status === 200) {
          console.log('res---->', res);
          const scannedInputKey = focusedInput;
          if (!scannedInputs[scannedInputKey] && val) {
            setScannedInputs(prevScannedInputs => ({
              ...prevScannedInputs,
              [scannedInputKey]: true,
            }));
            setScannedData(prevScannedInputs => [
              ...prevScannedInputs,
              selectedItemIndex,
            ]);
            setScannedCount(prevCount => prevCount + 1);

            setIsQRCodeModalVisible(false);
            setLoading(false);
            setTimeout(() => {
              if (scannedCount === totalItems) {
                navigation.navigate('LiveViewScreen');
              } else {
                setModalVisible(true);
              }
            }, 500);
          }
        }
      } catch (error) {
        if (error?.response?.status === 400) {
          console.log('error-->', error?.response);
          setLoading(false);
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
      }
    } else {
      CustomeToast({type: 'error', message: 'Please try again'});
      setLoading(false);
    }
  };

  const handleContinueButtonPress = async () => {
    if (scannedCount === totalItems) {
      // console.log('devices', devices);
      // console.log('authToken', authToken);
      // if (devices) {
      // dispatch(setDevicesAction(true));
      // await setAddedDevices('true');
      // setModalVisible(false);
      navigation.navigate('LiveViewScreen');
      // } else {
      dispatch(setDevicesAction(true));
      await setAddedDevices('true');
      setModalVisible(false);
      // }
    } else {
      // Not all items are scanned, close the modal
      // const inputKey = focusedInput;
      // console.log('inputKey', inputKey);
      // const currentIndex = Object.keys(textInputRefs.current).indexOf(inputKey);
      // console.log('currentIndex', currentIndex);
      // if (
      //   currentIndex >= 0 &&
      //   currentIndex < Titles.length * Titles[0].count - 1
      // ) {
      //   const nextInputKey = Object.keys(textInputRefs.current)[
      //     currentIndex + 1
      //   ];
      //   console.log('nextInputKey', nextInputKey);
      //   if (nextInputKey) {
      //     textInputRefs.current[nextInputKey]?.focus();
      //   }
      // }
      setModalVisible(false);
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Add Devices'}
        isBackBtnVisible={true}
        isNextBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
        onNextBtnPress={() => {
          toggleModal();
        }}
      />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.frameImageMargin}>
        <View style={styles.frameImage}>
          <Frame />
        </View>
        <Text style={styles.orAddText}>
          {/* Enter the name of the camera and click “link” to connect */}
          Enter the camera name and click 'Link' to initiate camera scanning
        </Text>
        {/* <TextInputField
          value={home}
          onchangeText={value => {
            setHome(value);
          }}
          placeholder={'Enter your home name'}
          placeholderTextColor={color.DARK_GRAY}
          extraTextInputStyle={{}}
          extraInputViewStyle={styles.inputHomeMargin}
        /> */}

        {Titles?.map((item, index) => (
          <View key={index}>
            <Text style={[CommonStyle.inputTitle, styles.titleText]}>
              {item?.name}
            </Text>
            {Array.from({length: item?.count}, (_, i) => (
              <View key={i}>
                <View style={styles.inputFieldAndImageView}>
                  {scannedData.length >= i ? (
                    <TextInputField
                      ref={input => {
                        textInputRefs.current[`${item.name}-${i}`] = input;
                      }}
                      value={camera || ''}
                      onchangeText={value => {
                        setCamera(value);
                      }}
                      onBlurPress={value => {
                        const inputKey = `${item?.name}-${i}`;
                        if (!scannedInputs[inputKey] && value.trim() !== '') {
                          // setSelectedItemName(item?.name);
                          // setSelectedItemIndex(i);
                          // setIsQRCodeModalVisible(true);
                          setFocusedInput(inputKey);
                        }
                        // setIsQRCodeModalVisible(true);
                        // if (value.trim() === '') {
                        //   setIsQRCodeModalVisible(false);
                        // } else {
                        //   setIsQRCodeModalVisible(true);
                        //   setFocusedInput(`${item?.name}-${i}`);
                        // }
                      }}
                      placeholder={`Name your space`}
                      placeholderTextColor={color.DARK_GRAY}
                      isExtraBtn={
                        scannedInputs[`${item?.name}-${i}`] ? false : true
                      }
                      extraBtn={
                        <Button
                          name={'Link'}
                          extraBtnViewStyle={styles.extraBtnViewStyle}
                          extraBtnNameStyle={{fontSize: responsiveScale(13)}}
                          onPress={() => {
                            // onResetBtnPress();
                            // if (home === '') {
                            //   return CustomeToast({
                            //     type: 'error',
                            //     message: 'Please feelup first field',
                            //   });
                            // }
                            // console.log('camera[`${item?.name}-${i}`]', camera);
                            if (!camera) {
                              return CustomeToast({
                                type: 'error',
                                message: `Name your space eg. Living room`,
                              });
                            }
                            // setIsQRCodeModalVisible(true);
                            setSelectedItemName(item?.name);
                            setSelectedItemIndex(i);
                            onScan(deviceData);
                          }}
                        />
                      }
                      extraInputViewStyle={CommonStyle.flex}
                      editable={!scannedInputs[`${item?.name}-${i}`]} // Set editable to false if input has been scanned
                    />
                  ) : (
                    <View style={styles.disableComtainer}>
                      <Text style={CommonStyle.NavigateText}>Eg. Kitchen</Text>
                    </View>
                  )}

                  {/* <View style={styles.disableComtainer}>
                    <Text>Eg. Kitchen</Text>
                  </View> */}
                  {/* <LinearGradient
                    start={{x: 0.9, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['#00937D80', '#00937D20']}
                    style={styles.linearGradient}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        if (home === '') {
                          return Alert.alert('Please feelup first field');
                        }
                        console.log(
                          'camera[`${item?.name}-${i}`]',
                          camera[`${item?.name}-${i}`],
                        );
                        if (!camera[`${item?.name}-${i}`]) {
                          return Alert.alert(
                            `Please feelup camera ${item?.name}- Camera ${
                              i + 1
                            }`,
                          );
                        }
                        setIsQRCodeModalVisible(true);
                        setSelectedItemName(item?.name);
                        setSelectedItemIndex(i);
                      }}
                      style={styles.innerContainer}>
                      <View style={styles.scanImageView}>
                        <Scanner height="100%" width="100%" />
                      </View>
                    </TouchableOpacity>
                  </LinearGradient> */}
                  {scannedInputs[`${item?.name}-${i}`] && (
                    <TouchableOpacity style={styles.deleteBtnViewStyle}>
                      <RedDelete height={'100%'} width={'100%'} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </KeyboardAwareScrollView>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color.GREEN} />
          <Text style={styles.loadingText}>{formatTime(seconds)}</Text>
        </View>
      ) : null}

      <Modal
        style={CommonStyle.modelContainerStyle}
        animationType="fade"
        transparent={true}
        visible={isModalVisible}>
        <View style={CommonStyle.modalContentStyle}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <RightCircle />
          <Text style={[CommonStyle.sectionTitle, styles.congratulationsTitle]}>
            Congratulations !
          </Text>
          <Text style={CommonStyle.text}>
            {totalItems > 1
              ? `${scannedCount}/${totalItems} devices connected.`
              : `${scannedCount}/${totalItems} device connected.`}
          </Text>
          <Button
            name={
              scannedCount === totalItems
                ? 'Continue'
                : `Add camera ${totalItems - scannedCount}`
            }
            extraBtnViewStyle={styles.continueText}
            onPress={() => {
              handleContinueButtonPress();
            }}
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
            title={selectedItemName}
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

          {/* <View style={styles.textAndButtonView}>
              <Text style={styles.orAddText}>Or add devices by the UID/IP</Text>
              <View style={styles.buttonView}>
                <Button name={'Input UID'} />
                <Button
                  name={'Select Network'}
                  extraBtnViewStyle={styles.btnViewStyle}
                  extraBtnNameStyle={styles.btnNameStyle}
                />
              </View>
            </View> */}
          {/* {device ? (
                <Camera
                  style={StyleSheet.absoluteFill}
                  device={device}
                  isActive={true}
                  codeScanner={codeScanner}
                />
              ) : (
                <Text>No Camera Found</Text>
              )} */}
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};

export default AddSetUpDevice;

const styles = StyleSheet.create({
  congratulationsTitle: {
    fontSize: responsiveScale(18),
    paddingTop: 20,
    paddingBottom: 10,
  },
  qrContainer: {
    height: '100%',
    width: '100%',
    margin: 0,
    backgroundColor: 'white',
  },
  qrCodeScannerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldAndImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
  },
  linearGradient: {
    height: perfectSize(40),
    borderRadius: 32, // <-- Outer Border Radius
  },
  extraBtnViewStyle: {width: '20%', height: 30},
  innerContainer: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    height: perfectSize(40),
    width: perfectSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanImageView: {
    height: 24,
    aspectRatio: 1,
  },
  frameImage: {alignItems: 'center', paddingTop: 20},
  frameImageMargin: {marginBottom: 20},
  titleText: {
    // fontWeight: '900',
    paddingTop: 30,
    paddingBottom: 0,
  },
  inputHomeMargin: {marginTop: 50},
  continueText: {width: '50%', marginTop: 20},
  scanHeader: {paddingHorizontal: 20, zIndex: 2},
  btnNameStyle: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(14),
  },
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    marginVertical: 20,
  },
  deleteBtnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.RED,
    height: perfectSize(40),
    borderRadius: 32,
    aspectRatio: 1,
    padding: 7,
  },
  textAndButtonView: {
    marginTop: 20,
    width: '100%',
  },
  orAddText: {
    textAlign: 'center',
    paddingTop: 30,
    fontSize: responsiveScale(16),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.DARK_GRAY,
    width: '90%',
    alignSelf: 'center',
  },
  buttonView: {
    paddingHorizontal: 20,
  },
  divider: {marginTop: Platform.OS === 'android' ? 35 : 0},
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  disableComtainer: {
    height: perfectSize(40),
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: color.LIGHT_GRAY_4,
    width: '100%',
    paddingHorizontal: 30,
  },
  loadingText: {
    fontSize: responsiveScale(24),
    color: color.GREEN,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: responsiveScale(150),
  },
});
