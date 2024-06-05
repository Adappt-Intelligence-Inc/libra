/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import { responsiveScale } from "../styles/mixins";
import { color } from "../config/color";
import { FONT_WEIGHT_MEDIUM, TTNORMSPRO_REGULAR } from "../styles/typography";
import { useFocusEffect } from "@react-navigation/native";
import io from "socket.io-client";
import { setFaceEvents } from "../store/devicesReducer";
import { useDispatch } from "react-redux";

export default function WebRTCStreamView({
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
  const dispatch = useDispatch();
  const [remoteStream, setRemoteStream] = useState(null);
  const [num, setNum] = useState(0);
  const [type, setType] = useState("JOIN");

  // const reliableSocket = useRef(
  //   new WebSocket(`wss://ipcamera.adapptonline.com`),
  // );

  // const roomName = "65f570720af337cec5335a70ee88cbfb7df32b5ee33ed0b4a896a0";

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
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun2.l.google.com:19302",
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
      doCall();
      setNum(30);
    });

    socket.on("message", function (message) {
      console.log("Client received message:", message);
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
        console.log('message.type');
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
    isStarted = true;
    peerConnection.current.onaddstream = (event) => {
      setRemoteStream(event.stream);
    };
    peerConnection.current.addTransceiver("audio");
    peerConnection.current.addTransceiver("video");
    // Setup ice handling
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("event.candidate", event.candidate);
        console.log("event.candidate12", event);
        // var candidate = new RTCIceCandidate({
        //   sdpMLineIndex: event.candidate.sdpMLineIndex,
        //   sdpMid: event.candidate.sdpMid,
        //   candidate: event.candidate.candidate,
        // });
        // sendICEcandidate({
        //   calleeId: otherUserId.current,
        //   rtcMessage: {
        //     label: event.candidate.sdpMLineIndex,
        //     id: event.candidate.sdpMid,
        //     candidate: event.candidate.candidate,
        //   },
        // });

        // sendMessage('ICE_CANDIDATE', {
        //   socketdpMLineIndex: event.candidate.sdpMLineIndex,
        //   sdpMid: event.candidate.sdpMid,
        //   candidate: event.candidate.candidate,
        // });

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

    peerConnection.current.addEventListener("iceconnectionstatechange", (e) => {
      console.log("eeeeeee", e);
      onIceStateChange(peerConnection.current, e);
    });

    channelSnd.current = setupDataChannel(
      peerConnection.current,
      "chat",
      dataChannelOptions,
      starttime
    );
    console.log("createorjoin");
    socket.emit("createorjoin", roomName, true);
    // return () => {
    //   handleEndCall();
    // };
    //createPeerConnection();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused/mount
      return () => {
        // Do something when the screen is unfocused/unmount
        // Useful for cleanup functions
        isStarted = false;
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
        sendMessage({
          room: roomName,
          type: "bye",
        });
      };
    }, [])
  );

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
        // console.log(`Got message (${label})`, e.data);
        var msg = JSON.parse(e.data);

        switch (msg.messageType) {
          case "IDENTITY_NOT_IN_GALLERY": {
            break;
          }

          case "IDENTITY_RECOGNIZED": {
            console.log('darshit');
            dispatch(setFaceEvents(msg))
            break;
          }

          case "RECORDING": {
            // recordlist(msg.messagePayload);
            break;
          }
        }

        // recordlist(e.data);
      };

      datachannel.addEventListener("message", (message) => {
        console.log("message1", message);
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

    try {
      msg = JSON.parse(data);
    } catch (e) {
      console.log(e); // error in the above string (in this case, yes)!
      return;
    }

    if (!msg.type) {
      console.log("datachannel data error %o", msg);
      return;
    }

    switch (msg.type) {
      case "recDates": {
        console.log("first: %o", msg.data);
        let dataa = msg.data;
        setDate(dataa);
        break;
      }

      default: {
        console.log(
          "WARNING: Ignoring unknown msg of messageType '" +
            msg.messageType +
            "'"
        );
        break;
      }
    }
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

  function ontrack({ transceiver, receiver, streams: [stream] }) {
    console.log("transceiver", transceiver);
    console.log("receiver", receiver);
    console.log("stream", stream);
    setRemoteStream(stream);
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

  function maybestart(isInitiator, isFront) {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == "videoinput" &&
          sourceInfo.facing == (isFront ? "user" : "environment")
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream) => {
          // Got stream!

          setlocalStream(stream);

          console.log("added localstream");
          peerConnection.current.addStream(stream);

          //   setType('OUTGOING_CALL');
          // socket.emit('createorjoin', roomName, true);

          // if (isInitiator == true) doCall();
        })
        .catch((error) => {
          // Log error
        });
    });
    isStarted = true;
  }

  var encType;

  async function doCall() {
    console.log("doCall", peerConnection);

    let sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    console.log("sessionDescription", sessionDescription);
    sessionDescription.sdp = sessionDescription.sdp.replaceAll(
      "level-asymmetry-allowed=1",
      "level-asymmetry-allowed=1; Enc=" + encType
    );

    console.log(" messageType %o ", sessionDescription.type);
    console.log("setLocalAndSendMessage sending message", sessionDescription);

    // if (sessionDescription.type == 'answer')
    //   sendMessage('SDP_ANSWER', sessionDescription, starttime);
    // else if (sessionDescription.type == 'offer') {
    //   console.log(' messageType %o ', sessionDescription.type);
    //   sendMessage('SDP_OFFER', sessionDescription), starttime;
    // }
    sendMessage({
      room: roomName,
      type: sessionDescription.type,
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
    // sessionDescription.sdp = sessionDescription.sdp.replaceAll(
    //   "level-asymmetry-allowed=1",
    //   "level-asymmetry-allowed=1; Enc=" + encType
    // );

    console.log(" messageType %o ", sessionDescription.type);
    sendMessage({
      room: roomName,
      type: sessionDescription.type,
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

  useEffect(() => {
    if (selectedDate) {
      var vsend = "starttime:" + selectedDate;
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
    console.log("startrec", channelSnd);
    channelSnd.current.send("startrec");
  };

  const StopRec = () => {
    channelSnd.current.send("stoprec");
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
