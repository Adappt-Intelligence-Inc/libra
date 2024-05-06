import {Alert} from 'react-native';
import {
  MobileApplelogin,
  MobileSSOlogin,
  getDevicesList,
} from '../resources/baseServices/auth';
import {setAuthTokenAction, setUserDetailsAction} from '../store/authReducer';
import {setDevicesAction, setDevicesListAction} from '../store/devicesReducer';
import {setAddedDevices, setAuthToken, setUserDetails} from './auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const signInWithGoogle = async (dispatch, setLoading) => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    if (userInfo) {
      try {
        const data = {
          email: userInfo?.user?.email,
          token: userInfo?.idToken,
          type: 'google',
        };
        mobileSSO(data, dispatch, setLoading);
      } catch (error) {
        console.log('googleerror123', error);
      }
    }
  } catch (error) {
    console.log('signin 123 ==> ', error);
  }
};

const mobileSSO = async (data, dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await MobileSSOlogin(data);
    if (res?.status === 200) {
      // console.log('res?.data?.data', res?.data?.data);
      if (res?.data?.data) {
        try {
          const getList = await getDevicesList(res?.data?.data?.email, {
            Authorization: res?.data?.data?.auth_token,
          });
          const AddedDevice = getList?.data?.data;
          if (AddedDevice && AddedDevice.length > 0) {
            await setAddedDevices('true');
            dispatch(setDevicesAction(true));
            dispatch(setDevicesListAction(AddedDevice));
          } else {
            dispatch(setDevicesListAction([]));
          }
        } catch (error) {
          console.log('error123', error);
        }
        setLoading(false);
        await setAuthToken(res?.data?.data?.auth_token);
        await setUserDetails(JSON.stringify(res?.data?.data));
        dispatch(setUserDetailsAction(res?.data?.data));
        dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
      }
    } else {
      mobileSSO(data, dispatch, setLoading);
    }
  } catch (error) {
    console.log('error', error);
    setTimeout(() => {
      mobileSSO(data, dispatch, setLoading);
    }, 8000);
  }
};

const mobileAppleSSO = async (data, dispatch, setLoading) => {
  setLoading(true);
  try {
    const res = await MobileApplelogin(data);
    if (res?.status === 200) {
      // console.log('res?.data?.data', res?.data?.data);
      if (res?.data?.data) {
        try {
          const getList = await getDevicesList(res?.data?.data?.email, {
            Authorization: res?.data?.data?.auth_token,
          });
          const AddedDevice = getList?.data?.data;
          if (AddedDevice && AddedDevice.length > 0) {
            await setAddedDevices('true');
            dispatch(setDevicesAction(true));
            dispatch(setDevicesListAction(AddedDevice));
          } else {
            dispatch(setDevicesListAction([]));
          }
        } catch (error) {
          console.log('error123', error);
        }
        setLoading(false);
        await setAuthToken(res?.data?.data?.auth_token);
        await setUserDetails(JSON.stringify(res?.data?.data));
        dispatch(setUserDetailsAction(res?.data?.data));
        dispatch(setAuthTokenAction(res?.data?.data?.auth_token));
      }
    } else {
      mobileAppleSSO(data, dispatch, setLoading);
    }
  } catch (error) {
    console.log('error', error);
    setTimeout(() => {
      mobileAppleSSO(data, dispatch, setLoading);
    }, 8000);
  }
};

export const googleSignOut = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('googleSignOut', error);
  }
};

export const signInWithApple = async (dispatch, setLoading) => {
  // 1). start a apple sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log('appleAuthRequestResponse', appleAuthRequestResponse);
  // 2). if the request was successful, extract the token and nonce
  const {identityToken, nonce} = appleAuthRequestResponse;
  // can be null in some scenarios
  if (identityToken) {
    const data = {
      identityToken: identityToken,
    };
    mobileAppleSSO(data, dispatch, setLoading);
  } else {
  }
};
