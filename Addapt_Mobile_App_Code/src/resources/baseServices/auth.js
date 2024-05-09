import {callApiGet, callApiPost} from './baseApi';
import API from '../../constants/baseApi';

export const login = (data = {}) => callApiPost({url: API.LOGIN, data});

export const Mobilelogin = (data = {}) =>
  callApiPost({url: API.MOBILE_LOGIN, data});

export const updateEmailPhone = (data = {}) =>
  callApiPost({url: API.UPDATE_EMAIL_PHONE, data});

export const MobileSSOlogin = (data = {}) =>
  callApiPost({url: API.MOBILE_SSO_LOGIN, data});

export const MobileApplelogin = (data = {}) =>
  callApiPost({url: API.MOBILE_APPLE_LOGIN, data});

export const register = (data = {}) => callApiPost({url: API.REGISTER, data});

export const passwordChange = (data = {}) =>
  callApiPost({url: API.PASSWORD_CHANGE, data});

export const passwordChangeWithPhone = (phoneNumber = '') =>
  callApiGet({url: API.PASSWORD_CHANGE + `?phoneNumber=${phoneNumber}`});

export const passwordChangeWithEmail = (email = '') =>
  callApiGet({url: API.PASSWORD_CHANGE + `?email=${email}`});

export const newPasswordUpload = (data = {}) =>
  callApiPost({url: API.NEW_PASSWORD_UPLOAD, data});

export const deleteAccount = (data = {}) =>
  callApiPost({url: API.DELETE_ACCOUNT, data});

export const profileImageUpload = (email = '', data = {}) =>
  callApiPost({url: API.UPLOAD_PROFILE_IMAGE + `?email=${email}`, data});

export const editProfileName = (data = {}) =>
  callApiPost({url: API.EDIT_PROFILE_NAME, data});

export const getProfileDetails = (email = '') =>
  callApiGet({url: API.GET_PROFILE_DETAILS + `?email=${email}`});

export const getProfilePic = (email = '') =>
  callApiGet({url: API.GET_PROFILE_PIC + `?email=${email}`});

export const otpVerification = (data = {}) =>
  callApiPost({url: API.OTP_VERIFICATION, data});

export const registerUser = (data = {}) =>
  callApiPost({url: API.REGISTER_USER, data});

export const registerUserNew = (data = {}) =>
  callApiPost({url: API.REGISTER_USER_NEW, data});

export const addDevice = (data = {}) =>
  callApiPost({url: API.ADD_DEVICE, data});

export const deleteDevice = (data = {}) =>
  callApiPost({url: API.DELETE_DEVICE, data});

export const addLocation = (data = {}) =>
  callApiPost({url: API.ADD_LOCATION, data});

export const updateLocation = (data = {}) =>
  callApiPost({url: API.UPDATE_LOCATION, data});

export const deleteLocation = (data = {}) =>
  callApiPost({url: API.DELETE_LOCATION, data});

export const getLocationList = (email = '') =>
  callApiGet({url: API.GET_ALL_LOCATION + `?email=${email}`});

export const addEventsToDevice = (data = {}) =>
  callApiPost({url: API.ADD_EVENT_TO_DEVICE, data});

export const getDevicesList = (email = '', customHeaders = {}) =>
  callApiGet({
    url: API.GET_DEVICES_LIST + `?email=${email}`,
    customHeaders: customHeaders,
  });

export const getEventTypesList = (email = '') =>
  callApiGet({url: API.GET_ALL_EVENT_TYPES + `?email=${email}`});

export const events = (
  streamName = '',
  startDate = '',
  endDate = '',
  email = '',
) =>
  callApiGet({
    url:
      API.GET_EVENTS +
      `?streamName=${streamName}&startDate=${startDate}&endDate=${endDate}&email=${email}`,
  });

export const getAllEvents = (
  streamName = '',
  startDate = '',
  endDate = '',
  email = '',
) =>
  callApiGet({
    url: streamName
      ? API.GET_ALL_EVENTS +
        `?streamName=${streamName}&startDate=${startDate}&endDate=${endDate}&email=${email}`
      : API.GET_ALL_EVENTS +
        `?startDate=${startDate}&endDate=${endDate}&email=${email}`,
  });

export const logout = (email = '') =>
  callApiGet({url: API.LOGOUT + `?email=${email}`});

export const mobileLogout = phoneNumber =>
  callApiGet({url: API.LOGOUT + `?phoneNumber=${parseInt(phoneNumber)}`});

export const getRecognisedUsersList = (email = '') =>
  callApiGet({url: API.RECOGNISED_USERS + `?email=${email}`});

export const createInvitees = (data = {}) =>
  callApiPost({url: API.CREATE_INVITEES, data});

export const getInviteesList = (email = '') =>
  callApiGet({url: API.GET_INVITEES + `?email=${email}`});

export const setFavouriteDevice = (data = {}) =>
  callApiPost({url: API.SET_FAVOURITE_DEVICE, data});

export const registerUserFaceAWS = (
  email = '',
  userId = '',
  name = '',
  data = {},
  location,
  device,
) =>
  callApiPost({
    url:
      API.REGISTER_USER_FACE_AWS +
      `?email=${email}&name=${name}&location=${location}&device=${device}`,
    data,
  });

export const deleteUserFaceAWS = (email = '', name = '', location, device) =>
  callApiPost({
    url:
      API.REGISTER_USER_FACE_AWS +
      `?email=${email}&type=deleteUser&name=${name}&location=${location}&device=${device}`,
  });

export const addDeviceZone = (data = {}) =>
  callApiPost({url: API.ADD_DEVICE_COORDINATES, data});

export const getBasicAnalytics = (email = '') =>
  callApiGet({url: API.GET_BASIC_ANALYTICS + `?email=${email}`});

export const getDeviceBasicAnalytics = (
  email = '',
  deviceId = '',
  deviceLocation = '',
) =>
  callApiGet({
    url:
      API.GET_BASIC_ANALYTICS +
      `?email=${email}&deviceId=${deviceId}&deviceLocation=${deviceLocation}`,
  });

export const getEventsReport = (
  email = '',
  deviceLocation = '',
  eventType = '',
) =>
  callApiGet({
    url:
      API.GET_EVENT_REPORT +
      `?email=${email}&deviceLocation=${deviceLocation}&eventType=${eventType}`,
  });

export const getEventDurations = (
  email = '',
  deviceId = '',
  deviceLocation = '',
  startDate = '',
  endDate = '',
) =>
  callApiGet({
    url:
      API.GET_EVENT_DURATIONS +
      `?email=${email}&deviceId=${deviceId}&deviceLocation=${deviceLocation}&startDate=${startDate}&endDate=${endDate}`,
  });

export const getEventInsights = (
  email = '',
  deviceLocation = '',
  startDate = '',
  endDate = '',
) =>
  callApiGet({
    url:
      API.GET_EVENT_INSIGHTS +
      `?email=${email}&deviceLocation=${deviceLocation}&startDate=${startDate}&endDate=${endDate}`,
  });

export const getAppVersions = () => callApiGet({url: API.GET_APP_VERSIONS});

export const getInAppNotificationData = (email = '') =>
  callApiGet({url: API.GET_IN_APP_NOTIFICATION_DATA + `?email=${email}`});

export const markReadAllNotification = (data = {}) =>
  callApiPost({url: API.MARK_READ_ALL_NOTIFICATION, data});

export const turnOffNotificationTill = (data = {}) =>
  callApiPost({url: API.SET_UP_NOTIFICATIONS, data});

export const getNotificationSettingsData = (userId = '', email = '') =>
  callApiGet({
    url: API.GET_NOTIFICATIONS_CONFIG + `?userId=${userId}&email=${email}`,
  });

  export const addUniqueDevice = (data = {}) =>
    callApiPost({url: API.ADD_UNIQUE_DEVICE, data});
