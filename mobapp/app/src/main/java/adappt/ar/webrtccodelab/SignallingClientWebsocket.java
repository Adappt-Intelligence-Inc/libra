package adappt.ar.webrtccodelab;

import android.annotation.SuppressLint;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;
import org.webrtc.IceCandidate;
import org.webrtc.SessionDescription;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import io.socket.client.IO;
import io.socket.client.Socket;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

class WebSocketChatClient extends WebSocketClient {

    public WebSocketChatClient(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshakedata) {
        System.out.println("Connected");
        if (!roomName.isEmpty()) {
            emitInitStatement(roomName);
        }



    }

    @Override
    public void onMessage(String message) {
        System.out.println("got: " + message);

    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        System.out.println("Disconnected");

    }

    @Override
    public void onError(Exception ex) {
        ex.printStackTrace();

    }

}

/**
 * Webrtc_Step3
 https://github.com/TooTallNate/Java-WebSocket/wiki#client-example
 */

class SignallingClientWebsocket {
    private static SignallingClientWebsocket instance;
    private String roomName = null;
    private WebSocketChatClient chatclient;
    boolean isChannelReady = false;
    boolean isInitiator = false;
    boolean isStarted = false;
    private SignalingInterface callback;

    //This piece of code should not go into production!!
    //This will help in cases where the node server is running in non-https server and you want to ignore the warnings
    @SuppressLint("TrustAllX509TrustManager")
    private final TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[]{};
        }

        public void checkClientTrusted(X509Certificate[] chain,
                                       String authType) {
        }

        public void checkServerTrusted(X509Certificate[] chain,
                                       String authType) {
        }
    }};

    public static SignallingClientWebsocket getInstance() {
        if (instance == null) {
            instance = new SignallingClientWebsocket();
        }
        if (instance.roomName == null) {
            //set the room name here
            instance.roomName = "room1";
        }
        return instance;
    }



    public void init(SignalingInterface signalingInterface) {
        this.callback = signalingInterface;
        try {

            chatclient = new WebSocketChatClient(new URI("wss://100.94.120.72:8443/"));

            SSLContext sslcontext = SSLContext.getInstance("TLS");
            sslcontext.init(null, trustAllCerts, null);
           // IO.setDefaultHostnameVerifier((hostname, session) -> true);
            //IO.setDefaultSSLContext(sslcontext);

            SSLSocketFactory factory = sslcontext
                    .getSocketFactory();// (SSLSocketFactory) SSLSocketFactory.getDefault();

            chatclient.setSocketFactory(factory);


            //set the socket.io url here
            //socket = IO.socket("https://ipcamera.adapptonline.com:443");


            chatclient.connect();

            /*socket.connect();
            Log.e("SignallingClientWebsocket", "init() called");

            if (!roomName.isEmpty()) {
                emitInitStatement(roomName);
            }

            //room created event.
            socket.on("created", args -> {
                Log.e("SignallingClientWebsocket", "created call() called with: args = [" + Arrays.toString(args) + "]");
                callback.onCreatedRoom();
            });

            //room is full event
            socket.on("full", args -> Log.e("SignallingClientWebsocket", "full call() called with: args = [" + Arrays.toString(args) + "]"));

            //peer joined event
            socket.on("join", args -> {
                Log.e("SignallingClientWebsocket", "join call() called with: args = [" + Arrays.toString(args) + "]");
                isChannelReady = true;
                callback.onNewPeerJoined();
            });

            //when you joined a chat room successfully
            socket.on("joined", args -> {
                Log.e("SignallingClientWebsocket", "joined call() called with: args = [" + Arrays.toString(args) + "]");
                isChannelReady = true;
                isInitiator = true;
                callback.onJoinedRoom();
                callback.onTryToStart();
            });

            //log event
            socket.on("log", args -> Log.e("SignallingClientWebsocket", "log call() called with: args = [" + Arrays.toString(args) + "]"));

            //bye event
            socket.on("bye", args -> callback.onRemoteHangUp((String) args[0]));

            //messages - SDP and ICE candidates are transferred through this
            socket.on("message", args -> {
                Log.e("SignallingClientWebsocket", "message call() called with: args = [" + Arrays.toString(args) + "]");
                if (args[0] instanceof String) {
                    Log.e("SignallingClientWebsocket", "String received :: " + args[0]);
                    String data = (String) args[0];
                    if (data.equalsIgnoreCase("got user media")) {
                        callback.onTryToStart();
                    }
                    if (data.equalsIgnoreCase("bye")) {
                        callback.onRemoteHangUp(data);
                    }
                } else if (args[0] instanceof JSONObject) {
                    try {

                        JSONObject data = (JSONObject) args[0];
                        Log.e("SignallingClientWebsocket", "Json Received :: " + data.toString());
                        String type = data.getString("type");
                        if (type.equalsIgnoreCase("offer")) {
                            callback.onOfferReceived(data);
                        } else if (type.equalsIgnoreCase("answer") && isStarted) {
                            callback.onAnswerReceived(data);
                        } else if (type.equalsIgnoreCase("candidate") && isStarted) {
                            callback.onIceCandidateReceived(data);
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
           */
        } catch (URISyntaxException | NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }

    }

    private void emitInitStatement(String room) {
        Log.e("SignallingClientWebsocket", "emitInitStatement() called with: event = [" + "create or join" + "], message = [" + message + "]");
      //socket.emit("create or join", message)

        JSONObject obj = new JSONObject();
        obj.put("type", "createorjoin");
        obj.put("room", room);
        chatclient.send(obj.toString());
        //chatclient.send(JSON.stringify( {"type": "createorjoin" , "room": room}));
    }

    public void emitMessage(String message) {
        Log.e("SignallingClientWebsocket", "emitMessage() called with: message = [" + message + "]");
        // reliableSocket.send(JSON.stringify({"type": type, "msg": msg}));
        try {
            JSONObject obj = new JSONObject();
            obj.put("type", "message";
            obj.put("msg", message);
            Log.i("emitMessage", obj.toString());
            // socket.emit("message", obj);
            Log.i("room194", obj.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    public void emitMessage(SessionDescription message) {
        // reliableSocket.send(JSON.stringify({"type": type, "msg": msg}));
        try {
            Log.i("SignallingClientWebsocket", "emitMessage() called with: message = [" + message + "]");
            JSONObject obj = new JSONObject();
            obj.put("type", message.type.canonicalForm());
            obj.put("msg", message);
            Log.i("emitMessage", obj.toString());
           // socket.emit("message", obj);
            Log.i("room194", obj.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void emitIceCandidate(IceCandidate iceCandidate) {
        try {
            JSONObject object = new JSONObject();
            object.put("type", "candidate");
            object.put("label", iceCandidate.sdpMLineIndex);
            object.put("id", iceCandidate.sdpMid);
            object.put("candidate", iceCandidate.sdp);
            //socket.emit("message", object);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void close() {
   //     socket.emit("bye", roomName);
        //socket.disconnect();
      //  socket.close();
    }

    interface SignalingInterface {
        void onRemoteHangUp(String msg);

        void onOfferReceived(JSONObject data);

        void onAnswerReceived(JSONObject data);

        void onIceCandidateReceived(JSONObject data);

        void onTryToStart();

        void onCreatedRoom();

        void onJoinedRoom();

        void onNewPeerJoined();
    }
}
