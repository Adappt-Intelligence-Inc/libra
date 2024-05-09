const BASE_URL = 'http://backend.adapptonline.com:9002';
export const SOCKET_URL = 'http://backend.adapptonline.com:9010';
// const BASE_URL = 'https://backend.adapptonline.com';
// export const SOCKET_URL = 'https://backend.adapptonline.com:9010';

const API = {
  /** AUTH **/
  LOGIN: BASE_URL + '/individualLogin',
  MOBILE_LOGIN: BASE_URL + '/generateMobileLoginOtpIndividual',
  UPDATE_EMAIL_PHONE: BASE_URL + '/updateEmailPhoneNumber',
  MOBILE_SSO_LOGIN: BASE_URL + '/individualMobileSSOLogin',
  MOBILE_APPLE_LOGIN: BASE_URL + '/individualMobileAppleLogin',
  REGISTER: BASE_URL + '/registerIndividual',
  OTP_VERIFICATION: BASE_URL + '/createIndividualClient',
  REGISTER_USER: BASE_URL + '/createIndividualUser',
  REGISTER_USER_NEW: BASE_URL + '/createIndividualUserNew',
  LOGOUT: BASE_URL + '/individualLogout',
  PASSWORD_CHANGE: BASE_URL + '/getPasswordChangeOTP',
  NEW_PASSWORD_UPLOAD: BASE_URL + '/changeIndividualPassword',
  DELETE_ACCOUNT: BASE_URL + '/deleteAccount',
  UPLOAD_PROFILE_IMAGE: BASE_URL + '/uploadIndividualProfileImage',
  EDIT_PROFILE_NAME: BASE_URL + '/editProfileName',
  GET_PROFILE_DETAILS: BASE_URL + '/getProfileDetails',
  GET_PROFILE_PIC: BASE_URL + '/getProfilePic',

  ADD_DEVICE: BASE_URL + '/createQRCameraDevice',
  DELETE_DEVICE: BASE_URL + '/deleteCameraDevice',
  GET_DEVICES_LIST: BASE_URL + '/getQRCameraDevices',
  // GET_EVENTS: BASE_URL + '/getAllEvents',
  GET_EVENTS: BASE_URL + '/getAllAggregatedEvents',
  // GET_ALL_EVENTS: BASE_URL + '/getAllEventsMob',
  GET_ALL_EVENTS: BASE_URL + '/getAllAggregatedEventsMob',
  GET_ALL_EVENT_TYPES: BASE_URL + '/getAllCameraEventTypes',
  ADD_EVENT_TO_DEVICE: BASE_URL + '/assignEventToDevice',
  SET_FAVOURITE_DEVICE: BASE_URL + '/setFavouriteDevice',
  REGISTER_USER_FACE_AWS: BASE_URL + '/registerUserFaceAWS',
  RECOGNISED_USERS: BASE_URL + '/getRecognisedUsers',
  ADD_LOCATION: BASE_URL + '/createDeviceLocation',
  UPDATE_LOCATION: BASE_URL + '/updateDeviceLocation',
  DELETE_LOCATION: BASE_URL + '/deleteDeviceLocation',
  GET_ALL_LOCATION: BASE_URL + '/getDeviceLocation',
  GET_INVITEES: BASE_URL + '/getInvitees',
  CREATE_INVITEES: BASE_URL + '/createInvitees',
  ADD_DEVICE_COORDINATES: BASE_URL + '/addDeviceCoordinates',

  GET_BASIC_ANALYTICS: BASE_URL + '/getCameraBasicAnalytics',
  GET_EVENT_DURATIONS: BASE_URL + '/getEventDurations',
  GET_EVENT_REPORT: BASE_URL + '/getEventsReport',
  GET_EVENT_INSIGHTS: BASE_URL + '/getEventInsights',
  GET_APP_VERSIONS: BASE_URL + '/getAppVersions',
  GET_IN_APP_NOTIFICATION_DATA: BASE_URL + '/getInAppNotificationData',
  MARK_READ_ALL_NOTIFICATION: BASE_URL + '/markReadInAppNotificationData',
  SET_UP_NOTIFICATIONS: BASE_URL + '/setupNotifications',
  GET_NOTIFICATIONS_CONFIG: BASE_URL + '/getNotificationsConfig',
  ADD_UNIQUE_DEVICE: BASE_URL + '/addUniqueDevice',
};

export default API;
