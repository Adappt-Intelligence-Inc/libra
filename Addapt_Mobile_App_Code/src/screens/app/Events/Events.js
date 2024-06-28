import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../../components/CustomHeader';
import {CommonStyle} from '../../../config/styles';
import CategoryItem from '../../../components/CategoryItem';
import Event1 from '../../../assets/appImages/Event1.svg';
import VehicleIcon from '../../../assets/appImages/VehicleIcon.svg';
import PetIcon from '../../../assets/appImages/PetIcon.svg';
import PackageIcon from '../../../assets/appImages/PackageIcon.svg';
import FaceIcon from '../../../assets/appImages/FaceIcon.svg';
import Close from '../../../assets/appImages/Close.svg';
import Button from '../../../components/Button';
import {color} from '../../../config/color';
import {responsiveScale} from '../../../styles/mixins';
import TextInputField from '../../../components/TextInputField';
import {setEventsTypesAction} from '../../../store/devicesReducer';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import {
  addEventsToDevice,
  getEventTypesList,
} from '../../../resources/baseServices/auth';

const Events = ({navigation, route}) => {
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addVehicle, setAddVehicle] = useState('');
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state?.auth?.userDetails ?? {});
  const eventTypesList = useSelector(
    state => state?.devices?.eventTypesList ?? [],
  );
  const response = route?.params?.response;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCheckBoxPress = eventName => {
    if (selectedEvent.includes(eventName)) {
      setSelectedEvent(selectedEvent.filter(event => event !== eventName));
    } else {
      setSelectedEvent([...selectedEvent, eventName]);
    }
  };

  useEffect(() => {
    const getDashBoardAPIListener = navigation.addListener(
      'focus',
      async () => {
        const getList = await getEventTypesList(userDetails?.email);
        const events = getList.data.data;
        console.log('events', events);
        if (events.length > 0) {
          dispatch(setEventsTypesAction(events));
        } else {
          dispatch(setEventsTypesAction([]));
        }
      },
    );
    return getDashBoardAPIListener;
  }, [navigation]);

  useEffect(() => {
    let defaultEventSelect = [];
    if (response?.cameraEventTypeId.length > 0) {
      response?.cameraEventTypeId.map(item => {
        const found = eventTypesList.find(el => el._id === item);
        if (found) {
          defaultEventSelect.push(found?.type);
        }
      });
      setSelectedEvent(defaultEventSelect);
    }
  }, [eventTypesList, route]);

  const getImage = key => {
    switch (key) {
      case 'PERSON':
        return <Event1 />;
      case 'PET':
        return <PetIcon />;
      case 'VEHICLE':
        return <VehicleIcon />;
      case 'PACKAGE':
        return <PackageIcon />;
      case 'FACE':
        return <FaceIcon />;
      default:
        break;
    }
  };
  const getName = key => {
    switch (key) {
      case 'PERSON':
        return 'People detection';
      case 'PET':
        return 'Pet detection';
      case 'VEHICLE':
        return 'Vehicle detection';
      case 'PACKAGE':
        return 'Package detection';
      case 'FACE':
        return 'Face recognition';
      default:
        break;
    }
  };

  const handleSave = async () => {
    // if (selectedEvent.length > 0) {
    setLoading(true);
    try {
      const data = {
        email: userDetails?.email,
        eventType: selectedEvent,
        deviceId: response?._id,
      };
      const res = await addEventsToDevice(data);
      if (res?.status === 200) {
        console.log('res', res);
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
    // } else {
    //   console.log('error');
    // }
  };

  return (
    <View style={[CommonStyle.sectionContainer, CommonStyle.flex]}>
      <View style={CommonStyle.flex}>
        <CustomHeader
          title={'Events'}
          isBackBtnVisible={true}
          isPlusBtnVisible={true}
          onPressBackBtn={() => {
            navigation.goBack();
          }}
          onPlusBtnPress={() => {
            toggleModal();
          }}
        />
        <View style={styles.titlePadding}>
          <Text style={CommonStyle.sectionTitle}>Select events</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {eventTypesList.map((item, index) => {
            return (
              <CategoryItem
                DeviceName={getName(item.type)}
                icon={getImage(item.type)}
                isIcon={true}
                isCheckBox={true}
                isChecked={selectedEvent.includes(item.type)}
                onCheckBoxPress={() => {
                  handleCheckBoxPress(item.type);
                }}
                extraItemViewStyle={styles.viewMargin}
                isDisabled={true}
              />
            );
          })}
          {/* <CategoryItem
            DeviceName={'People detection'}
            icon={<Event1 />}
            isIcon={true}
            isCheckBox={true}
            isChecked={selectedEvent.includes('People detection')}
            onCheckBoxPress={() => {
              handleCheckBoxPress('People detection');
            }}
            extraItemViewStyle={styles.viewMargin}
          />
          <CategoryItem
            DeviceName={'Package detection'}
            icon={<PackageIcon />}
            isIcon={true}
            isCheckBox={true}
            isChecked={selectedEvent.includes('Package detection')}
            onCheckBoxPress={() => {
              handleCheckBoxPress('Package detection');
            }}
            extraItemViewStyle={styles.viewMargin}
          />
          <CategoryItem
            DeviceName={'Pet detection'}
            icon={<PetIcon />}
            isIcon={true}
            isCheckBox={true}
            isChecked={selectedEvent.includes('Pet detection')}
            onCheckBoxPress={() => {
              handleCheckBoxPress('Pet detection');
            }}
            extraItemViewStyle={styles.viewMargin}
          />
          <CategoryItem
            DeviceName={'Vehicle detection'}
            icon={<VehicleIcon />}
            isIcon={true}
            isCheckBox={true}
            isChecked={selectedEvent.includes('Vehicle detection')}
            onCheckBoxPress={() => {
              handleCheckBoxPress('Vehicle detection');
            }}
            extraItemViewStyle={styles.viewMargin}
          />
          <CategoryItem
            DeviceName={'Face recognition'}
            icon={<FaceIcon />}
            isIcon={true}
            isCheckBox={true}
            isChecked={selectedEvent.includes('Face recognition')}
            onCheckBoxPress={() => {
              handleCheckBoxPress('Face recognition');
            }}
            extraItemViewStyle={styles.viewMargin}
          /> */}
        </ScrollView>
      </View>
      <Button
        name={'Save'}
        extraBtnViewStyle={styles.extraBtnViewStyle}
        onPress={() => handleSave()}
        isLoading={loading}
      />
      <Modal
        animationType="fade"
        transparent={true}
        style={CommonStyle.modelContainerStyle}
        avoidKeyboard={true}
        visible={isModalVisible}>
        {/* <View style={CommonStyle.modelContainerStyle}> */}
        <View style={styles.modelContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={CommonStyle.position}>
            <Close />
          </TouchableOpacity>
          <Text style={[CommonStyle.sectionTitle, styles.title]}>
            Add new event
          </Text>
          <Text style={CommonStyle.inputTitle}>Enter new event</Text>
          <TextInputField
            value={addVehicle}
            onchangeText={value => {
              setAddVehicle(value);
            }}
            placeholder={'Eg. Vehicle detection'}
            placeholderTextColor={color.DARK_GRAY}
          />
          <Button
            name={'Add'}
            extraBtnViewStyle={styles.extraBtnStyle}
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingBottom: 10,
    textAlign: 'center',
  },
  viewMargin: {marginBottom: 10},
  titlePadding: {paddingTop: 20, paddingBottom: 15},
  extraBtnViewStyle: {width: '40%', marginBottom: 40},
  extraBtnStyle: {width: '40%', marginTop: 20},
});
export default Events;
