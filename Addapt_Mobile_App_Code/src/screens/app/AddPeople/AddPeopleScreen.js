import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import CustomHeader from '../../../components/CustomHeader';
import {RNCamera, FaceDetector} from 'react-native-camera';
import {perfectSize} from '../../../styles/theme';
import {color} from '../../../config/color';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import {registerUserFaceAWS} from '../../../resources/baseServices/auth';
import {useSelector} from 'react-redux';
import FaceRec from '../../../assets/appImages/FaceRec.svg';
import FaceRec1 from '../../../assets/appImages/FaceRec1.svg';
import FaceRec2 from '../../../assets/appImages/FaceRec2.svg';
import FaceRec3 from '../../../assets/appImages/FaceRec3.svg';
import FaceRec4 from '../../../assets/appImages/FaceRec4.svg';
import FaceRec5 from '../../../assets/appImages/FaceRec5.svg';
import Reset from '../../../assets/appImages/Reset.svg';
import ResetGreen from '../../../assets/appImages/ResetGreen.svg';
import AddIcon from '../../../assets/appImages/AddIcon.svg';
import CameraChange from '../../../assets/appImages/CameraChange.svg';
import GreenAddIcon from '../../../assets/appImages/GreenAddIcon.svg';
import PlusIcon from '../../../assets/appImages/PlusIcon.svg';
import {CustomeToast} from '../../../components/CustomeToast';
import CustomDropdown from '../../../components/CustomDropdown';
import {Stepper} from '../../../components/Stepper';
import _ from 'lodash';
import MultiDropdown from '../../../components/MultiDropdown';

const AddPeopleScreen = ({navigation}) => {
  const cameraRef = useRef(null);
  const [name, setName] = useState('');
  const [images, setImages] = useState([{}, {}, {}, {}, {}]);
  const [loading, setLoading] = useState(false);
  const [hitloading, setHitLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [cameraType, setCameraType] = useState('front');
  const [selectedCamera, setSelectedCamera] = useState([]);
  const [slectedLocation, setSelectedLocation] = useState('');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const locationList = useSelector(state => state?.devices?.locationList ?? []);

  const getImages = [
    {
      image: require('../../../assets/appImages/FaceS1.png'),
      name: 'Face your face to the front',
    },
    {
      image: require('../../../assets/appImages/FaceS2.png'),
      name: 'Turn your face slightly to the right',
    },
    {
      image: require('../../../assets/appImages/FaceS3.png'),
      name: 'Turn your face to the right',
    },
    {
      image: require('../../../assets/appImages/FaceS4.png'),
      name: 'Turn your face slightly to the left',
    },
    {
      image: require('../../../assets/appImages/FaceS5.png'),
      name: 'Turn your face to the left',
    },
  ];

  const getAngles = [
    {max: 5, min: -5},
    {max: -15, min: -40},
    {max: -60, min: -100},
    {max: 40, min: 15},
    {max: 100, min: 60},
  ];

  const getBackAngles = [
    {max: 5, min: -5},
    {max: 40, min: 15},
    {max: 100, min: 60},
    {max: 345, min: 320},
    {max: 300, min: 260},
  ];

  const getAnglesIOS = [
    {max: 5, min: -5},
    {max: 40, min: 15},
    {max: 100, min: 60},
    {max: -15, min: -40},
    {max: -60, min: -100},
  ];

  const getBackAnglesIOS = [
    {max: 5, min: -5},
    {max: -15, min: -40},
    {max: -60, min: -100},
    {max: 40, min: 15},
    {max: 100, min: 60},
  ];

  const handleFacesDetected = async ({faces}) => {
    if (faces.length > 0) {
      const faceAngle =
        selectedIndex === 0 && cameraType === 'back' && faces[0].yawAngle > 355
          ? faces[0].yawAngle - 360
          : faces[0].yawAngle;
      console.log(selectedIndex, ' image', faceAngle, faces[0].yawAngle);
      if (Object.keys(images[selectedIndex]).length === 0 && !loading) {
        const Angles =
          cameraType === 'front'
            ? Platform.OS === 'android'
              ? getAngles
              : getAnglesIOS
            : Platform.OS === 'android'
            ? getBackAngles
            : getBackAnglesIOS;
        if (
          faceAngle >= Angles[selectedIndex].min &&
          faceAngle <= Angles[selectedIndex].max
        ) {
          setLoading(true);
          const indexToSet = selectedIndex;
          try {
            const options = {
              quality: 0.7, // Image quality (0 to 1)
              // width: 800, // Image width
              // height: 600, // Image height
              // base64: true, // If true, the result will be in base64 format
              // exif: true, // Include EXIF data in the result
              // skipProcessing: false, // If true, no additional processing will be done on the image (no resizing or compression)
              // fixOrientation: true, // If true, the image will be rotated to match the device's orientation
              // forceUpOrientation: true, // If true, the image will be rotated to an upright orientation, ignoring the device's orientation
              // onPictureSaved: result => {
              //   console.log('Picture saved:', result);
              // },
            };
            let imageData = await cameraRef.current.takePictureAsync(options);
            const updatedImages = [...images];
            updatedImages[indexToSet] = imageData;
            setImages(updatedImages);
            setLoading(false);
          } catch (error) {
            console.error('Error capturing image:', error);
            setLoading(true);
          }
        }
      }
    }
  };

  const onAddPress = async () => {
    const atLeastOneEmpty = images.some(obj => Object.keys(obj).length === 0);
    if (name === '') {
      CustomeToast({type: 'error', message: 'Please enter name'});
    } else if (atLeastOneEmpty) {
      console.log('one object in the array is empty.');
    } else {
      try {
        console.log('No objects in the array are empty.');
        setHitLoading(true);
        let formData = new FormData();
        images.map((photo, i) => {
          formData.append('file', {
            name: photo.uri.split('/').pop(),
            type: 'image/jpeg',
            uri: photo.uri,
          });
        });
        const res = await registerUserFaceAWS(
          userDetails?.email,
          userDetails?.userId,
          name,
          formData,
          [slectedLocation],
          selectedCamera,
        );
        if (res?.status === 200) {
          console.log('res', res);
          setHitLoading(false);
          CustomeToast({type: 'success', message: res?.data.msg});
          navigation.goBack();
        } else {
        }
      } catch (error) {
        console.log('error', error);
        error?.response?.data?.err &&
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        setHitLoading(false);
      }
    }
  };

  const changeCameraPress = () => {
    if (cameraType === 'front') {
      setCameraType('back');
      setImages([{}, {}, {}, {}, {}]);
    } else {
      setCameraType('front');
      setImages([{}, {}, {}, {}, {}]);
    }
  };
  const onPressBack = () => {
    if (selectedIndex === 0) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(selectedIndex - 1);
    }
  };
  const onPressNext = () => {
    if (selectedIndex === 4) {
      onAddPress();
    } else {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  return (
    <View
      style={[CommonStyle.sectionContainer, {flex: 1, paddingHorizontal: 0}]}>
      <View style={{paddingBottom: 10, paddingHorizontal: 20}}>
        <CustomHeader
          title={'Set up your face'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
      </View>

      <View style={[styles.frameImageMargin, {flex: 1}]}>
        {selectedIndex === null ? (
          <View style={{marginTop: 20}}>
            <TextInputField
              value={name}
              onchangeText={value => {
                setName(value);
              }}
              placeholder={'Eg. Vishal Bhatt'}
              placeholderTextColor={color.DARK_GRAY}
            />
            <View style={[CommonStyle.row, {marginTop: 20}]}>
              <View style={{width: '48%'}}>
                <CustomDropdown
                  placeholder={'Location *'}
                  onChangeValue={item => {
                    setSelectedCamera([]);
                    setSelectedLocation(item._id);
                  }}
                  extraInputViewStyle={{
                    backgroundColor: color.WHITE,
                  }}
                  valueField={'_id'}
                  labelField={'location'}
                  value={slectedLocation}
                  data={locationList}
                />
              </View>
              <View style={{width: '48%'}}>
                <MultiDropdown
                  placeholder={'Device *'}
                  data={_.filter(devicesList, {
                    deviceLocation: slectedLocation,
                  }).map(item => {
                    return {
                      label: item?.deviceDetails?.name,
                      value: item?._id,
                    };
                  })}
                  value={selectedCamera}
                  onChangeValue={setSelectedCamera}
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              marginTop: responsiveScale(20),
              marginBottom: responsiveScale(30),
            }}>
            <Stepper currentPosition={selectedIndex} />
          </View>
        )}
        <View style={styles.cameraContainer}>
          {images[selectedIndex]?.uri ? (
            <View style={[styles.rnCameraView, {transform: [{scaleX: 1.3}]}]}>
              <Image
                source={{uri: images[selectedIndex]?.uri}}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 100,
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <RNCamera
              ref={cameraRef}
              captureAudio={false}
              style={styles.rnCameraView}
              type={cameraType}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              faceDetectionLandmarks={FaceDetector.Constants.Landmarks.all}
              faceDetectionClassifications={
                FaceDetector.Constants.Classifications.all
              }
              faceDetectionMode={FaceDetector.Constants.Mode.accurate}
              onFacesDetected={handleFacesDetected}
            />
          )}
          {selectedIndex === null && (
            <View style={styles.changeCameraContainer}>
              <TouchableOpacity
                onPress={changeCameraPress}
                style={{
                  height: perfectSize(20),
                  width: perfectSize(20),
                  transform: [{scaleX: 1.3}],
                }}>
                <CameraChange height={'100%'} width={'100%'} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.verticalLine} />
          <View style={styles.horizontalLine} />
        </View>
        {selectedIndex === null && (
          <Text style={[styles.title]}>
            Configure facial recognition for various orientations
          </Text>
        )}
        {/* <View
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {images.map((item, index) => {
            return (
              <View style={styles.imageContainer}>
                <LinearGradient
                  start={{x: 0.5, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={[
                    selectedIndex === index ? '#00937D80' : color.WHITE,
                    selectedIndex === index ? '#00937D20' : color.WHITE,
                  ]}
                  style={[styles.linearGradient]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setSelectedIndex(index)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        selectedIndex === index
                          ? color.LIGHT_GRAY_4
                          : color.LIGHT_GRAY_5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                      width: '100%',
                    }}>
                    {item?.uri ? (
                      <Image
                        source={{uri: item?.uri}}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 100,
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <View
                        style={{
                          height: '100%',
                          width: '100%',
                          opacity: selectedIndex === index ? 1 : 0.5,
                        }}>
                        {getImages[index].image}
                      </View>
                    )}
                    {item?.uri ? (
                      <View style={styles.resetBtnContainer}>
                        <TouchableOpacity
                          // style={{opacity: 0.7}}
                          onPress={() => {
                            setSelectedIndex(index);
                            const updatedImages = [...images];
                            updatedImages[index] = {};
                            setImages(updatedImages);
                          }}>
                          <Reset />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.addBtnContainer}>
                        <AddIcon />
                      </View>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
                <Text
                  style={[
                    styles.angleText,
                    selectedIndex === index && {color: color.DARK_GRAY_5},
                  ]}>
                  {getImages[index].name}
                </Text>
              </View>
            );
          })}
        </View> */}

        {selectedIndex != null && (
          <Button
            isIcon
            image={<ResetGreen />}
            name={'Retake face'}
            extraBtnViewStyle={[
              styles.btnViewStyle,
              {marginVertical: responsiveScale(30)},
            ]}
            extraBtnNameStyle={styles.btnBoldNameStyle}
            onPress={() => {
              const updatedImages = [...images];
              updatedImages[selectedIndex] = {};
              setImages(updatedImages);
            }}
          />
        )}

        {selectedIndex != null && (
          <View style={[CommonStyle.row, {paddingHorizontal: 20}]}>
            <View style={styles.faceContainer}>
              <Image
                source={getImages[selectedIndex].image}
                style={{height: '100%', width: '100%'}}
              />
            </View>
            <Text
              style={[
                CommonStyle.greyText20,
                {width: '80%', textAlign: 'center'},
              ]}>
              {getImages[selectedIndex].name}
            </Text>
          </View>
        )}

        {/* <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.front} // You can change the camera type as needed
        onFacesDetected={handleFacesDetected}
        faceDetectionLandmarks={FaceDetector.Constants.Landmarks.all}
        faceDetectionClassifications={
          FaceDetector.Constants.Classifications.all
        }
        faceDetectionMode={FaceDetector.Constants.Mode.accurate}
        captureAudio={false}
      /> */}
        {/* <View style={styles.overlay}>

        {faces.map((face, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: face.bounds.origin.y,
              left: face.bounds.origin.x,
              width: face.bounds.size.width,
              height: face.bounds.size.height,
              borderWidth: 2,
              borderColor: 'red',
            }}
          />
        ))}
      </View> */}
        <View style={{flex: 1}} />
        {selectedIndex === null && (
          <View style={styles.paddingBottom}>
            <Button
              name={'Continue'}
              extraBtnViewStyle={
                selectedCamera.length === 0 ||
                name === '' ||
                slectedLocation === ''
                  ? styles.btnDisableStyle
                  : styles.deleteBtn
              }
              extraBtnNameStyle={
                (selectedCamera.length === 0 ||
                  name === '' ||
                  slectedLocation === '') &&
                styles.btnDisableTextStyle
              }
              disabled={
                name === '' ||
                selectedCamera.length === 0 ||
                slectedLocation === ''
              }
              onPress={() => {
                setSelectedIndex(0);
              }}
            />
          </View>
        )}
        {selectedIndex != null && (
          <View style={[CommonStyle.row, styles.paddingBottom]}>
            <Button
              name={'Back'}
              extraBtnViewStyle={styles.btnViewStyle}
              extraBtnNameStyle={styles.btnNameStyle}
              onPress={() => {
                onPressBack();
              }}
            />
            <Button
              name={selectedIndex === 4 ? 'Done' : 'Next'}
              extraBtnViewStyle={
                !images[selectedIndex]?.uri
                  ? styles.btnDisableStyle
                  : styles.deleteBtn
              }
              extraBtnNameStyle={[
                {fontSize: responsiveScale(16)},
                !images[selectedIndex]?.uri && styles.btnDisableTextStyle,
              ]}
              disabled={!images[selectedIndex]?.uri}
              onPress={onPressNext}
            />
          </View>
        )}
        <View style={{height: responsiveScale(20)}} />
      </View>
      {hitloading && (
        <View style={CommonStyle.fullLoader}>
          <ActivityIndicator size={30} color={color.GREEN} />
        </View>
      )}
    </View>
  );
};

export default AddPeopleScreen;

const styles = StyleSheet.create({
  rnCameraView: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 100,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    backgroundColor: color.LIGHT_GRAY_5,
    height: perfectSize(200),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: perfectSize(200),
    borderRadius: perfectSize(100),
    alignSelf: 'center',
    transform: [{scaleY: 1.3}],
    marginBottom: perfectSize(30),
    marginTop: perfectSize(50),
  },
  verticalLine: {
    height: '100%',
    position: 'absolute',
    borderStyle: 'dashed',
    borderColor: color.WHITE,
    borderEndWidth: 1,
    opacity: 0.7,
  },
  horizontalLine: {
    width: '100%',
    position: 'absolute',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderColor: color.WHITE,
    opacity: 0.7,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    width: '85%',
    alignSelf: 'center',
    fontSize: responsiveScale(18),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  frameImageMargin: {paddingHorizontal: 20},
  linearGradient: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    padding: 1.2,
  },
  imageContainer: {
    width: '17%',
    alignItems: 'center',
    padding: 1.2,
  },
  btnNameStyle: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontSize: responsiveScale(16),
  },
  btnBoldNameStyle: {
    color: color.GREEN,
    fontWeight: FONT_WEIGHT_BOLD,
    fontFamily: TTNORMSPRO_BOLD,
    fontSize: responsiveScale(14),
  },
  btnDisableTextStyle: {
    fontFamily: TTNORMSPRO_BOLD,
    color: color.DARK_GRAY,
    fontWeight: FONT_WEIGHT_BOLD,
    fontSize: responsiveScale(16),
  },
  btnViewStyle: {
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.GREEN,
    width: '45%',
  },
  btnDisableStyle: {
    backgroundColor: color.LIGHT_GRAY_9,
    width: '45%',
  },
  deleteBtn: {width: '45%'},
  paddingBottom: {padding: 20},
  resetBtnContainer: {
    position: 'absolute',
    backgroundColor: color.LIGHT_GREEN_2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '100%',
    height: '100%',
    borderColor: color.GREEN,
    borderWidth: 2,
  },
  addBtnContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '50%',
    height: '50%',
    backgroundColor: '#00937D40',
  },
  angleText: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.DARK_GRAY,
    textAlign: 'center',
  },
  changeCameraContainer: {
    height: perfectSize(40),
    backgroundColor: color.LIGHT_GREEN,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: '#00000033',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectContainer: {
    height: perfectSize(40),
    paddingHorizontal: perfectSize(25),
    alignItems: 'center',
    borderRadius: perfectSize(40),
    borderColor: color.DARK_GRAY,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
});
