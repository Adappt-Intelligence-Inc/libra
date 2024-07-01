import AsyncStorage from '@react-native-community/async-storage';
import {logError} from './logging';

const TOKEN_KEY = '@auth_token';
const USER_DETAILS = '@user_details';
const ADDED_DEVICES = '@added_devices';
const FIRST_LAUNCH = '@first_launch';
const SELECTED_DATE = '@selected_date';

export const setAuthToken = async (value = '') => {
  try {
    // await AsyncStorage.setItem(TOKEN_KEY, value);
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(value));
  } catch (err) {
    logError(err, '[setAuthToken] AsyncStorage Error');
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    logError(err, '[getAuthToken] AsyncStorage Error');

    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    logError(err, '[removeAuthToken] AsyncStorage Error');
  }
};

export const clearAsyncStorage = async () => {
  try {
    AsyncStorage.clear();
  } catch (err) {
    logError(err, '[clearStorage] AsyncStorage Error');
  }
};

export const authHeader = async () => {
  let token = await getAuthToken();
  try {
    token = JSON.parse(token);
  } catch (error) {
    token = token;
  }

  return token ? {Authorization: `${token}`} : {};
};

export const setUserDetails = async value => {
  try {
    await AsyncStorage.setItem(USER_DETAILS, value);
  } catch (err) {
    logError(err, '[setUserDetails] AsyncStorage Error');
  }
};

export const getUserDetails = async () => {
  try {
    return await AsyncStorage.getItem(USER_DETAILS);
  } catch (err) {
    logError(err, '[getUserDetails] AsyncStorage Error');
  }
};
export const setAddedDevices = async value => {
  try {
    await AsyncStorage.setItem(ADDED_DEVICES, value);
  } catch (err) {
    logError(err, '[setAddedDevices] AsyncStorage Error');
  }
};

export const getAddedDevices = async () => {
  try {
    return await AsyncStorage.getItem(ADDED_DEVICES);
  } catch (err) {
    logError(err, '[getAddedDevices] AsyncStorage Error');
  }
};
export const setFirstLaunch = async value => {
  try {
    await AsyncStorage.setItem(FIRST_LAUNCH, value);
  } catch (err) {
    logError(err, '[setFirstLaunch] AsyncStorage Error');
  }
};

export const getFirstLaunch = async () => {
  try {
    return await AsyncStorage.getItem(FIRST_LAUNCH);
  } catch (err) {
    logError(err, '[getFirstLaunch] AsyncStorage Error');
  }
};

export const setSelectedDateInAsync = async value => {
  try {
    await AsyncStorage.setItem(SELECTED_DATE, value);
  } catch (err) {
    logError(err, '[setSelectedDateInAsync] AsyncStorage Error');
  }
};
export const removeSelectedDateInAsync = async () => {
  try {
    await AsyncStorage.removeItem(SELECTED_DATE);
  } catch (error) {
    console.error("Error removing date from AsyncStorage", error);
  }
};
export const getSelectedDateInAsync = async () => {
  try {
    return await AsyncStorage.getItem(SELECTED_DATE);
  } catch (err) {
    logError(err, '[getSelectedDateInAsync] AsyncStorage Error');
  }
};
