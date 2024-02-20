// (c) 2023 Adappt.  All Rights reserved.
// https://stackoverflow.com/questions/62370962/how-to-create-join-chat-room-using-ws-websocket-package-in-node-js

'use strict';

var os = require('os');
const fs = require('fs');
var nodeStatic = require('node-static');
var http = require('https');
const WebSocket = require('ws');
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

async function runWebServer() 
{


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

    const rooms = {};

    console.error('runSocketServer');
    const wss = new WebSocket.Server({server: webServer});  
    wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data)
    {

       var msg = JSON.parse(data);
       console.log('received: %s', data);

       switch (msg.type) {
        case "createorjoin":
        {
           // console.log('first: %o', rooms);

            console.log("createorjoin " + msg.room );
            ws["room"] = msg.room;
             if(! rooms[msg.room])
              rooms[msg.room] = [];
            rooms[msg.room].push(ws);

            var numClients = rooms[msg.room].length; 

            if(numClients == 1)
               ws.send( JSON.stringify({"type": "join"}));
            else if (numClients > 1)
               ws.send( JSON.stringify({"type": "joined"})); 


            break;
        }
        case "message":
        {
            rooms[ws.room].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN)
              client.send(JSON.stringify(msg.msg));
             // console.log(JSON.stringify(msg.msg));
            });

            break;
        }
        default:
        {
          console.log("WARNING: Ignoring unknown msg of type '" + msg.type + "'");
          break;
        }


        };




    });


    ws.on('error',e=>console.log(e));
    ws.on('close',(e)=>
    {
       // console.log('secomd: %o', rooms);
        console.log('websocket closed'+e);

        rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);

       

    });



    });

}



