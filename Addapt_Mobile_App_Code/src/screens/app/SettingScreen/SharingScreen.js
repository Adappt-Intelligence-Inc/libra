import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../../components/CustomHeader';
import CategoryItem from '../../../components/CategoryItem';
import {color} from '../../../config/color';
import ProfileAdd from '../../../assets/appImages/ProfileAdd.svg';
import Face1 from '../../../assets/appImages/Face1.svg';
import {WINDOW_WIDTH, responsiveScale} from '../../../styles/mixins';
import {colors, perfectSize} from '../../../styles/theme';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {CommonStyle} from '../../../config/styles';

const SharingScreen = ({navigation}) => {
  //   const width = (deviceWidth - 3 * perfectSize(15)) / 2;
  const FamilyFaces = [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}];

  const renderItem = ({item}) => {
    return (
      <>
        <View style={styles.renderMainView}>
          <View style={styles.imageView}>
            <Text style={{color: color.GREEN}}>KD</Text>
          </View>
          <View>
            <Text style={CommonStyle.text}>
              Contact :{' '}
              <Text
                style={{
                  color: color.DARK_GRAY_5,
                  fontFamily: TTNORMSPRO_MEDIUM,
                }}>
                96958 69555
              </Text>
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerView}>
        <CustomHeader
          title={'Sharing'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
      </View>

      <CategoryItem
        DeviceName={'Share device to other users'}
        onPress={() => {
          navigation.navigate('CreateShare');
        }}
        isIcon={true}
        icon={<ProfileAdd />}
        extraItemViewStyle={styles.extraItemStyle}
        extraItemTextStyle={{color: color.WHITE}}
      />
      <Text style={styles.familierFacesText}>People with access</Text>
      <View style={styles.flatListView}>
        <FlatList
          data={FamilyFaces}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default SharingScreen;

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
    fontSize: responsiveScale(18),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
    paddingTop: 10,
    color: color.DARK_GRAY_5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  flatListView: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingHorizontal: 20,
  },
  renderMainView: {
    marginBottom: 20,
    height: perfectSize(68),
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  imageView: {
    width: perfectSize(44),
    height: perfectSize(44),
    borderRadius: perfectSize(44),
    backgroundColor: color.LIGHT_GREEN_5,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
