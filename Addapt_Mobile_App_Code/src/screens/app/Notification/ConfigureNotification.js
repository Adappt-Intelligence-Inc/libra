import {
  FlatList,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import CustomHeader from '../../../components/CustomHeader';
import {
  getInAppNotificationData,
  getNotificationSettingsData,
  markReadAllNotification,
  turnOffNotificationTill,
} from '../../../resources/baseServices/auth';
import {useDispatch, useSelector} from 'react-redux';
import {color} from '../../../config/color';
import {setNotificationData} from '../../../store/devicesReducer';
import moment from 'moment';
import CheckBox from '../../../assets/appImages/CheckBox.svg';
import CheckBoxBlank from '../../../assets/appImages/CheckBoxBlank.svg';
import {perfectSize} from '../../../styles/theme';
import {responsiveScale} from '../../../styles/mixins';
import CategoryItem from '../../../components/CategoryItem';
import Button from '../../../components/Button';
import {CustomeToast} from '../../../components/CustomeToast';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ConfigureNotification = ({navigation, route}) => {
  const dispatch = useDispatch();

  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const toggleSwitchExpansion = (id, value) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleSwitch(id);
  };
  const [selectedData, setSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {date} = route?.params;
  useEffect(() => {
    const data = devicesList.map(item => {
      return {
        streamName: item?.deviceDetails?.streamName,
        events: [],
        isEnabled: false,
      };
    });
    setSelectedData(data);
  }, []);

  const data = ['PET', 'PACKAGE', 'VEHICLE', 'PEOPLE'];

  const toggleSwitch = id => {
    const updatedData = selectedData.map(item => {
      if (item.streamName === id) {
        return {...item, isEnabled: !item.isEnabled};
      }
      return item;
    });
    setSelectedData(updatedData);
  };

  const updateIsEnabledAndEvents = (id, eventData) => {
    const updatedData = selectedData.map(item => {
      if (item.streamName === id) {
        if (item.events.includes(eventData)) {
          return {
            ...item,
            isEnabled: true,
            events: item.events.filter(event => event !== eventData),
          };
        } else {
          return {
            ...item,
            isEnabled: true,
            events: [...item.events, eventData],
          };
        }
      }
      return item;
    });
    setSelectedData(updatedData);
  };

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getNotificationSetting();
      },
    );

    return getDashBoardAPIListener;
  }, [navigation]);

  const getNotificationSetting = async () => {
    try {
      const getData = await getNotificationSettingsData(
        userDetails?.userId,
        userDetails?.email,
      );
      const res = getData.data.data;
      const result = devicesList.map(item => ({
        events:
          res?.notifications.find(
            obj => obj.streamName === item.deviceDetails.streamName,
          )?.events || [],
        isEnabled: res?.notifications.some(
          obj => obj.streamName === item.deviceDetails.streamName,
        ),
        streamName: item.deviceDetails.streamName,
      }));
      setSelectedData(result);
    } catch (error) {
      console.log('eee', error);
    }
  };

  const onPressSave = async () => {
    setIsLoading(true);
    const transformedData = selectedData
      .filter(item => item.isEnabled)
      .map(item => ({
        streamName: item.streamName,
        events: item.events,
      }));

    try {
      const data = {
        status: true,
        email: userDetails?.email,
        userId: userDetails?.userId,
        notifications: transformedData,
        endTime: date,
        pushNotificationStatus: true,
      };
      const res = await turnOffNotificationTill(data);
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data?.msg});
        setIsLoading(false);
        // navigation.navigate('NotificationScreen');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      CustomeToast({type: 'error', message: error?.response?.data?.err});
    }
  };

  const getDeviceName = streamName => {
    const deviceName = devicesList.find(
      device => device?.deviceDetails?.streamName === streamName,
    )?.deviceDetails.name;
    return deviceName;
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Configure Notification'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
        <FlatList
          data={selectedData}
          renderItem={({item}) => {
            return (
              <View style={{marginBottom: 20}}>
                <CategoryItem
                  DeviceName={getDeviceName(item?.streamName)}
                  isSwitchVisible={true}
                  isSwithOn={item?.isEnabled}
                  extraItemViewStyle={[
                    item?.isEnabled && styles.expandSwitchContainer,
                  ]}
                  onSwitchChange={value =>
                    toggleSwitchExpansion(item?.streamName, value)
                  }
                />
                {item?.isEnabled && (
                  <View style={[styles.expandContainer]}>
                    {data.map(item1 => {
                      return (
                        <View style={styles.item}>
                          <TouchableOpacity
                            style={styles.checkboxButton}
                            onPress={() => {
                              updateIsEnabledAndEvents(item?.streamName, item1);
                            }}>
                            {item?.events.includes(item1) ? (
                              <CheckBox height={'100%'} width={'100%'} />
                            ) : (
                              <CheckBoxBlank height={'100%'} width={'100%'} />
                            )}
                          </TouchableOpacity>
                          <Text
                            style={[
                              CommonStyle.smallGreyText,
                              {textTransform: 'capitalize'},
                            ]}>
                            {item1} detection
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
        <Button
          name={'Save'}
          extraBtnViewStyle={[styles.extraBtnViewStyle]}
          extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          onPress={() => {
            onPressSave();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ConfigureNotification;

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  mainView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  notFoundImage: {
    width: perfectSize(254),
    height: perfectSize(188),
    alignSelf: 'center',
    marginBottom: 20,
  },
  subContent: {textAlign: 'center', marginHorizontal: 20, paddingTop: 20},
  petaContent: {textAlign: 'center', marginHorizontal: 40},
  expandContainer: {
    padding: 15,
    borderWidth: 1,
    borderTopColor: color.LIGHT_GRAY_4,
    borderLeftColor: color.LIGHT_GREEN_5,
    borderRightColor: color.LIGHT_GREEN_5,
    borderBottomColor: color.LIGHT_GREEN_5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 0,
  },
  expandSwitchContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '49%',
    marginBottom: 15,
  },
  checkboxButton: {
    marginRight: 5,
    width: responsiveScale(20),
    height: responsiveScale(20),
  },
  extraBtnViewStyle: {width: '40%'},
});
