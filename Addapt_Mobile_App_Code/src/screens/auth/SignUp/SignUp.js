import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Button from '../../../components/Button';
import TextInputField from '../../../components/TextInputField';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Google from '../../../assets/appImages/Google.svg';
import Apple from '../../../assets/appImages/Apple.svg';
import Call from '../../../assets/appImages/Call.svg';
import Microsoft from '../../../assets/appImages/Microsoft.svg';
import Rectangle1 from '../../../assets/appImages/Rectangle1.svg';
import Rectangle2 from '../../../assets/appImages/Rectangle2.svg';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import User from '../../../assets/appImages/User.svg';
import {CommonStyle} from '../../../config/styles';
import {color} from '../../../config/color';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {register} from '../../../resources/baseServices/auth';
import {CustomeToast} from '../../../components/CustomeToast';
import {signInWithApple, signInWithGoogle} from '../../../helpers/global';
import {useDispatch} from 'react-redux';

const SignUp = ({navigation}) => {
  const {top} = useSafeAreaInsets();
  const [isChecked, setIsChecked] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSSOLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUpBtn = async () => {
    if (value === '') {
      CustomeToast({type: 'error', message: 'Please enter email / phone no.'});
    } else if (value.includes('@')) {
      if (!validateEmail(value)) {
        CustomeToast({type: 'error', message: 'Please enter valid email !'});
      } else {
        setLoading(true);
        const data = {
          email: value.toLowerCase(),
        };

        try {
          const res = await register(data);
          if (res?.status === 200) {
            navigation.navigate('OTPScreen', {userEmail: value});
            setLoading(false);
          }
        } catch (error) {
          if (error?.response?.status === 400) {
            CustomeToast({type: 'error', message: error?.response?.data?.err});
          }
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (!validateMobile(value)) {
        CustomeToast({
          type: 'error',
          message: 'Please enter valid phone no. !',
        });
      } else {
        setLoading(true);
        const data = {
          phoneNumber: parseInt(value),
        };

        try {
          const res = await register(data);
          if (res?.status === 200) {
            navigation.navigate('OTPScreen', {
              userPhoneNumber: parseInt(value),
            });
            setLoading(false);
          }
        } catch (error) {
          if (error?.response?.status === 400) {
            CustomeToast({type: 'error', message: error?.response?.data?.err});
          }
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Email validation
  const validateEmail = Email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(Email);
  };
  const validateMobile = Email => {
    var re = /^(\+\d{1,3}[- ]?)?\d{10}$/;

    return re.test(Email);
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
          <Text style={CommonStyle.loginTitle}>Create an account</Text>

          <View style={styles.navigateRow}>
            <Text style={CommonStyle.NavigateText}>Existing user?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}>
              <Text style={CommonStyle.linkText}> Login</Text>
            </TouchableOpacity>
          </View>

          <TextInputField
            value={value}
            onchangeText={value => {
              setValue(value);
            }}
            icon={<User />}
            placeholder={'Email / phone no.'}
            placeholderTextColor={color.DARK_GRAY}
            extraTextInputStyle={CommonStyle.textInputWidth}
            extraInputViewStyle={styles.emailText}
            autoCapitalize={false}
            // keyboardType={'email-address'}
          />
          {/* <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkBoxView}
              onPress={() => {
                setIsChecked(!isChecked);
              }}>
              {isChecked ? <CheckBox /> : <CheckBoxBlank />}
            </TouchableOpacity>
            <Text style={styles.terms}>
              I agree to the{' '}
              <Text style={styles.underlineText}>Terms of Services</Text> &{' '}
              <Text style={styles.underlineText}>Privacy Statements.</Text>
            </Text>
          </View> */}
          <Button
            name={'Proceed'}
            isLoading={loading}
            disabled={loading}
            extraBtnViewStyle={[CommonStyle.BtnView, {marginTop: 20}]}
            onPress={() => {
              handleSignUpBtn();
            }}
          />
          <View style={[CommonStyle.row, {justifyContent: 'center'}]}>
            <View style={CommonStyle.divider} />
            <Text style={[CommonStyle.text, {marginHorizontal: 20}]}>Or</Text>
            <View style={CommonStyle.divider} />
          </View>
          {/* <TouchableOpacity
            style={CommonStyle.callBtn}
            onPress={() => {
              navigation.navigate('MobileLogin');
            }}>
            <Call />
            <Text style={CommonStyle.callBtnText}>Login Via Mobile No.</Text>
          </TouchableOpacity> */}
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
                  onPress={() => signInWithGoogle(dispatch, setSSOLoading)}
                  style={CommonStyle.socialBtn}>
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
            {/* <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={CommonStyle.linearGradient}>
              <View style={CommonStyle.innerContainer}>
                <TouchableOpacity style={CommonStyle.socialBtn}>
                  <Microsoft />
                </TouchableOpacity>
              </View>
            </LinearGradient> */}
          </View>
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

export default SignUp;

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'flex-start'},
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
  checkBoxView: {marginTop: 3},
});
