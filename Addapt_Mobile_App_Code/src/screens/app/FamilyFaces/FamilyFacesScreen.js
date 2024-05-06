import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
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
import AddIcon from '../../../assets/appImages/AddIcon.svg';
import Face1 from '../../../assets/appImages/Face1.svg';
import GreenEdit from '../../../assets/appImages/GreenEdit.svg';
import RedDelete from '../../../assets/appImages/RedDelete.svg';
import Close from '../../../assets/appImages/Close.svg';
import DeleteFrame from '../../../assets/appImages/DeleteFrame.svg';
import ProfileCircle from '../../../assets/appImages/ProfileCircle.svg';
import Frame3 from '../../../assets/appImages/Frame3.svg';
import {WINDOW_WIDTH, responsiveScale} from '../../../styles/mixins';
import {perfectSize} from '../../../styles/theme';
import {
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../../../styles/typography';
import {CommonStyle} from '../../../config/styles';
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {
  deleteUserFaceAWS,
  getRecognisedUsersList,
} from '../../../resources/baseServices/auth';
import {setFamilyFacesListAction} from '../../../store/devicesReducer';
import DeleteModal from '../../../components/DeleteModal';
import {CustomeToast} from '../../../components/CustomeToast';

const FamilyFacesScreen = ({navigation}) => {
  //   const width = (deviceWidth - 3 * perfectSize(15)) / 2;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [selectedFace, setSelectedFace] = useState(null);
  const [editName, setEditName] = useState('');
  const [errorImageIndices, setErrorImageIndices] = useState([]);
  // const [familyFaces, setFamilyFaces] = useState([]);
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const familyFaces = useSelector(
    state => state?.devices?.familyFacesList ?? [],
  );
  const devicesList = useSelector(state => state?.devices?.devicesList ?? []);
  const locationList = useSelector(state => state?.devices?.locationList ?? []);

  const dispatch = useDispatch();
  // const FamilyFaces = [
  //   {id: '1', image: <Face1 width="100%" height="100%" />},
  //   {id: '2', image: <Face1 width="100%" height="100%" />},
  //   {id: '3', image: <Face1 width="100%" height="100%" />},
  //   {id: '4', image: <Face1 width="100%" height="100%" />},
  //   {id: '5', image: <Face1 width="100%" height="100%" />},
  // ];

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        getUserList();
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  const handleImageError = index => {
    setErrorImageIndices(prevErrorIndices => [...prevErrorIndices, index]);
  };

  const getUserList = async () => {
    setLoading(true);
    try {
      const getList = await getRecognisedUsersList(userDetails?.email);
      console.log('getList', getList);
      const family = getList.data.data || [];
      if (getList?.status === 200) {
        dispatch(setFamilyFacesListAction(family));
        setLoading(false);
      } else {
        dispatch(setFamilyFacesListAction([]));
        setLoading(false);
      }
    } catch (error) {
      dispatch(setFamilyFacesListAction([]));
      setLoading(false);
    }
  };

  const deleteFace = async () => {
    setBtnLoading(true);
    try {
      const res = await deleteUserFaceAWS(
        userDetails?.email,
        familyFaces[selectedFace]?.name,
        familyFaces[selectedFace]?.faceLocation || [],
        familyFaces[selectedFace]?.device || [],
      );
      if (res?.status === 200) {
        setDeleteModalVisible(false);
        setBtnLoading(false);
        CustomeToast({type: 'success', message: 'Face deleted successfully!'});
        getUserList();
      }
    } catch (error) {
      setDeleteModalVisible(false);
      setBtnLoading(false);
      CustomeToast({type: 'error', message: error?.response?.data?.err});
      getUserList();
    }
  };
  const findLocationById = id => {
    const result = locationList.find(item => item._id === id);
    return result ? result.location : null;
  };
  const findDeviceById = id => {
    const result = devicesList.find(item => item._id === id);
    return result ? result.deviceDetails.name : null;
  };

  const renderItem = ({item, index}) => {
    const isImageError = errorImageIndices.includes(index);
    return (
      <>
        <View style={styles.renderMainView}>
          <View style={[{width: '25%'}]}>
            <View style={styles.imageView}>
              {isImageError ? (
                <ProfileCircle width="70%" height="70%" />
              ) : (
                <Image
                  source={{uri: item?.previewImage}}
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: color.LIGHT_GREEN_7,
                    borderRadius: 8,
                  }}
                  onError={() => handleImageError(index)}
                />
              )}
            </View>
          </View>
          <View style={[{width: '72%'}]}>
            <View style={[CommonStyle.row]}>
              <Text style={styles.nameText}>{item?.name}</Text>
              <View style={[CommonStyle.row, {width: '27%'}]}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  disabled
                  style={[styles.btncontainer, {opacity: 0.3}]}>
                  <GreenEdit />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(true);
                    setSelectedFace(index);
                  }}
                  style={[styles.btncontainer]}>
                  <RedDelete />
                </TouchableOpacity>
              </View>
            </View>
            {item?.faceLocation && (
              <Text style={[CommonStyle.smallGreyText, {marginTop: 5}]}>
                {findLocationById(item?.faceLocation[0])}
              </Text>
            )}
            {item?.device && (
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {item?.device.map(item => {
                  return (
                    findDeviceById(item) && (
                      <View style={styles.deviceNameContainer}>
                        <Text style={CommonStyle.smallBlackText}>
                          {findDeviceById(item)}
                        </Text>
                      </View>
                    )
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.main}>
      <View style={styles.headerView}>
        <CustomHeader
          title={'Familiar Faces'}
          isBackBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
        />
      </View>

      <CategoryItem
        DeviceName={'Add User'}
        onPress={() => {
          navigation.navigate('AddPeopleScreen');
        }}
        isIcon={true}
        icon={<AddIcon />}
        extraItemViewStyle={styles.extraItemStyle}
        extraItemTextStyle={{color: color.WHITE}}
      />
      {familyFaces.length > 0 && (
        <View
          style={[
            CommonStyle.row,
            {paddingHorizontal: 20, marginVertical: 20},
          ]}>
          <Text style={styles.familierFacesText}>Familiar Faces</Text>
          <Text style={styles.redText}>Clear Library</Text>
        </View>
      )}
      <View style={styles.flatListView}>
        {/* {loading ? (
          <ActivityIndicator size="large" color={color.GREEN} />
        ) : ( */}
        <FlatList
          data={familyFaces}
          renderItem={renderItem}
          // style={{marginRight: space}}
          // numColumns={numColumn}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <View style={styles.mainView}>
                {loading && <ActivityIndicator color={color.GREEN} />}
                <View style={styles.notFoundImage}>
                  <Frame3 height="100%" width="100%" />
                </View>
                <Text style={CommonStyle.title}>No Familiar Faces</Text>
                <Text
                  style={[
                    CommonStyle.text,
                    {textAlign: 'center', width: '80%', marginTop: 10},
                  ]}>
                  You don’t have any familiar faces. You can add familiar faces
                  if you’d like
                </Text>
              </View>
            );
          }}
        />
        {/* )} */}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        style={CommonStyle.modelContainerStyle}
        visible={isModalVisible}>
        {/* <View style={CommonStyle.modelContainerStyle}> */}
        <View style={styles.modelContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Text style={[CommonStyle.sectionTitle, styles.title]}>
            Edit Name
          </Text>
          <Text style={CommonStyle.inputTitle}>Name</Text>
          <TextInputField
            value={editName}
            onchangeText={value => {
              setEditName(value);
            }}
            placeholder={'Eg. Rahul Sharma'}
            placeholderTextColor={color.DARK_GRAY}
          />
          <Button
            name={'Save'}
            extraBtnViewStyle={styles.extraBtnStyle}
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
        {/* </View> */}
      </Modal>
      <DeleteModal
        visible={isDeleteModalVisible}
        setVisible={setDeleteModalVisible}
        title={'Delete Face'}
        loading={btnloading}
        onPressDelete={deleteFace}
        subTitle={
          <Text>
            Are you sure you want to delete{' '}
            <Text style={[CommonStyle.linkText, {textTransform: 'capitalize'}]}>
              {familyFaces[selectedFace]?.name}
            </Text>{' '}
            familiar face?
          </Text>
        }
      />
    </View>
  );
};

export default FamilyFacesScreen;

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
    fontSize: responsiveScale(15),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY,
  },
  flatListView: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingHorizontal: 20,
    height: perfectSize(80),
  },
  renderMainView: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 10,
    borderColor: color.LIGHT_GREEN_5,
    borderRadius: 12,
  },
  imageView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: color.LIGHT_GREEN_7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.DARK_GRAY_5,
    textTransform: 'capitalize',
    width: '67%',
  },
  redText: {
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.RED,
  },
  btncontainer: {
    height: perfectSize(22),
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelContent: {
    backgroundColor: color.WHITE,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '90%',
    borderRadius: 10,
  },
  title: {
    fontSize: responsiveScale(18),
    paddingTop: 20,
    textAlign: 'center',
  },
  viewMargin: {marginBottom: 10},
  titlePadding: {paddingTop: 20, paddingBottom: 15},
  extraBtnViewStyle: {width: '40%', marginBottom: 40},
  extraBtnStyle: {width: '40%', marginTop: 30},
  deviceTitle: {marginTop: 20},
  subText: {paddingHorizontal: 20, textAlign: 'center', marginTop: 10},
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
  deviceNameContainer: {
    padding: responsiveScale(8),
    backgroundColor: '#F3F4F4',
    borderRadius: responsiveScale(6),
    marginRight: responsiveScale(8),
    marginTop: responsiveScale(5),
  },
});
