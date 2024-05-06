import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAuthTokenAction,
  setFirstLaunchAction,
  setUserDetailsAction,
} from '../store/authReducer';
import {
  getAddedDevices,
  getAuthToken,
  getFirstLaunch,
  getUserDetails,
} from '../helpers/auth';
import {setDevicesAction} from '../store/devicesReducer';

const useAuthorizedSession = () => {
  // get token from redux
  const userDetails = useSelector(state => state?.auth?.userDetails ?? '');
  const authToken = useSelector(state => state.auth?.authToken ?? '');
  const devices = useSelector(state => state.devices?.devices ?? '');
  const first_launch = useSelector(state => state.auth?.first_launch ?? '');

  const dispatch = useDispatch();

  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const checkStoredTokenAvailability = async () => {
      const userData = await getUserDetails();
      const userDataRes = JSON.parse(userData);

      if (userData) {
        dispatch(setUserDetailsAction(userDataRes));
      }
      const FirstLaunch = await getFirstLaunch();
      if (FirstLaunch) {
        dispatch(setFirstLaunchAction(FirstLaunch));
      } else {
        console.log('No FirstLaunch found');
      }

      const storedToken = await getAuthToken();
      if (storedToken) {
        // save token to redux
        dispatch(setAuthTokenAction(storedToken));
      } else {
        console.log('No token found');
      }
      const checkDevices = await getAddedDevices();
      if (checkDevices) {
        // save token to redux
        dispatch(setDevicesAction(true));
      } else {
        console.log('No devices found');
      }
    };

    const validateSessionAndFetch = async () => {
      try {
        await checkStoredTokenAvailability();
      } catch {
      } finally {
        setIsInitializing(false);
      }
    };

    validateSessionAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [authToken, isInitializing, userDetails, devices, first_launch];
};

export default useAuthorizedSession;
