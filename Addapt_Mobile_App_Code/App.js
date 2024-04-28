/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import configureStore from './src/store/configureStore';
import Navigation from './src/navigation';
import {MenuProvider} from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LogLevel, OneSignal} from 'react-native-onesignal';

function App() {
  const store = configureStore();
  GoogleSignin.configure({
    iosClientId:
      '47444515063-d5bh6r8p34aa0ebemf6epmr5j36n8d1m.apps.googleusercontent.com',
    webClientId:
      '47444515063-ima8lker6m8sglbtme5ul6vcp42cs0h5.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize('4cbdd6be-052f-497a-9c55-4662b37e6daf');

    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('OneSignal: notification clicked:', event);
    });
  }, []);

  return (
    <MenuProvider>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" />
        <View style={styles.container}>
          <Navigation />
          <Toast visibilityTime={3000} />
        </View>
      </Provider>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
