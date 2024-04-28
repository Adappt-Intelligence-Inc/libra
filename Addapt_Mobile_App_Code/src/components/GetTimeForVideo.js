import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {responsiveScale} from '../styles/mixins';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {color} from '../config/color';

const GetTimeForVideo = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1000 milliseconds (1 second)

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  // return (
  //   <View style={{}}>
  //     <Text style={styles.titleText}>
  //       {moment(currentTime).format('hh:mm:ss A, D MMM YYYY')}
  //     </Text>
  //   </View>
  // );
  return moment(currentTime).format('hh:mm:ss A, D MMM YYYY');
};

export default GetTimeForVideo;

const styles = StyleSheet.create({
  titleText: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
});
