import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {responsiveScale} from '../styles/mixins';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {color} from '../config/color';

const GetCustomTime = date => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const timerId = setInterval(() => {
      setElapsedSeconds(prevElapsedSeconds => prevElapsedSeconds + 1);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup the interval on component unmount
  }, []); // Empty dependency array ensures useEffect runs once on mount

  // Calculate the current time by adding elapsedSeconds to the initialDate
  const currentTime = new Date(date.date);
  currentTime.setSeconds(currentTime.getSeconds() + elapsedSeconds);

  useEffect(() => {
    setElapsedSeconds(0);
  }, [date.date]);
  return moment(currentTime).format('hh:mm:ss A, D MMM YYYY');
};

export default GetCustomTime;

const styles = StyleSheet.create({
  titleText: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
});
