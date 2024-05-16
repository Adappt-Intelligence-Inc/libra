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
    v4 : uuidv4
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
    //console.log('received');
    ws.id = uuidv4();

    ws.on('message', function incoming(data)
    {
       console.log('received: %s', data);
       let msg;
 
       try {
          msg = JSON.parse(data);
        } catch (e) {
        return console.error(e); // error in the above string (in this case, yes)!
		 }

       if( !msg.messageType)
       {
          console.log("websock data error %o", msg);
	  return;
       }


       switch (msg.messageType) {
        case "createorjoin":
        {
           // console.log('first: %o', rooms);

            console.log("createorjoin " + msg.room );

            if(msg.server)
            {
                if(rooms[msg.room])
                 {
                    rooms[msg.room].forEach((client) => {
                    if ( client.readyState === WebSocket.OPEN)
                    {
                         console.log('close: %o %o %o', client.server, client.room,  client.id);
                        rooms[client.room] = rooms[client.room].filter((cl) => cl !== ws);
                    }
                    });

                    if(rooms[msg.room])
                    delete rooms[msg.room];
                    console.log('delete: %o',  rooms[msg.room]);
                    rooms[msg.room] = [];

                 }

            }    

            ws["room"] = msg.room;
             if(! rooms[msg.room])
              rooms[msg.room] = [];
            
           if (rooms[msg.room].indexOf(ws) < 0) {


                rooms[msg.room].push(ws);
            } 
            else
            {
                console.log("websocket connection exist");
            }
            

            var numClients = rooms[msg.room].length; 

            if(numClients == 1)
            {  ws.server = true;
               ws.send( JSON.stringify({"messageType": "join", "room": msg.room}));
            }
            else if (numClients > 1)
            {
                ws.server = false;
               ws.send( JSON.stringify({"messageType": "joined","room": msg.room})); 
            }

           

            break;
        }
        case "ICE_CANDIDATE":
        case "SDP_OFFER":
        case "SDP_ANSWER":
        {
            rooms[ws.room].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN)
            {   
                msg.senderClientId = ws.id;

                if((  ws.server == true &&  client.server == false) ||  (  ws.server == false &&  client.server == true))
                {
                    console.log('RecipientClientId= %o client.id= %o',  msg.RecipientClientId,  client.id );
                  if( !msg.RecipientClientId  ||  (msg.RecipientClientId == client.id ))
                  { 
                    //console.log('client.server: %o', client.server);
                    //console.log('ws.server: %o', ws.server);
                    msg.room = ws.room;
                    if(ws.server  &&  !client.server)
                    {
                         console.log('camera sending: %s', JSON.stringify(msg));
                    }
                    else if(!ws.server  &&  client.server)
                    {
                         console.log('Particpant sending: %s', JSON.stringify(msg));
                    }
                    else
                    {
                        console.error('not possbile state');
                    }
                   
                    client.send(JSON.stringify(msg));
                  }
                }
            }
             
            });

            break;
        }
        case "bye":
        
        break;

        default:
        {
          console.log("WARNING: Ignoring unknown msg of messageType '" + msg.messageType + "'");
          break;
        }


        };




    });


    ws.on('error',e=>console.log(e));
    ws.on('close',(e)=>
    {
       
        console.log('websocket closed'+e);

        if(  ws.server == true && ws.room)
        {
            rooms[ws.room].forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN)
                {
                     console.log('close: %o %o %o', client.server, client.room,  client.id);
                    rooms[client.room] = rooms[client.room].filter((cl) => cl !== ws);
                }
            });
        }
        else
        {
            rooms[ws.room].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN)
            {   
               // msg.senderClientId = ws.id;

                if(  ws.server == false &&  client.server == true)
                {
                    client.send(JSON.stringify({"messageType": "disconnectClient", "senderClientId":ws.id})); 
                }
            }
             
            });
        }

        if(ws.room )
        {
          console.log('close:  %o %o %o', ws.server, ws.room,  ws.id);
          rooms[ws.room] = rooms[ws.room].filter((client) => client !== ws);
        }
        //   console.log('delete: %o',  rooms[ws.room]);


        //delete rooms[ws.room];
       

       

    });



    });

}



