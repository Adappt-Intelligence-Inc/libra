import {produce} from 'immer';
import moment from 'moment';

const SET_DEVICES = 'SET_DEVICES';
const REMOVE_DEVICES = 'REMOVE_DEVICES';
const SET_DEVICES_LIST = 'SET_DEVICES_LIST';
const SET_DEVICES_QUALITY_LIST = 'SET_DEVICES_QUALITY_LIST';
const SET_EVENT_TYPES_LIST = 'SET_EVENT_TYPES_LIST';
const SET_LOCATION_FILTER = 'SET_LOCATION_FILTER';
const SET_TIME_FILTER = 'SET_TIME_FILTER';
const SET_EVENT_FILTER_LIST = 'SET_EVENT_FILTER_LIST';
const SET_CAMERA_FILTER = 'SET_CAMERA_FILTER';
const SET_EVENT_PLAY_TIME = 'SET_EVENT_PLAY_TIME';
const SET_SELECTED_EVENT_DATE = 'SET_SELECTED_EVENT_DATE';
const SET_FAMILY_FACES_LIST = 'SET_FAMILY_FACES_LIST';
const SET_LOCATION_LIST = 'SET_LOCATION_LIST';
const SET_CONTACT_LIST = 'SET_CONTACT_LIST';
const SET_INVITEES_LIST = 'SET_INVITEES_LIST';
const SET_VERSION_DATA = 'SET_VERSION_DATA';
const SET_VERSION_POPUP = 'SET_VERSION_POPUP';
const SET_NOTIFICATION_DATA = 'SET_NOTIFICATION_DATA';
const FACE_EVENTS = 'FACE_EVENTS';

const initialState = {
  devices: false,
  devicesList: [],
  eventTypesList: [],
  eventFilterList: [],
  familyFacesList: [],
  locationList: [],
  contactList: [],
  inviteesList: [],
  cameraFilter: [],
  devicesQualityList: [],
  locationFilter: '',
  timeFilter: '',
  eventPlayTime: '',
  selectedEventDate: '',
  verionData: [],
  vesrionPopup: false,
  notificationData: [],
  faceEventsFromCamera:[]
};

// reducer
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_DEVICES:
        draft.devices = action.payload;
        break;
      case SET_DEVICES_LIST:
        draft.devicesList = action.payload;
        break;
      case SET_DEVICES_QUALITY_LIST:
        draft.devicesQualityList = action.payload;
        break;
      case REMOVE_DEVICES:
        draft.devices = false;
        draft.devicesList = [];
        draft.devicesQualityList = [];
        draft.eventTypesList = [];
        draft.familyFacesList = [];
        draft.eventFilterList = [];
        draft.locationList = [];
        draft.contactList = [];
        draft.inviteesList = [];
        draft.cameraFilter = [];
        draft.notificationData = [];
        draft.locationFilter = '';
        draft.eventPlayTime = '';
        draft.selectedEventDate = '';
        draft.faceEventsFromCamera = [];
        break;
      case SET_EVENT_TYPES_LIST:
        draft.eventTypesList = action.payload;
        break;
      case SET_EVENT_FILTER_LIST:
        draft.eventFilterList = action.payload;
        break;
      case SET_CAMERA_FILTER:
        draft.cameraFilter = action.payload;
        break;
      case SET_LOCATION_FILTER:
        draft.locationFilter = action.payload;
        break;
      case SET_TIME_FILTER:
        draft.timeFilter = action.payload;
        break;
      case SET_EVENT_PLAY_TIME:
        draft.eventPlayTime = action.payload;
        break;
      case SET_SELECTED_EVENT_DATE:
        draft.selectedEventDate = action.payload;
        break;
      case SET_LOCATION_LIST:
        draft.locationList = action.payload;
        break;
      case SET_CONTACT_LIST:
        draft.contactList = action.payload;
        break;
      case SET_FAMILY_FACES_LIST:
        draft.familyFacesList = action.payload;
        break;
      case SET_INVITEES_LIST:
        draft.inviteesList = action.payload;
        break;
      case SET_VERSION_DATA:
        draft.verionData = action.payload;
        break;
      case SET_VERSION_POPUP:
        draft.vesrionPopup = action.payload;
        break;
      case SET_NOTIFICATION_DATA:
        draft.notificationData = action.payload;
        break;
      case FACE_EVENTS:
        draft.faceEventsFromCamera = [...draft.faceEventsFromCamera,action.payload];
        break;
    }
  });

export const setDevicesAction = (value = '') => ({
  type: SET_DEVICES,
  payload: value,
});
export const setCameraFilterAction = (value = []) => ({
  type: SET_CAMERA_FILTER,
  payload: value,
});
export const setLocationFilterAction = (value = '') => ({
  type: SET_LOCATION_FILTER,
  payload: value,
});

export const setTimeFilterAction = (value = '') => ({
  type: SET_TIME_FILTER,
  payload: value,
});

export const removeDevicesAction = () => ({
  type: REMOVE_DEVICES,
});

export const setDevicesListAction = (value = {}) => ({
  type: SET_DEVICES_LIST,
  payload: value,
});
export const setDevicesQualityListAction = (value = {}) => ({
  type: SET_DEVICES_QUALITY_LIST,
  payload: value,
});
export const setLocationAction = (value = {}) => ({
  type: SET_LOCATION_LIST,
  payload: value,
});

export const setEventsTypesAction = (value = '') => ({
  type: SET_EVENT_TYPES_LIST,
  payload: value,
});

export const setEventsFilterAction = (value = []) => ({
  type: SET_EVENT_FILTER_LIST,
  payload: value,
});

export const setEventsPlayTimeAction = (value = []) => ({
  type: SET_EVENT_PLAY_TIME,
  payload: value,
});

export const setSelectedEventDateAction = (value = []) => ({
  type: SET_SELECTED_EVENT_DATE,
  payload: value,
});

export const setFamilyFacesListAction = (value = []) => ({
  type: SET_FAMILY_FACES_LIST,
  payload: value,
});

export const setInviteesListAction = (value = []) => ({
  type: SET_INVITEES_LIST,
  payload: value,
});

export const setContactListAction = (value = []) => ({
  type: SET_CONTACT_LIST,
  payload: value,
});

export const setVersionData = (value = []) => ({
  type: SET_VERSION_DATA,
  payload: value,
});

export const setVersionPopup = (value = false) => ({
  type: SET_VERSION_POPUP,
  payload: value,
});

export const setNotificationData = (value = []) => ({
  type: SET_NOTIFICATION_DATA,
  payload: value,
});

export const setFaceEvents = (value = {}) => ({
  type: FACE_EVENTS,
  payload: value,
});
