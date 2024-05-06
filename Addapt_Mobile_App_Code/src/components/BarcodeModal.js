import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {consoleLog} from '../styles/mixins';
import BarcodeMask from 'react-native-barcode-mask';
import {color} from '../config/color';

const BarcodeModal = props => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Addapt App Camera Permission',
              message: 'Addapt App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          } else {
            consoleLog('CAMERA permission denied');
          }
        } catch (err) {
          consoleLog('Camera permission err', err);
        }
      }
      requestCameraPermission();
    }
  }, []);

  return (
    <View style={styles.main}>
      <RNCamera
        ref={ref => null}
        captureAudio={false}
        style={styles.rnCameraView}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onBarCodeRead={event => {
          console.log('123->', event);
          let data = event?.data;
          try {
            data = JSON.parse(data);
          } catch (error) {
            data = data;
          }
          // try {
          //   event = JSON.parse(event);
          // } catch (error) {
          //   event = event;
          // }
          // Platform.OS === 'android'
          //   ? props.onBarcodeScan(data)
          //   :
          props.onBarcodeScan(data);
        }}>
        <BarcodeMask
          backgroundColor="transparent"
          edgeColor={color.GREEN}
          animatedLineColor={color.GREEN}
          height={200}
          width={200}
        />
      </RNCamera>
    </View>
  );
};

export default BarcodeModal;

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    height: 200,
    width: 200,
    overflow: 'hidden',
  },
  rnCameraView: {
    height: 200,
    width: 200,
    alignSelf: 'center',
  },
});
