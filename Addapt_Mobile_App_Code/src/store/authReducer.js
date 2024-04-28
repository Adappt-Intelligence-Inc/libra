import {produce} from 'immer';

const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
const REMOVE_AUTH_TOKEN = 'REMOVE_AUTH_TOKEN';
const SET_USER_DETAILS = 'SET_USER_DETAILS';
const EDIT_USER_DETAILS = 'EDIT_USER_DETAILS';
const FIRST_LAUNCH = 'FIRST_LAUNCH';

const initialState = {
  authToken: '',
  userDetails: {},
  first_launch: false,
};

// reducer
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SET_AUTH_TOKEN:
        draft.authToken = action.payload;
        break;
      case SET_USER_DETAILS:
        draft.userDetails = action.payload;
        break;
      case EDIT_USER_DETAILS:
        draft.userDetails = {...draft.userDetails, ...action.payload};
        break;
      case REMOVE_AUTH_TOKEN:
        draft.authToken = '';
        break;
      case FIRST_LAUNCH:
        draft.first_launch = action.payload;
        break;
    }
  });

export const setAuthTokenAction = (value = '') => ({
  type: SET_AUTH_TOKEN,
  payload: value,
});

export const removeAuthTokenAction = () => ({
  type: REMOVE_AUTH_TOKEN,
});

export const setUserDetailsAction = (value = {}) => ({
  type: SET_USER_DETAILS,
  payload: value,
});

export const setEditedUserDetailsAction = (value = {}) => ({
  type: EDIT_USER_DETAILS,
  payload: value,
});

export const setFirstLaunchAction = (value = '') => ({
  type: FIRST_LAUNCH,
  payload: value,
});
