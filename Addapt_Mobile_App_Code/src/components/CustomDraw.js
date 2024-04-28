/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

const CustomDraw = ({
  start,
  end,
  dimensions,
  isAdd,
  isBlock,
  blockAreasData,
  onPress = () => {},
  onEnd = () => {},
}) => {
  const [viewHeight, setViewHeight] = useState(0);

  const find_dimesions = layout => {
    const {x, y, width, height} = layout;
    setViewHeight(height);
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={isAdd && onPress} onEnded={onEnd}>
        <View
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: 411 / 294,
          }}>
          <Image
            style={{width: '100%', height: '100%', position: 'relative'}}
            source={{uri: 'https://picsum.photos/300/201'}}
            resizeMode={'contain'}
            onLayout={event => {
              find_dimesions(event.nativeEvent.layout);
            }}
          />
          {blockAreasData.map(el => {
            return (
              <View
                style={{
                  position: 'absolute',
                  borderWidth: !isBlock ? 2 : 4,
                  borderColor: !isBlock ? 'red' : 'green',
                  backgroundColor: isBlock ? '#00937D10' : '#79797933',
                  top: el?.startX || el?.endX,
                  left: el?.startY || el?.endY,
                  width: el?.w || 0,
                  height: el?.h || 0,
                }}
              />
            );
          })}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default CustomDraw;
