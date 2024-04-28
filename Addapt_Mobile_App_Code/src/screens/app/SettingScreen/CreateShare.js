import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
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
import TextInputField from '../../../components/TextInputField';
import Button from '../../../components/Button';

const CreateShare = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const list = ['Email', 'Contact'];

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
        <View style={[CommonStyle.row, {marginVertical: 30}]}>
          {list.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedIndex(index)}
                style={[
                  styles.btncontainer,
                  selectedIndex === index && {borderColor: color.LIGHT_GRAY_8},
                ]}>
                <View
                  style={[
                    styles.circlecontainer,
                    selectedIndex === index && {
                      borderColor: color.GREEN,
                    },
                  ]}>
                  {selectedIndex === index && <View style={styles.circle} />}
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color:
                        selectedIndex === index ? color.GREEN : color.DARK_GRAY,
                    },
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedIndex === 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Email</Text>
            <TextInputField
              value={email}
              onchangeText={value => {
                setEmail(value);
              }}
              placeholder={'Eg. kartik@gmail.com'}
              placeholderTextColor={color.DARK_GRAY}
              extraTextInputStyle={CommonStyle.textInputWidth}
              extraInputViewStyle={styles.emailText}
              autoCapitalize={false}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Contact</Text>
            <TextInputField
              value={contact}
              onchangeText={value => {
                setContact(value);
              }}
              placeholder={'Eg. 97859 56236'}
              placeholderTextColor={color.DARK_GRAY}
              extraTextInputStyle={CommonStyle.textInputWidth}
              extraInputViewStyle={styles.emailText}
              autoCapitalize={false}
            />
          </View>
        )}
        <Button
          name={'Invite'}
          extraBtnViewStyle={styles.extraBtnViewStyle}
          extraBtnNameStyle={{fontSize: responsiveScale(14)}}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default CreateShare;

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
  emailText: {
    marginTop: 7,
  },
  sectionTitle: {
    color: color.DARK_GRAY_5,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_MEDIUM,
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  btncontainer: {
    backgroundColor: color.LIGHT_GRAY_7,
    borderRadius: 8,
    width: '47%',
    height: perfectSize(50),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.LIGHT_GRAY_7,
  },
  circlecontainer: {
    height: perfectSize(20),
    width: perfectSize(20),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color.DARK_GRAY,
    borderWidth: 2,
    marginRight: 10,
  },
  circle: {
    height: perfectSize(10),
    width: perfectSize(10),
    borderRadius: 10,
    backgroundColor: color.GREEN,
  },
  extraBtnViewStyle: {width: '40%', marginTop: 30},
});
