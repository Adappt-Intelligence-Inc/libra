'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;



// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  }
};

/////////////////////////////////////////////

// Could prompt for room name:
var room = prompt('Enter camera name:', 'room9');

if (room === '') {
  room = 'room9';
}


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
  reliableSocket.send(JSON.stringify( {"messageType": "createorjoin" , "room": room}));
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

/*
socket.emit('create or join', room);
console.log('Attempted to create or join room', room);

socket.on('created', function(room) {
  console.log('Created room ' + room);
  
});

socket.on('full', function(room) {
  console.log('Room ' + room + ' is full');
});

socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
});

socket.on('joined', function(room) {
  console.log('joined: ' + room);
  isChannelReady = true;
  isInitiator = true;
  maybeStart();
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});



function sendMessage(message) {
  console.log('Client sending message: ', message);
  socket.emit('message', message);
}

// This client receives a message
socket.on('message', function(message) {
  console.log('Client received message:', message);

  if (message === 'got user media') {
    maybeStart();
  } else if (message.type === 'offer') {
    if (!isInitiator && !isStarted) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
  } else if (message.type === 'answer' && isStarted) {
    console.log("received answer %o",  message.sdp);
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});
*/
////////////////////////////////////////////////////

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');

// navigator.mediaDevices.getUserMedia({
//   audio: true,
//   video: true
// })
// .then(gotStream)
// .catch(function(e) {
//   alert('getUserMedia() error: ' + e.name);
// });

function gotStream(stream) {
  console.log('Adding local stream.');
  if ('srcObject' in localVideo) {
    localVideo.srcObject = stream;
  } else {
    // deprecated
    localVideo.src = window.URL.createObjectURL(stream);
  }
  localStream = stream;
  //sendMessage('got user media');
  if (isInitiator) {
    maybeStart();
  }
}


    maybeStart();

var constraints = {
  video: true
};

console.log('Getting user media with constraints', constraints);


function maybeStart() {
  console.log('>>>>>>> maybeStart() ', isStarted,  isChannelReady);
  if (!isStarted && isChannelReady) {
    console.log('>>>>>> creating peer connection');
    createPeerConnection();
    //pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    if (isInitiator) {
      doCall();
    }
  }
}

window.onbeforeunload = function() {
  sendMessage('bye');
};

/////////////////////////////////////////////////////////

function createPeerConnection() {
  try {
    //pc = new RTCPeerConnection(null);

    pc = new RTCPeerConnection({
                iceServers: [{'urls': 'stun:stun.l.google.com:19302'}],
                iceTransportPolicy: 'all',
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require',
                sdpSemantics: 'unified-plan'
            });



   var channelSnd = pc.createDataChannel("chat"); // sende PC1 
    
    channelSnd.onopen = function(event)
    {
        channelSnd.send('Hi you!');
    }
    
    channelSnd.onmessage = function(event)
    {
        console.log("arvind " + event.data);
    }



    pc.ondatachannel = function(event) {  // receiver /PC2
    var channel = event.channel;
    channel.onopen = function(event) {
    channel.send('ravind back!');
    }
    channel.onmessage = function(event) {
    console.log("ravind " + event.data);
    }
    }




    pc.onicecandidate = handleIceCandidate;
    if ('ontrack' in pc) {
      pc.ontrack = ontrack;
    } else {
      // deprecated
      pc.onaddstream = ontrack;
    }
    pc.onremovestream = handleRemoteStreamRemoved;

    pc.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc, e));

    console.log('Created RTCPeerConnnection');
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
    return;
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

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  if ('srcObject' in remoteVideo) {
    remoteVideo.srcObject = event.streams[0];
  } else {
    // deprecated
    remoteVideo.src = window.URL.createObjectURL(event.stream);
  }
  remoteStream = event.stream;
}




function ontrack({
    transceiver,
    receiver,
    streams: [stream]
}) 

{
    


  stream.onaddtrack = () => console.log("stream.onaddtrack");
  stream.onremovetrack = () => console.log("stream.onremovetrack");
  transceiver.receiver.track.onmute = () => console.log("transceiver.receiver.track.onmute");
  transceiver.receiver.track.onended = () => console.log("transceiver.receiver.track.onended");
  transceiver.receiver.track.onunmute = () => {
    console.log("transceiver.receiver.track.onunmute");
    remoteVideo.srcObject = stream;
  }
  
}


function handleCreateOfferError(event) {
  console.log('createOffer() error: ', event);
}

function doCall() {
  console.log('Sending offer to peer');
  pc.addTransceiver("video", {
          direction: "recvonly"
        });

        pc.addTransceiver("audio", {
          direction: "recvonly"
        });
    
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
  trace('Failed to create session description: ' + error.toString());
}



function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

function hangup() {
  console.log('Hanging up.');
  stop();
  sendMessage('bye');
}

function handleRemoteHangup() {
  console.log('Session terminated.');
  stop();
  isInitiator = false;
}

function stop() {
  isStarted = false;
  pc.close();
  pc = null;
}

function onIceStateChange(pc, event) {
    switch (pc.iceConnectionState) {
        case 'checking': {
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
