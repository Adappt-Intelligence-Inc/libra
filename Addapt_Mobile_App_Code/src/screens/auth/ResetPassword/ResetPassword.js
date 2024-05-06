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
  passwordChange,
  passwordChangeWithEmail,
  register,
} from '../../../resources/baseServices/auth';
import {CustomeToast} from '../../../components/CustomeToast';
import Button from '../../../components/Button';

const ResetPassword = ({navigation}) => {
  const [otpCode, setOtpCode] = useState('');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [loading, setLoading] = useState(false);

  const verifyOtp = () => {
    if (otpCode === '' || otpCode?.length !== 5) {
      CustomeToast({type: 'error', message: 'Please enter OTP!'});
    } else {
      navigation.navigate('NewPassword', {otpCode: otpCode});
    }
  };

  const resendOtp = async () => {
    const data = {
      email: userDetails?.email?.toLowerCase(),
    };
    try {
      // const res = await passwordChange(data);
      const res = await passwordChangeWithEmail(
        userDetails?.email.toLowerCase(),
      );
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data.msg});
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        CustomeToast({type: 'error', message: error?.response?.data?.err});
      }
    } finally {
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Reset password'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <KeyboardAwareScrollView
        style={[{paddingHorizontal: 0, backgroundColor: color.WHITE}]}
        showsVerticalScrollIndicator={false}>
        <Text style={[CommonStyle.loginTitle, {paddingTop: 30}]}>
          Verification code
        </Text>
        <Text style={[CommonStyle.NavigateText, styles.inboxText]}>
          Please check your inbox, we have sent the verification code to
          <Text style={{color: color.GREEN}}> {userDetails?.email}</Text>
        </Text>

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
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  extraItemViewStyle: {
    marginBottom: 12,
    backgroundColor: color.GREEN,
    marginTop: 20,
  },
  extraItemStyle: {marginTop: 12},
  inboxText: {marginBottom: 10},
  row: {flexDirection: 'row', alignItems: 'center'},
});
