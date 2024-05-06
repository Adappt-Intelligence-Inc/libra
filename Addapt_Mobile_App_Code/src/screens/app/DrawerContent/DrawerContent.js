import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {CommonStyle} from '../../../config/styles';
import CloseIcon from '../../../assets/appImages/CloseIcon.svg';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeAuthTokenAction,
  setFirstLaunchAction,
  setUserDetailsAction,
} from '../../../store/authReducer';
import {
  clearAsyncStorage,
  getUserDetails,
  setFirstLaunch,
} from '../../../helpers/auth';
import AdapptLogo from '../../../assets/appImages/AdapptLogo.svg';
import ProfileCircleWhite from '../../../assets/appImages/ProfileCircleWhite.svg';
import LibraryOutline from '../../../assets/appImages/LibraryOutline.svg';
import Library from '../../../assets/appImages/Library.svg';
import Services from '../../../assets/appImages/Services.svg';
import PrivacyPolicy from '../../../assets/appImages/PrivacyPolicy.svg';
import LogoutIcon from '../../../assets/appImages/LogoutIcon.svg';
import {logout, mobileLogout} from '../../../resources/baseServices/auth';
import {removeDevicesAction} from '../../../store/devicesReducer';
import {googleSignOut} from '../../../helpers/global';

export default function DrawerContent({navigation}) {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});

  const handleLogout = async () => {
    const userData = await getUserDetails();
    const userDataRes = JSON.parse(userData);
    try {
      googleSignOut();
      const res = await logout(userDataRes?.email);
      if (res?.status === 200) {
        clearAsyncStorage().then(async () => {
          dispatch(setUserDetailsAction({}));
          dispatch(removeAuthTokenAction());
          dispatch(removeDevicesAction());
          dispatch(setFirstLaunchAction(true));
          await setFirstLaunch('true');
        });
      }
    } catch (err) {
      console.log(err, ' logOut Error');
    }
  };

  const handleMobileLogout = async () => {
    const userData = await getUserDetails();
    const userDataRes = JSON.parse(userData);
    try {
      googleSignOut();
      const res = await mobileLogout(userDataRes?.phoneNumber);
      if (res?.status === 200) {
        clearAsyncStorage().then(async () => {
          dispatch(setUserDetailsAction({}));
          dispatch(removeAuthTokenAction());
          dispatch(removeDevicesAction());
          dispatch(setFirstLaunchAction(true));
          await setFirstLaunch('true');
        });
      }
    } catch (err) {
      console.log(err, ' logOut Error');
    }
  };

  return (
    <View style={[CommonStyle.container, styles.mainView]}>
      <DrawerContentScrollView>
        <View style={CommonStyle.row}>
          <View style={CommonStyle.imageView}>
            <AdapptLogo height={'100%'} width={'100%'} />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.closeDrawer();
            }}>
            <CloseIcon />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Account');
            }}>
            <View style={styles.imageView}>
              <ProfileCircleWhite height={'100%'} width={'100%'} />
            </View>
            <Text style={styles.drawerItem}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnContainer]}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('LibraryScreen');
            }}>
            <View style={styles.imageView}>
              <Library height={'100%'} width={'100%'} />
            </View>
            <Text style={styles.drawerItem}>Library</Text>
          </TouchableOpacity>
          {!userDetails?.viewOnly && (
            <TouchableOpacity
              disabled
              style={[styles.btnContainer, {opacity: 0.7}]}>
              <View style={styles.imageView}>
                <Services height={'100%'} width={'100%'} />
              </View>
              <Text style={styles.drawerItem}>Services</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            disabled
            style={[styles.btnContainer, {opacity: 0.7}]}>
            <View style={styles.imageView}>
              <PrivacyPolicy height={'100%'} width={'100%'} />
            </View>
            <Text style={styles.drawerItem}>Privacy policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
              handleLogout();
            }}>
            <View style={styles.imageView}>
              <LogoutIcon height={'100%'} width={'100%'} />
            </View>
            <Text style={styles.drawerItem}>Log out</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    paddingLeft: 20,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerItem: {
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.WHITE,
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    paddingVertical: 20,
  },
  imageView: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
