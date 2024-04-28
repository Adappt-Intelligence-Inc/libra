import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { color } from '../config/color';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import { responsiveScale } from '../styles/mixins';
import MoreWhite from '../assets/appImages/MoreWhite.svg';
import Group from '../assets/appImages/Group.svg';
import Camera3 from '../assets/appImages/Camera3.svg';
import Frame4 from '../assets/appImages/Frame4.svg';
import Close from '../assets/appImages/Close.svg';
import Camera2 from '../assets/appImages/Camera2.svg';
import { perfectSize } from '../styles/theme';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Button from './Button';
import { CommonStyle } from '../config/styles';

const CustomCameraItem = ({
  extraItemViewStyle,
  extraViewNameStyle,
  title,
  onMoreIconPress = () => { },
  onPress = () => { },
  onEventSelect = () => { },
  onResetDevices = () => { },
  onDeleteDevice = () => { },
  onResetBtnPress = () => { },
  isNotConnected,
  isConnected,
  disable,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colors = isConnected ? ['#0CB69C', '#00927D'] : ['#FFFFFF', '#FFFFFF'];

  return (
    <>
      <LinearGradient
        start={{ x: 0.9, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={colors}
        style={[styles.linearGradient, extraItemViewStyle]}>
        {isConnected && (
          <TouchableOpacity
            style={styles.groupIcon}
            onPress={() => {
              onPress();
            }}>
            <Group height="100%" width="100%" />
            <View style={styles.cameraIcon}>
              <View style={styles.cameraIconContainer}>
                <Camera3 width="100%" height="100%" />
              </View>
              <Text numberOfLines={2} style={[styles.btnName, extraViewNameStyle]}>{title}</Text>
            </View>
            <TouchableOpacity
              style={styles.moreIcon}
              disabled={true}
              hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
              onPress={() => {
                onMoreIconPress();
              }}>
              <Menu>
                <MenuTrigger
                  style={{
                    padding: perfectSize(3),
                  }}>
                  <MoreWhite />
                </MenuTrigger>
                <MenuOptions customStyles={styles.menuStyles}>
                  <MenuOption
                    onSelect={() => {
                      onEventSelect();
                    }}>
                    <Text style={styles.menuOptionText}>Add Events</Text>
                  </MenuOption>

                  {/* <MenuOption
                    onSelect={() => {
                      setModalVisible(true);
                      onResetDevices();
                    }}>
                    <Text style={styles.menuOptionText}>Reset devices</Text>
                  </MenuOption> */}
                  <MenuOption
                    onSelect={() => {
                      onDeleteDevice();
                    }}>
                    <Text style={styles.menuDeleteText}>Delete device</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {isNotConnected && (
          <TouchableOpacity
            activeOpacity={1}
            disabled={disable}
            style={[
              styles.notConnectedContainer,
              disable && { backgroundColor: color.LIGHT_GRAY_3 },
            ]}
            onPress={() => {
              onPress();
            }}>
            <View style={styles.camera2Icon}>
              <Camera2 width="100%" height="100%" />
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        style={CommonStyle.modelContainerStyle}
        onBackdropPress={() => {
          setModalVisible(false);
        }}>
        {/* <View style={CommonStyle.modelContainerStyle}> */}
        <View style={CommonStyle.modalContentStyle}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Frame4 />
          <Text style={[CommonStyle.sectionTitle, styles.deviceTitle]}>
            Reset Devices
          </Text>
          <Text style={[CommonStyle.text, styles.subText]}>
            Are you sure you want to reset devices?
          </Text>
          <Button
            name={'Reset'}
            extraBtnViewStyle={styles.extraBtnViewStyle}
            extraBtnNameStyle={{ fontSize: responsiveScale(14) }}
            onPress={() => {
              onResetBtnPress();
            }}
          />
        </View>
        {/* </View> */}
      </Modal>
    </>
  );
};

export default CustomCameraItem;

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  btnName: {
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontSize: responsiveScale(16),
    color: color.WHITE,
    paddingTop: 10,
    paddingRight: 10,
  },
  connectedContainer: {
    height: responsiveScale(90),
    width: '100%',
  },
  cameraIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: responsiveScale(22),
    width: responsiveScale(22),
  },
  notConnectedContainer: {
    height: responsiveScale(90),
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  camera2Icon: {
    height: responsiveScale(24),
    width: responsiveScale(28),
  },
  menuStyles: {
    optionsContainer: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: color.LIGHT_GRAY_5,
      shadowColor: 'white',
      width: 150,
      marginTop: 20,
    },
  },
  menuOptionText: {
    color: color.DARK_GRAY,
    padding: 5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  menuDeleteText: {
    color: color.RED,
    padding: 5,
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  moreIcon: { position: 'absolute', right: 10, top: 10, zIndex: 1 },
  groupIcon: { height: responsiveScale(90), width: '100%' },
  cameraIcon: { position: 'absolute', margin: 10 },
  extraBtnViewStyle: { width: '40%', marginTop: 30 },
  deviceTitle: { marginTop: 20 },
  subText: { paddingHorizontal: 50, textAlign: 'center', marginTop: 10 },
});
