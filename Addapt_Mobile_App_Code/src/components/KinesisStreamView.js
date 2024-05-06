import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import AWS from 'aws-sdk';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import moment from 'moment';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';
import {color} from '../config/color';
import {responsiveScale} from '../styles/mixins';
import {useDispatch} from 'react-redux';
import {setEventsPlayTimeAction} from '../store/devicesReducer';
import axios from 'axios';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Slider from 'react-native-slider';
import {CommonStyle} from '../config/styles';
import ViewShot from 'react-native-view-shot';

const KinesisStreamView = ({
  streamName,
  endTimestamp,
  startTimestamp,
  playbackMode,
  extraVideoStyle,
  controls = false,
  videoTime = () => {},
  devicesList,
  setBandWidth,
  setVideoWidth,
  setVideoHeight,
  resizeMode = 'cover',
  paused = false,
  setVideoPaused,
  setQualityData,
  // videoRef,
  viewShotRef,
}) => {
  const [streamData, setStreamData] = useState('');
  const [loading, setLoading] = useState(false);
  const [num, setNum] = useState(0);
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(0.1);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const options = {
      accessKeyId: 'AKIAYAISQDEVDQHIYWG4',
      secretAccessKey: '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',
      region: 'ap-south-1',
    };
    setLoading(true);
    setNum(10);
    const kinesisVideo = new AWS.KinesisVideo(options);
    const kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(
      options,
    );
    const cloudwatch = new AWS.CloudWatch(options);
    const params = {
      MetricName: 'kb', // Replace with the metric you're interested in
      Namespace: 'AWS/KinesisVideo',
      StartTime: new Date(Date.now() - 86400000), // Replace with your desired start time
      EndTime: new Date(),
      Period: 300, // 5-minute intervals
      Statistics: ['Sum'], // You can use other statistics like 'Average', 'Maximum', etc.
      Dimensions: [
        {
          Name: streamName,
          Value: streamName,
        },
      ],
    };

    cloudwatch.getMetricStatistics(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        // Extract data points
        const datapoints = data.Datapoints;

        // Process data points
        datapoints.forEach(point => {
          console.log(`Timestamp: ${point.Timestamp}, Sum: ${point.Sum}`);
          // Use point.Sum or other statistical values as needed
        });
      }
    });
    setNum(30);
    kinesisVideo.getDataEndpoint(
      {
        StreamName: streamName,
        APIName: 'GET_HLS_STREAMING_SESSION_URL',
      },
      async function (err, response) {
        if (err) {
          return console.error(err);
        }
        console.log('Data endpoint: ' + response.DataEndpoint);
        kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(
          response.DataEndpoint,
        );
        console.log('streamName', streamName);

        // Step 3: Get an HLS Streaming Session URL
        console.log('Fetching HLS Streaming Session URL');
        // const playbackMode = 'LIVE'; // 'LIVE' or 'ON_DEMAND'
        // const startTimestamp = new Date('START_TIMESTAMP'); // For ON_DEMAND only
        // const endTimestamp = new Date('END_TIMESTAMP'); // For ON_DEMAND only
        const fragmentSelectorType = 'SERVER_TIMESTAMP'; // 'SERVER_TIMESTAMP' or 'PRODUCER_TIMESTAMP'
        const SESSION_EXPIRATION_SECONDS = 60 * 60;
        setNum(60);
        await kinesisVideoArchivedContent.getHLSStreamingSessionURL(
          {
            StreamName: streamName,
            PlaybackMode: playbackMode,
            DiscontinuityMode: 'ON_DISCONTINUITY',
            HLSFragmentSelector: {
              FragmentSelectorType: fragmentSelectorType,
              // TimestampRange: {
              //   EndTimestamp: EndTimestamp,
              //   StartTimestamp: StartTimestamp,
              // },
              TimestampRange:
                playbackMode === 'LIVE'
                  ? undefined
                  : {
                      StartTimestamp: startTimestamp,
                      EndTimestamp: endTimestamp,
                    },
            },
            DisplayFragmentTimestamp: 'ALWAYS',
            Expires: parseInt(SESSION_EXPIRATION_SECONDS),
          },
          function (err, response) {
            if (err) {
              return console.error('Error', err);
            }
            if (streamData === '') {
              console.log('HLS Streaming Session URL: ', response, streamName);
              setStreamData(response?.HLSStreamingSessionURL);

              if (response?.HLSStreamingSessionURL) {
                axios
                  .get(response?.HLSStreamingSessionURL)
                  .then(function (response) {
                    const bandwidthRegex = /BANDWIDTH=(\d+)/;
                    const match = response.data.match(bandwidthRegex);
                    if (match) {
                      const bandwidth = match[1];
                      // console.log('res Bandwidth:', bandwidth);
                      setBandWidth(bandwidth);
                      const resolutionRegex = /RESOLUTION=(\d+)x(\d+)/;
                      const resolutionMatch =
                        response.data.match(resolutionRegex);
                      if (resolutionMatch && resolutionMatch.length === 3) {
                        // const width = parseInt(resolutionMatch[1], 10);
                        const height = parseInt(resolutionMatch[2], 10);
                        // console.log(`Width: ${width}, Height: ${height}`);
                        setQualityData({bandwidth: bandwidth, quality: height});
                        // setVideoWidth(width);
                        // setVideoHeight(height);
                      } else {
                        console.log('Resolution not found in the input string');
                      }
                    } else {
                      setBandWidth(0);
                      console.error('Bandwidth not found in the playlist.');
                    }
                  });
              } else {
                setBandWidth(0);
              }
            }
            setLoading(false);
            setNum(100);
          },
        );
      },
    );
  }, [streamName, endTimestamp, startTimestamp, playbackMode, devicesList]);

  const addTodo = useCallback(newDateTime => {
    dispatch(setEventsPlayTimeAction(newDateTime));
  }, []);

  const onslide = slide => {
    videoRef.seek(slide * duration);
    // clearTimeout(overlayTimer);
    // const overlayTimer = setTimeout(() => setOverlay(false), 3000);
  };
  const onEnd = () => {
    setVideoPaused && setVideoPaused(true);
    videoRef.seek(0);
    setCurrentTime(0);
  };

  const load = duration => {
    videoRef.seek(currentTime);
    setDuration(duration);
  };
  const progress = currentTime => setCurrentTime(currentTime);

  const getTime = t => {
    const digit = n => (n < 10 ? `0${n}` : `${n}`);
    const sec = digit(Math.floor(t % 60));
    const min = digit(Math.floor((t / 60) % 60));
    const hr = digit(Math.floor((t / 3600) % 60));
    return min + ':' + sec;
  };

  return (
    <View>
      {!loading && streamData ? (
        <>
          {/* <ViewShot ref={viewShotRef} options={{format: 'jpg', quality: 0.9}}>
            <View collapsable={false} style={{height: '100%', width: '100%'}}> */}
          <Video
            source={{uri: streamData}}
            style={[extraVideoStyle]}
            ref={ref => {
              videoRef = ref;
            }}
            onError={error => console.error('Video error:', error)}
            // controls={controls}
            useNativeControls={true}
            paused={paused}
            resizeMode={resizeMode} // Fill the whole screen at aspect ratio.
            onProgress={e => {
              if (startTimestamp) {
                const date = new Date((startTimestamp + e?.currentTime) * 1000);
                videoTime(date);
                // dispatch(setEventsPlayTimeAction(date));
              }
              controls && progress(e?.currentTime);
            }}
            onSeek={e => {
              if (startTimestamp) {
                const date = new Date((startTimestamp + e?.currentTime) * 1000);
                videoTime(date);
              }
            }}
            onLoad={({duration}) => controls && duration & load(duration)}
            onEnd={() => onEnd()}
            enableHardwareAcceleration
            muted={true}
            disableFocus={true}
          />
          {/* </View>
          </ViewShot> */}
          {controls && (
            <View style={styles.controlContainer}>
              <View style={CommonStyle.row}>
                <Text style={styles.whitetext}>{getTime(currentTime)}</Text>
                <Text style={styles.whitetext}>{getTime(duration)}</Text>
              </View>
              <Slider
                maximumTrackTintColor="#FFFFFF99"
                minimumTrackTintColor={color.GREEN}
                thumbTintColor={color.GREEN}
                value={currentTime / duration}
                onSlidingComplete={onslide}
                thumbStyle={styles.thumbStyle}
              />
            </View>
          )}
        </>
      ) : (
        <View style={[extraVideoStyle, styles.emptyContainer]}>
          <AnimatedCircularProgress
            size={responsiveScale(30)}
            width={3}
            fill={num}
            tintColor={color.WHITE}
            backgroundColor={color.DARK_GRAY_5}>
            {fill => (
              <Text style={styles.loadingText}>{parseInt(fill) + '%'}</Text>
            )}
          </AnimatedCircularProgress>
          {/* <ActivityIndicator size={18} color={color.WHITE} />
          <Text style={styles.loadingText}>{num}please wait</Text> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: responsiveScale(8),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  whitetext: {
    fontSize: responsiveScale(12),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  controlContainer: {
    position: 'absolute',
    width: '90%',
    bottom: 0,
    alignSelf: 'center',
  },
  thumbStyle: {
    width: 15,
    height: 15,
    borderColor: color.WHITE,
    borderWidth: 3,
  },
});

export default KinesisStreamView;
