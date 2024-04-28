import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Button from '../../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MyCodeField} from '../../../components/MyCodeField';
import {
  Mobilelogin,
  getDevicesList,
  login,
  otpVerification,
  passwordChange,
  passwordChangeWithEmail,
  passwordChangeWithPhone,
  register,
} from '../../../resources/baseServices/auth';
import {
  setAddedDevices,
  setAuthToken,
  setUserDetails,
} from '../../../helpers/auth';
import {
  setAuthTokenAction,
  setUserDetailsAction,
} from '../../../store/authReducer';
import {useDispatch} from 'react-redux';
import {
  setDevicesAction,
  setDevicesListAction,
} from '../../../store/devicesReducer';
import {CustomeToast} from '../../../components/CustomeToast';

const OTPScreen = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const [otpCode, setOtpCode] = useState('');
  const email = route?.params?.userEmail;
  const userPhoneNumber = route?.params?.userPhoneNumber;
  const phoneNumber = route?.params?.phoneNumber;
  const screen = route?.params?.screen;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerifyOtpButton = async () => {
    if (otpCode === '' || otpCode?.length > 3 === false) {
      CustomeToast({type: 'error', message: 'Please enter OTP!'});
    } else {
      setLoading(true);
      const data = {
        email: email.toLowerCase(),
        otp: otpCode,
      };
      try {
        const res = await otpVerification(data);
        if (res?.status === 200) {
          setLoading(false);
          navigation.navigate('AccountVerifyScreen', {userEmail: email});
        }
      } catch (error) {
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleVerifyPhoneOtpButton = async () => {
    if (otpCode === '' || otpCode?.length > 3 === false) {
      CustomeToast({type: 'error', message: 'Please enter OTP!'});
    } else {
      setLoading(true);
      const data = {
        phoneNumber: parseInt(userPhoneNumber),
        otp: otpCode,
      };
      try {
        const res = await otpVerification(data);
        if (res?.status === 200) {
          setLoading(false);
          navigation.navigate('AccountVerifyScreen', {
            userPhoneNumber: parseInt(userPhoneNumber),
          });
        }
      } catch (error) {
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const resendForgotOtp = async () => {
    const data = {
      email: email.toLowerCase(),
    };
    const dataphoneNumber = {
      phoneNumber: userPhoneNumber,
    };
    try {
      // const res = await passwordChange(
      //   userPhoneNumber ? dataphoneNumber : data,
      // );
      const emailRes = await passwordChangeWithEmail(email.toLowerCase());
      const phoneRes = await passwordChangeWithPhone(parseInt(userPhoneNumber));
      const res = userPhoneNumber ? phoneRes : emailRes;
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      console.log('error', error);
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = () => {
    if (screen === 'forgot') {
      if (otpCode === '' || otpCode?.length !== 5) {
        CustomeToast({type: 'error', message: 'Please enter OTP!'});
      } else {
        navigation.navigate('ResetYourPassword', {
          otpCode: otpCode,
          userEmail: email,
          userPhoneNumber: parseInt(userPhoneNumber),
        });
      }
    } else {
      if (email) {
        handleVerifyOtpButton();
      }
      if (userPhoneNumber) {
        handleVerifyPhoneOtpButton();
      }
      if (phoneNumber) {
        handleVerifyMobileOtp();
      }
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (otpCode === '' || otpCode?.length > 3 === false) {
      CustomeToast({type: 'error', message: 'Please enter OTP!'});
    } else {
      const data = {
        phoneNumber: parseInt(phoneNumber),
        mobileOtp: otpCode,
      };
      try {
        setLoading(true);
        const res = await login(data);
        if (res?.status === 200) {
          console.log('res', res);
          await setAuthToken(res?.data?.data?.auth_token);
          await setUserDetails(JSON.stringify(res?.data?.data));
          dispatch(setUserDetailsAction(res?.data?.data));
          dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          setLoading(false);
          try {
            const getList = await getDevicesList(res?.data?.data?.email);
            const AddedDevice = getList.data.data;
            if (AddedDevice.length > 0) {
              await setAddedDevices('true');
              dispatch(setDevicesAction(true));
              dispatch(setDevicesListAction(AddedDevice));
            } else {
              dispatch(setDevicesListAction([]));
              // navigation.navigate('AddDevice');
            }
          } catch (error) {
            console.log('error', error);
            // navigation.navigate('AddDevice');
          }

          dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          await setAuthToken(res?.data?.data?.auth_token);
        }
      } catch (error) {
        if (error?.response?.status === 400) {
          CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const resendOtp = () => {
    if (screen === 'forgot') {
      resendForgotOtp();
    } else {
      if (email) {
        resendOtpToMail();
      }
      if (phoneNumber) {
        resendOtpToMobile();
      }
    }
  };

  const resendOtpToMail = async () => {
    const data = {
      email: email.toLowerCase(),
    };
    try {
      const res = await register(data);
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    }
  };

  const resendOtpToMobile = async () => {
    const data = {
      phoneNumber: parseInt(phoneNumber),
    };
    try {
      const res = await Mobilelogin(data);
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
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
          <Text style={CommonStyle.loginTitle}>
            {screen === 'forgot' ? 'Forgot Password' : 'Verification code'}
          </Text>
          {!email && (
            <Text style={[CommonStyle.NavigateText, styles.inboxText]}>
              You’re almost there! Check the verification code sent to
              <Text style={{color: color.GREEN}}>
                {' '}
                {`+91 ${userPhoneNumber || phoneNumber}`}
              </Text>
            </Text>
          )}
          {email && (
            <Text style={[CommonStyle.NavigateText, styles.inboxText]}>
              You’re almost there! Check the inbox to
              <Text style={{color: color.GREEN}}> {email} </Text>
              to verify your code.
            </Text>
          )}

          <MyCodeField
            cellCount={5}
            value={otpCode}
            onChangeText={text => setOtpCode(text)}
          />
          <View style={styles.row}>
            <Text style={CommonStyle.NavigateText}>Don’t receive a code? </Text>
            <TouchableOpacity
              onPress={() => {
                resendOtp();
              }}>
              <Text style={CommonStyle.linkText}> Resend OTP</Text>
            </TouchableOpacity>
          </View>
          <Button
            name={'Verify OTP'}
            isLoading={loading}
            disabled={loading}
            extraBtnViewStyle={CommonStyle.BtnView}
            onPress={() => verifyOtp()}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};
export default OTPScreen;
const styles = StyleSheet.create({
  inboxText: {marginBottom: 10},
  row: {flexDirection: 'row', alignItems: 'center'},
});
