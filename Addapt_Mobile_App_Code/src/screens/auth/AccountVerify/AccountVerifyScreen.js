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
import UserIcon from '../../../assets/appImages/UserIcon.svg';
import CallBlack from '../../../assets/appImages/CallBlack.svg';
import EmailIcon from '../../../assets/appImages/EmailIcon.svg';
import {
  registerUser,
  registerUserNew,
} from '../../../resources/baseServices/auth';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {CustomeToast} from '../../../components/CustomeToast';

const AccountVerifyScreen = ({navigation, route}) => {
  const {top} = useSafeAreaInsets();
  const email = route?.params?.userEmail || '';
  const phoneNumber = route?.params?.userPhoneNumber || '';
  const [f_name, setF_name] = useState('');
  // const [l_name, setL_name] = useState('');
  const [password, setPassword] = useState('');
  const [c_password, setC_password] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileNum, setMobileNum] = useState(phoneNumber);
  const [emailAdd, setEmailAdd] = useState(email);

  const handleDoneButton = async () => {
    if (f_name === '') {
      CustomeToast({type: 'error', message: 'Please enter your full name!'});
    } else if (mobileNum === '') {
      CustomeToast({type: 'error', message: 'Please enter mobile number'});
    } else if (!validateMobile(mobileNum)) {
      CustomeToast({type: 'error', message: 'Please enter valid phone no. !'});
    } else if (emailAdd === '') {
      CustomeToast({type: 'error', message: 'Please enter mobile number'});
    } else if (!validateEmail(emailAdd)) {
      CustomeToast({type: 'error', message: 'Please enter valid phone no. !'});
    } else if (password === '') {
      CustomeToast({type: 'error', message: 'Please enter your password!'});
    } else if (isDisabled) {
      CustomeToast({
        type: 'error',
        message: 'Password does not meet the criteria.',
      });
    } else if (c_password === '') {
      CustomeToast({
        type: 'error',
        message: 'Please enter your confirm password!',
      });
    } else if (password !== c_password) {
      CustomeToast({type: 'error', message: 'Passwords do not match!'});
    } else if (!isChecked) {
      CustomeToast({
        type: 'error',
        message: 'Please Select Terms of Services !',
      });
    } else {
      setLoading(true);
      const data = {
        email: emailAdd.toLowerCase(),
        fullName: f_name,
        password: password,
        confirmPassword: c_password,
        phoneNumber: parseInt(mobileNum),
      };
      try {
        const res = await registerUserNew(data);
        if (res?.status === 200) {
          navigation.navigate('Login');
          setLoading(false);
        }
      } catch (error) {
        console.log('error', error);
        handleDoneButton();
        if (error?.response?.status === 400) {
          // CustomeToast({type: 'error', message: error?.response?.data?.err});
        }
      } finally {
        // setLoading(false);
      }
    }
  };
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
          <Text style={CommonStyle.loginTitle}>Registration Details</Text>
          <Text style={CommonStyle.NavigateText}>
            Fill the details below to finish registering your account
          </Text>
          <TextInputField
            value={f_name}
            onchangeText={value => {
              setF_name(value);
            }}
            icon={<UserIcon />}
            placeholder={'Full name *'}
            placeholderTextColor={color.DARK_GRAY}
            extraTextInputStyle={CommonStyle.textInputWidth}
            extraInputViewStyle={styles.f_nameText}
          />

          {/* <TextInputField
            value={l_name}
            onchangeText={value => {
              setL_name(value);
            }}
            icon={<UserIcon />}
            placeholder={'Enter last name'}
            placeholderTextColor={color.DARK_GRAY}
            extraTextInputStyle={CommonStyle.textInputWidth}
            extraInputViewStyle={styles.l_nameText}
          /> */}
          {!phoneNumber && (
            <TextInputField
              value={mobileNum}
              onchangeText={value => {
                setMobileNum(value);
              }}
              icon={<CallBlack />}
              placeholder={'Mobile number'}
              placeholderTextColor={color.DARK_GRAY}
              extraTextInputStyle={CommonStyle.textInputWidth}
              extraInputViewStyle={styles.l_nameText}
              autoCapitalize={false}
              keyboardType={'numeric'}
              maxLength={10}
            />
          )}
          {!email && (
            <TextInputField
              value={emailAdd}
              onchangeText={value => {
                setEmailAdd(value);
              }}
              icon={<EmailIcon />}
              placeholder={'Email address '}
              placeholderTextColor={color.DARK_GRAY}
              extraTextInputStyle={CommonStyle.textInputWidth}
              extraInputViewStyle={styles.l_nameText}
              autoCapitalize={false}
              keyboardType={'email-address'}
            />
          )}

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
          <View style={styles.row}>
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
          </View>
          <Button
            name={'Done'}
            isLoading={loading}
            extraBtnViewStyle={CommonStyle.BtnView}
            onPress={() => {
              handleDoneButton();
            }}
            disabled={loading}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};
export default AccountVerifyScreen;
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
});
