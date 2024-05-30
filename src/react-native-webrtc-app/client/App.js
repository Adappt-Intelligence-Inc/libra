// import React, {useEffect, useState, useRef} from 'react';
// import {
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import TextInputContainer from './components/TextInputContainer';
// import SocketIOClient from 'socket.io-client';
// import {
//   mediaDevices,
//   RTCPeerConnection,
//   RTCView,
//   RTCIceCandidate,
//   RTCSessionDescription,
// } from 'react-native-webrtc';
// import CallEnd from './asset/CallEnd';
// import CallAnswer from './asset/CallAnswer';
// import MicOn from './asset/MicOn';
// import MicOff from './asset/MicOff';
// import VideoOn from './asset/VideoOn';
// import VideoOff from './asset/VideoOff';
// import CameraSwitch from './asset/CameraSwitch';
// import IconContainer from './components/IconContainer';
// import InCallManager from 'react-native-incall-manager';

// export default function App({}) {
//   const [localStream, setlocalStream] = useState(null);

//   const [remoteStream, setRemoteStream] = useState(null);

//   const [type, setType] = useState('JOIN');

//   const [callerId] = useState(
//     Math.floor(100000 + Math.random() * 900000).toString(),
//   );
//   const otherUserId = useRef(null);

//   // const socket = SocketIOClient('http://192.168.1.19:3500', {
//   //   transports: ['websocket'],
//   //   query: {
//   //     callerId,
//   //   },
//   // });

//   const reliableSocket = useRef(new WebSocket(`wss://ipcamera.adapptonline.com`));

//   const [localMicOn, setlocalMicOn] = useState(true);

//   const [localWebcamOn, setlocalWebcamOn] = useState(true);

//   const peerConnection = useRef(
//     new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: 'stun:stun.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun1.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun2.l.google.com:19302',
//         },
//       ],
//     }),
//   );

//   let remoteRTCMessage = useRef(null);

//   // useEffect(() => {
//   //   socket.on('newCall', data => {
//   //     remoteRTCMessage.current = data.rtcMessage;
//   //     otherUserId.current = data.callerId;
//   //     setType('INCOMING_CALL');
//   //   });

//   //   socket.on('callAnswered', data => {
//   //     remoteRTCMessage.current = data.rtcMessage;
//   //     peerConnection.current.setRemoteDescription(
//   //       new RTCSessionDescription(remoteRTCMessage.current),
//   //     );
//   //     setType('WEBRTC_ROOM');
//   //   });

//   //   socket.on('ICEcandidate', data => {
//   //     let message = data.rtcMessage;

//   //     if (peerConnection.current) {
//   //       peerConnection?.current
//   //         .addIceCandidate(
//   //           new RTCIceCandidate({
//   //             candidate: message.candidate,
//   //             sdpMid: message.id,
//   //             sdpMLineIndex: message.label,
//   //           }),
//   //         )
//   //         .then(data => {
//   //           console.log('SUCCESS');
//   //         })
//   //         .catch(err => {
//   //           console.log('Error', err);
//   //         });
//   //     }
//   //   });

//   //   let isFront = false;

//   //   return () => {
//   //     socket.off('newCall');
//   //     socket.off('callAnswered');
//   //     socket.off('ICEcandidate');
//   //   };
//   // }, []);
//   useEffect(() => {

//     let isInitiator = false;
//     let isFront = false;
//     let room =  "room9";

//     peerConnection.current.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };

//     // Setup ice handling
//     peerConnection.current.onicecandidate = event => {
//       if (event.candidate) {
//         // sendICEcandidate({
//         //   calleeId: otherUserId.current,
//         //   rtcMessage: {
//         //     label: event.candidate.sdpMLineIndex,
//         //     id: event.candidate.sdpMid,
//         //     candidate: event.candidate.candidate,
//         //   },
//         // });

//           sendMessage( "ICE_CANDIDATE", {
//           socketdpMLineIndex: event.candidate.sdpMLineIndex,
//           sdpMid: event.candidate.sdpMid,
//           candidate: event.candidate.candidate
//         });

//       } else {
//         console.log('End of candidates.');
//       }
//     };

//     reliableSocket.current.onopen = msg => {

//      console.log("reliableSocket is open and ready to use");
//        setType('JOIN');
//        reliableSocket.current.send(JSON.stringify( {"messageType": "createorjoin" , "room": room}));
//     };

//     //when we get a message from a signaling server
//     reliableSocket.current.onmessage = event => {

//       const msg = JSON.parse(event.data);
//       console.log('onmessage --------------------->', msg);

//       // switch (data.type) {
//       //   //when another user is calling us
//       //   case 'newCall':
//       //     handleNewCall(data);
//       //     break;

//       //   //when somebody wants to call us
//       //   case 'acceptCall':
//       //     handleAcceptCall(data);
//       //     break;

//       //   //when a remote peer sends an ice candidate to us
//       //   case 'ICEcandidate':
//       //     handleICEcandidate(data);
//       //     break;

//       //   //when the other user rejects the call
//       //   case 'CancelCall':
//       //     handleCancelCall(data);

//       //   //when the other user rejects the call
//       //   case 'rejectCall':
//       //     handleRejectCall(data);

//       //   //when the other user ends the call
//       //   case 'endCall':
//       //     handleEndCall(data);
//       //     break;
//       // }

//        switch (msg.messageType) {
//              case "join":

//             console.log('Another peer made a request to join room ' + room);
//             console.log('This peer is the initiator of room ' + room + '!');

//             break;
//           case "joined":
//             {

//             //isChannelReady = true;
//               isInitiator = true;

//               console.log('joined and ready to make offer');

//               maybestart(isInitiator, isFront);

//             break;
//             }
//            case "SDP_OFFER":
//             {
//                    maybestart(false, isFront);

//                   // if (!isInitiator && !isStarted)
//                   // {
//                   //   maybeStart();
//                   // }
//                      peerConnection.current.setRemoteDescription(new RTCSessionDescription(msg.messagePayload));
//                      doAnswer();

//                 break;
//             }
//           case "SDP_ANSWER":
//            {
//               // if(isStarted) {
//               //   console.log("received answer %o",  msg.messagePayload);
//               //   pc.setRemoteDescription(new RTCSessionDescription(msg.messagePayload));
//               // }

//               if(isInitiator) {
//                 console.log("received answer %o",  msg.messagePayload);
//                peerConnection.current.setRemoteDescription(new RTCSessionDescription(msg.messagePayload) );
//                setType('WEBRTC_ROOM');
//              }

//               break;
//            }
//           case "ICE_CANDIDATE":
//            {

//               // if(isStarted)
//               // {
//               //     var candidate = new RTCIceCandidate({
//               //       sdpMLineIndex: 0,
//               //       candidate: msg.messagePayload.candidate
//               //     });
//               //     pc.addIceCandidate(candidate);
//               // }

//                     if (peerConnection.current) {
//                     peerConnection?.current
//                       .addIceCandidate(
//                         new RTCIceCandidate({
//                           candidate: msg.messagePayload.candidate,
//                           sdpMid: msg.messagePayload.sdpMid,
//                           sdpMLineIndex: msg.messagePayload.sdpMLineIndex,
//                         }),
//                       )
//                       .then(data => {
//                         console.log(' candidate reation SUCCESS');
//                       })
//                       .catch(err => {
//                         console.log('Error', err);
//                       });
//                   }

//                break;
//            }

//             case "bye":
//             {

//               // if(isStarted)
//               // {
//               //   handleRemoteHangup();
//               // }
//               break;
//             }

//             default:
//             {
//               console.log("WARNING: Ignoring unknown msg of messageType '" + msg.messageType + "'");
//               break;
//             }

//           };

//     };

//     // const handleNewCall = data => {
//     //   console.log('\n\n\n\n INCOMING_CALL \n\n\n\n');
//     //   remoteRTCMessage.current = data.rtcMessage;
//     //   otherUserId.current = data.callerId;
//     //   setType('INCOMING_CALL');
//     // };

//     // const handleAcceptCall = data => {
//     //   console.log('\n\n\n\n CALL_ANSWERED \n\n\n\n');
//     //   remoteRTCMessage.current = data.rtcMessage;
//     //   peerConnection.current.setRemoteDescription(
//     //     new RTCSessionDescription(remoteRTCMessage.current),
//     //   );
//     //   setType('WEBRTC_ROOM');
//     // };

//     // const handleICEcandidate = data => {
//     //   console.log('\n\n\n\n ICE_CANDIDATE \n\n\n\n');
//     //   let message = data.rtcMessage;

//     //   if (peerConnection.current) {
//     //     peerConnection?.current
//     //       .addIceCandidate(
//     //         new RTCIceCandidate({
//     //           candidate: message.candidate,
//     //           sdpMid: message.id,
//     //           sdpMLineIndex: message.label,
//     //         }),
//     //       )
//     //       .then(data => {
//     //         console.log('SUCCESS');
//     //       })
//     //       .catch(err => {
//     //         console.log('Error', err);
//     //       });
//     //   }
//     // };

//     // const handleCancelCall = data => {
//     //   peerConnection.current.close();
//     //   setlocalStream(null);
//     //   setType('JOIN');
//     //   //createPeerConnection();
//     // };

//     // const handleRejectCall = data => {
//     //   peerConnection.current.close();
//     //   setlocalStream(null);
//     //   setType('JOIN');
//     //  // createPeerConnection();
//     // };

//     // const handleEndCall = data => {
//     //   peerConnection.current.close();
//     //   setlocalStream(null);
//     //   setType('JOIN');
//     //   //createPeerConnection();
//     // };

//     reliableSocket.current.onerror = function (err) {
//       console.log('Got error', err);
//     };

//     //createPeerConnection();
//   }, []);

//   useEffect(() => {
//     InCallManager.start();
//     InCallManager.setKeepScreenOn(true);
//     InCallManager.setForceSpeakerphoneOn(true);

//     return () => {
//       InCallManager.stop();
//     };
//   }, []);

//   function sendICEcandidate(data) {
//     socket.emit('ICEcandidate', data);
//   }

//   async function sendMessage(messageType,  msg) {

//      console.log('Client sending message: ', messageType);

//      reliableSocket.current.send(JSON.stringify({"messageType": messageType, "messagePayload": msg}));

//   }

//    function maybestart(isInitiator , isFront )
//    {

//        mediaDevices.enumerateDevices().then(sourceInfos => {
//             let videoSourceId;
//             for (let i = 0; i < sourceInfos.length; i++) {
//               const sourceInfo = sourceInfos[i];
//               if (
//                 sourceInfo.kind == 'videoinput' &&
//                 sourceInfo.facing == (isFront ? 'user' : 'environment')
//               ) {
//                 videoSourceId = sourceInfo.deviceId;
//               }
//             }

//             mediaDevices
//               .getUserMedia({
//                 audio: true,
//                 video: {
//                   mandatory: {
//                     minWidth: 500, // Provide your own width, height and frame rate here
//                     minHeight: 300,
//                     minFrameRate: 30,
//                   },
//                   facingMode: isFront ? 'user' : 'environment',
//                   optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//                 },
//               })
//               .then(stream => {
//                 // Got stream!

//                 setlocalStream(stream);

//                 console.log("added localstream");
//                 peerConnection.current.addStream(stream);

//                  setType('OUTGOING_CALL');

//                  if( isInitiator == true)
//                  processCall();

//               })
//               .catch(error => {
//                 // Log error
//               });
//           });

//    }

//   async function processCall() {

//     console.log('processCall');

//     const sessionDescription = await peerConnection.current.createOffer();
//     await peerConnection.current.setLocalDescription(sessionDescription);

//       console.log(' messageType %o ', sessionDescription.type);

//       if( sessionDescription.type == "answer")
//       sendMessage( "SDP_ANSWER", sessionDescription);
//       else if( sessionDescription.type == "offer")
//       {
//         console.log(' messageType %o ', sessionDescription.type);
//         sendMessage( "SDP_OFFER", sessionDescription);

//       }

//     // sendCall({
//     //   calleeId: otherUserId.current,
//     //   rtcMessage: sessionDescription,
//     // });
//   }

//    async function doAnswer() {
//      peerConnection.current.setRemoteDescription(
//        new RTCSessionDescription(remoteRTCMessage.current),
//      );
//      const sessionDescription = await peerConnection.current.createAnswer();
//      await peerConnection.current.setLocalDescription(sessionDescription);

//      console.log(' messageType %o ', sessionDescription.type);

//       if( sessionDescription.type == "answer")
//       sendMessage( "SDP_ANSWER", sessionDescription);
//       else if( sessionDescription.type == "offer")
//       {
//         console.log(' messageType %o ', sessionDescription.type);
//         sendMessage( "SDP_OFFER", sessionDescription);

//       }

//    }

//   // function answerCall(data) {
//   //   socket.emit('answerCall', data);
//   // }

//   // function sendCall(data) {
//   //   socket.emit('call', data);
//   // }

//   const JoinScreen = () => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           justifyContent: 'center',
//           paddingHorizontal: 42,
//         }}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <>
//             <View
//               style={{
//                 padding: 35,
//                 backgroundColor: '#1A1C22',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Your Caller ID
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   marginTop: 12,
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 32,
//                     color: '#ffff',
//                     letterSpacing: 6,
//                   }}>
//                   {callerId}
//                 </Text>
//               </View>
//             </View>

//             <View
//               style={{
//                 backgroundColor: '#1A1C22',
//                 padding: 40,
//                 marginTop: 25,
//                 justifyContent: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Enter call id of another user
//               </Text>
//               <TextInputContainer
//                 placeholder={'Enter Caller ID'}
//                 value={otherUserId.current}
//                 setValue={text => {
//                   otherUserId.current = text;
//                   console.log('TEST', otherUserId.current);
//                 }}
//                 keyboardType={'number-pad'}
//               />
//               <TouchableOpacity
//                 onPress={() => {
//                   setType('OUTGOING_CALL');
//                   processCall();
//                 }}
//                 style={{
//                   height: 50,
//                   backgroundColor: '#5568FE',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderRadius: 12,
//                   marginTop: 16,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: '#FFFFFF',
//                   }}>
//                   Call Now
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     );
//   };

//   const OutgoingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               color: '#D0D4DD',
//             }}>
//             Calling to...
//           </Text>

//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//               letterSpacing: 6,
//             }}>
//             {otherUserId.current}
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               setType('JOIN');
//               otherUserId.current = null;
//             }}
//             style={{
//               backgroundColor: '#FF5D5D',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallEnd width={50} height={12} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const IncomingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//             }}>
//             {otherUserId.current} is calling..
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               processAccept();
//               setType('WEBRTC_ROOM');
//             }}
//             style={{
//               backgroundColor: 'green',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallAnswer height={28} fill={'#fff'} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   function switchCamera() {
//     localStream.getVideoTracks().forEach(track => {
//       track._switchCamera();
//     });
//   }

//   function toggleCamera() {
//     localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
//     localStream.getVideoTracks().forEach(track => {
//       localWebcamOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function toggleMic() {
//     localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
//     localStream.getAudioTracks().forEach(track => {
//       localMicOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function leave() {
//     peerConnection.current.close();
//     setlocalStream(null);
//     setType('JOIN');
//   }

//   const WebrtcRoomScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           paddingHorizontal: 12,
//           paddingVertical: 12,
//         }}>
//         {localStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{flex: 1, backgroundColor: '#050A0E'}}
//             streamURL={localStream.toURL()}
//           />
//         ) : null}
//         {remoteStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{
//               flex: 1,
//               backgroundColor: '#050A0E',
//               marginTop: 8,
//             }}
//             streamURL={remoteStream.toURL()}
//           />
//         ) : null}
//         <View
//           style={{
//             marginVertical: 12,
//             flexDirection: 'row',
//             justifyContent: 'space-evenly',
//           }}>
//           <IconContainer
//             backgroundColor={'red'}
//             onPress={() => {
//               leave();
//             }}
//             Icon={() => {
//               return <CallEnd height={26} width={26} fill="#FFF" />;
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localMicOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleMic();
//             }}
//             Icon={() => {
//               return localMicOn ? (
//                 <MicOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <MicOff height={28} width={28} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleCamera();
//             }}
//             Icon={() => {
//               return localWebcamOn ? (
//                 <VideoOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <VideoOff height={36} width={36} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={'transparent'}
//             onPress={() => {
//               switchCamera();
//             }}
//             Icon={() => {
//               return <CameraSwitch height={24} width={24} fill="#FFF" />;
//             }}
//           />
//         </View>
//       </View>
//     );
//   };

//   switch (type) {
//     case 'JOIN':
//       return JoinScreen();
//     case 'INCOMING_CALL':
//       return IncomingCallScreen();
//     case 'OUTGOING_CALL':
//       return OutgoingCallScreen();
//     case 'WEBRTC_ROOM':
//       return WebrtcRoomScreen();
//     default:
//       return null;
//   }
// }

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import WebRTC from './webRTC';
import WebRTCSocket from './WebRTCStreamView';

const App = () => {
  const [userName, setUserName] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [roomName, setRoomName] = useState('room9');
  const [addRoomName, setAddRoomName] = useState('');
  const [addDevice, setAddDevice] = useState('');
  const [token, setToken] = useState('');
  const [login, setLogin] = useState(false);
  const [next, setNext] = useState(false);
  const [date, setDate] = useState([]);
  const [selectedDate, setSeleDate] = useState('');
  const [list, setList] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRecordingModalVisible, setRecordingModalVisible] = useState(false);
  console.log('date', date);

  const Login = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      uname: userName,
      psw: password,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://ipcamera.adapptonline.com:8080/api/login', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log('result', result);
        setToken(result);
        setLogin(true);
        getList(result);
      })
      .catch(error => console.error(error));
  };

  const getList = token => {
    const myHeaders = new Headers();
    myHeaders.append('token', token);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch('https://ipcamera.adapptonline.com:8080/api/camtree', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log('result', result);
        console.log(JSON.parse(result)), setList(JSON.parse(result));
      })
      .catch(error => console.error(error));
  };

  const onPress = () => {
    if (login) {
      setNext(true);
    } else {
      Login();
    }
  };

  const saveRegister = () => {
    const myHeaders = new Headers();
    myHeaders.append('token', token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      [addDevice]: addRoomName,
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://ipcamera.adapptonline.com:8080/api/put', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        getList(token);
        setModalVisible(false);
        setAddDevice('');
        setAddRoomName('');
      })
      .catch(error => console.error(error));
  };

  const deleteDevice = (data, name) => {
    const myHeaders = new Headers();
    myHeaders.append('token', token);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      [data]: name,
    });

    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://ipcamera.adapptonline.com:8080/api/del', requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result), getList(token);
      })
      .catch(error => console.error(error));
  };

  const DateConvert = timestamp => {
    const date = new Date(parseInt(timestamp));

    // Format the date
    const formattedDate = `${('0' + date.getDate()).slice(-2)}/${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;

    // Format the time
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Combine date and time
    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return formattedDateTime;
  };

  return (
    <>
      <WebRTCSocket
        // roomName={'65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0'}
        extraVideoStyle={styles.extraVideoStyle}
      />
      {/* {!next ? (
        <View style={styles.container}>
          {!login ? (
            <View style={{width: '90%'}}>
              <Text style={styles.text}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUserName}
                value={userName}
                placeholder="Username"
                placeholderTextColor={'grey'}
              />
              <Text style={styles.text}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                placeholderTextColor={'grey'}
              />
              <TouchableOpacity
                style={[styles.btn, login && {marginBottom: 50}]}
                onPress={onPress}>
                <Text style={styles.whiteText}>
                  {!login ? 'Login' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={{width: '90%', paddingVertical: 30}}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={[
                    styles.smallBtn,
                    {marginBottom: 20, backgroundColor: '#059cfa', width: 120},
                  ]}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styles.whiteText}>{'Register'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.smallBtn,
                    {
                      marginBottom: 20,
                      marginLeft: 20,
                      backgroundColor: '#059cfa',
                      width: 120,
                    },
                  ]}
                  onPress={() => setRecordingModalVisible(true)}>
                  <Text style={styles.whiteText}>{'Recording'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: 20}}>
                {Object.keys(list).map(item => {
                  return (
                    <View style={{marginBottom: 20}}>
                      <Text style={[styles.boldText, {marginBottom: 10}]}>
                        {item} :-{' '}
                        <Text style={styles.text}>{list[item].video}</Text>
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          style={[
                            styles.smallBtn,
                            {backgroundColor: '#ff0000'},
                          ]}
                          // onPress={() => deleteDevice(list[item].video, item)}
                        >
                          <Text style={styles.whiteText}>{'Delete'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.smallBtn,
                            {backgroundColor: '#fc0ad8'},
                          ]}
                          onPress={() => {
                            console.log('asda', item);
                            setRoomName(list[item].video);
                            setNext(true);
                          }}>
                          <Text style={styles.whiteText}>{'View'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.smallBtn}
                          // onPress={}
                        >
                          <Text style={styles.whiteText}>{'Save'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.text}>Room Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setRoomName}
                value={roomName}
                placeholder="Password"
                placeholderTextColor={'grey'}
              />
              <TouchableOpacity style={[styles.btn]} onPress={onPress}>
                <Text style={styles.whiteText}>
                  {!login ? 'Login' : 'Next'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            style={styles.modelContainerStyle}
            onBackdropPress={() => {
              setModalVisible(false);
            }}>
            <View style={styles.modelContainerStyle}>
              <View style={styles.modalContentStyle}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.position}>
                  <Text style={styles.text}>Close</Text>
                </TouchableOpacity>
                <Text style={[styles.boldText, {marginTop: 20}]}>
                  Register Devices
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setAddDevice}
                  value={addDevice}
                  placeholder="EnterCamraID_WhichStartwith_65XX"
                  placeholderTextColor={'grey'}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setAddRoomName}
                  value={addRoomName}
                  placeholder="Room7"
                  placeholderTextColor={'grey'}
                />
                <TouchableOpacity
                  style={[
                    styles.smallBtn,
                    {backgroundColor: '#059cfa', width: 120},
                  ]}
                  onPress={() => saveRegister()}>
                  <Text style={styles.whiteText}>{'Save'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isRecordingModalVisible}
            style={styles.modelContainerStyle}
            onBackdropPress={() => {
              setRecordingModalVisible(false);
            }}>
            <View style={styles.modelContainerStyle}>
              <View style={styles.modalContentStyle}>
                <TouchableOpacity
                  onPress={() => setRecordingModalVisible(false)}
                  style={styles.position}>
                  <Text style={styles.text}>Close</Text>
                </TouchableOpacity>
                <Text style={[styles.boldText, {marginTop: 20}]}>
                  Recording
                </Text>
                <View style={{marginBottom: 20, width: '100%'}}>
                  <Text style={[styles.boldText, {marginBottom: 10}]}>
                    {'Room8'}
                  </Text>
                  <Text style={styles.text}>Recording list here</Text>
                </View>
                {date.map(item => {
                  return (
                    <TouchableOpacity onPress={() => setSeleDate(item)}>
                      <Text style={styles.text}>{DateConvert(item)}</Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={{height: 200, width: '100%'}}>
                  {isRecordingModalVisible && (
                    <WebRTC
                      roomName={
                        '65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0'
                      }
                      setNext={setNext}
                      starttime={'1'}
                      hidebtn={true}
                      setDate={setDate}
                      selectedDate={selectedDate}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <WebRTC roomName={roomName} setNext={setNext} />
      )} */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },
  boldText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '700',
  },
  whiteText: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    color: 'black',
    borderRadius: 8,
  },
  btn: {
    backgroundColor: '#1374f2',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBtn: {
    backgroundColor: '#008000',
    paddingVertical: 5,
    borderRadius: 8,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
    padding: 0,
    width: '100%',
  },
  modalContentStyle: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '90%',
    borderRadius: 10,
    alignItems: 'center',
  },
  extraVideoStyle: {
    backgroundColor: 'black',
    borderRadius: 10,
    height: '50%',
    width: '100%',
  },
  position: {position: 'absolute', top: 10, right: 10},
});
