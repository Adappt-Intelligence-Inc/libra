import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Close from '../assets/appImages/Close.svg';
import DeleteFrame from '../assets/appImages/DeleteFrame.svg';
import {CommonStyle} from '../config/styles';
import Button from './Button';
import {responsiveScale} from '../styles/mixins';
import Modal from 'react-native-modal';

const DeleteModal = ({
  visible,
  setVisible,
  title,
  subTitle,
  onPressDelete,
  loading,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      style={CommonStyle.modelContainerStyle}
      onBackdropPress={() => {
        setVisible(false);
      }}>
      {/* <View style={CommonStyle.modelContainerStyle}> */}
      <View style={CommonStyle.modalContentStyle}>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={CommonStyle.position}>
          <Close />
        </TouchableOpacity>
        <DeleteFrame />
        <Text style={[CommonStyle.sectionTitle, styles.deviceTitle]}>
          {title}
        </Text>
        <Text style={[CommonStyle.text, styles.subText]}>{subTitle}</Text>
        <Button
          name={'Delete'}
          extraBtnViewStyle={styles.extraBtnStyle}
          extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          onPress={onPressDelete}
          isLoading={loading}
          disabled={loading}
        />
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  extraBtnStyle: {width: '40%', marginTop: 30},
  deviceTitle: {marginTop: 20},
  subText: {paddingHorizontal: 20, textAlign: 'center', marginTop: 10},
});
