import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import QRCode from 'react-native-qrcode-svg';
import {WINDOW_WIDTH, responsiveScale} from '../../../styles/mixins';
import Button from '../../../components/Button';
import {color} from '../../../config/color';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import Step1 from '../../../assets/appImages/Step1.svg';

const GeneratedQRCode = ({navigation, route}) => {
  const QRcodeData = route?.params?.QRcodeData;
  console.log('QRcodeData', QRcodeData);

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'QR Code'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{marginTop: 20, flex: 1}}>
        <Text style={CommonStyle.text}>
          place the QR code in front of the camera and keep it 20-30cm away.
        </Text>
        <View style={styles.container}>
          <QRCode
            logoBackgroundColor="transparent"
            value={JSON.stringify(QRcodeData)}
            size={WINDOW_WIDTH - responsiveScale(120)}
          />
        </View>
        <Text style={styles.text}>How to Use</Text>
        <View style={styles.stepContainer}>
          <Step1 height={'100%'} />
        </View>
        <Button
          name={'Done'}
          extraBtnViewStyle={[styles.BtnView]}
          onPress={() => {
            navigation.navigate('Devices');
          }}
          // isLoading={loading}
          // disabled={true}
        />
      </ScrollView>
    </View>
  );
};

export default GeneratedQRCode;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: responsiveScale(14),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    paddingTop: 40,
  },
  BtnView: {width: '40%', marginVertical: 40},
  stepContainer: {
    height: responsiveScale(140),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    overflow: 'hidden',
    paddingVertical: 10,
  },
});
