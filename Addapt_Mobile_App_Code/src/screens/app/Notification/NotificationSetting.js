import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonStyle} from '../../../config/styles';
import CustomHeader from '../../../components/CustomHeader';
import {color} from '../../../config/color';
import DatePicker from 'react-native-date-picker';
import {useSelector} from 'react-redux';
import Button from '../../../components/Button';
import {responsiveScale} from '../../../styles/mixins';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  getNotificationSettingsData,
  turnOffNotificationTill,
} from '../../../resources/baseServices/auth';
import {CustomeToast} from '../../../components/CustomeToast';
import AngleRight from '../../../assets/appImages/AngleRight.svg';

const NotificationSetting = ({navigation}) => {
  const {bottom} = useSafeAreaInsets();
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const data = [
    'For 30 min',
    'For 1 hour',
    'Until tomorrow morning',
    'Until I turn it back on',
    'Custom',
  ];

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
      setNotifications(res?.notifications);
    } catch (error) {
      console.log('eee', error);
    }
  };

  const onTurnOffNotification = async () => {
    setIsLoading(true);
    try {
      const data = {
        status: true,
        email: userDetails?.email,
        userId: userDetails?.userId,
        notifications: notifications,
        endTime: getTime(selectedIndex),
        pushNotificationStatus: true,
      };
      const res = await turnOffNotificationTill(data);
      console.log('turnOffNotificationTill res', res);
      if (res?.status === 200) {
        CustomeToast({type: 'success', message: res?.data?.msg});
        setIsLoading(false);
        // navigation.goBack();
      }
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
      CustomeToast({type: 'error', message: error?.response?.data?.err});
    }
  };
  const currentDate = new Date();

  const getCurrentTimeFormatted = date => {
    const now = date;
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const getTime = key => {
    switch (key) {
      case 0:
        const next30MinDate = new Date(currentDate.getTime() + 30 * 60000);
        return getCurrentTimeFormatted(next30MinDate);
      case 1:
        const next1HourDate = new Date(currentDate.getTime() + 60 * 60000);
        return getCurrentTimeFormatted(next1HourDate);
      case 2:
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(6);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        return getCurrentTimeFormatted(currentDate);
      case 3:
        return '2024-03-19T14:55:00';
      case 4:
        return getCurrentTimeFormatted(new Date(selectedDate));
      default:
        return '2030-03-19T14:55:00';
    }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Notification settings'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingVertical: 20}}>
        <Text style={[CommonStyle.text, {marginBottom: 20}]}>
          Configure notification setting
        </Text>
        <TouchableOpacity
          style={[styles.topCardContainer]}
          onPress={() => {
            navigation.navigate('ConfigureNotification', {
              date: getTime(selectedIndex),
            });
          }}>
          <Text style={[CommonStyle.blackText14]}>
            {'Configure Notification'}
          </Text>
          <AngleRight />
        </TouchableOpacity>

        <Text style={[CommonStyle.text, {marginBottom: 20}]}>
          Turn off notification
        </Text>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                styles.cardContainer,
                index === selectedIndex && {
                  borderColor: color.LIGHT_GREEN_5,
                  backgroundColor: color.LIGHT_GREEN_6,
                },
              ]}
              onPress={() => {
                setSelectedIndex(index);
                if (index === 4) {
                  setDateOpen(true);
                }
              }}>
              <Text
                style={[
                  CommonStyle.blackText14,
                  index === selectedIndex && {
                    color: color.GREEN,
                  },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {selectedIndex !== null && (
        <Button
          name={'Save'}
          extraBtnViewStyle={[
            styles.extraBtnViewStyle,
            {marginBottom: bottom + 20},
          ]}
          extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          onPress={() => {
            onTurnOffNotification();
          }}
          isLoading={isLoading}
        />
      )}
      <DatePicker
        modal
        mode={'datetime'}
        open={dateOpen}
        date={selectedDate}
        onConfirm={date => {
          console.log('date', date);
          setSelectedDate(date);
          setDateOpen(false);
        }}
        onCancel={() => {
          setDateOpen(false);
        }}
        title={'Turn off notification until'}
        minimumDate={new Date()}
      />
    </View>
  );
};

export default NotificationSetting;

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: color.LIGHT_BLACK_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: responsiveScale(50),
    justifyContent: 'center',
  },
  topCardContainer: {
    borderColor: color.LIGHT_GREEN_8,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 40,
    backgroundColor: color.LIGHT_GREEN_13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveScale(50),
  },
  extraBtnViewStyle: {width: '40%'},
});
