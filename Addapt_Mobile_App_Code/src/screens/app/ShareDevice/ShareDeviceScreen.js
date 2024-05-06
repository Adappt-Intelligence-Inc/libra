import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';
import ProfileAdd from '../../../assets/appImages/ProfileAdd.svg';
import ClockGrey from '../../../assets/appImages/ClockGrey.svg';
import CalenderGrey from '../../../assets/appImages/CalenderGrey.svg';
import Frame3 from '../../../assets/appImages/Frame3.svg';
import {responsiveScale} from '../../../styles/mixins';
import {perfectSize} from '../../../styles/theme';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
} from '../../../styles/typography';
import {CommonStyle} from '../../../config/styles';
import {getInviteesList} from '../../../resources/baseServices/auth';
import {setInviteesListAction} from '../../../store/devicesReducer';
import {useDispatch, useSelector} from 'react-redux';

const ShareDeviceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const inviteesList = useSelector(state => state?.devices?.inviteesList ?? {});
  const [loading, setLoading] = useState(false);
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getInvitees();
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const getInvitees = async () => {
    setLoading(true);
    try {
      const getList = await getInviteesList(userDetails?.email);
      console.log('getInviteesList', getList);
      const family = getList.data.data || [];
      if (getList?.status === 200) {
        dispatch(setInviteesListAction(family));
        setLoading(false);
      } else {
        dispatch(setInviteesListAction([]));
        setLoading(false);
      }
    } catch (error) {
      console.log('error', error);
      dispatch(setInviteesListAction([]));
      setLoading(false);
    }
  };

  const getCameraName = accessibleIPCameras => {
    const data = devicesList.filter(item =>
      accessibleIPCameras?.includes(item._id),
    );
    const roomNames = data.map(item => item.deviceDetails.name).join(', ');
    return roomNames;
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <View style={styles.renderMainView}>
          <Text style={[CommonStyle.blackText14, {paddingHorizontal: 15}]}>
            {item?.phoneNumber || item?.email}
          </Text>
          <Text
            style={[
              CommonStyle.smallGreyText,
              {marginTop: 10, paddingHorizontal: 15},
            ]}>
            {/* {item?.deviceData?.deviceDetails?.alias} */}
            {getCameraName(item?.accessibleIPCameras)}
          </Text>
          <View style={styles.border} />
          <View style={[CommonStyle.row, {paddingHorizontal: 15}]}>
            <View style={[{width: '47%'}]}>
              <Text style={[CommonStyle.smallGreyText]}>{'Location :'}</Text>
              <Text style={[CommonStyle.mediumBlackText]}>
                {item?.deviceData?.deviceDetails?.location}
              </Text>
            </View>
            <View style={[{width: '47%'}]}>
              <Text style={[CommonStyle.smallGreyText]}>{'Access type :'}</Text>
              <Text style={[CommonStyle.mediumBlackText]}>
                {item?.viewOnly ? 'View only' : 'Admin'}
              </Text>
            </View>
          </View>
          {(item.time || item.date) && (
            <View style={[CommonStyle.row, {marginTop: 15}]}>
              {item.time && (
                <View style={[styles.timeContainer, {width: '47%'}]}>
                  <View style={styles.iconView}>
                    <ClockGrey height="100%" width="100%" />
                  </View>
                  <Text
                    style={[CommonStyle.text, {fontSize: responsiveScale(10)}]}>
                    {item.time}
                  </Text>
                </View>
              )}
              {item.date && (
                <View style={styles.timeContainer}>
                  <View style={styles.iconView}>
                    <CalenderGrey height="100%" width="100%" />
                  </View>
                  <Text
                    style={[CommonStyle.text, {fontSize: responsiveScale(10)}]}>
                    {item.date}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerView}>
        <CustomHeader
          title={'Sharing camera'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
          isLogHistoryIconVisible={true}
          onLogHistoryIconPress={() => {
            navigation.navigate('LogHistoryScreen');
          }}
        />
      </View>

      <CategoryItem
        DeviceName={'Share device to other users'}
        onPress={() => {
          navigation.navigate('AddShareDevice');
        }}
        isIcon={true}
        icon={<ProfileAdd />}
        extraItemViewStyle={styles.extraItemStyle}
        extraItemTextStyle={{color: color.WHITE}}
      />
      {inviteesList.length > 0 && (
        <View
          style={[
            CommonStyle.row,
            {paddingHorizontal: 20, marginVertical: 20},
          ]}>
          <Text style={styles.familierFacesText}>People with access</Text>
        </View>
      )}
      <View style={styles.flatListView}>
        <FlatList
          data={inviteesList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={styles.mainView}>
                {loading && <ActivityIndicator color={color.GREEN} />}
                <View style={styles.notFoundImage}>
                  <Frame3 height="100%" width="100%" />
                </View>
                <Text style={CommonStyle.title}>No Invitees</Text>
                <Text
                  style={[
                    CommonStyle.text,
                    {textAlign: 'center', width: '80%', marginTop: 10},
                  ]}>
                  Now you don’t have invitees. You have to invite user
                </Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ShareDeviceScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: color.WHITE,
  },
  headerView: {
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  extraItemStyle: {
    backgroundColor: color.GREEN,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  familierFacesText: {
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
  },
  flatListView: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingHorizontal: 20,
    height: perfectSize(80),
  },
  renderMainView: {
    marginBottom: 20,
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 20,
    // paddingHorizontal: 15,
  },
  iconView: {
    height: responsiveScale(18),
    width: responsiveScale(18),
    marginRight: 5,
  },
  timeContainer: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notFoundImage: {
    width: perfectSize(254),
    height: perfectSize(188),
    alignSelf: 'center',
    marginVertical: 20,
  },
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 50,
  },
  border: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: color.LIGHT_GRAY_4,
    marginVertical: 5,
    marginBottom: 10,
  },
});
