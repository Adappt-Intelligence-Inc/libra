const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

const initialState = {
  notificationsArray: [],
};

// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        notificationsArray: [...state.notificationsArray, action.payload],
      };
    case REMOVE_NOTIFICATION:
      const formattedArray = [];

      state.notificationsArray.forEach(item => {
        if (item.id !== action.payload) {
          formattedArray.push({...item});
        }
      });

      return {notificationsArray: formattedArray};
    default:
      return state;
  }
};

export const addNotification = (notification = {}) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const removeNotification = (id = '') => ({
  type: REMOVE_NOTIFICATION,
  payload: id,
});

let notificationId = 1;
const standardDelay = 3000;
const warningDelay = 5000;
export const notify = ({
  title = 'Something went wrong!',
  message = 'Please try again',
  type = 'info',
} = {}) => {
  const id = ++notificationId;

  const notificationObject = {
    id,
    title,
    message,
    type,
  };

  return dispatch => {
    dispatch(addNotification(notificationObject));

    setTimeout(
      () => {
        dispatch(removeNotification(id));
      },
      type === 'warning' ? warningDelay : standardDelay,
    );
  };
};
