import {
  ActionSheetIOS,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Google from '../../../assets/appImages/Google.svg';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import ProfileCircle from '../../../assets/appImages/ProfileCircle.svg';
import Camera4 from '../../../assets/appImages/Camera4.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import UserIcon from '../../../assets/appImages/UserIcon.svg';
import RedDelete from '../../../assets/appImages/RedDelete.svg';
import InfoCircle from '../../../assets/appImages/InfoCircle.svg';
import FaceScanner from '../../../assets/appImages/FaceScanner.svg';
import Close from '../../../assets/appImages/Close.svg';
import MessageQuestion from '../../../assets/appImages/MessageQuestion.svg';
import CameraShare from '../../../assets/appImages/CameraShare.svg';
import NotificationGrey from '../../../assets/appImages/NotificationGrey.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import {useDispatch, useSelector} from 'react-redux';
import CustomHeader from '../../../components/CustomHeader';
import {perfectSize} from '../../../styles/theme';
import CategoryItem from '../../../components/CategoryItem';
import DeleteModal from '../../../components/DeleteModal';
import {
  deleteAccount,
  editProfileName,
  getProfileDetails,
  passwordChangeWithEmail,
  profileImageUpload,
} from '../../../resources/baseServices/auth';
import {
  removeAuthTokenAction,
  setEditedUserDetailsAction,
  setFirstLaunchAction,
  setUserDetailsAction,
} from '../../../store/authReducer';
import {removeDevicesAction} from '../../../store/devicesReducer';
import {
  clearAsyncStorage,
  setFirstLaunch,
  setUserDetails,
} from '../../../helpers/auth';
import Modal from 'react-native-modal';
import {CustomeToast} from '../../../components/CustomeToast';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';

const Account = ({navigation}) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [userPicture, setUserPicture] = useState({});
  const [imageUri, setImageUri] = useState('');
  const dispatch = useDispatch();
  const actionSheetRef = useRef(null);
  const [editNameModal, setEditNameModal] = useState(false);
  const [name, setName] = useState('');

  const getProfileDetail = async () => {
    try {
      const res = await getProfileDetails(userDetails?.email);
      if (res?.status === 200) {
        setName(res?.data?.data?.profileName);
        if (res?.data?.data?.profilePic.includes('http')) {
          setImageUri(res?.data?.data?.profilePic);
        }
        dispatch(setEditedUserDetailsAction(res?.data?.data));
        await setUserDetails(
          JSON.stringify({...userDetails, ...res?.data?.data}),
        );
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  useEffect(() => {
    getProfileDetail();
  }, []);

  const _handleItemPress = useCallback(() => {
    if (Platform.OS === 'android') {
      actionSheetRef.current.show();
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Done', 'Take Photo', 'Choose From Library'],
        cancelButtonIndex: 0,
        message: 'Select a Photo',
      },
      buttonIndex => {
        _handleActionSheet(buttonIndex);
      },
    );
  }, []);

  const _handleActionSheet = buttonIndex => {
    switch (buttonIndex) {
      case 1:
        takePhotoFromCamera();
        break;
      case 2:
        choosePhotosFromGallery();
        break;
      default:
        break;
    }
  };

  const choosePhotosFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      onProfileImageUpload(image);
    });
  };

  const takePhotoFromCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      });
      onProfileImageUpload(image);
    } catch (err) {
      console.log(err, '[useProfilePhotos] getPhotoLibrary Error');
    }
  };

  const onSaveEditName = async () => {
    if (name === '') {
      CustomeToast({type: 'error', message: 'Please enter name'});
    } else {
      setLoading(true);
      const data = {
        email: userDetails?.email,
        fullName: name,
      };
      try {
        const res = await editProfileName(data);
        if (res?.status === 200) {
          CustomeToast({
            type: 'success',
            message: res?.data.msg || 'Profile name updated!!',
          });
          getProfileDetail();
          setLoading(false);
          setEditNameModal(false);
        }
      } catch (error) {
        console.log('error', error);
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
          setLoading(false);
          setEditNameModal(false);
        }
        setLoading(false);
      }
    }
  };

  const onProfileImageUpload = async photo => {
    setImageLoading(true);
    let formData = new FormData();
    formData.append('image', {
      name: photo.path.split('/').pop(),
      type: photo.mime,
      uri: photo.path,
    });

    try {
      const res = await profileImageUpload(userDetails?.email, formData);
      if (res?.status === 200) {
        CustomeToast({
          type: 'success',
          message: res?.data.msg || 'Profile picture updated successfully!!',
        });
        getProfileDetail();
        setUserPicture(photo);
        setImageLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
        setImageLoading(false);
      }
    }
  };
  const onPressReset = async () => {
    const data = {
      email: userDetails?.email,
    };
    try {
      const res = await passwordChangeWithEmail(
        userDetails?.email.toLowerCase(),
      );
      if (res?.status === 200) {
        navigation.navigate('ResetPassword');
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  const onPressDelete = async () => {
    setLoading(true);
    const data = {
      email: userDetails?.email,
    };
    try {
      const res = await deleteAccount(data);
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data.msg});
        setDeleteModalVisible(false);
        setLoading(false);
        clearAsyncStorage().then(async () => {
          dispatch(setUserDetailsAction({}));
          dispatch(removeAuthTokenAction());
          dispatch(removeDevicesAction());
          dispatch(setFirstLaunchAction(true));
          await setFirstLaunch('true');
        });
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
        setDeleteModalVisible(false);
        setLoading(false);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topcontainer}>
        <View style={CommonStyle.Rectangle1}>
          <Rectangle1 height={'100%'} width={'100%'} />
        </View>
        <View style={CommonStyle.Rectangle2}>
          <Rectangle2 height={'100%'} width={'100%'} />
        </View>
        <CustomHeader
          title={'Account'}
          titleColor={color.WHITE}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.imagecontainer}>
          {imageUri !== '' ? (
            <Image source={{uri: imageUri}} style={styles.prifileImage} />
          ) : (
            <View style={styles.image}>
              {imageLoading ? (
                <ActivityIndicator size={'large'} color={color.GREEN} />
              ) : (
                <ProfileCircle height={'100%'} width={'100%'} />
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.cameracontainer}
            onPress={() => _handleItemPress()}>
            <Camera4 height={'70%'} width={'710%'} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.devicePadding}>
        <CategoryItem
          DeviceName={
            name ||
            userDetails?.profileName ||
            userDetails?.firstName + ' ' + userDetails?.lastName
          }
          extraItemViewStyle={styles.itemMargin}
          onPress={() => {
            setEditNameModal(true);
          }}
          isRightIcon={true}
          isIcon={true}
          icon={<UserIcon height={'150%'} width={'150%'} />}
        />
        <CategoryItem
          DeviceName={userDetails?.email}
          extraItemViewStyle={styles.itemMargin}
          isExtraRightIcon={userDetails?.googleAuth && true}
          isIcon={!userDetails?.googleAuth && true}
          icon={<EmailIcon height={'150%'} width={'150%'} />}
          rightIcon={<Google height={'150%'} width={'150%'} />}
        />
        {!userDetails?.viewOnly && (
          <CategoryItem
            DeviceName={'Notification'}
            extraItemViewStyle={[styles.itemMargin, {opacity: 0.5}]}
            isRightIcon={true}
            isIcon={true}
            isDisabled
            onPress={() => {}}
            icon={<NotificationGrey height={'150%'} width={'150%'} />}
          />
        )}
        {!userDetails?.viewOnly && (
          <CategoryItem
            DeviceName={'Familiar Faces'}
            extraItemViewStyle={styles.itemMargin}
            isRightIcon={true}
            isIcon={true}
            onPress={() => {
              navigation.navigate('FamilyFacesScreen');
            }}
            icon={<FaceScanner height={'150%'} width={'150%'} />}
          />
        )}
        {!userDetails?.viewOnly && (
          <CategoryItem
            DeviceName={'Sharing camera'}
            extraItemViewStyle={styles.itemMargin}
            isRightIcon={true}
            isIcon={true}
            onPress={() => {
              navigation.navigate('ShareDeviceScreen');
            }}
            icon={<CameraShare height={'150%'} width={'150%'} />}
          />
        )}
        <CategoryItem
          DeviceName={'Reset password'}
          extraItemViewStyle={styles.itemMargin}
          isRightIcon={true}
          isIcon={true}
          onPress={() => {
            onPressReset();
          }}
          icon={<LockIcon height={'150%'} width={'150%'} />}
        />
        <CategoryItem
          DeviceName={'Support'}
          extraItemViewStyle={[styles.itemMargin, {opacity: 0.5}]}
          isRightIcon={true}
          isDisabled
          isIcon={true}
          onPress={() => {
            navigation.navigate('AdapptSupport');
          }}
          icon={<MessageQuestion height={'150%'} width={'150%'} />}
        />
        <CategoryItem
          DeviceName={'About'}
          extraItemViewStyle={[styles.itemMargin, {opacity: 0.5}]}
          isRightIcon={true}
          isDisabled
          isIcon={true}
          icon={<InfoCircle height={'150%'} width={'150%'} />}
        />
        <TouchableOpacity
          style={styles.deletecontainer}
          onPress={() => setDeleteModalVisible(true)}>
          <RedDelete />
          <Text style={styles.redtext}>Delete account</Text>
        </TouchableOpacity>
        <DeleteModal
          visible={isDeleteModalVisible}
          setVisible={setDeleteModalVisible}
          title={'Delete account'}
          subTitle={'Are you sure you want to delete account?'}
          onPressDelete={onPressDelete}
          loading={loading}
        />
        <View style={{height: perfectSize(38)}} />
        <ActionSheet
          ref={actionSheetRef}
          options={['Done', 'Take Photo', 'Choose From Library']}
          cancelButtonIndex={0}
          onPress={buttonIndex => {
            _handleActionSheet(buttonIndex);
          }}
        />
      </ScrollView>
      <Modal
        animationType="fade"
        style={CommonStyle.modelContainerStyle}
        visible={editNameModal}
        avoidKeyboard={true}
        onBackdropPress={() => setEditNameModal(false)}>
        <View style={CommonStyle.modalContentStyle}>
          <TouchableOpacity
            onPress={() => setEditNameModal(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Text style={[CommonStyle.greyText20]}>Change Name</Text>
          <Text style={[CommonStyle.inputTitle, {alignSelf: 'flex-start'}]}>
            Name
          </Text>
          <TextInputField
            value={name}
            onchangeText={value => {
              setName(value);
            }}
            placeholder={'Eg. Rahul Sharma'}
            placeholderTextColor={color.DARK_GRAY}
            extraInputViewStyle={styles.locationTextInputWidth}
          />
          <Button
            name={'Save'}
            extraBtnViewStyle={styles.extraBtnViewStyle}
            extraBtnNameStyle={{fontSize: responsiveScale(16)}}
            isLoading={loading}
            disabled={loading}
            onPress={() => {
              onSaveEditName();
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  topcontainer: {
    backgroundColor: color.GREEN,
    height: perfectSize(180),
    padding: 20,
    borderBottomLeftRadius: 50,
  },
  imagecontainer: {
    backgroundColor: color.LIGHT_GREEN_7,
    height: perfectSize(120),
    width: perfectSize(120),
    borderRadius: 100,
    top: perfectSize(120),
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: perfectSize(68),
    width: perfectSize(68),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameracontainer: {
    backgroundColor: color.GREEN,
    height: perfectSize(26),
    width: perfectSize(26),
    borderRadius: 26,
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: perfectSize(5),
    right: perfectSize(5),
  },
  itemMargin: {marginBottom: 15},
  devicePadding: {
    padding: 20,
    marginTop: perfectSize(68),
  },
  deletecontainer: {
    height: perfectSize(50),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.LIGHT_RED,
    borderRadius: 8,
    marginTop: 40,
  },
  redtext: {
    color: color.RED,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    marginLeft: 10,
  },
  itemText: {
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
  },
  prifileImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: perfectSize(150),
  },
  locationTextInputWidth: {
    width: '100%',
  },
  extraBtnViewStyle: {width: '40%', marginTop: 30},
});
