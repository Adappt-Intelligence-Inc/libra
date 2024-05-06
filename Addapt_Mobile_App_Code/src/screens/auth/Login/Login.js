import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Google from '../../../assets/appImages/Google.svg';
import Apple from '../../../assets/appImages/Apple.svg';
import Microsoft from '../../../assets/appImages/Microsoft.svg';
import Call from '../../../assets/appImages/Call.svg';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import CallBlack from '../../../assets/appImages/CallBlack.svg';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  Mobilelogin,
  getDevicesList,
  login,
} from '../../../resources/baseServices/auth';
import {
  setAuthTokenAction,
  setUserDetailsAction,
} from '../../../store/authReducer';
import {
  getAddedDevices,
  setAddedDevices,
  setAuthToken,
  setUserDetails,
} from '../../../helpers/auth';
import {
  setDevicesAction,
  setDevicesListAction,
} from '../../../store/devicesReducer';
import AzureAuth from 'react-native-azure-auth';
import {CustomeToast} from '../../../components/CustomeToast';
import {signInWithApple, signInWithGoogle} from '../../../helpers/global';
import {OneSignal} from 'react-native-onesignal';

const Login = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSSOLoading] = useState(false);
  const [loginType, setLoginType] = useState('email');

  const azureAuth = new AzureAuth({
    clientId: '13b30d09-60cb-44a0-bc18-a93f63653133',
  });

  //  =======> Sign In with Microsoft
  const signInWithMicrosoft = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize();

      console.log('tokens test ==> ', tokens);
      let azureRefreshToken = await azureAuth.auth.cache.getRefreshToken(
        tokens?.userId,
      );
      console.log('signInWithMicrosoft tokens ==> tttt ', azureRefreshToken);
      let info = await azureAuth.auth.msGraphRequest({
        token: tokens.accessToken,
        path: '/me',
      });

      let tokenData = {
        access_token: tokens?.accessToken,
        refresh_token: azureRefreshToken?.refreshToken || '',
      };

      // const parmamObj = {
      //   type: 'microsoft',
      //   email: info?.mail,
      //   token: tokenData,
      //   firstName: info?.surname,
      //   lastName: info?.givenName,
      // };
      // if (info) {
      // }
    } catch (error) {
      console.log('signInWithMicrosoft error ==> ', error);
    }
  };

  const handleMobileLoginBtn = async () => {
    if (mobileNum === '') {
      CustomeToast({type: 'error', message: 'Please enter mobile number'});
    } else if (mobileNum.length !== 10) {
      CustomeToast({
        type: 'error',
        message: 'Please enter valid mobile number !',
      });
    } else {
      const data = {
        phoneNumber: parseInt(mobileNum),
      };
      try {
        setLoading(true);
        const res = await Mobilelogin(data);
        if (res?.status === 200) {
          setLoading(false);
          navigation.navigate('OTPScreen', {phoneNumber: parseInt(mobileNum)});
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

  const handleLoginBtn = async () => {
    if (email === '') {
      CustomeToast({type: 'error', message: 'Please enter email'});
    } else if (!validateEmail(email)) {
      CustomeToast({type: 'error', message: 'Please enter valid email !'});
    } else if (password === '') {
      CustomeToast({type: 'error', message: 'Please enter password'});
    } else {
      const data = {
        email: email.toLowerCase(),
        password: password,
      };
      try {
        setLoading(true);
        const res = await login(data);
        if (res?.status === 200) {
          OneSignal.login(res?.data?.data.userId);
          try {
            console.log('123');
            const getList = await getDevicesList(res?.data?.data?.email, {
              Authorization: res?.data?.data?.auth_token,
            });
            console.log('456', getList);
            const AddedDevice = getList?.data?.data;
            if (AddedDevice && AddedDevice.length > 0) {
              await setAddedDevices('true');
              dispatch(setDevicesAction(true));
              dispatch(setDevicesListAction(AddedDevice));
            } else {
              dispatch(setDevicesListAction([]));
              // navigation.navigate('AddDevice');
            }
          } catch (error) {
            console.log('error123', error);
            // navigation.navigate('AddDevice');
          }
          await setAuthToken(res?.data?.data?.auth_token);
          await setUserDetails(JSON.stringify(res?.data?.data));
          dispatch(setUserDetailsAction(res?.data?.data));
          dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          setLoading(false);

          // dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          // await setAuthToken(res?.data?.data?.auth_token);
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

  // Email validation
  const validateEmail = Email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(Email);
  };
  const loginTypes = ['phone', 'email'];
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
          style={[CommonStyle.loginContent]}
          showsVerticalScrollIndicator={false}>
          <Text style={CommonStyle.loginTitle}>Welcome back, Sign in</Text>
          <View style={styles.row}>
            <Text style={CommonStyle.NavigateText}>New user?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text style={CommonStyle.linkText}> Create an account</Text>
            </TouchableOpacity>
          </View>
          <View style={CommonStyle.row}>
            {loginTypes.map(item => {
              return (
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    onPress={() => setLoginType(item)}
                    // disabled={item === 'phone'}
                    style={[
                      styles.radioBorder,
                      item === loginType && {borderColor: color.GREEN},
                      // item === 'phone' && {opacity: 0.5},
                    ]}>
                    {item === loginType && <View style={styles.radio} />}
                  </TouchableOpacity>
                  <Text
                    style={[
                      CommonStyle.blackText14,
                      // item === 'phone' && {opacity: 0.5},
                    ]}>
                    {item === 'phone' ? 'Mobile Number' : 'Email Id'}
                  </Text>
                </View>
              );
            })}
          </View>
          {loginType === 'phone' && (
            <TextInputField
              value={mobileNum}
              onchangeText={value => {
                setMobileNum(value);
              }}
              icon={<CallBlack />}
              placeholder={'Mobile number'}
              placeholderTextColor={color.DARK_GRAY}
              extraTextInputStyle={CommonStyle.textInputWidth}
              extraInputViewStyle={styles.phoneText}
              autoCapitalize={false}
              keyboardType={'numeric'}
              maxLength={10}
            />
          )}
          {loginType === 'email' && (
            <View>
              <TextInputField
                value={email}
                onchangeText={value => {
                  setEmail(value);
                }}
                icon={<EmailIcon />}
                placeholder={'Email address'}
                placeholderTextColor={color.DARK_GRAY}
                extraTextInputStyle={CommonStyle.textInputWidth}
                extraInputViewStyle={styles.emailText}
                autoCapitalize={false}
                keyboardType={'email-address'}
              />
              <TextInputField
                value={password}
                onchangeText={value => {
                  setPassword(value);
                }}
                icon={<LockIcon />}
                placeholder={'Enter password'}
                placeholderTextColor={color.DARK_GRAY}
                secureTextEntry={true}
                isVisiblePassword={true}
                autoCapitalize={false}
              />
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}>
                <Text style={styles.forgetPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          )}
          {loginType === 'phone' ? (
            <Button
              name={'Verify'}
              isLoading={loading}
              disabled={loading}
              extraBtnViewStyle={CommonStyle.BtnView}
              onPress={() => {
                handleMobileLoginBtn();
              }}
            />
          ) : (
            <Button
              name={'Sign in'}
              disabled={loading}
              isLoading={loading}
              extraBtnViewStyle={CommonStyle.BtnView}
              onPress={() => {
                handleLoginBtn();
              }}
            />
          )}
          <View style={[CommonStyle.row, {justifyContent: 'center'}]}>
            <View style={CommonStyle.divider} />
            <Text style={[CommonStyle.text, {marginHorizontal: 20}]}>Or</Text>
            <View style={CommonStyle.divider} />
          </View>

          <View style={[CommonStyle.socialLoginBtn]}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[
                CommonStyle.linearGradient,
                Platform.OS === 'ios' && {width: '48%'},
              ]}>
              <View style={[CommonStyle.innerContainer]}>
                <TouchableOpacity
                  style={CommonStyle.socialBtn}
                  // disabled
                  onPress={() => signInWithGoogle(dispatch, setSSOLoading)}>
                  <Google />
                  <Text style={CommonStyle.socialBtnText}>Google</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            {Platform.OS === 'ios' && (
              <LinearGradient
                start={{x: 0.9, y: 0}}
                end={{x: 1, y: 1}}
                colors={['#00937D80', '#00937D20']}
                style={[
                  CommonStyle.linearGradient,
                  Platform.OS === 'ios' && {width: '48%'},
                ]}>
                <View style={CommonStyle.innerContainer}>
                  <TouchableOpacity
                    style={CommonStyle.socialBtn}
                    onPress={() => signInWithApple(dispatch, setSSOLoading)}>
                    <Apple />
                    <Text style={CommonStyle.socialBtnText}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          </View>
          {/* <TouchableOpacity
            style={CommonStyle.callBtn}
            onPress={() => {
              navigation.navigate('MobileLogin');
            }}>
            <Text style={CommonStyle.callBtnText}>
              Sign in via mobile number
            </Text>
          </TouchableOpacity> */}
        </KeyboardAwareScrollView>
      </View>
      {ssoLoading && (
        <View style={CommonStyle.fullLoader}>
          <ActivityIndicator size={30} color={color.GREEN} />
        </View>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  forgetPassword: {
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.GREEN,
    textAlign: 'right',
    paddingTop: 10,
  },
  emailText: {
    marginTop: 30,
    marginBottom: 20,
  },
  phoneText: {
    marginTop: 30,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    marginTop: 20,
  },
  radioBorder: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.DARK_GRAY,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: color.GREEN,
  },
});
