import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeft from '../assets/appImages/ArrowLeft.svg';
import Setting from '../assets/appImages/Setting1.svg';
import LogHistory from '../assets/appImages/LogHistory.svg';
import GridIcon from '../assets/appImages/GridIcon.svg';
import PlusIcon from '../assets/appImages/PlusIcon.svg';
import DeleteIcon from '../assets/appImages/DeleteIcon.svg';
import BarIcon from '../assets/appImages/BarIcon.svg';
import NoteIcon from '../assets/appImages/NoteIcon.svg';
import EditIcon from '../assets/appImages/EditIcon.svg';
import FilterIcon from '../assets/appImages/FilterIcon.svg';
import AdapptLogo from '../assets/appImages/AdapptLogo2.svg';
import Notification from '../assets/appImages/Notification.svg';
import MoonGreen from '../assets/appImages/MoonGreen.svg';
import SerachReport from '../assets/appImages/SerachReport.svg';
import {color} from '../config/color';
import {CommonStyle} from '../config/styles';
import {responsiveScale} from '../styles/mixins';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  TTNORMSPRO_MEDIUM,
  TTNORMSPRO_REGULAR,
} from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';
import {perfectSize} from '../styles/theme';

export default function CustomHeader({
  title,
  isBackBtnVisible = false,
  isBellBtnVisible = false,
  isSearchBtnVisible = false,
  isNextBtnVisible = false,
  isClearBtnVisible = false,
  isPlusBtnVisible = false,
  isDrawerIconVisible = false,
  isAdapptLogo = false,
  isSettingIconVisible = false,
  isLogHistoryIconVisible = false,
  isMoonIconVisible = false,
  isGridIconVisible = false,
  isDeleteBtnVisible = false,
  isEventsIcon = false,
  isSelectAllVisible = false,
  isEditIconVisible = false,
  isExtraIconVisible = false,
  onPressBackBtn = () => {},
  onPressBellBtn = () => {},
  onPressSearchBtn = () => {},
  onNextBtnPress = () => {},
  onClearBtnPress = () => {},
  onPlusBtnPress = () => {},
  onBarIconPress = () => {},
  onSettingIconPress = () => {},
  onLogHistoryIconPress = () => {},
  onDeleteBtnPress = () => {},
  onEditIconPress = () => {},
  onFilterIconPress = () => {},
  onNoteIconPress = () => {},
  onGridIconPress = () => {},
  onEditBtnPress = () => {},
  onSelectAllPress = () => {},
  onExtraIconPress = () => {},
  onMoonPress = () => {},
  titleColor,
  extraIcon,
  extraTitleStyle,
  notificationCount = 0,
}) {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{paddingTop: top + 20}}>
      <View style={CommonStyle.row}>
        <View style={[CommonStyle.row, {flex: 1, marginRight: 10}]}>
          {isDrawerIconVisible && (
            <View style={styles.shadowContainer}>
              <LinearGradient
                start={{x: 0.9, y: 0}}
                end={{x: 1, y: 1}}
                colors={['#00937D80', '#00937D20']}
                style={styles.linearGradient}>
                <View style={styles.innerContainer}>
                  <TouchableOpacity
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={() => onBarIconPress()}>
                    <BarIcon />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
          {isBackBtnVisible && (
            <>
              <View style={styles.shadowContainer}>
                <LinearGradient
                  start={{x: 0.9, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#00937D80', '#00937D20']}
                  style={styles.linearGradient}>
                  <View style={styles.innerContainer}>
                    <TouchableOpacity
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      onPress={() => onPressBackBtn()}>
                      <ArrowLeft />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </>
          )}
          {title && (
            <Text
              style={[
                CommonStyle.headerTitle,
                {flex: 1, color: titleColor},
                extraTitleStyle,
              ]}
              numberOfLines={1}>
              {title}
            </Text>
          )}
          {extraTitleStyle && <View />}
          {isAdapptLogo && (
            <View style={styles.adapptLogo}>
              <AdapptLogo />
            </View>
          )}
          {isBellBtnVisible && (
            <>
              <View style={styles.shadowContainer}>
                <LinearGradient
                  start={{x: 0.9, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#00937D80', '#00937D20']}
                  style={[styles.linearGradient, {marginRight: 0}]}>
                  <View style={[styles.innerContainer]}>
                    <TouchableOpacity
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      onPress={() => onPressBellBtn()}>
                      <Notification />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
                {notificationCount > 0 && (
                  <View style={styles.countContainer}>
                    <Text style={styles.countNumber}>{notificationCount}</Text>
                  </View>
                )}
              </View>
            </>
          )}
          {isSearchBtnVisible && (
            <>
              <View style={styles.shadowContainer}>
                <LinearGradient
                  start={{x: 0.9, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={['#00937D80', '#00937D20']}
                  style={[styles.linearGradient, {marginRight: 0}]}>
                  <View
                    style={[
                      styles.innerContainer,
                      {padding: 3},
                      // {backgroundColor: color.LIGHT_GRAY},
                    ]}>
                    <TouchableOpacity
                      style={{padding: 2}}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                      onPress={() => {
                        onPressSearchBtn();
                      }}>
                      <SerachReport height={'100%'} />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </>
          )}
        </View>

        {isNextBtnVisible && (
          <TouchableOpacity
            onPress={() => {
              onNextBtnPress();
            }}>
            <Text style={styles.nextButton}>Next</Text>
          </TouchableOpacity>
        )}
        {isClearBtnVisible && (
          <TouchableOpacity
            onPress={() => {
              onClearBtnPress();
            }}>
            <Text style={styles.nextButton}>Clear All</Text>
          </TouchableOpacity>
        )}
        {isPlusBtnVisible && (
          <TouchableOpacity
            onPress={() => {
              onPlusBtnPress();
            }}
            style={[
              styles.shadowContainer,
              {height: responsiveScale(28), width: responsiveScale(28)},
            ]}>
            <PlusIcon width="100%" height="100%" />
          </TouchableOpacity>
        )}
        {isDeleteBtnVisible && (
          <View style={styles.shadowContainer}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.margin0]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onDeleteBtnPress()}>
                  <DeleteIcon />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        {isMoonIconVisible && (
          <TouchableOpacity
            onPress={() => {
              onMoonPress();
            }}
            style={[styles.shadowContainer, styles.moon]}>
            <MoonGreen width="100%" height="100%" />
          </TouchableOpacity>
        )}
        {isSettingIconVisible && (
          <View style={styles.shadowContainer}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.margin0]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onSettingIconPress()}>
                  <Setting />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        {isLogHistoryIconVisible && (
          <View style={styles.shadowContainer}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.margin0]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onLogHistoryIconPress()}>
                  <LogHistory />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        {isGridIconVisible && (
          <View style={styles.shadowContainer}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.margin0]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onGridIconPress()}>
                  <GridIcon />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        {isEditIconVisible && (
          <LinearGradient
            start={{x: 0.9, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00937D80', '#00937D20']}
            style={[styles.linearGradient, styles.margin0]}>
            <View
              style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => onEditBtnPress()}>
                <EditIcon />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        {isExtraIconVisible && (
          <LinearGradient
            start={{x: 0.9, y: 0}}
            end={{x: 1, y: 1}}
            colors={['#00937D80', '#00937D20']}
            style={[styles.extraiconstyle, styles.margin0]}>
            <View
              style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => onExtraIconPress()}>
                {extraIcon}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        {isSelectAllVisible && (
          <TouchableOpacity onPress={() => onSelectAllPress()}>
            <Text style={styles.selectAllButtonText}>Select All</Text>
          </TouchableOpacity>
        )}
        {isEventsIcon && (
          <View style={[styles.shadowContainer, CommonStyle.row]}>
            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.marginRight]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onNoteIconPress()}>
                  <NoteIcon />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.marginRight]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onEditIconPress()}>
                  <EditIcon />
                </TouchableOpacity>
              </View>
            </LinearGradient> */}

            <LinearGradient
              start={{x: 0.9, y: 0}}
              end={{x: 1, y: 1}}
              colors={['#00937D80', '#00937D20']}
              style={[styles.linearGradient, styles.margin0]}>
              <View
                style={[styles.innerContainer, {backgroundColor: color.GREEN}]}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                  onPress={() => onFilterIconPress()}>
                  <FilterIcon />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  nextButton: {
    color: color.GREEN,
    fontSize: responsiveScale(16),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  clearButton: {
    color: color.GREEN,
    fontSize: responsiveScale(14),
    fontFamily: TTNORMSPRO_REGULAR,
    fontWeight: FONT_WEIGHT_BOLD,
  },
  shadowContainer: {
    shadowColor: color.LIGHT_GRAY_2,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 4,
  },
  moon: {
    height: responsiveScale(30),
    width: responsiveScale(30),
    padding: responsiveScale(4),
    borderColor: '#E5E5E580',
    borderWidth: responsiveScale(1.2),
    borderRadius: responsiveScale(28),
    marginRight: 10,
  },
  linearGradient: {
    height: perfectSize(30),
    width: perfectSize(30),
    borderRadius: 20, // <-- Outer Border Radius
    marginRight: 20,
  },
  extraiconstyle: {
    height: perfectSize(34),
    width: perfectSize(34),
    borderRadius: perfectSize(34), // <-- Outer Border Radius
    marginRight: 20,
  },
  innerContainer: {
    borderRadius: perfectSize(34), // <-- Inner Border Radius
    flex: 1,
    margin: 1.2, // <-- Border Width
    backgroundColor: color.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adapptLogo: {
    // flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin0: {marginRight: 0},
  marginRight: {marginRight: perfectSize(10)},

  selectAllButtonText: {
    fontSize: responsiveScale(14),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_REGULAR,
    color: color.GREEN,
  },
  countNumber: {
    fontSize: responsiveScale(7),
    fontWeight: FONT_WEIGHT_MEDIUM,
    fontFamily: TTNORMSPRO_MEDIUM,
    color: color.WHITE,
  },
  countContainer: {
    position: 'absolute',
    // height: perfectSize(13),
    borderRadius: perfectSize(13),
    backgroundColor: color.RED,
    right: -perfectSize(3),
    top: -perfectSize(7),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    minHeight: perfectSize(13),
    minWidth: perfectSize(13),
  },
});
