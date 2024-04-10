import React, {useEffect, useState, useRef} from 'react';
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
import TextInputContainer from './components/TextInputContainer';
import SocketIOClient from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import CallEnd from './asset/CallEnd';
import CallAnswer from './asset/CallAnswer';
import MicOn from './asset/MicOn';
import MicOff from './asset/MicOff';
import VideoOn from './asset/VideoOn';
import VideoOff from './asset/VideoOff';
import CameraSwitch from './asset/CameraSwitch';
import IconContainer from './components/IconContainer';
import InCallManager from 'react-native-incall-manager';

export default function WebRTC({roomName, setNext}) {
  const [localStream, setlocalStream] = useState(null);

  const [remoteStream, setRemoteStream] = useState(null);

  const [type, setType] = useState('JOIN');

  const [callerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const otherUserId = useRef(null);

  // const socket = SocketIOClient('http://192.168.1.19:3500', {
  //   transports: ['websocket'],
  //   query: {
  //     callerId,
  //   },
  // });

  const reliableSocket = useRef(
    new WebSocket(`wss://ipcamera.adapptonline.com`),
  );

  const [localMicOn, setlocalMicOn] = useState(true);

  const [localWebcamOn, setlocalWebcamOn] = useState(true);

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

  // useEffect(() => {
  //   socket.on('newCall', data => {
  //     remoteRTCMessage.current = data.rtcMessage;
  //     otherUserId.current = data.callerId;
  //     setType('INCOMING_CALL');
  //   });

  //   socket.on('callAnswered', data => {
  //     remoteRTCMessage.current = data.rtcMessage;
  //     peerConnection.current.setRemoteDescription(
  //       new RTCSessionDescription(remoteRTCMessage.current),
  //     );
  //     setType('WEBRTC_ROOM');
  //   });

  //   socket.on('ICEcandidate', data => {
  //     let message = data.rtcMessage;

  //     if (peerConnection.current) {
  //       peerConnection?.current
  //         .addIceCandidate(
  //           new RTCIceCandidate({
  //             candidate: message.candidate,
  //             sdpMid: message.id,
  //             sdpMLineIndex: message.label,
  //           }),
  //         )
  //         .then(data => {
  //           console.log('SUCCESS');
  //         })
  //         .catch(err => {
  //           console.log('Error', err);
  //         });
  //     }
  //   });

  //   let isFront = false;

  //   return () => {
  //     socket.off('newCall');
  //     socket.off('callAnswered');
  //     socket.off('ICEcandidate');
  //   };
  // }, []);
  let starttime = null;
  let channelSnd = useRef(null);

  const dataChannelOptions = {ordered: true};
  useEffect(() => {
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
        // sendICEcandidate({
        //   calleeId: otherUserId.current,
        //   rtcMessage: {
        //     label: event.candidate.sdpMLineIndex,
        //     id: event.candidate.sdpMid,
        //     candidate: event.candidate.candidate,
        //   },
        // });

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
      setType('JOIN');
      reliableSocket.current.send(
        JSON.stringify({messageType: 'createorjoin', room: room}),
      );
    };

    //when we get a message from a signaling server
    reliableSocket.current.onmessage = event => {
      const msg = JSON.parse(event.data);
      console.log('onmessage --------------------->', msg);

      // switch (data.type) {
      //   //when another user is calling us
      //   case 'newCall':
      //     handleNewCall(data);
      //     break;

      //   //when somebody wants to call us
      //   case 'acceptCall':
      //     handleAcceptCall(data);
      //     break;

      //   //when a remote peer sends an ice candidate to us
      //   case 'ICEcandidate':
      //     handleICEcandidate(data);
      //     break;

      //   //when the other user rejects the call
      //   case 'CancelCall':
      //     handleCancelCall(data);

      //   //when the other user rejects the call
      //   case 'rejectCall':
      //     handleRejectCall(data);

      //   //when the other user ends the call
      //   case 'endCall':
      //     handleEndCall(data);
      //     break;
      // }

      switch (msg.messageType) {
        case 'join':
          console.log('Another peer made a request to join room ' + room);
          console.log('This peer is the initiator of room ' + room + '!');

          isChannelReady = true;
          break;
        case 'joined': {
          isChannelReady = true;
          isInitiator = true;

          console.log('joined and ready to make offer');
          doCall(); // doCall
          // maybestart(isInitiator, isFront);

          break;
        }
        case 'SDP_OFFER': {
          maybestart(false, isFront);

          // if (!isInitiator && !isStarted)
          // {
          //   maybeStart();
          // }
          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(msg.messagePayload),
          );
          doAnswer();

          break;
        }
        case 'SDP_ANSWER': {
          // if(isStarted) {
          //   console.log("received answer %o",  msg.messagePayload);
          //   pc.setRemoteDescription(new RTCSessionDescription(msg.messagePayload));
          // }

          if (isInitiator) {
            console.log('received answer %o', msg.messagePayload);
            peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(msg.messagePayload),
            );
            setType('WEBRTC_ROOM');
          }

          break;
        }
        case 'ICE_CANDIDATE': {
          // if(isStarted)
          // {
          //     var candidate = new RTCIceCandidate({
          //       sdpMLineIndex: 0,
          //       candidate: msg.messagePayload.candidate
          //     });
          //     pc.addIceCandidate(candidate);
          // }

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

    // const handleNewCall = data => {
    //   console.log('\n\n\n\n INCOMING_CALL \n\n\n\n');
    //   remoteRTCMessage.current = data.rtcMessage;
    //   otherUserId.current = data.callerId;
    //   setType('INCOMING_CALL');
    // };

    // const handleAcceptCall = data => {
    //   console.log('\n\n\n\n CALL_ANSWERED \n\n\n\n');
    //   remoteRTCMessage.current = data.rtcMessage;
    //   peerConnection.current.setRemoteDescription(
    //     new RTCSessionDescription(remoteRTCMessage.current),
    //   );
    //   setType('WEBRTC_ROOM');
    // };

    // const handleICEcandidate = data => {
    //   console.log('\n\n\n\n ICE_CANDIDATE \n\n\n\n');
    //   let message = data.rtcMessage;

    //   if (peerConnection.current) {
    //     peerConnection?.current
    //       .addIceCandidate(
    //         new RTCIceCandidate({
    //           candidate: message.candidate,
    //           sdpMid: message.id,
    //           sdpMLineIndex: message.label,
    //         }),
    //       )
    //       .then(data => {
    //         console.log('SUCCESS');
    //       })
    //       .catch(err => {
    //         console.log('Error', err);
    //       });
    //   }
    // };

    // const handleCancelCall = data => {
    //   peerConnection.current.close();
    //   setlocalStream(null);
    //   setType('JOIN');
    //   //createPeerConnection();
    // };

    // const handleRejectCall = data => {
    //   peerConnection.current.close();
    //   setlocalStream(null);
    //   setType('JOIN');
    //  // createPeerConnection();
    // };

    // const handleEndCall = data => {
    //   peerConnection.current.close();
    //   setlocalStream(null);
    //   setType('JOIN');
    //   //createPeerConnection();
    // };

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

  function onIceStateChange(pc, event) {
    switch (pc.iceConnectionState) {
      case 'checking':
        {
          // start();
          // setupWebRtcPlayer(pc);
          // onWebRtcAnswer();

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
    console.log('stream', stream);
    setRemoteStream(stream);
  }

  // useEffect(() => {
  //   InCallManager.start();
  //   InCallManager.setKeepScreenOn(true);
  //   InCallManager.setForceSpeakerphoneOn(true);

  //   return () => {
  //     InCallManager.stop();
  //   };
  // }, []);

  function sendICEcandidate(data) {
    socket.emit('ICEcandidate', data);
  }

  async function sendMessage(messageType, msg) {
    console.log('Client sending message: ', messageType);

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

          setType('OUTGOING_CALL');

          // if (isInitiator == true) doCall();
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
      sendMessage('SDP_ANSWER', sessionDescription);
    else if (sessionDescription.type == 'offer') {
      console.log(' messageType %o ', sessionDescription.type);
      sendMessage('SDP_OFFER', sessionDescription);
    }

    // sendCall({
    //   calleeId: otherUserId.current,
    //   rtcMessage: sessionDescription,
    // });
  }

  async function doAnswer() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);

    console.log(' messageType %o ', sessionDescription.type);

    if (sessionDescription.type == 'answer')
      sendMessage('SDP_ANSWER', sessionDescription);
    else if (sessionDescription.type == 'offer') {
      console.log(' messageType %o ', sessionDescription.type);
      sendMessage('SDP_OFFER', sessionDescription);
    }
  }

  // function answerCall(data) {
  //   socket.emit('answerCall', data);
  // }

  // function sendCall(data) {
  //   socket.emit('call', data);
  // }

  const JoinScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          justifyContent: 'center',
          paddingHorizontal: 42,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: '#1A1C22',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    color: '#ffff',
                    letterSpacing: 6,
                  }}>
                  {callerId}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#1A1C22',
                padding: 40,
                marginTop: 25,
                justifyContent: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Enter call id of another user
              </Text>
              <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId.current}
                setValue={text => {
                  otherUserId.current = text;
                  console.log('TEST', otherUserId.current);
                }}
                keyboardType={'number-pad'}
              />
              <TouchableOpacity
                onPress={() => {
                  setType('OUTGOING_CALL');
                  doCall();
                }}
                style={{
                  height: 50,
                  backgroundColor: '#5568FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };

  const OutgoingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#D0D4DD',
            }}>
            Calling to...
          </Text>

          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {otherUserId.current}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setType('JOIN');
              setNext(false);
              otherUserId.current = null;
            }}
            style={{
              backgroundColor: '#FF5D5D',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallEnd width={50} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const IncomingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              setType('WEBRTC_ROOM');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswer height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setlocalStream(null);
    setNext(false);
    setType('JOIN');
  }

  console.log('remoteStream', remoteStream);

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

  const StartRec = () => {
    console.log('startrec', channelSnd);
    channelSnd.current.send('startrec');
  };

  const StopRec = () => {
    channelSnd.current.send('stoprec');
  };

  const WebrtcRoomScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}>
        {localStream ? (
          <RTCView
            objectFit={'contain'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null}
        {remoteStream ? (
          <RTCView
            objectFit={'contain'}
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              marginTop: 8,
            }}
            streamURL={remoteStream.toURL()}
          />
        ) : null}
        <View
          style={{
            paddingTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            style={[styles.smallBtn]}
            onPress={() => StartRec()}>
            <Text style={styles.whiteText}>{'Start Rec'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallBtn, {backgroundColor: '#ff0000'}]}
            onPress={() => StopRec()}>
            <Text style={styles.whiteText}>{'Stop Rec'}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <IconContainer
            backgroundColor={'red'}
            onPress={() => {
              leave();
            }}
            Icon={() => {
              return <CallEnd height={26} width={26} fill="#FFF" />;
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localMicOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleMic();
            }}
            Icon={() => {
              return localMicOn ? (
                <MicOn height={24} width={24} fill="#FFF" />
              ) : (
                <MicOff height={28} width={28} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleCamera();
            }}
            Icon={() => {
              return localWebcamOn ? (
                <VideoOn height={24} width={24} fill="#FFF" />
              ) : (
                <VideoOff height={36} width={36} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={'transparent'}
            onPress={() => {
              switchCamera();
            }}
            Icon={() => {
              return <CameraSwitch height={24} width={24} fill="#FFF" />;
            }}
          />
        </View>
      </View>
    );
  };

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    case 'WEBRTC_ROOM':
      return WebrtcRoomScreen();
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  whiteText: {
    fontSize: 16,
    color: 'white',
  },
  smallBtn: {
    backgroundColor: '#059cfa',
    padding: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
