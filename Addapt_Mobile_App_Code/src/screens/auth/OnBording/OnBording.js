import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {color} from '../../../config/color';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Onboarding from 'react-native-onboarding-swiper';
import Camera1 from '../../../assets/appImages/Camera1.svg';
import ArrowRight2 from '../../../assets/appImages/ArrowRight2.svg';
import OnBoard1 from '../../../assets/appImages/OnBoard1.svg';
import OnBoard2 from '../../../assets/appImages/OnBoard2.svg';
import OnBoard3 from '../../../assets/appImages/OnBoard3.svg';
import NewOnboard1 from '../../../assets/appImages/NewOnboard1.svg';
import NewOnboard2 from '../../../assets/appImages/NewOnboard2.svg';
import NewOnboard3 from '../../../assets/appImages/NewOnboard3.svg';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {deviceHeight, deviceWidth, perfectSize} from '../../../styles/theme';
import {setFirstLaunch} from '../../../helpers/auth';
import useAuthorizedSession from '../../../hooks/useAuthorizedSession';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {setFirstLaunchAction} from '../../../store/authReducer';

const OnBording = ({navigation}) => {
  const [progress, setProgress] = useState(33);
  const [index, setIndex] = useState(0);
  const onboardingRef = useRef(null);
  const dispatch = useDispatch();

  const Square = ({isLight, selected}) => {
    return (
      <View
        style={{
          width: selected ? 8 : 6,
          height: selected ? 8 : 6,
          marginHorizontal: 3,
          backgroundColor: selected ? color.GREEN : '#CFEBE7',
          borderRadius: 8,
          marginBottom: 170,
        }}
      />
    );
  };
  const onNext = () => {
    if (index < 2) {
      onboardingRef.current.goToPage(index + 1, true);
      setIndex(index + 1);
      setProgress(34 * (index + 1));
    } else {
      onSkip();
    }
  };
  const pageIndexCallback = index => {
    setIndex(index);
    setProgress(34 * (index + 1));
  };
  const onSkip = async () => {
    await setFirstLaunch('true');
    dispatch(setFirstLaunchAction(true));
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        disabled={index == 2 && true}
        style={styles.skipbtn}
        onPress={onSkip}>
        {index != 2 && <Text style={styles.skiptext}>Skip</Text>}
      </TouchableOpacity>
      <Onboarding
        ref={onboardingRef}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              // <LinearGradient
              //   start={{x: 1, y: 0}}
              //   end={{x: 1, y: 1}}
              //   colors={['#00937D00', color.GREEN]}
              //   style={styles.linearGradient}>
              <View style={styles.imagecontainer}>
                <Image
                  source={require('../../../assets/appImages/OnBoardP1.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              </View>
              // </LinearGradient>
            ),
            title: 'Manage your security with ease!',
            subtitle:
              'An Effortless and Simplified Security Camera Management Solution',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.imagecontainer}>
                <Image
                  source={require('../../../assets/appImages/OnBoardP2.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              </View>
            ),
            title: 'Protect your home.',
            subtitle: 'Enhanced Vigilance and Family Safety Anytime, Anywhere',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.imagecontainer}>
                <Image
                  source={require('../../../assets/appImages/OnBoardP3.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="cover"
                />
              </View>
            ),
            title: 'Seamlessly sync.',
            subtitle:
              'Capable of capturing security with any camera, old or new!',
          },
        ]}
        showNext={false}
        showSkip={false}
        showDone={false}
        bottomBarHighlight={false}
        showPagination={false}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        DotComponent={Square}
        pageIndexCallback={pageIndexCallback}
        containerStyles={styles.containerStyles}
      />
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: responsiveScale(30),
        }}>
        <AnimatedCircularProgress
          size={responsiveScale(60)}
          width={5}
          fill={progress}
          rotation={0}
          tintColor={color.GREEN}
          lineCap="round"
          onAnimationComplete={() => {}}
          backgroundColor={color.LIGHT_GRAY_4}>
          {fill => (
            <TouchableOpacity onPress={onNext} style={styles.progressContainer}>
              <ArrowRight2 height={'70%'} width={'70%'} />
            </TouchableOpacity>
          )}
        </AnimatedCircularProgress>
      </View>
    </SafeAreaView>
  );
};

export default OnBording;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  title: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(20),
  },
  subtitle: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_LIGHT,
    color: color.DARK_GRAY,
    fontSize: responsiveScale(14),
  },
  imagecontainer: {
    height: responsiveScale(320),
    width: '100%',
    marginBottom: responsiveScale(-20),
  },
  containerStyles: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: responsiveScale(20),
  },
  skipbtn: {
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    marginTop: responsiveScale(10),
    marginRight: 10,
    height: responsiveScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  skiptext: {
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_BOLD,
    color: color.GREEN,
    fontSize: responsiveScale(14),
  },
  linearGradient: {
    height: deviceWidth / 1.3,
    width: deviceWidth / 1.3,
    borderRadius: deviceWidth / 2, // <-- Outer Border Radius
    marginRight: responsiveScale(20),
    transform: [{scaleX: 1.3}],
    opacity: 0.15,
    marginLeft: responsiveScale(20),
  },
  progressContainer: {
    height: responsiveScale(44),
    width: responsiveScale(44),
    backgroundColor: color.GREEN,
    borderRadius: responsiveScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
