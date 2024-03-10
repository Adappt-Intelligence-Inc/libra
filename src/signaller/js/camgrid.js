// (c) 2023 Johnson Controls.  All Rights reserved.

'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var pc;
var remoteStream;
var turnReady;

var roomId = 'room9'; /*think as a group  peerName@room */
var peerID;
var peerName;

var encType;

let ai = false;



let encoder ="NATIVE"; 


var browserName = (function(agent) {
    switch (true) {
        case agent.indexOf("edge") > -1:
            return "Edge";
        case agent.indexOf("edg/") > -1:
            return "Edge ( chromium based)";
        case agent.indexOf("opr") > -1 && !!window.opr:
            return "Opera";
        case agent.indexOf("chrome") > -1 && !!window.chrome:
            return "Chrome";
        case agent.indexOf("trident") > -1:
            return "MS IE";
        case agent.indexOf("firefox") > -1:
            return "Firefox";
        case agent.indexOf("safari") > -1:
            return "Safari";
        default:
            return "other";
    }
})(window.navigator.userAgent.toLowerCase());

// if (browserName == "Firefox")
//     encoder = "VP9";




function reliable_log_msg(msg) {
  console.log(msg);
}


window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
  alert('Your browser doesn\'t support WebSocket');

}


//var socket = new WebSocket(window.location.href.replace('http://', 'ws://').replace('https://', 'wss://'));
var reliableSocket = new WebSocket(window.location.href.replace('http://', 'ws://').replace('https://', 'wss://'));


reliableSocket.onopen = function (event) {
  // Socket is now ready to send and receive messages
  console.log("reliableSocket is open and ready to use");
  reliableSocket.send(JSON.stringify( {"messageType": "createorjoin" , "room": roomId}));
};

reliableSocket.onerror = function (event) {
  // Socket failed to connect
};

reliableSocket.onclose = function (event) {
  console.log("ERROR: Reliable socket has closed");
};

// Simple helper to send JSON messages with a given messageType
reliableSocket.sendMessage = function (messageType, msg) {
  reliable_log_msg("Sending msg of type: " + messageType);
  reliableSocket.send(JSON.stringify({"messageType": messageType, "messagePayload": msg}));
}

reliableSocket.onmessage = function (event) {
  console.log("Got msg", event);
  var msg = JSON.parse(event.data);

  reliable_log_msg("Received msg of messageType: " + msg.messageType);
  console.log(msg);

  switch (msg.messageType) {
    case "join":
     
      console.log('Another peer made a request to join room ' + room);
      console.log('This peer is the initiator of room ' + room + '!');
      isChannelReady = true;

      break;
    case "joined":
      {

      isChannelReady = true;
      isInitiator = true;
      maybeStart();

      break;
      }
     case "SDP_OFFER":
      {
            if (!isInitiator && !isStarted) 
            {
              maybeStart();
            }
            pc.setRemoteDescription(new RTCSessionDescription(msg.messagePayload));
            doAnswer();

          break;
      }
    case "SDP_ANSWER":
     {
        if(isStarted) {
          console.log("received answer %o",  msg.messagePayload);
          pc.setRemoteDescription(new RTCSessionDescription(msg.messagePayload));
        }
        break;
     }
    case "ICE_CANDIDATE":
     {

        if(isStarted)
        {
            var candidate = new RTCIceCandidate({
              sdpMLineIndex: 0,
              candidate: msg.messagePayload.candidate
            });
            pc.addIceCandidate(candidate);
        }

         break;  
     }
    
    case "bye":
    {

      if(isStarted) 
      {
        handleRemoteHangup();
      }
      break;
    }

    default:
    {
      console.log("WARNING: Ignoring unknown msg of messageType '" + msg.messageType + "'");
      break;
    }


   };
}

function sendMessage(type,  message) {
  console.log('Client sending message: ', message);
  reliableSocket.sendMessage (type, message);
}


function getQueryParameters() {
    var queryParameters = {};

    function captureQueryParam(match, name, value)
    {
        queryParameters[name] = value;
    }

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, captureQueryParam);
    return queryParameters;
}




// let SDPUtils;
// socket.on('message', function(message) {
//     console.log('Client received message:', message);
//     log('Client received message:', message);

//     if (message === 'got user media') {
//         maybeStart();
//     } else if (message.type === 'offer') {
//         if (!isInitiator && !isStarted) {
//             maybeStart();
//         }

//         var des = new RTCSessionDescription(message.desc);
//         let mediaSections = SDPUtils.getMediaSections(des.sdp);
//         const mediaSection = mediaSections[mediaSections.length - 1];
//         const rtpParameters = SDPUtils.parseRtpParameters(mediaSection);

//         let statsText = '';
//         for (var i = 0; i < rtpParameters.codecs.length; i++) {
//             var codecName = rtpParameters.codecs[i].name;
//             var tmpObj = {};

//             tmpObj["MaxEnc"] = rtpParameters.codecs[i].parameters["MaxEnc"];
//             if (codecName == "VP9")
//                 tmpObj["SwEnc"] = rtpParameters.codecs[i].parameters["PresentEncIns"];
//             else if (codecName == "H264") {
//                 encType = rtpParameters.codecs[i].parameters["Enc"];
//                 tmpObj[encType] = rtpParameters.codecs[i].parameters["PresentEncIns"];
//             }
//             if (codecName == "VP9" || codecName == "H264") {
//                 statsText += `<div>Encoder: ${ JSON.stringify(tmpObj)}</div>`;
//             }
//         }

//         let statsDiv = document.getElementById("statsEnc");
//         statsDiv.innerHTML = statsText;

//         pc.setRemoteDescription(des);
//         doAnswer();
//     } else if (message.type === 'answer' && isStarted) {
//         pc.setRemoteDescription(new RTCSessionDescription(message.desc));
//     } else if (message.type === 'candidate' && isStarted) {
//         var candidate = new RTCIceCandidate({
//             sdpMLineIndex: message.candidate.sdpMLineIndex,
//             sdpMid: message.candidate.sdpMid,
//             candidate: message.candidate.candidate
//         });
//         pc.addIceCandidate(candidate);
//     } else if (message.type === 'bye' && isStarted) {
//         console.log('Camera state', message.desc);
//         log('Camera state:', message.desc);

//         handleRemoteHangup();
//     } else if (message.type === 'error') {
//         console.log('Camera state', message.cam, message.desc);
//         log('Camera state:', message.desc);

//         removeCamera(  message.cam, message.desc);

//        // hangup();
//     }
// });

var remoteVideo = document.querySelector('#remoteVideo');

function maybeStart() {
  console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
  if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
    console.log('>>>>>> creating peer connection');
    createPeerConnection();
    pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
}


window.onbeforeunload = function() {
    sendMessage({
        room: roomId,
        type: 'bye'
    });
};




async function createPeerConnection() {
    try {

            pc = new RTCPeerConnection({
                iceServers: [{'urls': 'stun:stun.l.google.com:19302'}],
                iceTransportPolicy: 'all',
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require',
                sdpSemantics: 'unified-plan'
            });

        pc.onicecandidate = handleIceCandidate;
        pc.ontrack = ontrack;
        pc.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc, e));
        console.log('Created RTCPeerConnnection');
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
    }
}

function handleIceCandidate(event) {
  console.log('icecandidate event: ', event);
  if (event.candidate) {
    sendMessage( "ICE_CANDIDATE", {
      //label: event.candidate.sdpMLineIndex,
      //id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    });
  } else {
    console.log('End of candidates.');
  }
}

function handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
}

function doCall() {
    console.log('Sending offer to peer');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}


function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer().then(
    setLocalAndSendMessage,
    onCreateSessionDescriptionError
  );
}

function setLocalAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  pc.setLocalDescription(sessionDescription);
  console.log(' messageType %o  sdp %o', sessionDescription.type, sessionDescription.sdp);

  if( sessionDescription.type == "answer")
  sendMessage( "SDP_ANSWER", sessionDescription);
  else if( sessionDescription.type == "offer")
  sendMessage( "SDP_OFFER", sessionDescription);

}


function onCreateSessionDescriptionError(error) {
    log('Failed to create session description: ' + error.toString());
    console.log('Failed to create session description: ' + error.toString());
}

function handleRemoteStreamAdded(event) {
    console.log('Remote stream added.');
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed. Event: ', event);
}

function hangup() {
    console.log('Hanging up.');
    stop();
    sendMessage({
        room: roomId,
        type: 'bye'
    });
}

function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
}

function stop() {
    isStarted = false;
    pc.close();
    pc = null;
}

let streamV = new Map();

function ontrack({
    transceiver,
    receiver,
    streams: [stream]
}) {
    var track = transceiver.receiver.track;
    var trackid = stream.id;
    if (transceiver.direction != 'inactive' && transceiver.currentDirection != 'inactive' && track.kind == "video") {

        var camId = trackid.split("_")[0];


        var divDrag =   document.getElementById("Cam" + camId );
        var gridTD =   divDrag.parentNode;



        var divVid = document.createElement('div');
        divVid.className = "videoBg";

        var divStore = document.createElement('div');
       // divStore.className = "divTableRow";

        let el = document.createElement("video");

        el.setAttribute('playsinline', true);
        el.setAttribute('autoplay', true);
        el.muted = true;
        el.id = `vd-${trackid}`;


        //var width =  document.getElementById(trackid).clientWidth; //
       // var height = document.getElementById(trackid).clientHeight;// 

       // var width = document.getElementById("widthVideo").value;

        // el.style.maxWidth = width + 'px';
        // el.width = width + 'px';
        
        // el.style.maxHeight = height + 'px';  // arvind never set height rather set aspec ratio
        // el.height= height + 'px';
       


        el.controls = false;

       // var div = document.createElement('div');
        var name = document.createElement("label");

        name.innerHTML = "<span> <small> videotrackid:" + trackid + "<br>" + "peerID:" + peerID + "<br>" + "</small> </span>";

       // var camid = document.getElementById("camId").value;

        let cv;


        // var closeButton = document.createElement('button');
        // closeButton.innerHTML += 'close';
        // closeButton.id = "btclose_" + trackid;
        // closeButton.onclick = async function() {
        //     var trs = streamV.get(trackid).getTracks();
        //     var trsid = [];
        //     for (var i = 0; i < trs.length; ++i) {
        //         trsid.push(trs[i].id);
        //     }

        //     streamV.delete(trackid);

        //     sendMessage({
        //         room: roomId,
        //         type: 'command',
        //         desc: 'close',
        //         trackids: trsid,
        //         act: true
        //     });

        //     removeCamera( camid, "Drag and Drop Camera");

        //     return false;
        // };

      
        divStore.innerHTML += trackid + "  ";
        //divStore.appendChild(closeButton);
        divVid.appendChild(el);
        divVid.appendChild(divStore);
       // 
        //divVid.appendChild(checkbox);
       // divVid.appendChild(label);
       // divVid.appendChild(pause);

        var trackk = streamV.get(trackid);
        // var audt = trackk.getAudioTracks();  // enable when both audio and vidoeo present

        // if (audt.length) {
        //     let pause1 = document.createElement('span'),
        //         checkbox1 = document.createElement('input'),
        //         label1 = document.createElement('label');
        //     pause1.classList = 'nowrap';
        //     checkbox1.type = 'checkbox';
        //     checkbox1.id = trackid + "_aud";
        //     checkbox1.checked = true;
        //     checkbox1.onchange = async () => {

        //         el.muted = (checkbox1.checked == true);

        //         sendMessage({
        //             room: roomId,
        //             type: 'command',
        //             desc: 'muteaudio',
        //             trackids: [trackid + "_aud"],
        //             act: checkbox1.checked
        //         });
        //     }
        //     label1.id = `audio-check-${trackid}`;
        //     label1.innerHTML = "Pause " + "audio";

        //     divVid.appendChild(checkbox1);
        //     divVid.appendChild(label1);
        //     divVid.appendChild(pause1);
        // }

        if (!streamV.has(trackid)) {
            streamV.set(trackid, new MediaStream());
        }

        streamV.get(trackid).addTrack(track);
        el.srcObject = streamV.get(trackid);

        el.play()
            .then(() => {
                // if (cv) {
                //     cv.width = el.offsetWidth;;
                //     cv.height = el.offsetHeight
                // }
            })
            .catch((e) => {
                console.log("play eror %o ", e);
            });

       // divVid.id = 'td' + trackid;

        gridTD.removeChild(divDrag);
       
        divVid.id = 'Cam' + camId;
        gridTD.appendChild(divVid);


        //document.getElementById(trackid).innerHTML="";
      

    } else if (transceiver.direction != 'inactive' && transceiver.currentDirection != 'inactive' && track.kind == "audio") {
        if (!streamV.has(trackid)) {
            streamV.set(trackid, new MediaStream());
        }
        streamV.get(trackid).addTrack(track);
    }

    stream.onaddtrack = () => console.log("stream.onaddtrack");
    stream.onremovetrack = () => console.log("stream.onremovetrack");
    transceiver.receiver.track.onmute = () => console.log("transceiver.receiver.track.onmute " + trackid);
    transceiver.receiver.track.onended = () => console.log("transceiver.receiver.track.onended " + trackid);
    transceiver.receiver.track.onunmute = () => {
        console.log("transceiver.receiver.track.onunmute " + trackid);
    };
}



function removeCamera( camid, reason) {


    var treeVideoEl =   document.getElementById(camid );
    treeVideoEl.style.backgroundColor = 'red';

    var divDrag =   document.getElementById("Cam" + camid );

    var gridTD =   divDrag.parentNode;

    gridTD.removeChild(divDrag);

    var divDrag = document.createElement('div');
    divDrag.innerHTML= reason;
    divDrag.className = "drag";
    divDrag.style.aspectRatio="16/9";
    gridTD.appendChild(divDrag);
    dragEvenListner(divDrag);

}

function onIceStateChange(pc, event) {
    switch (pc.iceConnectionState) {
        case 'checking': {
            start();
            setupWebRtcPlayer(pc);
            onWebRtcAnswer();

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

function onMuteClick() {
    // we  might enable this code in future
    // var checkBox = document.getElementById("checkmute");
    // if (checkBox.checked == true) {
    //     text.style.display = "block";
    // } else {
    //     text.style.display = "none";
    // }

    var camids = document.getElementById("camId").value;

    if (!trackarr.length) {
        checkBox.checked = false;
        alert("Please click and select elements to pause");
        return;
    }

    sendMessage({
        room: roomId,
        type: 'command',
        desc: 'mute',
        trackids: trackarr,
        act: checkBox.checked
    });
}



function applyCamera() {
    var camids = document.getElementById("camId").value;

    var endTime = 0;

    var width = document.getElementById("widthVideo").value;
    var height = document.getElementById("heightVideo").value;

    var speed = document.getElementById("speed").value;
    var scale = document.getElementById("scale").value;

    var startTime = document.getElementById("startTime").value;

    if (!trackarr.length) {
        alert("Please click and select elements to reverseplay or change resolution");
        return;
    }

    for (var x = 0; x < trackarr.length; ++x) {
        let el = document.getElementById(`vd-${trackarr[x]}`);

        el.style.maxWidth = width + 'px';
        el.width = width + 'px';
    }

    if (startTime == "0" && speed != "1") {
        alert("Please enter starttime for Speed > 1")
        document.getElementById("speed").value = 1;
        return;
    }

    sendMessage({
        room: roomId,
        start: startTime.toString(),
        end: endTime.toString(),
        width: width.toString(),
        height: height.toString(),
        speed: speed.toString(),
        scale: scale.toString(),
        type: 'command',
        trackids: trackarr,
        desc: 'apply',
        act: true
    });
}

function forward() {
    document.getElementById("scale").value = 1;
    applyCamera();
}

function backward() {
    document.getElementById("scale").value = -1;
    applyCamera();
}

function offermsg(camid, startTime, endTime, width, height, speed, scale, encoder, ai) {
    sendMessage({
        room: roomId,
        cam: camid.toString(),
        start: startTime.toString(),
        end: endTime.toString(),
        width: width.toString(),
        height: height.toString(),
        speed: speed.toString(),
        scale: scale.toString(),
        encoder: encoder.toString(),
        ai: ai,
        type: 'offer',
    });
}


 var log = function () {
    var args = Array.prototype.slice.call(arguments);
      //$('#webrtc-logs').append(JSON.stringify(args)).append('\n');
      console.log.apply(console, arguments);
      //var logger = document.getElementById('webrtc-logs');
     // logger.innerHTML += JSON.stringify(args) + '<br />';
    }





function test()
{


    var divAdd  =     document.getElementById("liveS11").children[0];

     addCamera("room9", divAdd);

}
