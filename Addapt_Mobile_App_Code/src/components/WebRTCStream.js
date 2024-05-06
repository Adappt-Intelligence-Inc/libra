import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';
import {useFocusEffect} from '@react-navigation/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {responsiveScale} from '../styles/mixins';
import {color} from '../config/color';
import {FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR} from '../styles/typography';

export default function WebRTCStream({
  roomName,
  extraVideoStyle,
  setNext,
  starttime = null,
  hidebtn,
  setDate,
  selectedDate,
  recording = false,
  stopRecording = false,
}) {
  const [localStream, setlocalStream] = useState(null);

  const [remoteStream, setRemoteStream] = useState(null);

  const [num, setNum] = useState(0);

  const reliableSocket = useRef(
    new WebSocket(`wss://ipcamera.adapptonline.com`),
  );

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef(null);
  let channelSnd = useRef(null);
  let isStarted = false;
  var isChannelReady = true;

  const dataChannelOptions = {ordered: true};
  useEffect(() => {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log('sourceInfos', sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then(stream => {
          console.log('added localstream');
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

    let isInitiator = false;
    let isFront = false;
    let room = roomName;

    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };
    peerConnection.current.addTransceiver('audio');
    peerConnection.current.addTransceiver('video');

    // Setup ice handling
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        sendMessage('ICE_CANDIDATE', {
          socketdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
        });
      } else {
        console.log('End of candidates.');
      }
    };

    peerConnection.current.ontrack = ontrack;

    peerConnection.current.addEventListener('iceconnectionstatechange', e =>
      onIceStateChange(peerConnection.current, e),
    );

    reliableSocket.current.onopen = msg => {
      console.log('reliableSocket is open and ready to use');
      reliableSocket.current.send(
        JSON.stringify({messageType: 'createorjoin', room: room}),
      );
    };

    //when we get a message from a signaling server
    reliableSocket.current.onmessage = event => {
      const msg = JSON.parse(event.data);
      console.log('onmessage --------------------->', msg);

      switch (msg.messageType) {
        case 'join':
          console.log('Another peer made a request to join room ' + room);
          console.log('This peer is the initiator of room ' + room + '!');

          // isChannelReady = true;
          break;
        case 'joined': {
          // isChannelReady = true;
          isInitiator = true;

          console.log('joined and ready to make offer');
          setNum(30);
          doCall(); // doCall
          // maybestart(isInitiator, isFront);

          break;
        }
        case 'SDP_OFFER': {
          maybestart(false, isFront);

          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(msg.messagePayload),
          );
          doAnswer();

          break;
        }
        case 'SDP_ANSWER': {
          if (isInitiator) {
            console.log('received answer %o', msg.messagePayload);
            peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(msg.messagePayload),
            );
            setNum(60);
          }
          break;
        }
        case 'ICE_CANDIDATE': {
          if (peerConnection.current) {
            peerConnection?.current
              .addIceCandidate(
                new RTCIceCandidate({
                  candidate: msg.messagePayload.candidate,
                  sdpMid: msg.messagePayload.sdpMid,
                  sdpMLineIndex: msg.messagePayload.sdpMLineIndex,
                }),
              )
              .then(data => {
                console.log(' candidate reation SUCCESS');
              })
              .catch(err => {
                console.log('Error12', err);
              });
          }

          break;
        }

        case 'bye': {
          if (isStarted) {
            handleRemoteHangup();
          }
          break;
        }

        default: {
          console.log(
            "WARNING: Ignoring unknown msg of messageType '" +
              msg.messageType +
              "'",
          );
          break;
        }
      }
    };

    reliableSocket.current.onerror = function (err) {
      console.log('Got error', err);
    };
    channelSnd.current = setupDataChannel(
      peerConnection.current,
      'chat',
      dataChannelOptions,
      starttime,
    );

    //createPeerConnection();
  }, []);
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused/mount

      return () => {
        // Do something when the screen is unfocused/unmount
        // Useful for cleanup functions
        peerConnection.current.close();
      };
    }, []),
  );

  function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
  }

  function stop() {
    isStarted = false;
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    reliableSocket.current.close();
  }

  function onIceStateChange(pc, event) {
    switch (pc.iceConnectionState) {
      case 'checking':
        {
          console.log('checking...');
        }
        break;
      case 'connected':
        console.log('connected...');
        break;
      case 'completed':
        console.log('completed...');
        break;
      case 'failed':
        console.log('failed...');
        break;
      case 'disconnected':
        console.log('Peerconnection disconnected...');
        break;
      case 'closed':
        console.log('failed...');
        break;
    }
  }

  function ontrack({transceiver, receiver, streams: [stream]}) {
    console.log('transceiver', transceiver);
    console.log('receiver', receiver);
    // console.log('streams', streams);
    console.log('stream', stream);
    setRemoteStream(stream);
    // const newStream = new MediaStream();
    // streams[0].getTracks().forEach(track => {
    //   newStream.addTrack(track);
    // });

    // setRemoteStream(newStream);
  }

  async function sendMessage(messageType, msg, timestamp) {
    console.log('Client sending message: ', messageType);
    if (timestamp)
      reliableSocket.current.send(
        JSON.stringify({
          messageType: messageType,
          messagePayload: msg,
          starttime: timestamp,
        }),
      );
    else
      reliableSocket.current.send(
        JSON.stringify({messageType: messageType, messagePayload: msg}),
      );
  }

  function maybestart(isInitiator, isFront) {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Got stream!

          setlocalStream(stream);

          console.log('added localstream');
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });
  }

  async function doCall() {
    console.log('doCall');

    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);

    console.log(' messageType %o ', sessionDescription.type);

    if (sessionDescription.type == 'answer')
      sendMessage('SDP_ANSWER', sessionDescription, starttime);
    else if (sessionDescription.type == 'offer') {
      console.log(' messageType %o ', sessionDescription.type);
      sendMessage('SDP_OFFER', sessionDescription, starttime);
    }
  }

  async function doAnswer() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);

    console.log(' messageType %o ', sessionDescription.type);

    if (sessionDescription.type == 'answer')
      sendMessage('SDP_ANSWER', sessionDescription, starttime);
    else if (sessionDescription.type == 'offer') {
      console.log(' messageType %o ', sessionDescription.type);
      sendMessage('SDP_OFFER', sessionDescription, starttime);
    }
  }

  function leave() {
    peerConnection.current.close();
    setlocalStream(null);
    setNext(false);
  }

  function setupDataChannel(pc, label, options, starttime) {
    try {
      let datachannel = pc.createDataChannel(label, options);
      console.log(`Created datachannel (${label})`);

      // Inform browser we would like binary data as an ArrayBuffer (FF chooses Blob by default!)
      datachannel.binaryType = 'arraybuffer';

      datachannel.onopen = function (e) {
        console.log(`data channel (${label}) connect`);
        if (starttime) datachannel.send('recDates');
      };

      datachannel.onclose = function (e) {
        console.log(`data channel (${label}) closed`);
      };

      datachannel.onmessage = function (e) {
        console.log(`Got message (${label})`, e.data);

        recordlist(e.data);
      };

      datachannel.addEventListener('message', message => {
        console.log('message1', message);
      });
      console.log('datachannel', datachannel);
      return datachannel;
    } catch (e) {
      console.warn('No data channel', e);
      return null;
    }
  }

  function recordlist(data) {
    let msg;

    try {
      msg = JSON.parse(data);
    } catch (e) {
      console.log(e); // error in the above string (in this case, yes)!

      return;
    }

    if (!msg.type) {
      console.log('datachannel data error %o', msg);
      return;
    }

    switch (msg.type) {
      case 'recDates': {
        console.log('first: %o', msg.data);
        let dataa = msg.data;
        setDate(dataa);
        break;
      }

      default: {
        console.log(
          "WARNING: Ignoring unknown msg of messageType '" +
            msg.messageType +
            "'",
        );
        break;
      }
    }
  }
  useEffect(() => {
    if (selectedDate) {
      var vsend = 'starttime:' + selectedDate;
      channelSnd.current.send(vsend);
    }
  }, [selectedDate]);
  useEffect(() => {
    if (recording) {
      StartRec();
    }
  }, [recording]);
  useEffect(() => {
    if (stopRecording) {
      StopRec();
    }
  }, [stopRecording]);

  const StartRec = () => {
    console.log('startrec', channelSnd);
    channelSnd.current.send('startrec');
  };

  const StopRec = () => {
    channelSnd.current.send('stoprec');
  };

  return (
    <View style={extraVideoStyle}>
      {/* {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null} */}
      {remoteStream ? (
        <RTCView
          objectFit={'contain'}
          style={extraVideoStyle}
          streamURL={remoteStream.toURL()}
        />
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  smallBtn: {
    backgroundColor: '#059cfa',
    padding: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: responsiveScale(8),
    fontWeight: FONT_WEIGHT_MEDIUM,
    color: color.WHITE,
    fontFamily: TTNORMSPRO_REGULAR,
  },
  whiteText: {
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
