import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddDevice from '../../screens/app/AddDevice/AddDevice';
import AddCameraDevice from '../../screens/app/AddCameraDevice/AddCameraDevice';
import AddSetUpDevice from '../../screens/app/AddSetUpDevice/AddSetUpDevice';
import Login from '../../screens/auth/Login/Login';
import SignUp from '../../screens/auth/SignUp/SignUp';
import OTPScreen from '../../screens/auth/OTP/OTPScreen';
import AccountVerifyScreen from '../../screens/auth/AccountVerify/AccountVerifyScreen';
import useAuthorizedSession from '../../hooks/useAuthorizedSession';
import OnBording from '../../screens/auth/OnBording/OnBording';
import {getFirstLaunch} from '../../helpers/auth';
import {useSelector} from 'react-redux';
import MobileLogin from '../../screens/auth/MobileLogin/MobileLogin';
import ForgotPassword from '../../screens/auth/ForgotPassword/ForgotPassword';
import ResetYourPassword from '../../screens/auth/ForgotPassword/ResetYourPassword';
const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  const [authToken, isInitializing, userDetails, devices, first_launch] =
    useAuthorizedSession();

  const initialRouteName = first_launch ? 'Login' : 'OnBording';

  return (
    <>
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName={initialRouteName}>
          <AuthStack.Screen
            name="OnBording"
            component={OnBording}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="MobileLogin"
            component={MobileLogin}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="AddDevice"
            component={AddDevice}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="AddCameraDevice"
            component={AddCameraDevice}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="AddSetUpDevice"
            component={AddSetUpDevice}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="OTPScreen"
            component={OTPScreen}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="AccountVerifyScreen"
            component={AccountVerifyScreen}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{headerShown: false}}
          />
          <AuthStack.Screen
            name="ResetYourPassword"
            component={ResetYourPassword}
            options={{headerShown: false}}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    </>
  );
}
