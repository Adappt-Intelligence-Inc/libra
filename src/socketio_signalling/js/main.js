'use strict';

var isChannelReady = true;
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



function waitToCompleteIceGathering(pc) {
  return new Promise((resolve) => {
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') {
        resolve(pc.localDescription);
      }
    });
  });
}

// Could prompt for room name:
var room = prompt('Enter camera name:', 'room1');

if (room === '') {
  room = 'room1';
}

var socket = io.connect();
//socket.emit('createorjoin', room);
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
   doCall();
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
    doAnswer(message.from, pc);
  } else if (message.type === 'answer' && isStarted) {
    console.log("received answer %o",  message.sdp);
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.sdpMLineIndex,
      sdpMid: message.sdpMid,
      candidate: message.candidate
    });

   
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  }
});

////////////////////////////////////////////////////

var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');

navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true
})
.then(gotStream)
.catch(function(e) {
  alert('getUserMedia() error: ' + e.name);
});

function gotStream(stream) {
  console.log('Adding local stream.');
  if ('srcObject' in localVideo) {
    localVideo.srcObject = stream;
  } else {
    // deprecated
    localVideo.src = window.URL.createObjectURL(stream);
  }
  localStream = stream;
 // sendMessage('got user media');
  //if (isInitiator) {
   maybeStart();
  //}
}

var constraints = {
  video: true
};

console.log('Getting user media with constraints', constraints);


function maybeStart() {
  console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
  if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
    console.log('>>>>>> creating peer connection');
    createPeerConnection();
    pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    //if (isInitiator) {
      
      if (room !== '') {
        socket.emit('createorjoin', room);
        console.log('Attempted to create or  join room', room);
      }


  }
}

window.onbeforeunload = function() {
 // sendMessage('bye');
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
      pc.ontrack = handleRemoteStreamAdded;
    } else {
      // deprecated
      pc.onaddstream = handleRemoteStreamAdded;
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

    console.log("icecandidate %o " + event.candidate) ;

    // sendMessage({
    //   type: 'candidate',
    //   sdpMLineIndex: event.candidate.sdpMLineIndex,
    //   sdpMid: event.candidate.sdpMid,
    //   candidate: event.candidate.candidate
    // });
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

function handleCreateOfferError(event) {
  console.log('createOffer() error: ', event);
}

function doCall() {
  console.log('Sending offer to peer');
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer(from, pc) {
  console.log('Sending answer to peer.');
  // pc.createAnswer().then(
  //   setLocalAndSendMessage,
  //   onCreateSessionDescriptionError
  // );

  
  // Do something when ICE gathering is complete.

  pc.createAnswer().then(function (answer) {
    
   pc.setLocalDescription(answer);

    waitToCompleteIceGathering(pc).then((ret) => {
        
      var sendit =ret.toJSON();

      sendit["to"] =  from;

      console.log(' type %o  sdp %o', sendit.type, sendit.sdp);

      sendMessage(sendit);

     });


  },
    function () { console.warn("Couldn't create answer") });


}

function setLocalAndSendMessage(sessionDescription) {
  // Set Opus as the preferred codec in SDP if Opus is present.
  //  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
  pc.setLocalDescription(sessionDescription);
 // console.log(' type %o  sdp %o', sessionDescription.type, sessionDescription.sdp);
 // sendMessage(sessionDescription);

  waitToCompleteIceGathering(pc).then((ret) => {
        
      var sendit =ret.toJSON();

      //sendit["to"] =  from;

      console.log(' type %o  sdp %o', sendit.type, sendit.sdp);

      sendMessage(sendit);

     });


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
 // sendMessage('bye');
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
