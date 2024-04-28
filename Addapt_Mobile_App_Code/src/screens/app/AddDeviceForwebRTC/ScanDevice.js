import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BarcodeModal from '../../../components/BarcodeModal';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import Modal from 'react-native-modal';
import Scanner from '../../../assets/appImages/Scanner.svg';
import CarotRight from '../../../assets/appImages/CarotRight.svg';
import SelectConfiguration from '../../../assets/appImages/SelectConfiguration.svg';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import Button from '../../../components/Button';

const ScanDevice = ({navigation, route}) => {
  const [isQRCodeModalVisible, setIsQRCodeModalVisible] = useState(true);
  const [deviceId, setDeviceId] = useState('');
  const defaultLocation = route?.params?.location;

  const onScan = async val => {
    setDeviceId(val);
  };

  return (
    <View style={[CommonStyle.whiteContainer, CommonStyle.flex]}>
      <View style={{marginHorizontal: 20, marginBottom: 20}}>
        <CustomHeader
          title={'Select Configuration'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={{width: '100%'}}>
        <SelectConfiguration width={'100%'} />
      </View>
      <View style={{marginTop: 40}}>
        <Text style={styles.sectionTitle}>Device Scan QR Code</Text>
        <Text style={styles.greyText}>
          The device scans the QR code the phone to configure the network.
        </Text>
      </View>
      <Button
        name={'Next'}
        extraBtnViewStyle={[styles.BtnView]}
        onPress={() => {
          navigation.navigate('AddNewDevice', {
            deviceId: deviceId,
            location: defaultLocation,
          });
        }}
      />
      {/* <TouchableOpacity
        style={[CommonStyle.row, styles.cardContainer]}
        onPress={() =>
          navigation.navigate('AddNewDevice', {
            deviceId: deviceId,
            location: defaultLocation,
          })
        }>
        <View style={{width: '7%', aspectRatio: 1}}>
          <Scanner height="100%" width="100%" />
        </View>
        <View style={{width: '80%'}}>
          <Text style={CommonStyle.sectionTitle}>Device Scan QR Code</Text>
          <Text style={CommonStyle.smallestGreyText}>
            The device scans the QR code the phone to configure the network.
          </Text>
        </View>
        <View style={{width: '7%', aspectRatio: 1}}>
          <CarotRight height="100%" width="100%" />
        </View>
      </TouchableOpacity> */}
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent
        style={styles.qrContainer}
        visible={isQRCodeModalVisible}>
        <View style={styles.divider} />
        <View style={styles.scanHeader}>
          <CustomHeader
            title={'Scan Device QR'}
            isBackBtnVisible={true}
            onPressBackBtn={() => {
              navigation.goBack();
            }}
          />
        </View>

        <View style={styles.qrCodeScannerContainer}>
          <BarcodeModal
            onBarcodeScan={val => {
              setIsQRCodeModalVisible(false);
              onScan(val);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ScanDevice;

const styles = StyleSheet.create({
  qrContainer: {
    height: '100%',
    width: '100%',
    margin: 0,
    backgroundColor: 'white',
  },
  qrCodeScannerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {marginTop: Platform.OS === 'android' ? 35 : 0},
  scanHeader: {paddingHorizontal: 20, zIndex: 2},
  cardContainer: {
    marginTop: 20,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: color.LIGHT_BORDER,
  },
  sectionTitle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(20),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    textAlign: 'center',
  },
  greyText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(14),
    textAlign: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  BtnView: {width: '40%', marginTop: 20, marginBottom: 20},
});
