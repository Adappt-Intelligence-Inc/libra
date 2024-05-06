import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {MyCodeField} from '../../../components/MyCodeField';
import {useSelector} from 'react-redux';
import {
  Mobilelogin,
  newPasswordUpload,
  register,
} from '../../../resources/baseServices/auth';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import {CustomeToast} from '../../../components/CustomeToast';
import Button from '../../../components/Button';
import TextInputField from '../../../components/TextInputField';
import PasswordValidation from '../../../components/PasswordValidation';

const NewPassword = ({navigation, route}) => {
  const [password, setPassword] = useState('');
  const [c_password, setC_password] = useState('');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const otpCode = route?.params?.otpCode;

  const handleDoneButton = async () => {
    if (password === '') {
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
    } else {
      setLoading(true);
      const data = {
        email: userDetails?.email.toLowerCase(),
        passwordOtp: parseInt(otpCode),
        newPassword: password,
      };
      try {
        const res = await newPasswordUpload(data);
        if (res?.status === 200) {
          navigation.navigate('Account');
          CustomeToast({type: 'success', message: res?.data.msg});
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
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'New password'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <KeyboardAwareScrollView
        style={[
          {paddingHorizontal: 0, backgroundColor: color.WHITE, paddingTop: 30},
        ]}
        showsVerticalScrollIndicator={false}>
        <TextInputField
          value={password}
          onchangeText={value => {
            setPassword(value);
          }}
          icon={<LockIcon />}
          placeholder={'Enter new password'}
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
          name={'Done'}
          isLoading={loading}
          disabled={loading}
          extraBtnViewStyle={CommonStyle.BtnView}
          onPress={() => {
            handleDoneButton();
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  extraItemViewStyle: {
    marginBottom: 12,
    backgroundColor: color.GREEN,
    marginTop: 20,
  },
  extraItemStyle: {marginTop: 12},
  inboxText: {marginBottom: 10},
  row: {flexDirection: 'row', alignItems: 'center'},
  c_PasswordText: {
    marginVertical: 10,
  },
  passwordText: {
    marginBottom: 10,
  },
});
