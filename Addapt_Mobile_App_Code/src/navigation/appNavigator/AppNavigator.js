/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../../screens/app/Home/Home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DrawerContent from '../../screens/app/DrawerContent/DrawerContent';
import Devices from '../../screens/app/Devices/Devices';
import {perfectSize} from '../../styles/theme';
import Camera from '../../assets/appImages/CCTV.svg';
import CameraGreen from '../../assets/appImages/CameraGreen.svg';
import EventIcon from '../../assets/appImages/EventIcon.svg';
import GreenEventIcon from '../../assets/appImages/GreenEventIcon.svg';
import Setting from '../../assets/appImages/Setting.svg';
import Library from '../../assets/appImages/Library.svg';
import LibraryGreen from '../../assets/appImages/LibraryGreen.svg';
import Analytics from '../../assets/appImages/Analytics.svg';
import AnalyticsGreen from '../../assets/appImages/AnalyticsGreen.svg';
import Faces from '../../assets/appImages/Faces.svg';
import LiveIcon from '../../assets/appImages/LiveIcon.svg';
import LiveGreen from '../../assets/appImages/LiveGreen.svg';
import VideoPlay from '../../assets/appImages/VideoPlay.svg';
import VideoPlayGreen from '../../assets/appImages/VideoPlayGreen.svg';
import HomeIcon from '../../assets/appImages/HomeWhite.svg';
import GreenHome from '../../assets/appImages/GreenHome.svg';
import {color} from '../../config/color';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_BOLD,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../styles/typography';
import {responsiveScale} from '../../styles/mixins';
import LinearGradient from 'react-native-linear-gradient';
import LiveViewScreen from '../../screens/app/LiveView/LiveViewScreen';
import SettingScreen from '../../screens/app/SettingScreen/SettingScreen';
import EventsScreen from '../../screens/app/EventsScreen/EventsScreen';
import Events from '../../screens/app/Events/Events';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CameraView from '../../screens/app/LiveCameraView/CameraView';
import AddSetUpDevice from '../../screens/app/AddSetUpDevice/AddSetUpDevice';
import AddCameraDevice from '../../screens/app/AddCameraDevice/AddCameraDevice';
import AddDevice from '../../screens/app/AddDevice/AddDevice';
import FamilyFacesScreen from '../../screens/app/FamilyFaces/FamilyFacesScreen';
import AddPeopleScreen from '../../screens/app/AddPeople/AddPeopleScreen';
import LibraryScreen from '../../screens/app/Library/LibraryScreen';
import EventRecording from '../../screens/app/SettingScreen/EventRecording';
import Notifications from '../../screens/app/SettingScreen/Notifications';
import SchedulesAutomation from '../../screens/app/SettingScreen/SchedulesAutomation';
import SharingScreen from '../../screens/app/SettingScreen/SharingScreen';
import CreateShare from '../../screens/app/SettingScreen/CreateShare';
import Account from '../../screens/app/Account/Account';
import FilterScreen from '../../screens/app/FilterScreen/FilterScreen';
import AdapptSupport from '../../screens/app/Account/AdapptSupport';
import ResetPassword from '../../screens/auth/ResetPassword/ResetPassword';
import NewPassword from '../../screens/auth/ResetPassword/NewPassword';
import useAuthorizedSession from '../../hooks/useAuthorizedSession';
import ShareDeviceScreen from '../../screens/app/ShareDevice/ShareDeviceScreen';
import AddShareDevice from '../../screens/app/AddShareDevice/AddShareDevice';
import ReportScreen from '../../screens/app/Report/ReportScreen';
import GridViewScreen from '../../screens/app/GridViewScreen/GridViewScreen';
import AnalyticsScreen from '../../screens/app/Analytics/AnalyticsScreen';
import SubscriptionScreen from '../../screens/app/Subscription/SubscriptionScreen';
import WifiScan from '../../screens/app/WifiScan/WifiScan';
import LogHistoryScreen from '../../screens/app/ShareDevice/LogHistoryScreen';
import io from 'socket.io-client';
import NotificationScreen from '../../screens/app/Notification/NotificationScreen';
import {getInAppNotificationData} from '../../resources/baseServices/auth';
import {setNotificationData} from '../../store/devicesReducer';
import {useDispatch} from 'react-redux';
import {SOCKET_URL} from '../../constants/baseApi';
import NotificationSetting from '../../screens/app/Notification/NotificationSetting';
import ScanDevice from '../../screens/app/AddDeviceForwebRTC/ScanDevice';
import SelectWifi from '../../screens/app/AddDeviceForwebRTC/SelectWifi';
import GeneratedQRCode from '../../screens/app/AddDeviceForwebRTC/GeneratedQRCode';
import AddNewDevice from '../../screens/app/AddDeviceForwebRTC/AddNewDevice';
import ConfigureNotification from '../../screens/app/Notification/ConfigureNotification';
import WifiPassword from '../../screens/app/AddDeviceForwebRTC/WifiPassword';
const AppStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch();

  const [authToken, isInitializing, userDetails, devices, first_launch] =
    useAuthorizedSession();

  const socket = io(SOCKET_URL);
  useEffect(() => {
    // Connect to the Socket.IO server

    // Listen for a custom event from the server
    // console.log('userDetails?.userId',userDetails?.userId);
    socket.on(userDetails?.userId, data => {
      console.log('Received data:', data);
      getNotificationData();
      // Handle the data received from the server
    });

    // Emit a custom event to the server
    // socket.emit([userDetails?.userId], {message: 'New notification found'});

    // Close the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const getNotificationData = async () => {
    try {
      const getData = await getInAppNotificationData(userDetails?.email);
      console.log('getNotificationData from socket', getData);
      const res = getData.data.data;
      if (res) {
        dispatch(setNotificationData(res));
      }
    } catch (error) {
      console.log('eee', error);
    }
  };

  return (
    <NavigationContainer>
      <AppStack.Navigator initialRouteName={'DrawerNavigator'}>
        <AppStack.Screen
          name="Home"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Events"
          component={Events}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="CameraView"
          component={CameraView}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddDevice"
          component={AddDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddCameraDevice"
          component={AddCameraDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddSetUpDevice"
          component={AddSetUpDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddPeopleScreen"
          component={AddPeopleScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="EventRecording"
          component={EventRecording}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Notifications"
          component={Notifications}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="SchedulesAutomation"
          component={SchedulesAutomation}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="SharingScreen"
          component={SharingScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="CreateShare"
          component={CreateShare}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="Account"
          component={Account}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="LibraryScreen"
          component={LibraryScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="FamilyFacesScreen"
          component={FamilyFacesScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="FilterScreen"
          component={FilterScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AdapptSupport"
          component={AdapptSupport}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="NewPassword"
          component={NewPassword}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="ShareDeviceScreen"
          component={ShareDeviceScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddShareDevice"
          component={AddShareDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="ReportScreen"
          component={ReportScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="GridViewScreen"
          component={GridViewScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="SubscriptionScreen"
          component={SubscriptionScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="WifiScan"
          component={WifiScan}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="LogHistoryScreen"
          component={LogHistoryScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="NotificationSetting"
          component={NotificationSetting}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="ConfigureNotification"
          component={ConfigureNotification}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="ScanDevice"
          component={ScanDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AddNewDevice"
          component={AddNewDevice}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="SelectWifi"
          component={SelectWifi}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="WifiPassword"
          component={WifiPassword}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="GeneratedQRCode"
          component={GeneratedQRCode}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="LiveViewScreen"
      screenOptions={{
        drawerStyle: {backgroundColor: 'transparent'},
        headerShown: false,
        drawerType: 'front',
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigation}
      />
    </Drawer.Navigator>
  );
};

const CustomTabBarButton = ({children, onPress}) => {
  return (
    <View
      style={{
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: perfectSize(65),
          height: perfectSize(65),
          borderRadius: 40,
          borderWidth: 10,
          borderColor: color.GREEN,
          backgroundColor: color.GREEN,
        }}>
        {children}
      </TouchableOpacity>
    </View>
  );
};

const BottomTabNavigation = ({navigation}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const tabBarHeight = perfectSize(56) + safeAreaInsets.bottom;
  const [authToken, isInitializing, userDetails, devices, first_launch] =
    useAuthorizedSession();
  const initialRouteName = devices ? 'LiveViewScreen' : 'Home';

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        tabBarStyle: {
          height: tabBarHeight,
          backgroundColor: color.GREEN,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          paddingHorizontal: 5,
          paddingBottom: 5 + safeAreaInsets.bottom,
        },
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: color.WHITE,
                fontFamily: focused ? TTNORMSPRO_BOLD : TTNORMSPRO_REGULAR,
                fontWeight: focused ? FONT_WEIGHT_BOLD : FONT_WEIGHT_LIGHT,
                fontSize: responsiveScale(12),
                includeFontPadding: false,
              }}>
              Home
            </Text>
          ),
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* {focused ? (
                  <View
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: color.WHITE,
                    }}>
                    <LinearGradient
                      colors={['#FFFFFF59', '#FFFFFF00']}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={{
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'hidden',
                        }}>
                        <HomeIcon />
                      </View>
                    </LinearGradient>
                  </View>
                ) : ( */}
                <View
                  style={{
                    backgroundColor: focused ? color.WHITE : 'transparent',
                    overflow: 'hidden',
                    borderTopWidth: focused ? responsiveScale(3) : 0,
                    borderTopColor: color.LIGHT_GREEN_5,
                    borderBottomLeftRadius: responsiveScale(20),
                    borderBottomRightRadius: responsiveScale(20),
                    paddingTop: responsiveScale(5),
                    paddingBottom: responsiveScale(4),
                    paddingHorizontal: responsiveScale(8),
                  }}>
                  {focused ? <GreenHome /> : <HomeIcon />}
                </View>
                {/* )} */}
              </>
            );
          },
        }}
        name={'Home'}
        component={Home}
      />
      {!userDetails?.viewOnly && (
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: color.WHITE,
                  fontFamily: focused ? TTNORMSPRO_BOLD : TTNORMSPRO_REGULAR,
                  fontWeight: focused ? FONT_WEIGHT_BOLD : FONT_WEIGHT_LIGHT,
                  fontSize: responsiveScale(12),
                  includeFontPadding: false,
                }}>
                Devices
              </Text>
            ),
            tabBarIcon: ({focused}) => {
              return (
                <>
                  {/* {focused ? (
                  <View
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: color.WHITE,
                    }}>
                    <LinearGradient
                      colors={['#FFFFFF59', '#FFFFFF00']}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={{
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'hidden',
                        }}>
                        <Camera />
                      </View>
                    </LinearGradient>
                  </View>
                ) : ( */}
                  <View
                    style={{
                      backgroundColor: focused ? color.WHITE : 'transparent',
                      overflow: 'hidden',
                      borderTopWidth: focused ? responsiveScale(3) : 0,
                      borderTopColor: color.LIGHT_GREEN_5,
                      borderBottomLeftRadius: responsiveScale(20),
                      borderBottomRightRadius: responsiveScale(20),
                      paddingTop: responsiveScale(5),
                      paddingBottom: responsiveScale(4),
                      paddingHorizontal: responsiveScale(8),
                    }}>
                    {focused ? <CameraGreen /> : <Camera />}
                  </View>
                  {/* )} */}
                </>
              );
            },
          }}
          name={'Devices'}
          component={Devices}
        />
      )}
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: color.WHITE,
                fontFamily: focused ? TTNORMSPRO_BOLD : TTNORMSPRO_REGULAR,
                fontWeight: focused ? FONT_WEIGHT_BOLD : FONT_WEIGHT_LIGHT,
                fontSize: responsiveScale(12),
                textAlign: 'center',
                marginTop: responsiveScale(3),
                includeFontPadding: false,
              }}>
              Live
            </Text>
          ),
          tabBarIcon: ({focused}) => {
            return (
              // <View
              //   style={{
              //     marginTop: -20,
              //     backgroundColor: color.GREEN,
              //     borderTopLeftRadius: 50,
              //     borderTopRightRadius: 50,
              //     paddingHorizontal: 10,
              //   }}>
              //   {!focused ? (
              //     <View
              //       style={{
              //         marginTop: 10,
              //       }}>
              //       <LinearGradient
              //         colors={['#FFFFFF4D', '#FFFFFF00']}
              //         start={{x: 0, y: 0}}
              //         end={{x: 0, y: 1}}
              //         style={{
              //           borderRadius: 30,
              //           padding: 13,
              //         }}>
              //         <LiveIcon />
              //       </LinearGradient>
              //     </View>
              //   ) : (
              //     <View
              //       style={{
              //         marginTop: 10,
              //         backgroundColor: color.WHITE,
              //         borderRadius: 30,
              //         padding: 13,
              //         shadowColor: '#00000029',
              //         shadowOffset: {width: 0, height: 4},
              //         shadowOpacity: 1,
              //         shadowRadius: 15,
              //         elevation: 4,
              //       }}>
              //       <LiveGreen />
              //     </View>
              //   )}
              // </View>
              <View
                style={{
                  backgroundColor: focused ? color.WHITE : 'transparent',
                  overflow: 'hidden',
                  borderTopWidth: focused ? responsiveScale(3) : 0,
                  borderTopColor: color.LIGHT_GREEN_5,
                  borderBottomLeftRadius: responsiveScale(20),
                  borderBottomRightRadius: responsiveScale(20),
                  paddingTop: responsiveScale(5),
                  paddingBottom: responsiveScale(4),
                  paddingHorizontal: responsiveScale(8),
                }}>
                {focused ? <VideoPlayGreen /> : <VideoPlay />}
              </View>
              //    <View
              //    style={{
              //      backgroundColor: focused ? color.WHITE : 'transparent',
              //      overflow: 'hidden',
              //      borderTopWidth: focused ? responsiveScale(3) : 0,
              //      borderTopColor: color.LIGHT_GREEN_5,
              //      borderBottomLeftRadius: responsiveScale(20),
              //      borderBottomRightRadius: responsiveScale(20),
              //      // paddingTop: responsiveScale(5),
              //      paddingBottom: responsiveScale(4),
              //      paddingHorizontal: responsiveScale(8),
              //    }}>
              //    <View
              //      style={{
              //        height: responsiveScale(24),
              //        width: responsiveScale(24),
              //        padding: responsiveScale(1),
              //      }}>
              //      {focused ? (
              //        <VideoPlayGreen height={'100%'} width={'100%'} />
              //      ) : (
              //        <VideoPlay height={'100%'} width={'100%'} />
              //      )}
              //    </View>
              //  </View>
            );
          },
          // tabBarButton: CustomTabBarButton,
        }}
        name={'LiveViewScreen'}
        component={LiveViewScreen}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: color.WHITE,
                fontFamily: focused ? TTNORMSPRO_BOLD : TTNORMSPRO_REGULAR,
                fontWeight: focused ? FONT_WEIGHT_BOLD : FONT_WEIGHT_LIGHT,
                fontSize: responsiveScale(12),
                includeFontPadding: false,
              }}>
              Events
            </Text>
          ),
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* {focused ? (
                  <View
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: color.WHITE,
                    }}>
                    <LinearGradient
                      colors={['#FFFFFF59', '#FFFFFF00']}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={{
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'hidden',
                        }}>
                        <EventIcon />
                      </View>
                    </LinearGradient>
                  </View>
                ) : ( */}
                {/* <View
                    style={{
                      backgroundColor: 'transparent',
                      overflow: 'hidden',
                      borderTopWidth: 3,
                      borderTopColor: color.GREEN,
                    }}>
                    <EventIcon />
                  </View> */}
                <View
                  style={{
                    backgroundColor: focused ? color.WHITE : 'transparent',
                    overflow: 'hidden',
                    borderTopWidth: focused ? responsiveScale(3) : 0,
                    borderTopColor: color.LIGHT_GREEN_5,
                    borderBottomLeftRadius: responsiveScale(20),
                    borderBottomRightRadius: responsiveScale(20),
                    paddingTop: responsiveScale(5),
                    paddingBottom: responsiveScale(4),
                    paddingHorizontal: responsiveScale(8),
                  }}>
                  {focused ? <GreenEventIcon /> : <EventIcon />}
                </View>
                {/* )} */}
              </>
            );
          },
        }}
        name={'EventsScreen'}
        component={EventsScreen}
      />
      {/* <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                color: color.WHITE,
                fontFamily: TTNORMSPRO_REGULAR,
                fontWeight: focused ? FONT_WEIGHT_MEDIUM : FONT_WEIGHT_LIGHT,
                fontSize: responsiveScale(12),
              }}>
              Settings
            </Text>
          ),
          tabBarIcon: ({focused}) => {
            return (
              <>
                {focused ? (
                  <View
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: color.WHITE,
                    }}>
                    <LinearGradient
                      colors={['#FFFFFF59', '#FFFFFF00']}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={{
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'hidden',
                        }}>
                        <Setting />
                      </View>
                    </LinearGradient>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      overflow: 'hidden',
                      borderTopWidth: 3,
                      borderTopColor: color.GREEN,
                    }}>
                    <Setting />
                  </View>
                )}
              </>
            );
          },
        }}
        name={'SettingScreen'}
        component={SettingScreen}
      /> */}
      {!userDetails?.viewOnly && (
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarLabel: ({focused}) => (
              <Text
                style={{
                  color: color.WHITE,
                  fontFamily: focused ? TTNORMSPRO_BOLD : TTNORMSPRO_REGULAR,
                  fontWeight: focused ? FONT_WEIGHT_BOLD : FONT_WEIGHT_LIGHT,
                  fontSize: responsiveScale(12),
                  includeFontPadding: false,
                }}>
                Analytics
              </Text>
            ),
            tabBarIcon: ({focused}) => {
              return (
                <>
                  {/* {focused ? (
                  <View
                    style={{
                      borderTopWidth: 3,
                      borderTopColor: color.WHITE,
                    }}>
                    <LinearGradient
                      colors={['#FFFFFF59', '#FFFFFF00']}
                      start={{x: 1, y: 1}}
                      end={{x: 1, y: 0}}
                      style={{
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        paddingTop: 8,
                        paddingBottom: 5,
                        paddingHorizontal: 8,
                      }}>
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          overflow: 'hidden',
                        }}>
                        <Library />
                      </View>
                    </LinearGradient>
                  </View>
                ) : ( */}
                  <View
                    style={{
                      backgroundColor: focused ? color.WHITE : 'transparent',
                      overflow: 'hidden',
                      borderTopWidth: focused ? responsiveScale(3) : 0,
                      borderTopColor: color.LIGHT_GREEN_5,
                      borderBottomLeftRadius: responsiveScale(20),
                      borderBottomRightRadius: responsiveScale(20),
                      paddingTop: responsiveScale(5),
                      paddingBottom: responsiveScale(4),
                      paddingHorizontal: responsiveScale(8),
                    }}>
                    {focused ? <AnalyticsGreen /> : <Analytics />}
                  </View>
                  {/* )} */}
                </>
              );
            },
          }}
          name={'AnalyticsScreen'}
          component={AnalyticsScreen}
        />
      )}
    </Tab.Navigator>
  );
};
