import axios from 'axios';
import {
  authHeader,
  clearAsyncStorage,
  setFirstLaunch,
} from '../../helpers/auth';
import {configureAxiosParams} from '../../helpers/configureAxios';
import {consoleLog} from '../../styles/mixins';
import {CustomeToast} from '../../components/CustomeToast';

// Format axios nested params correctly
configureAxiosParams(axios);

export const callApi = async (url, options = {}, customHeaders = {}) => {
  const headers = await authHeader();
  consoleLog('API URL ', url);
  consoleLog('API Parameters ', options);
  consoleLog('API headers ', headers);
  consoleLog('API customHeaders ', customHeaders);
  // try {
  let response = await axios.request({
    url,
    headers:
      url.includes('registerUserFaceAWS') ||
      url.includes('createFaceIdentityX') ||
      url.includes('uploadIndividualProfileImage')
        ? {...headers,...customHeaders,}
        : {
            ...headers,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...customHeaders,
            // ...{'Cache-Control': 'no-cache, no-store, must-revalidate'},
          },
    ...options,
  });
  consoleLog('API Response ', response);
  return response;
  // } catch (error) {
  //   consoleLog('API Error ', error);
  //   if (error?.response?.status === 401) {
  //     console.log('status', error);
  //     // try {
  //     //   googleSignOut();
  //     //   const res = await logout(userDataRes?.email);
  //     //   if (res?.status === 200) {
  //     //     clearAsyncStorage().then(async () => {
  //     //       dispatch(setUserDetailsAction({}));
  //     //       dispatch(removeAuthTokenAction());
  //     //       dispatch(removeDevicesAction());
  //     //       dispatch(setFirstLaunchAction(true));
  //     //       await setFirstLaunch('true');
  //     //     });
  //     //   }
  //     // } catch (err) {
  //     //   console.log(err, ' logOut Error');
  //     // }
  //     CustomeToast({type: 'error', message: error?.response?.data?.err?.name});
  //   }
  //   return error;
  // }
};
