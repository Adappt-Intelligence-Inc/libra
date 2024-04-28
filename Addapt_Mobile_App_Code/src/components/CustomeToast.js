import React from 'react';
import Toast from 'react-native-toast-message';

export const CustomeToast = ({type, message}) => {
  return Toast.show({
    type: type,
    text1: message,
  });
};
