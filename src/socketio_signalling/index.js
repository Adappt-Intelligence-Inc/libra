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

       // console.log('message from %o:', message);
		message.from = socket.id;

        if(  socket.server == true)
        {
             console.log('message from camera: ', message);
             // io.sockets.to(socket.room).emit('leave', socket.room, socket.id, numClients); 
             socket.to(socket.room).emit('message', message);
        }
        else
        {
            //console.log('message from participant: ', message);

            var clients_in_the_room = io.sockets.adapter.rooms[socket.room];

            console.log('message from %o: %o:', clients_in_the_room, socket.room);

            for (var clientId in clients_in_the_room ) {
              //console.log('client: %s', clientId); // Seeing is believing
              var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this


              if(client_socket.server)
              {
                    socket.to(clientId).emit('message', message);
               }

            }
        }

	});

    socket.on('disconnect', function() {
      
          var clientsInRoom = io.nsps['/'].adapter.rooms[socket.room];
            var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom).length; clientsInRoom = io.sockets.adapter.rooms[socket.room];

          if( socket.server == true)
          {
            
              console.log("disconnect camera " + socket.id + " from room " + socket.room + " numClients " + numClients);
             
              var clients_in_the_room = io.sockets.adapter.rooms[socket.room];
            
              for (var clientId in clients_in_the_room ) {
              console.log('client: %s', clientId); // Seeing is believing
              //var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this
               if(io.sockets.connected[clientId])
               io.sockets.connected[clientId].disconnect();

            }

          }
          else
          {

              // var clientsInRoom = io.sockets.adapter.rooms[socket.room];
              // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
              console.log("disconnect participant" + socket.id + " from room " + socket.room + " numClients " + numClients);
              ////////////////////////////////////////////////////////////////////
              //io.sockets.connected[serverSocketid].emit('disconnectClient', socket.id);
              //if(socket.room)
             // io.sockets.to(socket.room).emit('leave', socket.room, socket.id, numClients); 
               console.log("unsubscribe " + socket.id);

                var clients_in_the_room = io.sockets.adapter.rooms[socket.room];

                console.log('message from %o: %o:', clients_in_the_room, socket.room);

                for (var clientId in clients_in_the_room ) {
x
                    var client_socket = io.sockets.connected[clientId]; // Do whatever you want with this

                    if(client_socket.server)
                    {
                         socket.to(clientId).emit('leave', socket.room, socket.id, numClients); 
                    }
                }

          }

        });



	  socket.on('createorjoin', function(room) {
	    log('Received request to createorjoin room ' + room);

	    var clientsInRoom = io.nsps['/'].adapter.rooms[room];
	    var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom).length; clientsInRoom = io.sockets.adapter.rooms[room];
	   // var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
	    log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (socket.room)
            socket.leave(socket.room);

        socket.room = room;
	    socket.join(room);
	    if (numClients === 0) {
	      log('Client ID ' + socket.id + ' created room ' + room);
	       
               socket.server = true;
               socket.emit('join', room, socket.id);

	    } else if (numClients > 0) {
                
            socket.server = false;

	        log('Client ID ' + socket.id + ' joined room ' + room);

	        socket.emit('joined', room, socket.id);
	      //io.sockets.in(room).emit('ready');
	    } else { // max two clients
	      socket.emit('full', room);
	    }


	  });

	  socket.on('bye', function() {
	    console.log('received bye');
	  });

    });
}



