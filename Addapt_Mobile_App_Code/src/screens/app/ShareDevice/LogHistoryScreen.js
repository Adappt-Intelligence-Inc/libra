import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {color} from '../../../config/color';
import {CommonStyle} from '../../../config/styles';
import {useSelector} from 'react-redux';
import Frame3 from '../../../assets/appImages/Frame3.svg';
import {perfectSize} from '../../../styles/theme';
import moment from 'moment';

const LogHistoryScreen = ({navigation}) => {
  const inviteesList = useSelector(state => state?.devices?.inviteesList ?? {});

  const renderItem = ({item, index}) => {
    return (
      <>
        <View style={styles.renderMainView}>
          <Text style={[CommonStyle.blackTitle]}>
            {item?.phoneNumber || item?.email}
          </Text>
          <Text style={[CommonStyle.regularGreyText]}>
            Login :{' '}
            {item?.lastLoginTime
              ? moment(new Date(item?.lastLoginTime)).format('Do MMM, YYYY')
              : '      - -'}
          </Text>
        </View>
      </>
    );
  };
  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <CustomHeader
        title={'Logs History'}
        isBackBtnVisible={true}
        onPressBackBtn={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.flatListView}>
        <FlatList
          data={inviteesList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          ListEmptyComponent={() => {
            return (
              <View style={styles.mainView}>
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

export default LogHistoryScreen;

const styles = StyleSheet.create({
  renderMainView: {
    marginBottom: 20,
    borderColor: color.LIGHT_GREEN_5,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  flatListView: {
    flex: 1,
    backgroundColor: color.WHITE,
    marginTop: 30,
    height: perfectSize(80),
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
});
