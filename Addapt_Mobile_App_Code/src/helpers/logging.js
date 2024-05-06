import {Alert} from 'react-native';

export const logError = (error, name) => {
  const n = name ? name + ' -->> ' : '';
  if (process.env.NODE_ENV !== 'production') {
    if (error.response && error.response.data && error.response.data.message) {
      console.warn(n, error.response.data.message, error.response);
    } else if (error.code && error.message) {
      console.warn(n, error.code, error.message);
    } else {
      console.warn(n, error, error.response);
    }
  }
};

export const showAlert = (
  title = 'Something went wrong ...',
  message = 'Please try again',
  buttons = [{text: 'Ok'}],
) => {
  Alert.alert(title, message, buttons, {cancelable: false});
};
