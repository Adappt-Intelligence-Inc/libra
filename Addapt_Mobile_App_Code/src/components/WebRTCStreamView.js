/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCRtpSender,
  MediaStream,
} from "react-native-webrtc";
import { responsiveScale } from "../styles/mixins";
import { color } from "../config/color";
import { FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR } from "../styles/typography";
import { useFocusEffect } from "@react-navigation/native";
import io from "socket.io-client";
import { setFaceEvents } from "../store/devicesReducer";
import { useDispatch } from "react-redux";
import InCallManager from "react-native-incall-manager";
import RNFS from "react-native-fs";
const WebRTCStreamView = forwardRef(
  (
    {
      roomName,
      extraVideoStyle,
      setNext,
      starttime = null,
      hidebtn,
      setDate,
      selectedDate,
      recording = false,
      sound,
      speak,
      stopRecording = false,
      imageData,
      identity = false,
      onSuccess,
      onFailed,
      reset = false,
      reboot = false,
    },
    ref
  ) => {
    const [localStream, setlocalStream] = useState(null);
    const dispatch = useDispatch();
    const [remoteStream, setRemoteStream] = useState(null);
    const [num, setNum] = useState(0);
    const [type, setType] = useState("JOIN");
    // roomName ="65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0"
    // const reliableSocket = useRef(
    //   new WebSocket(`wss://ipcamera.adapptonline.com`),
    // );

    // const roomName = "65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0";

    const Fail = () => {
      if (remoteStream === null) {
        console.log("failed", roomName);
        onFailed && onFailed();
      }
    };
    useFocusEffect(
      useCallback(() => {
        const timeoutId = setTimeout(() => {
          Fail();
        }, 20000); // Execute function after 20 seconds

        return () => clearTimeout(timeoutId); // Cleanup on component unmount or unfocus
      }, [remoteStream])
    );

    const socket = io("https://ipcamera.adapptonline.com", {
      transports: ["websocket"],
    });

    const [localMicOn, setlocalMicOn] = useState(true);

    const [localWebcamOn, setlocalWebcamOn] = useState(true);

    const peerConnection = useRef(
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
          {
            url: "turn:13.235.182.183:3478?transport=udp",
            credential: "test123",
            username: "test",
          },
        ],
      })
    );

    let remoteRTCMessage = useRef(null);
    let channelSnd = useRef(null);
    const dataChannelOptions = { ordered: true };
    var isChannelReady = true;
    var isStarted = false;
    let isInitiator = true;
    let isFront = false;

    useEffect(() => {
      InCallManager.start({ media: "video" });
      InCallManager.setKeepScreenOn(true);
      InCallManager.setForceSpeakerphoneOn(true);
      return () => {
        InCallManager.stop();
      };
    }, []);

    useEffect(() => {
      // peerConnection.current = new RTCPeerConnection({
      //   iceServers: [
      //     {
      //       urls: "stun:stun.l.google.com:19302",
      //     },
      //     {
      //       urls: "stun:stun1.l.google.com:19302",
      //     },
      //     {
      //       urls: "stun:stun2.l.google.com:19302",
      //     },
      //   ],
      // });
      isChannelReady = true;
      peerConnection.current.addTransceiver("audio");
      peerConnection.current.addTransceiver("video");
      // Setup ice handling
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("event.candidate", event.candidate);

          sendMessage({
            room: roomName,
            type: "candidate",
            candidate: event.candidate,
          });
        } else {
          console.log("End of candidates.");
        }
      };

      peerConnection.current.ontrack = ontrack;

      peerConnection.current.addEventListener(
        "iceconnectionstatechange",
        (e) => {
          console.log("eeeeeee", e);
          onIceStateChange(peerConnection.current, e);
        }
      );

      channelSnd.current = setupDataChannel(
        peerConnection.current,
        "chat",
        dataChannelOptions,
        starttime
      );

      console.log("socket", socket);
      // socket.emit('createorjoin', roomName, true);
      socket.on("created", function (room) {
        console.log("Created room " + room);
        isInitiator = true;
      });

      socket.on("join", function (room, id, numClients) {
        console.log("New peer, room: " + room + ", " + " client id: " + id);
        isChannelReady = true;
      });

      socket.on("joined", function (room, id, numClients) {
        console.log("joined: " + room + " with peerID: " + id);
        // log('joined: ' + room + ' with peerID: ' + id);
        isChannelReady = true;
        //peerID = id;
        maybestart();
        setNum(30);
        // onSuccess && onSuccess();
      });

      socket.on("message", function (message) {
        // console.log("Client received message:", message);
        //log('Client received message:', message);

        if (message === "got user media") {
          maybestart();
        } else if (message.type === "offer") {
          if (!isInitiator && !isStarted) {
            maybestart();
          }
          // remotePeerID=message.from;
          // log('got offfer from remotePeerID: ' + remotePeerID);

          // pc.setRemoteDescription(new RTCSessionDescription(message.desc));
          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(message.desc)
          );
          doAnswer();
        } else if (message.type === "answer") {
          console.log("message.type");
          // pc.setRemoteDescription(new RTCSessionDescription(message.desc));
          peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(message.desc)
          );
          setNum(60);
        } else if (message.type === "candidate") {
          var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.candidate.sdpMLineIndex,
            sdpMid: message.candidate.sdpMid,
            candidate: message.candidate.candidate,
          });
          // pc.addIceCandidate(candidate);
          if (peerConnection.current) {
            peerConnection?.current
              .addIceCandidate(candidate)
              .then((data) => {
                console.log(" candidate reation SUCCESS");
              })
              .catch((err) => {
                console.log("Error", err);
              });
          }
        } else if (message.type === "bye") {
          console.log("Camera state", message.desc);
          //log('Camera state:', message.desc);

          handleRemoteHangup();
        } else if (message.type === "error") {
          console.log("Camera state", message.desc);
          //log('Camera state:', message.desc);
          hangup();
        }
      });
      // isStarted = true;
      // peerConnection.current.onaddstream = (event) => {
      //   console.log('eventevent',event);
      //   setRemoteStream(event.stream);
      // };
      // peerConnection.current.addTransceiver("audio");
      // peerConnection.current.addTransceiver("video");
      // // Setup ice handling
      // peerConnection.current.onicecandidate = (event) => {
      //   if (event.candidate) {
      //     console.log("event.candidate", event.candidate);
      //     console.log("event.candidate12", event);
      //     // var candidate = new RTCIceCandidate({
      //     //   sdpMLineIndex: event.candidate.sdpMLineIndex,
      //     //   sdpMid: event.candidate.sdpMid,
      //     //   candidate: event.candidate.candidate,
      //     // });
      //     // sendICEcandidate({
      //     //   calleeId: otherUserId.current,
      //     //   rtcMessage: {
      //     //     label: event.candidate.sdpMLineIndex,
      //     //     id: event.candidate.sdpMid,
      //     //     candidate: event.candidate.candidate,
      //     //   },
      //     // });

      //     // sendMessage('ICE_CANDIDATE', {
      //     //   socketdpMLineIndex: event.candidate.sdpMLineIndex,
      //     //   sdpMid: event.candidate.sdpMid,
      //     //   candidate: event.candidate.candidate,
      //     // });

      //     sendMessage({
      //       room: roomName,
      //       type: "candidate",
      //       candidate: event.candidate,
      //     });
      //   } else {
      //     console.log("End of candidates.");
      //   }
      // };

      // peerConnection.current.ontrack = ontrack;

      // peerConnection.current.addEventListener("iceconnectionstatechange", (e) => {
      //   console.log("eeeeeee", e);
      //   onIceStateChange(peerConnection.current, e);
      // });

      // channelSnd.current = setupDataChannel(
      //   peerConnection.current,
      //   "chat",
      //   dataChannelOptions,
      //   starttime
      // );
      console.log("createorjoin");
      socket.emit("createorjoin", roomName, true);
      // return () => {
      //   handleEndCall();
      // };
      //createPeerConnection();
    }, []);

    useFocusEffect(
      useCallback(() => {
        return () => {
          isStarted = false;
          if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
          }
          sendMessage({
            room: roomName,
            type: "bye",
          });

          socket.disconnect();
        };
      }, [])
    );

    useImperativeHandle(ref, () => ({
      someFunction(data) {
        console.log("data==>>", data);
        sendData(data);
      },
    }));

    function setupDataChannel(pc, label, options, starttime) {
      try {
        let datachannel = pc.createDataChannel(label, options);
        console.log(`Created datachannel (${label})`);

        // Inform browser we would like binary data as an ArrayBuffer (FF chooses Blob by default!)
        datachannel.binaryType = "arraybuffer";

        datachannel.onopen = function (e) {
          console.log(`data channel (${label}) connect`);
          if (starttime) datachannel.send("recDates");
        };

        datachannel.onclose = function (e) {
          console.log(`data channel (${label}) closed`);
        };

        datachannel.onmessage = function (e) {
          console.log(`Got message (${label})`, e.data);
          var msg = JSON.parse(e.data);

          switch (msg.messageType) {
            case "IDENTITY_NOT_IN_GALLERY": {
              // dispatch(setFaceEvents(msg))
              break;
            }

            case "IDENTITY_RECOGNIZED": {
              // dispatch(setFaceEvents(msg))
              break;
            }

            case "RECORDING": {
              recordlist(msg.messagePayload);
              break;
            }
          }

          // recordlist(e.data);
        };

        datachannel.addEventListener("message", (message) => {
          // console.log("message1", message);
        });
        console.log("datachannel", datachannel);
        return datachannel;
      } catch (e) {
        console.warn("No data channel", e);
        return null;
      }
    }

    function recordlist(data) {
      let msg;
      // console.log("first: ", data);
      try {
        msg = JSON.parse(data);
      } catch (e) {
        msg = data;
        console.log(e); // error in the above string (in this case, yes)!
      }
      if (setDate) {
        setDate(msg);
      }

      // if (!msg.type) {
      //   console.log("datachannel data error %o", msg);
      //   return;
      // }

      // switch (msg.type) {
      //   case "recDates": {
      //     console.log("first: %o", msg.data);
      //     let dataa = msg.data;
      //     break;
      //   }

      //   default: {
      //     console.log(
      //       "WARNING: Ignoring unknown msg of messageType '" +
      //         msg.messageType +
      //         "'"
      //     );
      //     break;
      //   }
      // }
    }

    function handleRemoteHangup() {
      console.log("Session terminated.");
      stop();
    }

    function hangup() {
      console.log("Hanging up.");
      stop();
      sendMessage({
        room: roomName,
        type: "bye",
      });
    }

    function stop() {
      isStarted = false;
      if (peerConnection.current) {
        peerConnection.current.close();
      }

      // reliableSocket.current.close();
    }
    let inboundStream;

    function ontrack({ transceiver, receiver, streams: [stream] }) {
      console.log("transceiver", transceiver);
      console.log("receiver", receiver);
      console.log("Stream", stream);
      setRemoteStream(stream);
      onSuccess && onSuccess();
      // var track = transceiver.receiver.track;
      // var trackid = stream.id;

      // if (!inboundStream) {
      //   console.log("start");
      //   inboundStream = new MediaStream();
      // }
      // inboundStream.addTrack(track);
      // setRemoteStream(inboundStream);
      // console.log("inboundStream", JSON.stringify(inboundStream));

      // stream.onaddtrack = () => console.log("stream.onaddtrack");
      // stream.onremovetrack = () => console.log("stream.onremovetrack");
      // transceiver.receiver.track.onmute = () =>
      //   console.log("transceiver.receiver.track.onmute " + track.id);
      // transceiver.receiver.track.onended = () =>
      //   console.log("transceiver.receiver.track.onended " + track.id);
      // transceiver.receiver.track.onunmute = () =>
      //   console.log("transceiver.receiver.track.onunmute " + track.id);
    }

    function onIceStateChange(pc, event) {
      switch (pc.iceConnectionState) {
        case "checking":
          console.log("checking...");
          break;
        case "connected":
          console.log("connected...");
          break;
        case "completed":
          console.log("completed...");
          break;
        case "failed":
          console.log("failed...");
          break;
        case "disconnected":
          console.log("Peerconnection disconnected...");
          onFailed && onFailed();
          break;
        case "closed":
          console.log("failed...");
          break;
      }
    }

    // async function sendMessage(messageType, msg, timestamp) {
    //   console.log('Client sending message: ', messageType);
    //   if (timestamp)
    //     reliableSocket.current.send(
    //       JSON.stringify({
    //         messageType: messageType,
    //         messagePayload: msg,
    //         starttime: timestamp,
    //       }),
    //     );
    //   else
    //     reliableSocket.current.send(
    //       JSON.stringify({messageType: messageType, messagePayload: msg}),
    //     );
    // }

    function sendMessage(message) {
      console.log("Client sending message: ", message);
      // log('Client sending message: ', message);
      socket.emit("messageToWebrtc", message);
    }

    function maybestart(isFront) {
      // mediaDevices.enumerateDevices().then((sourceInfos) => {
      //   let videoSourceId;
      //   for (let i = 0; i < sourceInfos.length; i++) {
      //     const sourceInfo = sourceInfos[i];
      //     if (
      //       sourceInfo.kind == "videoinput" &&
      //       sourceInfo.facing == (isFront ? "user" : "environment")
      //     ) {
      //       videoSourceId = sourceInfo.deviceId;
      //     }
      //   }

      mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          // Got stream!

          // setlocalStream(stream);

          console.log("added localstream");
          // peerConnection.current.addStream(stream);
          stream
            .getTracks()
            .forEach((track) => peerConnection.current.addTrack(track, stream));
          stream.getAudioTracks().forEach((track) => {
            speak ? (track.enabled = true) : (track.enabled = false);
          });
          const transceiver = peerConnection.current
            .getTransceivers()
            .find(
              (t) => t.sender && t.sender.track === stream.getAudioTracks()[0]
            );
          const { codecs } = RTCRtpSender.getCapabilities("audio");
          const selectedCodecIndex = codecs.findIndex(
            (c) => c.mimeType === "audio/PCMA"
          );
          transceiver.setCodecPreferences([codecs[selectedCodecIndex]]);
          //   setType('OUTGOING_CALL');
          // socket.emit('createorjoin', roomName, true);

          isStarted = true;
          if (isInitiator == true) doCall();
        })
        .catch((error) => {
          // Log error
        });
      // });
    }

    var encType;

    async function doCall() {
      console.log("doCall", peerConnection);

      let sessionDescription = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(sessionDescription);
      // console.log("sessionDescription", sessionDescription);
      // sessionDescription.sdp = sessionDescription.sdp.replaceAll(
      //   "level-asymmetry-allowed=1",
      //   "level-asymmetry-allowed=1; Enc=" + encType
      // );
      if (starttime && starttime.length) {
        sessionDescription.sdp = sessionDescription.sdp.replaceAll(
          "level-asymmetry-allowed=1",
          "level-asymmetry-allowed=1; Enc=" + starttime
        );
      }

      console.log(" messageType %o ", sessionDescription.type);
      // console.log("setLocalAndSendMessage sending message", sessionDescription);

      // if (sessionDescription.type == 'answer')
      //   sendMessage('SDP_ANSWER', sessionDescription, starttime);
      // else if (sessionDescription.type == 'offer') {
      //   console.log(' messageType %o ', sessionDescription.type);
      //   sendMessage('SDP_OFFER', sessionDescription), starttime;
      // }
      sendMessage({
        room: roomName,
        type: sessionDescription.type,
        starttime: starttime ? starttime : undefined,
        camAudio: sound ? sound : false,
        appAudio: speak ? speak : false,
        desc: sessionDescription,
      });

      // sendCall({
      //   calleeId: otherUserId.current,
      //   rtcMessage: sessionDescription,
      // });
    }

    async function doAnswer() {
      // peerConnection.current.setRemoteDescription(
      //   new RTCSessionDescription(remoteRTCMessage.current),
      // );
      let sessionDescription = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(sessionDescription);
      if (starttime && starttime.length) {
        sessionDescription.sdp = sessionDescription.sdp.replaceAll(
          "level-asymmetry-allowed=1",
          "level-asymmetry-allowed=1; Enc=" + starttime
        );
      }

      // sessionDescription.sdp = sessionDescription.sdp.replaceAll(
      //   "level-asymmetry-allowed=1",
      //   "level-asymmetry-allowed=1; Enc=" + encType
      // );

      console.log(" messageType %o ", sessionDescription.type);
      sendMessage({
        room: roomName,
        type: sessionDescription.type,
        starttime: starttime ? starttime : undefined,
        camAudio: sound ? sound : false,
        appAudio: speak ? speak : false,
        desc: sessionDescription,
      });

      // if (sessionDescription.type == 'answer')
      //   sendMessage('SDP_ANSWER', sessionDescription, starttime);
      // else if (sessionDescription.type == 'offer') {
      //   console.log(' messageType %o ', sessionDescription.type);
      //   sendMessage('SDP_OFFER', sessionDescription, starttime);
      // }
    }

    // function answerCall(data) {
    //   socket.emit('answerCall', data);
    // }

    // function sendCall(data) {
    //   socket.emit('call', data);
    // }

    function switchCamera() {
      localStream.getVideoTracks().forEach((track) => {
        track._switchCamera();
      });
    }

    function toggleCamera() {
      localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
      localStream.getVideoTracks().forEach((track) => {
        localWebcamOn ? (track.enabled = false) : (track.enabled = true);
      });
    }

    function toggleMic() {
      localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
      localStream.getAudioTracks().forEach((track) => {
        localMicOn ? (track.enabled = false) : (track.enabled = true);
      });
    }

    function leave() {
      peerConnection.current.close();
      setlocalStream(null);
      // setType('JOIN');
    }

    // useEffect(() => {
    //   if (selectedDate) {
    //     var vsend = "starttime:" + selectedDate;
    //     channelSnd.current.send(vsend);
    //   }
    // }, [selectedDate]);

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

    useEffect(() => {
      if (reset) {
        resetCam();
      }
    }, [reset]);

    useEffect(() => {
      if (reboot) {
        rebootCam();
      }
    }, [reboot]);

    const StartRec = () => {
      console.log("startrec", channelSnd);
      channelSnd.current.send("startrec");
    };

    const StopRec = () => {
      channelSnd.current.send("stoprec");
    };

    const resetCam = () => {
      var data = {};
      data.messageType = "RESET";
      channelSnd.current.send(JSON.stringify(data));
    };

    const rebootCam = () => {
      var data = {}; // data object to transmit over data channel
      data.messageType = "REBOOT";
      channelSnd.current.send(JSON.stringify(data));
    };

    let fileReader;

    const Base64ToArrayBufferExample = (base64) => {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    };

    const sendData = async (fileData) => {
      try {
        // Array to store all promises for readFile and sending chunks
        const promises = fileData.map(async (element) => {
          try {
            const file = await RNFS.stat(element?.filePath);
            const fileSizeInMB = file.size;

            if (fileSizeInMB > 15728640) {
              Alert.alert(
                "File size error",
                "File size should be between 0 and 10 MB"
              );
              return; // Skip sending this file
            }

            const data = {
              name: element?.path?.fileName,
              messageType: "OTA",
              size: fileSizeInMB,
            };

            channelSnd.current.send(JSON.stringify(data));

            const contents = await RNFS.readFile(element?.filePath, "base64");
            const base64String = contents;
            var dataUrl =
              "data:application/octet-binary;base64," + base64String;

            const res = await fetch(dataUrl);
            const buffer = await res.arrayBuffer();

            const chunkSize = 16384; // 16 KB
            let offset = 0;
            const bufferData = new Uint8Array(buffer);

            const sendChunk = () => {
              if (offset < bufferData.length) {
                const end = Math.min(offset + chunkSize, bufferData.length);
                const slice = bufferData.slice(offset, end);
                console.log(`Sending chunk: ${offset} - ${end}`);
                channelSnd.current.send(slice);
                offset = end;
                setTimeout(sendChunk, 0); // Schedule next chunk
              } else {
                // Send end message
                const endData = {
                  name: element?.path?.fileName,
                  messageType: "OTA",
                  size: 0,
                };
                channelSnd.current.send(JSON.stringify(endData));
              }
            };

            sendChunk(); // Start sending chunks
          } catch (error) {
            console.log("Error processing file:", error);
          }
        });

        await Promise.all(promises); // Wait for all files to be processed

        console.log("All files sent");
      } catch (error) {
        console.log("senddata err:", error);
      }
    };

    // const sendData = async (fileData) => {
    //   try {
    //     console.log("fileData.length==>>", fileData, fileData.length);

    //     for (const element of fileData) {
    //       const file = await RNFS.stat(element?.filePath);

    //       console.log("file==>>", file, "file Size : ---", file.size);

    //       const fileSizeInMB = file.size;
    //       if (fileSizeInMB > 15728640) {
    //         // 10485760
    //         console.log("File Size:----", file.size);
    //         Alert.alert(
    //           "File size error",
    //           "File size should be between 0 and 10 MB"
    //         );
    //         continue;
    //       }

    //       const data = {
    //         name: element?.path?.fileName,
    //         messageType: "OTA",
    //         //path: file.path,
    //         size: fileSizeInMB,
    //       };

    //       channelSnd.current.send(JSON.stringify(data));

    //       console.log("data==>>", data);

    //       RNFS.readFile(element?.filePath, "base64")
    //         .then((contents) => {
    //           const base64String = contents;
    //           var dataUrl =
    //             "data:application/octet-binary;base64," + base64String;

    //           fetch(dataUrl)
    //             .then((res) => res.arrayBuffer())
    //             .then((buffer) => {
    //               const chunkSize = 16384; // 16 KB
    //               let offset = 0;

    //               const bufferData = new Uint8Array(buffer);
    //               console.log("base64 to buffer: ", bufferData.length);

    //               const sendChunk = () => {
    //                 if (offset < bufferData.length) {
    //                   const end = Math.min(
    //                     offset + chunkSize,
    //                     bufferData.length
    //                   );
    //                   const slice = bufferData.slice(offset, end);

    //                   console.log(`Sending chunk: ${offset} - ${end}`);
    //                   channelSnd.current.send(slice);
    //                   offset = end;

    //                   setTimeout(sendChunk, 0); // Schedule next chunk
    //                 } else {
    //                   console.log("All chunks sent");

    //                   // Send end message
    //                   const endData = {
    //                     name: element?.path?.fileName,
    //                     messageType: "OTA",
    //                     size: 0,
    //                   };
    //                   channelSnd.current.send(JSON.stringify(endData));
    //                 }
    //               };

    //               sendChunk(); // Start sending chunks
    //             })
    //             .catch((error) => {
    //               console.log("Error fetching data URL:", error.message);
    //             });
    //         })
    //         .catch((error) => {
    //           console.log("Error reading file:", error.message);
    //         });
    //     }
    //   } catch (error) {
    //     console.log("senddata err==>>", error);
    //   }
    // };

    // const sendData = async (filePath, currentVersion, downloadFileResponse) => {
    //   // try {
    //   //   // RNFS.readFile(filePath, "base64")
    //   //   //   .then((contents) => {
    //   //   //     // console.log("File contents:", contents);
    //   //   //     // Use the contents here as needed
    //   //   //   })
    //   //   //   .catch((error) => {
    //   //   //     console.log("Error reading file:", error.message);
    //   //   //   });
    //   //   const file = await RNFS.stat(filePath);
    //   //   console.log("File details:", file);
    //   //   var data = {}; // data object to transmit over data channel
    //   //   data.name = currentVersion.fileName;
    //   //   data.messageType = "OTA";
    //   //   data.size = file.size;
    //   //   console.log("data==>>", data);
    //   //   channelSnd.current.send(JSON.stringify(data));
    //   //   setTimeout(async () => {
    //   //     await RNFS.unlink(filePath);
    //   //     console.log("FILE DELETED =--->");
    //   //   }, 10000);
    //   // } catch (error) {
    //   //   console.error("sendData error", error);
    //   // }
    //   // try {
    //   //   // const file = await DocumentPicker.pick({
    //   //   //   type: [DocumentPicker.types.allFiles],
    //   //   // });
    //   //   const file = await RNFS.stat(filePath);
    //   //   console.log("file==>>", file);
    //   //   // Handle 0 size files.
    //   //   if (file.size === 0) {
    //   //     console.log("File is empty, please select a non-empty file");
    //   //     return;
    //   //   }
    //   //   // Prepare data to transmit over data channel
    //   //   let data = {};
    //   //   data.name = currentVersion.fileName;
    //   //   data.messageType = "OTA";
    //   //   data.size = file.size;
    //   //   // Send initial metadata
    //   //   channelSnd.current.send(JSON.stringify(data));
    //   //   setTimeout(() => {
    //   //     RNFS.readFile(filePath, "base64")
    //   //       .then((contents) => {
    //   //         // const base64String = contents; // Your base64 string here
    //   //         // const arrayBuffer = Base64ToArrayBufferExample(base64String);
    //   //         // console.log("contents==>>", contents);
    //   //         channelSnd.current.send(JSON.stringify(contents));
    //   //         // console.log("File contents:", contents);
    //   //       })
    //   //       .catch((error) => {
    //   //         console.log("Error reading file:", error.message);
    //   //       });
    //   //   }, 500);
    //   // } catch (err) {
    //   //   console.error("Error while picking file:", err);
    //   //   // if (DocumentPicker.isCancel(err)) {
    //   //   //   // User cancelled the picker
    //   //   //   console.log("User cancelled file selection");
    //   //   // } else {
    //   //   //   console.error("Error while picking file:", err);
    //   //   // }
    //   // }
    //   // channel.join;
    //   // var data = {}; // data object to transmit over data channel
    //   // data.name = "sumanth.txt";
    //   // data.messageType = "OTA";
    //   // data.size = 10;
    //   // channelSnd.current.send(JSON.stringify(data));
    //   // console.log("12345===>>>>");
    //   // var myText = "1234567890";
    //   // const buffer = arraybuffer(myText);
    //   // console.log("buffer==>>", buffer);
    //   // channelSnd.current.send(buffer);
    //   // var data1 = {}; // data object to transmit over data channel
    //   // data1.name = "sumanth.txt";
    //   // data1.messageType = "OTA";
    //   // data1.size = 0;
    //   // channelSnd.current.send(JSON.stringify(data1));
    // };

    // const arraybuffer = (buffer) => {
    //   console.log("111==>> 11", buffer);
    //   // const view = new DataView(buffer);

    //   // const numBytes = view.byteLength;

    //   // const interval = Math.floor(numBytes / 32);
    //   // console.log("111==>> 44", interval);

    //   // var currentIndex = 0;
    //   // var digest = "";
    //   // while (currentIndex < numBytes) {
    //   //   digest += view.getInt8(currentIndex);
    //   //   currentIndex += interval;
    //   // }
    //   // console.log("digest==>>", digest);
    //   // return digest;

    //   const uint8Array = new Uint8Array(buffer);
    //   console.log("111==>> 22", uint8Array);

    //   // Create an ArrayBuffer from the Uint8Array
    //   const arrayBuffer = uint8Array.buffer;
    //   console.log("111==>> 33", arrayBuffer);

    //   return arrayBuffer;
    // };

    useEffect(() => {
      if (identity) {
        sendIdentity();
      }
    }, [identity]);

    const sendIdentity = () => {
      console.log("imageData", JSON.stringify(imageData));
      channelSnd.current.send(JSON.stringify(imageData));
    };

    // useEffect(() => {
    //   setTimeout(() => {
    //     console.log("pauseStream");
    //     pauseStream();
    //   }, 10000);
    // }, []);
    // const pauseStream = () => {
    //   if (remoteStream) {
    //     remoteStream.getTracks().forEach((track) => track.stop());
    //   }
    // };

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
            objectFit={"contain"}
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
              backgroundColor={color.DARK_GRAY_5}
            >
              {(fill) => (
                <Text style={styles.loadingText}>{parseInt(fill) + "%"}</Text>
              )}
            </AnimatedCircularProgress>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
    position: "absolute",
    width: "90%",
    bottom: 0,
    alignSelf: "center",
  },
  thumbStyle: {
    width: 15,
    height: 15,
    borderColor: color.WHITE,
    borderWidth: 3,
  },
});

export default WebRTCStreamView;
