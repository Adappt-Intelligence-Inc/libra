// (c) 2023 Adappt.  All Rights reserved.

'use strict';

var os = require('os');
const fs = require('fs');
var nodeStatic = require('node-static');
var http = require('https');
var socketIO = require('socket.io');
const config = require('./config');
const express = require('express');

const {
    v4: uuidV4
} = require('uuid');

let webServer;
let socketServer;
let expressApp;
let io;

(async () => {
    try {
        await runExpressApp();
        await runWebServer();
        await runSocketServer();
    } catch (err) {
        console.error(err);
    }
})();

console.log("To browse https://localhost/ or https://ip/");

let serverSocketid = null;

var fileServer = new(nodeStatic.Server)();

async function runExpressApp() {
    expressApp = express();
    expressApp.use(express.json());
    expressApp.use(express.static(__dirname));

    expressApp.use((error, req, res, next) => {
        if (error) {
            console.log('Express app error,', error.message);

            error.status = error.status || (error.name === 'TypeError' ? 400 : 500);
            res.statusMessage = error.message;
            res.status(error.status).send(String(error));
        } else {
            next();
        }
    });
}

async function runWebServer() {
    console.error('runWebServer');

    const {
        sslKey,
        sslCrt
    } = config;
    if (!fs.existsSync(sslKey) || !fs.existsSync(sslCrt)) {
        console.error('SSL files are not found. check your config.js file');
        process.exit(0);
    }
    const tls = {
        cert: fs.readFileSync(sslCrt),
        key: fs.readFileSync(sslKey),
    };
    
    webServer = http.createServer(tls, expressApp);
    //webServer = http.createServer(expressApp); // for http
    webServer.on('error', (err) => {
        console.error('starting web server failed:', err.message);
    });

    await new Promise((resolve) => {
        const {
            listenIp,
            listenPort
        } = config;
        webServer.listen(listenPort, listenIp, () => {
            console.log('server is running');
            console.log(`open http://127.0.0.1:${listenPort} in your web browser`);
            resolve();
        });
    });
}

async function runSocketServer() {
    console.error('runSocketServer');
    io = socketIO.listen(webServer);

    io.sockets.on('connection', function(socket) {
    // convenience function to log server messages on the client
      // convenience function to log server messages on the client
	function log() {
	    var array = ['Message from server:'];
	    array.push.apply(array, arguments);
	    socket.emit('log', array);
	    console.log(array);
	  }

	  socket.on('message', function(message) {
	    log('Client said: ', message);
	    // for a real app, would be room-only (not broadcast)
	    socket.broadcast.emit('message', message);
	  });

	  socket.on('create or join', function(room) {
	    log('Received request to create or join room ' + room);

	    var clientsInRoom = io.nsps['/'].adapter.rooms[room];
	    var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom).length; clientsInRoom = io.sockets.adapter.rooms[room];
	   // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
	    log('Room ' + room + ' now has ' + numClients + ' client(s)');

	    socket.join(room);
	    if (numClients === 0) {
	     
	      log('Client ID ' + socket.id + ' created room ' + room);
	      socket.emit('created', room, socket.id);

	    } else if (numClients > 0) {
	      log('Client ID ' + socket.id + ' joined room ' + room);
	      io.sockets.in(room).emit('join', room);

	      socket.emit('joined', room, socket.id);
	      io.sockets.in(room).emit('ready');
	    } else { // max two clients
	      socket.emit('full', room);
	    }




	  });

	  socket.on('ipaddr', function() {
	    var ifaces = os.networkInterfaces();
	    for (var dev in ifaces) {
	      ifaces[dev].forEach(function(details) {
		if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
		  socket.emit('ipaddr', details.address);
		}
	      });
	    }
	  });

	  socket.on('bye', function() {
	    console.log('received bye');
	  });

    });
}



