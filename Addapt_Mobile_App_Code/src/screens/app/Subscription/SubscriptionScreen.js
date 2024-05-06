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
import DoubleArrow from '../../../assets/appImages/DoubleArrow.svg';
import {useSelector} from 'react-redux';
import {
  Mobilelogin,
  passwordChange,
  register,
} from '../../../resources/baseServices/auth';
import {CustomeToast} from '../../../components/CustomeToast';
import Button from '../../../components/Button';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
} from '../../../styles/typography';
import {ArrowLeft, ArrowRight} from '../../../assets/Icon';
import {perfectSize} from '../../../styles/theme';

const SubscriptionScreen = ({navigation}) => {
  const [otpCode, setOtpCode] = useState('');
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState('annual');

  const PlanData = [
    {
      title: 'Basic Plan',
      plans: [
        {key: 'annual', name: 'Annual plan', price: 80},
        {key: 'monthly', name: 'Monthly plan', price: 100},
      ],
      benefits: [
        'Full HD live video',
        'Night vison + alarm',
        '2 way talk',
        '2-user simultaneous viewing',
        'Motion detection',
        'People  detection',
        '15-Day video recording om SD card',
        'Mobile app access',
      ],
    },
    {
      title: 'Advanced Plan',
      plans: [
        {key: 'annual', name: 'Annual plan', price: 120},
        {key: 'monthly', name: 'Monthly plan', price: 150},
      ],
      benefits: [
        'Perimeter zoning',
        '100% Privacy mode(enable/Disable)',
        '4-user simultaneous viewing',
        'Package detection',
        'Face recognition',
        'Pet recognition',
        'Vehicle detection',
        '15-day video recording on SD card 7-day video recording on cloud',
        'Web-platform access',
        'Historical analytics and Trends',
      ],
    },
    {
      title: 'Premium Plan',
      plans: [
        {key: 'annual', name: 'Annual plan', price: 200},
        {key: 'monthly', name: 'Monthly plan', price: 250},
      ],
      benefits: [
        'Deploy custom trained AI models',
        'Additional cloud backup',
        '8-user simultaneous viewing',
        '30-day video recording on SD card 15-day video recording on cloud',
        'Priority customer support',
      ],
    },
  ];

  const onPrevious = () => {
    setSelectedPlan(selectedPlan - 1);
  };
  const onNext = () => {
    setSelectedPlan(selectedPlan + 1);
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Subscription plans'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />

      <KeyboardAwareScrollView
        style={[{paddingVertical: 20, backgroundColor: color.WHITE}]}
        showsVerticalScrollIndicator={false}>
        <View style={CommonStyle.row}>
          <Text style={[styles.planTitle, {width: '67%'}]}>
            {PlanData[selectedPlan].title}
          </Text>
          <View
            style={[
              CommonStyle.row,
              {width: '30%', marginRight: perfectSize(5)},
            ]}>
            <TouchableOpacity
              onPress={onPrevious}
              disabled={selectedPlan === 0}
              style={[
                styles.btnContainer,
                selectedPlan === 0 && {backgroundColor: '#D9D9D9'},
              ]}>
              <ArrowLeft
                height={'100%'}
                width={'100%'}
                color={selectedPlan === 0 && color.DARK_GRAY}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onNext}
              disabled={selectedPlan === 2}
              style={[
                styles.btnContainer,
                selectedPlan === 2 && {backgroundColor: '#D9D9D9'},
              ]}>
              <ArrowRight
                height={'100%'}
                width={'100%'}
                color={selectedPlan === 2 && color.DARK_GRAY}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.planContainer}>
          {PlanData[selectedPlan].plans.map((item, index) => {
            return (
              <>
                <View style={styles.plan}>
                  <View>
                    <Text style={CommonStyle.blackText14}>
                      {item.name}
                      {item.key === 'annual' && (
                        <Text style={CommonStyle.smallGreenText}>
                          {' '}
                          {'Save 20%'}
                        </Text>
                      )}
                    </Text>
                    <Text style={[CommonStyle.greenText20, {marginTop: 10}]}>
                      ₹{item.price}
                      <Text style={CommonStyle.regularGreyText}>
                        / camera / month{' '}
                      </Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.radioContainer}
                    onPress={() => setSelectedPackage(item.key)}>
                    {selectedPackage === item.key && (
                      <View style={styles.radio} />
                    )}
                  </TouchableOpacity>
                </View>
                {index === 0 && <View style={styles.line} />}
              </>
            );
          })}
        </View>
        <Button
          name={'Continue'}
          // isLoading={loading}
          extraBtnViewStyle={styles.BtnView}
          //   onPress={() => verifyOtp()}
        />
        {PlanData[selectedPlan].benefits.map(item => {
          return (
            <View style={styles.row}>
              <View style={styles.arrow}>
                <DoubleArrow height={'100%'} width={'100%'} />
              </View>
              <Text style={[CommonStyle.greyText18, {width: '90%'}]}>
                {item}
              </Text>
            </View>
          );
        })}
        <View style={{height: 50}} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  planTitle: {
    fontFamily: TTNORMSPRO_BOLD,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(24),
  },
  btnContainer: {
    height: responsiveScale(38),
    width: responsiveScale(38),
    borderRadius: responsiveScale(38),
    backgroundColor: color.GREEN,
    padding: responsiveScale(5),
  },
  planContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#F3F9F8',
    borderWidth: 1,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 10,
    marginTop: 20,
  },
  plan: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#7979791A',
  },
  radioContainer: {
    height: responsiveScale(20),
    width: responsiveScale(20),
    borderRadius: responsiveScale(20),
    borderColor: color.GREEN,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: responsiveScale(12),
    width: responsiveScale(12),
    borderRadius: responsiveScale(12),
    backgroundColor: color.GREEN,
  },
  BtnView: {width: '40%', marginVertical: 20},
  arrow: {
    height: responsiveScale(20),
    width: responsiveScale(20),
    // marginRight: responsiveScale(20),
  },
});
