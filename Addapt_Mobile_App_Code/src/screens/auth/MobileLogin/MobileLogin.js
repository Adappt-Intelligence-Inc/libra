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
import React, {useState} from 'react';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CallBlack from '../../../assets/appImages/CallBlack.svg';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import Google from '../../../assets/appImages/Google.svg';
import Apple from '../../../assets/appImages/Apple.svg';
import Microsoft from '../../../assets/appImages/Microsoft.svg';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
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
import LinearGradient from 'react-native-linear-gradient';
import {CustomeToast} from '../../../components/CustomeToast';
import {signInWithApple, signInWithGoogle} from '../../../helpers/global';

const MobileLogin = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginBtn = async () => {
    if (mobileNum === '') {
      CustomeToast({type: 'error', message: 'Please enter mobile number'});
    } else if (mobileNum.length !== 10) {
      CustomeToast({
        type: 'error',
        message: 'Please enter valid mobile number !',
      });
    } else {
      const data = {
        phoneNumber: mobileNum,
      };
      try {
        setLoading(true);
        const res = await Mobilelogin(data);
        if (res?.status === 200) {
          // await setAuthToken(res?.data?.data?.auth_token);
          // await setUserDetails(JSON.stringify(res?.data?.data));
          // dispatch(setUserDetailsAction(res?.data?.data));
          // dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          setLoading(false);
          navigation.navigate('OTPScreen', {phoneNumber: mobileNum});
          // try {
          //   const getList = await getDevicesList(res?.data?.data?.email);
          //   const AddedDevice = getList.data.data;
          //   if (AddedDevice.length > 0) {
          //     await setAddedDevices('true');
          //     dispatch(setDevicesAction(true));
          //     dispatch(setDevicesListAction(AddedDevice));
          //   } else {
          //     navigation.navigate('AddDevice');
          //   }
          // } catch (error) {
          //   console.log('error', error);
          //   navigation.navigate('AddDevice');
          // }

          // dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
          // await setAuthToken(res?.data?.data?.auth_token);
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
          <Text style={CommonStyle.loginTitle}>Sign in via mobile number</Text>

          <View style={styles.row}>
            <Text style={CommonStyle.NavigateText}>
              Enter details to login your account
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text style={CommonStyle.linkText}> Create an account</Text>
            </TouchableOpacity> */}
          </View>

          <TextInputField
            value={mobileNum}
            onchangeText={value => {
              setMobileNum(value);
            }}
            icon={<CallBlack />}
            placeholder={'Mobile number *'}
            placeholderTextColor={color.DARK_GRAY}
            extraTextInputStyle={CommonStyle.textInputWidth}
            extraInputViewStyle={styles.emailText}
            autoCapitalize={false}
            keyboardType={'numeric'}
            maxLength={10}
          />

          <Button
            name={'Verify'}
            isLoading={loading}
            disabled={loading}
            extraBtnViewStyle={CommonStyle.BtnView}
            onPress={() => {
              handleLoginBtn();
            }}
          />
          <View style={[CommonStyle.row, {justifyContent: 'center'}]}>
            <View style={CommonStyle.divider} />
            <Text style={[CommonStyle.text, {marginHorizontal: 20}]}>Or</Text>
            <View style={CommonStyle.divider} />
          </View>
          <View style={CommonStyle.socialLoginBtn}>
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
                  disabled
                  style={CommonStyle.socialBtn}
                  onPress={() => signInWithGoogle(dispatch, setLoading)}>
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
                    onPress={() => signInWithApple(dispatch, setLoading)}>
                    <Apple />
                    <Text style={CommonStyle.socialBtnText}>Apple</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
            {/* <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={CommonStyle.linearGradient}>
              <View style={CommonStyle.innerContainer}>
                <TouchableOpacity
                  style={CommonStyle.socialBtn}
                  onPress={signInWithMicrosoft}>
                  <Microsoft />
                </TouchableOpacity>
              </View>
            </LinearGradient> */}
          </View>
          <TouchableOpacity
            style={CommonStyle.callBtn}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            {/* <Call /> */}
            <Text style={CommonStyle.callBtnText}>
              Sign in via email address
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default MobileLogin;

const styles = StyleSheet.create({
  forgetPassword: {
    fontSize: responsiveScale(12),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.GREEN,
    textAlign: 'right',
    paddingTop: 10,
  },
  emailText: {
    marginTop: 30,
    marginBottom: 20,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
});
