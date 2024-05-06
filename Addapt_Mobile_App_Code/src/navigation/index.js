import React from 'react';
import useAuthorizedSession from '../hooks/useAuthorizedSession';
import AppNavigator from './appNavigator/AppNavigator';
import AuthNavigator from './authNavigator/AuthNavigator';
import {View} from 'react-native';

const Navigation = () => {
  const [authToken, isInitializing, userDetails, devices] =
    useAuthorizedSession();

  if (isInitializing) {
    return <View />;
  }

  return authToken ? <AppNavigator /> : <AuthNavigator />;
};

export default Navigation;
