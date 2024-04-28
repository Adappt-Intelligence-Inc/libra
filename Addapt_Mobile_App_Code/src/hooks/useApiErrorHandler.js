import {useDispatch} from 'react-redux';
import {notify} from '../store/notifications';
import {
  ERROR_BAD_REQUEST,
  ERROR_NETWORK_ERROR,
  ERROR_UNEXPECTED,
} from '../constants/errors';
import {consoleLog} from '../styles/mixins';

const useApiErrorsHandler = () => {
  const dispatch = useDispatch();

  return (error = {}) => {
    if (error.response) {
      const {status} = error.response;
      // handle http status codes
      consoleLog(error);
      switch (status) {
        case 400:
          consoleLog('400 :bad_request');
          dispatch(
            notify({title: error?.response?.data?.error, type: 'warning'}),
            notify({title: ERROR_BAD_REQUEST, type: 'warning'}),
          );
          break;
        case 401:
          // TODO: Getting 401 for invalid email id/password too and May be we'll get the same for the token expiration.
          consoleLog('401 :unauthorized');

          dispatch(
            notify({
              title: 'Error',
              message: error.response.data.msg,
              type: 'warning',
            }),
          );
          break;
        case 403:
          consoleLog('403 :forbidden');
          dispatch(notify({title: 'Not allowed', type: 'warning'}));
          break;
        case 404:
          consoleLog('404 :not_found');
          dispatch(notify({title: 'Not found', type: 'warning'}));
          break;
        case 422:
          // TODO: Need to update message key from the backend.
          consoleLog('422 :unprocessable_entity', error.response);
          dispatch(notify({title: error.response.data, type: 'warning'}));
          break;
        case 429:
          consoleLog('429 :too_many_requests');
          dispatch(notify({title: 'Too Many Requests', type: 'warning'}));
          break;
        case 500:
          consoleLog('500 :internal_server_error');
          dispatch(
            notify({
              title: 'Internal server error',
              message: 'Please wait and try again later',
              type: 'warning',
            }),
          );
          break;
        default:
          consoleLog('Response Error');
          dispatch(notify({title: ERROR_UNEXPECTED, type: 'warning'}));
          break;
      }
    } else if (error.request) {
      consoleLog('Network error');
      dispatch(notify({title: ERROR_NETWORK_ERROR, type: 'warning'}));
    } else {
      // Something happened in setting up the request and triggered an Error
      consoleLog('unrepentant_error');
      dispatch(notify({title: ERROR_UNEXPECTED, type: 'warning'}));
    }
    // log error into console
    consoleLog(error);
  };
};

export default useApiErrorsHandler;
