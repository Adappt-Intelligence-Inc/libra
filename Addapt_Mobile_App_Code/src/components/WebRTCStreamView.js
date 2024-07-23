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
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
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
      uploadFinished = () => {},
      uploadPercentage = () => {},
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
        iceTransportPolicy: "all",
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
        sdpSemantics: "unified-plan",
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

    const handleReconnection = async () => {
      console.log("Attempting reconnection...");
      // Close and clean up the old peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current.onicecandidate = null;
        peerConnection.current.oniceconnectionstatechange = null;
        peerConnection.current.onconnectionstatechange = null;
      }

      const newPeerConnection = new RTCPeerConnection({
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
        iceTransportPolicy: "all",
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
        sdpSemantics: "unified-plan",
      });

      newPeerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendMessage({
            room: roomName,
            type: "candidate",
            candidate: event.candidate,
          });
        } else {
          console.log("End of candidates.");
        }
      };

      newPeerConnection.current.ontrack = ontrack;

      newPeerConnection.current.addEventListener(
        "iceconnectionstatechange",
        (e) => {
          console.log("eeeeeee", e);
          onIceStateChange(newPeerConnection.current, e);
        }
      );

      newPeerConnection.oniceconnectionstatechange = () => {
        if (
          newPeerConnection.iceConnectionState === "disconnected" ||
          newPeerConnection.iceConnectionState === "failed"
        ) {
          handleReconnection();
        }
      };

      newPeerConnection.onconnectionstatechange = () => {
        console.log(
          "Connection State Changed:",
          newPeerConnection.connectionState
        );
        if (
          newPeerConnection.connectionState === "disconnected" ||
          newPeerConnection.connectionState === "failed"
        ) {
          console.log(
            "Peer connection disconnected, attempting to reconnect..."
          );
          handleReconnection();
        }
      };

      newPeerConnection.current = newPeerConnection;

      try {
        const offer = newPeerConnection.createOffer({ iceRestart: true });
        await newPeerConnection.setLocalDescription(offer);
        // Send the offer to the remote peer and wait for the answer

        if (starttime && starttime.length) {
          offer.sdp = offer.sdp.replaceAll(
            "level-asymmetry-allowed=1",
            "level-asymmetry-allowed=1; Enc=" + starttime
          );
        }

        sendMessage({
          room: roomName,
          type: offer.type,
          starttime: starttime ? starttime : undefined,
          camAudio: sound ? sound : false,
          appAudio: speak ? speak : false,
          desc: offer,
        });
        // ...
      } catch (error) {
        console.error("Error during reconnection:", error);
      }
    };

    useImperativeHandle(ref, () => ({
      someFunction(data) {
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
          doCall();
          // socket.emit("createorjoin", roomName, true);
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

    const sendData = async (fileData) => {
      try {
        // Check if the peer connection is active
        if (
          !peerConnection ||
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "failed"
        ) {
          console.log(
            "Peer connection is not active, attempting to reconnect..."
          );
          await handleReconnection();
        }
        for (const element of fileData) {
          const file = await RNFS.stat(element?.filePath);
          // console.log("file==>>", file);
          const fileSizeInMB = file.size;
          if (fileSizeInMB > 20000000) {
            // 10485760
            Alert.alert(
              "File size error",
              "File size should be between 0 and 20 MB"
            );
            uploadFinished(false);
            await RNFS.unlink(element?.filePath);
            continue;
          }

          const data = {
            name: element?.path?.fileName,
            messageType: "OTA",
            size: file.size,
          };
          channelSnd.current.send(JSON.stringify(data));
          console.log("data==>>", data);

          if (Platform.OS === "ios") {
            RNFS.readFile(element?.filePath, "base64")
              .then((contents) => {
                const base64String = contents;
                var dataUrl =
                  "data:application/octet-binary;base64," + base64String;

                fetch(dataUrl)
                  .then((res) => res.arrayBuffer())
                  .then((buffer) => {
                    const chunkSize = 16384; // 16 KB
                    let offset = 0;

                    const bufferData = new Uint8Array(buffer);

                    const sendChunk = () => {
                      if (offset < bufferData.length) {
                        const end = Math.min(
                          offset + chunkSize,
                          bufferData.length
                        );
                        const slice = bufferData.slice(offset, end);
                        const progress = (end / file.size) * 100;
                        // console.log(
                        //   `Sending chunk: ${offset} - ${end} - ${progress}`
                        // );
                        uploadPercentage(progress);
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

                        setTimeout(async () => {
                          uploadFinished(true);
                          await RNFS.unlink(element?.filePath);
                          console.log("FILE DELETED =--->");
                        }, 5000);

                        console.log("All chunks sent");
                      }
                    };

                    sendChunk(); // Start sending chunks
                  })
                  .catch((error) => {
                    CustomeToast({
                      type: "error",
                      message: "File Uploaded Fail",
                    });
                    console.log("Error fetching data URL:", error.message);
                  });
              })
              .catch((error) => {
                CustomeToast({
                  type: "error",
                  message: "File Uploaded Fail",
                });
                console.log("Error reading file:", error.message);
              });
          } else {
            await RNFS.readFile(element?.filePath, "base64")
              .then((contents) => {
                const binaryString = atob(contents); // Decode base64 to binary string
                const buffer = new Uint8Array(binaryString.length);

                for (let i = 0; i < binaryString.length; i++) {
                  buffer[i] = binaryString.charCodeAt(i);
                }

                const chunkSize = 16384; // 16 KB
                let offset = 0;

                const sendChunk = async () => {
                  if (offset < buffer.length) {
                    const end = Math.min(offset + chunkSize, buffer.length);
                    const slice = buffer.slice(offset, end);
                    // console.log(`Sending chunk: ${offset} - ${end}`);
                    const progress = (end / file.size) * 100;
                    uploadPercentage(progress);
                    await channelSnd.current.send(slice);
                    offset = end;

                    setTimeout(sendChunk, 50); // Schedule next chunk
                  } else {
                    // Send end message
                    const endData = {
                      name: element?.path?.fileName,
                      messageType: "OTA",
                      size: 0,
                    };
                    channelSnd.current.send(JSON.stringify(endData));

                    setTimeout(async () => {
                      uploadFinished(true);
                      await RNFS.unlink(element?.filePath);
                      console.log("FILE DELETED =--->");
                    }, 5000);

                    console.log("All chunks sent");
                  }
                };

                sendChunk(); // Start sending chunks
              })
              .catch(async (error) => {
                await RNFS.unlink(element?.filePath);
                console.log("Error reading file:", error.message);
                CustomeToast({
                  type: "error",
                  message: "File Uploaded Fail",
                });
              });
          }
        }
      } catch (error) {
        CustomeToast({
          type: "error",
          message: "File Uploaded Fail",
        });
        console.log("senddata err==>>", error);
      }
    };

    // Utility function to decode base64
    function atob(input) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      let str = input.replace(/=+$/, "");
      let output = "";

      for (
        let bc = 0, bs, buffer, idx = 0;
        (buffer = str.charAt(idx++));
        ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
          ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
          : 0
      ) {
        buffer = chars.indexOf(buffer);
      }

      return output;
    }

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
