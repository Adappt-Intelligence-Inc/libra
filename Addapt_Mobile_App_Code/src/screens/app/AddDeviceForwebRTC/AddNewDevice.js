import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import CustomHeader from '../../../components/CustomHeader';
import Button from '../../../components/Button';
import {responsiveScale} from '../../../styles/mixins';
import {color} from '../../../config/color';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import TextInputField from '../../../components/TextInputField';
import Step1 from '../../../assets/appImages/Step1.svg';
import Step2 from '../../../assets/appImages/Step2.svg';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddNewDevice = ({navigation, route}) => {
  const deviceId = route?.params?.deviceId;
  const defaultLocation = route?.params?.location;
  const [isTrue, setIsTrue] = useState(false);
  const [name, setName] = useState('');
  const scrollViewRef = useRef();

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Add New Device'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={CommonStyle.flex}>
        <View style={styles.stepContainer}>
          <View style={styles.countContainer}>
            <Text style={styles.count}>1.</Text>
          </View>
          <View style={styles.image}>
            <Step1 height={'100%'} />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.sectionTitle}>First Step</Text>
          <Text style={styles.greyText}>
            place the QR code in front of the camera and keep it 20-30cm away.
          </Text>
        </View>
        <View style={styles.stepContainer}>
          <View style={styles.countContainer}>
            <Text style={styles.count}>2.</Text>
          </View>
          <View style={styles.image}>
            <Step2 height={'100%'} />
          </View>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.sectionTitle}>Second step</Text>
          <Text style={styles.greyText}>
            Wait for the camera indicator light to flash or Sound.
            <Text style={{color: color.DARK_GRAY_5}}>
              {
                ' (If the camera does not responded, please press the camera reset button)'
              }
            </Text>
          </Text>
        </View>
        <Text style={styles.orAddText}>
          Enter the camera name and click “Next” to select Wi-Fi
        </Text>
        <Text style={CommonStyle.inputTitle}>Space name</Text>
        <TextInputField
          value={name}
          onchangeText={value => {
            setName(value);
          }}
          placeholder={'Enter space name'}
          placeholderTextColor={color.DARK_GRAY}
          extraInputViewStyle={styles.locationTextInputWidth}
          onFocus={() => scrollViewRef.current.scrollToEnd({animated: true})}
        />
        <View style={styles.radioContainer}>
          <TouchableOpacity
            onPress={() => setIsTrue(!isTrue)}
            disabled={name === ''}
            style={[styles.radioBorder, name === '' && {opacity: 0.5}]}>
            {isTrue ? (
              <CheckBox height={'100%'} width={'100%'} />
            ) : (
              <CheckBoxBlank height={'100%'} width={'100%'} />
            )}
          </TouchableOpacity>
          <Text
            style={[
              CommonStyle.text,
              {flex: 1},
              name === '' && {opacity: 0.5},
            ]}>
            Check whether the indicator blinks or a prompt tone is heared.
          </Text>
        </View>
        <Button
          name={'Next'}
          extraBtnViewStyle={[
            styles.BtnView,
            !isTrue && {opacity: 0.5},
            name === '' && {opacity: 0.5},
          ]}
          onPress={() => {
            navigation.navigate('SelectWifi', {
              deviceId: deviceId,
              location: defaultLocation,
              name: name,
            });
          }}
          // isLoading={loading}
          disabled={!isTrue || name === ''}
        />
        <View style={{height: 50}} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddNewDevice;

const styles = StyleSheet.create({
  BtnView: {width: '40%', marginTop: 35, marginBottom: 20},
  radioContainer: {
    flexDirection: 'row',
  },
  radioBorder: {
    height: responsiveScale(20),
    width: responsiveScale(20),
    borderRadius: responsiveScale(4),
    marginRight: 10,
  },
  radio: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: color.GREEN,
  },
  orAddText: {
    paddingTop: 20,
    fontSize: responsiveScale(16),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.DARK_GRAY,
    width: '90%',
  },
  locationTextInputWidth: {
    width: '100%',
    marginBottom: 20,
  },
  stepContainer: {
    height: responsiveScale(140),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 20,
    overflow: 'hidden',
  },
  countContainer: {
    height: responsiveScale(50),
    width: responsiveScale(50),
    borderRadius: responsiveScale(25),
    backgroundColor: '#D8EEEB99',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveScale(-10),
    left: responsiveScale(-10),
  },
  count: {
    fontSize: responsiveScale(18),
    color: color.DARK_GRAY_5,
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    marginTop: responsiveScale(5),
    marginLeft: responsiveScale(10),
  },
  image: {
    height: responsiveScale(105),
  },
  sectionTitle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(18),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  greyText: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(14),
    marginTop: 5,
    marginBottom: 20,
  },
});
