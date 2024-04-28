import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Button from '../../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PasswordValidation from '../../../components/PasswordValidation';
import TextInputField from '../../../components/TextInputField';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import Modal from 'react-native-modal';
import {newPasswordUpload} from '../../../resources/baseServices/auth';

import RightCircle from '../../../assets/appImages/RightCircle.svg';

import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {CustomeToast} from '../../../components/CustomeToast';

const ResetYourPassword = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const email = route?.params?.userEmail || '';
  const phoneNumber = route?.params?.userPhoneNumber || '';
  const [password, setPassword] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [c_password, setC_password] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const otpCode = route?.params?.otpCode;

  const handleDoneButton = async () => {
    if (c_password === '') {
      CustomeToast({
        type: 'error',
        message: 'Please enter your confirm password!',
      });
    } else if (password !== c_password) {
      CustomeToast({type: 'error', message: 'Passwords do not match!'});
    } else {
      setLoading(true);
      const data = {
        email: email.toLowerCase(),
        passwordOtp: parseInt(otpCode),
        newPassword: c_password,
      };
      const dataphoneNumber = {
        phoneNumber: parseInt(phoneNumber),
        passwordOtp: parseInt(otpCode),
        newPassword: c_password,
      };
      try {
        const res = await newPasswordUpload(
          phoneNumber ? dataphoneNumber : data,
        );
        if (res?.status === 200) {
          setModalVisible(true);
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={CommonStyle.container}>
      <View style={CommonStyle.Rectangle1}>
        <Rectangle1 height={'100%'} width={'100%'} />
      </View>
      <View style={CommonStyle.Rectangle2}>
        <Rectangle2 height={'100%'} width={'100%'} />
      </View>
      <View
        style={[
          CommonStyle.adapptLogo,
          {
            paddingTop: top,
          },
        ]}>
        <View style={CommonStyle.imageView}>
          <AdapptLogo height={'100%'} width={'100%'} />
        </View>
      </View>
      <View style={CommonStyle.hideExtraContent}>
        <KeyboardAwareScrollView
          style={CommonStyle.loginContent}
          showsVerticalScrollIndicator={false}>
          <Text style={CommonStyle.loginTitle}>Reset Your Password</Text>
          <Text style={CommonStyle.NavigateText}>
            The password must be different than before
          </Text>
          <TextInputField
            value={password}
            onchangeText={value => {
              setPassword(value);
            }}
            icon={<LockIcon />}
            placeholder={'Password'}
            placeholderTextColor={color.DARK_GRAY}
            secureTextEntry={true}
            isVisiblePassword={true}
            extraInputViewStyle={styles.passwordText}
          />
          <TextInputField
            value={c_password}
            onchangeText={value => {
              setC_password(value);
            }}
            icon={<LockIcon />}
            placeholder={'Confirm password'}
            placeholderTextColor={color.DARK_GRAY}
            secureTextEntry={true}
            isVisiblePassword={true}
            extraInputViewStyle={styles.c_PasswordText}
          />
          <PasswordValidation
            copyText={password}
            setIsDisabled={setIsDisabled}
            isDisabled={isDisabled}
          />
          <Button
            name={'Continue'}
            isLoading={loading}
            disabled={loading}
            extraBtnViewStyle={CommonStyle.BtnView}
            onPress={() => {
              handleDoneButton();
            }}
          />
          <Modal
            style={CommonStyle.modelContainerStyle}
            animationType="fade"
            transparent={true}
            visible={isModalVisible}>
            {/* <View style={CommonStyle.modelContainerStyle}> */}
            <View style={CommonStyle.modalContentStyle}>
              <RightCircle />
              <Text
                style={[CommonStyle.sectionTitle, styles.congratulationsTitle]}>
                Successful !
              </Text>
              <Text style={CommonStyle.text}>
                Your password has been changed.
              </Text>
              <Button
                name={['Done']}
                extraBtnViewStyle={styles.continueText}
                onPress={() => {
                  navigation.navigate('Login');
                }}
              />
            </View>
            {/* </View> */}
          </Modal>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};
export default ResetYourPassword;
const styles = StyleSheet.create({
  l_nameText: {
    marginBottom: 20,
  },
  f_nameText: {
    marginTop: 15,
    marginBottom: 20,
  },
  c_PasswordText: {
    marginVertical: 10,
  },
  passwordText: {
    marginTop: 20,
    marginBottom: 10,
  },
  checkBoxView: {marginTop: 3},
  row: {flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10},
  navigateRow: {flexDirection: 'row', alignItems: 'center'},
  terms: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_LIGHT,
    color: color.DARK_GRAY,
    fontFamily: TTNORMSPRO_REGULAR,
    paddingLeft: 10,
    flex: 1,
    lineHeight: 24,
  },
  underlineText: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.GREEN,
    fontFamily: TTNORMSPRO_REGULAR,
    textDecorationLine: 'underline',
  },
  emailText: {
    marginTop: 30,
    marginBottom: 15,
  },
  continueText: {width: '40%', marginTop: 20},
  congratulationsTitle: {
    marginVertical: 10,
  },
});
