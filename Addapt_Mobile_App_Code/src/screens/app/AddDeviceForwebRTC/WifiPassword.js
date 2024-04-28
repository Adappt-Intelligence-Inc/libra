import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WifiManager from 'react-native-wifi-reborn';
import Button from '../../../components/Button';
import {CommonStyle} from '../../../config/styles';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import TextInputField from '../../../components/TextInputField';
import Modal from 'react-native-modal';
import {color} from '../../../config/color';
import CustomHeader from '../../../components/CustomHeader';
import WifiDeviceGreen from '../../../assets/appImages/WifiDeviceGreen.svg';
import LockIcon from '../../../assets/appImages/LockIcon.svg';
import CarotRightBlack from '../../../assets/appImages/CarotRightBlack.svg';
import EnterPassword from '../../../assets/appImages/EnterPassword.svg';
import {responsiveScale} from '../../../styles/mixins';
import {useDispatch, useSelector} from 'react-redux';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';

const WifiPassword = ({route, navigation}) => {
  const [password, setPassword] = useState('');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? '');
  const authToken = useSelector(state => state.auth?.authToken ?? '');
  const {location, deviceId, name, selectedWifi} = route?.params;

  const onPressNext = async () => {
    let token = authToken;
    try {
      token = JSON.parse(authToken);
    } catch (error) {
      token = token;
    }
    const data = {
      additionalDetails: {
        deviceType: '3rd Party Sensor',
        deviceCategory: 'Input Device',
        deviceId: deviceId,
        communicationProtocol: 'Direct Communication',
        vpnIP: '0',
      },
      deviceDetails: {
        name: name,
        location: location?.location,
        class: 'IP_Camera-placed',
        streamName: deviceId,
        posx: 0,
        posy: 0,
        height: 50,
        width: 50,
        zindex: 1,
        cielingHeight: 10,
      },
      bleAddr: 0,
      cameraEventTypeId: [],
      deviceLocation: location?._id,
      deviceTypeId: 'IP_Camera',
      email: userDetails.email,
      ssid: selectedWifi.SSID,
      pwd: password,
      authToken: token,
    };
    console.log('onPressNext', data);
    navigation.navigate('GeneratedQRCode', {QRcodeData: data});
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Wi-Fi Password'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{marginTop: 20, flex: 1}}>
        <View style={styles.banner}>
          <EnterPassword height={'100%'} width={'100%'} />
        </View>
        <Text style={[styles.title]}>Enter Password for</Text>
        <Text style={[styles.title, {color: color.GREEN}]}>
          {selectedWifi.SSID}
        </Text>
        <TextInputField
          value={password}
          onchangeText={value => {
            setPassword(value);
          }}
          icon={<LockIcon />}
          placeholder={'password'}
          placeholderTextColor={color.DARK_GRAY}
          secureTextEntry={true}
          isVisiblePassword={true}
          autoCapitalize={false}
          extraInputViewStyle={styles.locationTextInputWidth}
        />
        <Button
          name={'Next'}
          extraBtnViewStyle={[
            CommonStyle.BtnView,
            password === '' && {opacity: 0.5},
            password.length < 8 && {opacity: 0.5},
          ]}
          onPress={() => {
            onPressNext();
          }}
          // isLoading={loading}
          disabled={password === '' || password.length < 8}
        />
      </ScrollView>
    </View>
  );
};

export default WifiPassword;

const styles = StyleSheet.create({
  locationTextInputWidth: {
    width: '100%',
    marginTop: 20,
  },
  banner: {
    height: responsiveScale(200),
    width: '85%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: responsiveScale(22),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
