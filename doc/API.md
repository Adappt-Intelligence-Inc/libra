# Rest API Interface for RTSP and Webrtc

## Common APIs for Cloud and NVR. We are targetting AWS in this doc.

# Rules

1. Mapping between UserID(emaild) & cameraId are done with Public SSL Certificate generated for Camera. During camera commissioning, public pem will be created from APP and shared to Camera.

2. All User Info and Device information are in Json Format.

3. Post Rest APIs for Creation, Put for Updation and Delete for deletion.
   
4. Generated temporary security credentials. Temporary security credentials include an access key ID and a secret access key, but they also include a security token that indicates when the credentials expire. After they expire, they're no longer valid.



   
5. Supported protocols
   
   1. Kinesis-WEBRTC cost around .03 *12 USD per year
   
   2. EC2-WEBRTC, cost around .07 USD PER YEAR
   
   3. Kinesis-HLS & Kinesis-HLS. Our legacy sensors works with HLS only
   
   4. We provided webpage and restapis to configure camera, network and colors of image.

   5. Notification of Events( Motion Clips) is done with SMS 

   6. All the recoridng on SD card are 30 seconds motion Mp4 clips. Recorded clips are not stored in cloud.
  
   7. OTA FPT server is hosted on S3 bucket. https://ip-camera-storage.s3.ap-south-1.amazonaws.com/sdfirm-1.0.0.tar.gz
      
   8. You can test some of our existing apis with following [API](Api_Test.pdf)



## CONTENTS

- 1 Scope

- 2 Terms and Definitions
   - 2.1 Definitions................................................................................................................................
   - 2.2 Abbreviations...........................................................................................................................
- 4 Overview
- 5 Live Streaming
   - 5.1 Media stream protocol..............................................................................................................
      - 5.1.1 Transport format................................................................................................................
         - 5.1.1.1 RTP data transfer via UDP
         - 5.1.1.2 RTP/TCP
         - 5.1.1.3 RTP/RTSP/TCP
         - 5.1.1.4 SRTP data transfer via UDP
         - 5.1.1.5 RTP/RTSP/HTTP/TCP
         - 5.1.1.6 RTP/RTSP/TCP/WebSocket
      - 5.1.2 Media Transport..............................................................................................................
         - 5.1.2.1 RTP
         - 5.1.2.2 RTCP
      - 5.1.3 Synchronization Point......................................................................................................
      - 5.1.4 JPEG over RTP
         - 5.1.4.1 Overall packet structure............................................................................................
         - 5.1.4.2 Logical decoding specification...................................................................................
         - 5.1.4.3 Supported colour spaces and sampling factors...........................................................
         - 5.1.4.4 Pixel aspect ratio handling........................................................................................
         - 5.1.4.5 Interlaced handling....................................................................................................
   - 5.2 Media control protocol............................................................................................................
      - 5.2.1 Stream control.................................................................................................................
      - 5.2.2 RTSP
         - 5.2.2.1 General....................................................................................................................
         - 5.2.2.2 Timeout and keep-alive handling...............................................................................
         - 5.2.2.3 RTSP audio and video synchronization
         - 5.2.2.4 RTSP session for a metadata stream
         - 5.2.2.5 Multicast streaming...................................................................................................
         - 5.2.2.6 RTSP message example
      - 5.2.3 RTSP over HTTP
      - 5.2.4 Secure RTSPS
   - 5.3 Back channel connection........................................................................................................
      - 5.3.1 RTSP Require tag
      - 5.3.2 Connection setup for a bi- directional connection...............................................................
         - 5.3.2.1 Describe example for a server without backchannel support:.......................................
         - 5.3.2.2 Describe example for a server with Onvif backchannel support:...................................
         - 5.3.2.3 Describe example in case of backchannel support with multiple decoding capability......
      - 5.3.3 Multicast streaming..........................................................................................................
         - 5.3.3.1 Example: Multicast Setup..........................................................................................
   - 5.4 Multitrack streaming................................................................................................................
      - 5.4.1 Group Attribute................................................................................................................
      - 5.4.2 Media Stream Identification Attribute.................................................................................
      - 5.4.3 Extension Attribute...........................................................................................................
      - 5.4.4 Example..........................................................................................................................
   - 5.5 Error handling........................................................................................................................
- 6 Playback
   - 6.1 RTSP usage
   - 6.2 RTSP describe
   - 6.3 RTP header extension
      - 6.3.1 NTP Timestamps.............................................................................................................
      - 6.3.2 Compatibility with the JPEG header extension..................................................................
   - 6.4 RTSP Feature Tag
   - 6.5 Initiating Playback...................................................................................................................
      - 6.5.1 Range header field..........................................................................................................
      - 6.5.2 Rate-Control header field.................................................................................................
      - 6.5.3 Frames header field.........................................................................................................
      - 6.5.4 Synchronization points.....................................................................................................
   - 6.6 Reverse replay.......................................................................................................................
      - 6.6.1 Packet transmission order................................................................................................
      - 6.6.2 RTP sequence numbers
      - 6.6.3 RTP timestamps
   - 6.7 RTSP Keepalive
   - 6.8 Currently recording footage.....................................................................................................
   - 6.9 End of footage.......................................................................................................................
   - 6.10 Go To Time
   - 6.11 Use of RTCP
- 7 WebSocket transport for RTP/RTSP/TCP
   - 7.1 WebSocket version.................................................................................................................
   - 7.2 Authentication.........................................................................................................................
   - 7.3 WebSocket Connection...........................................................................................................
      - 7.3.1 Handshake......................................................................................................................
         - 7.3.1.1 WebSocket Subprotocol............................................................................................
         - 7.3.1.2 Example: WebSocket Handshake..............................................................................
      - 7.3.2 Data Transfer..................................................................................................................
         - 7.3.2.1 WebSocket Message Frame Format..........................................................................
- Annex A Revision History


## 1 Scope

This document defines the ONVIF specific streaming extensions for live and replay streaming. The correspond-
ing web service APIs to retrieve the streaming URIs are defined in separate documents and are not covered
in this document.


 ## Android            

        ## POST API for andrioid


            if(request.getURI() == "/api/login")    // /User data storage with cameraid
            {


                // https header 
                std::string mobile = httpsHeader["mobile"].get<std::string>()
                std::string emailid = httpsHeader["emailid"].get<std::string>();  
                std::string pass = httpsHeader["psw"].get<std::string>();
                std::string cameraid = httpsHeader["camerid"].get<std::string>();  // camera barcode


                 if(authcheck( request, msg ))   // first time any password
                {
                    if failed  return reason of failure
                }
               
               
                
                return  auth tocken

                generate auth tocken  with email id and paassword

                tocken.set( "uid", emailid );
                tocken.set( "key", pass + "@" +  pass);
                tocken.set( "exp", "3600" );
                tocken.set( "perm", "r" );  // permission read or write . All the customer will have read only permssion. Only vendor will have w mode
            
                 
                 on success it will have auth token with expire time

                 on failure it will have reason of failure
                            
                         
            }
            
            else if(request.getURI() == "/api/account")   //add or change the user information. Change password
            {
            
                std::string emailid = httpsHeader["emailid"].get<std::string>();  
                std::string newpass = httpsHeader["newpass"] ?  httpsHeader["newpass"].get<std::string>():"";
                std::string userinfo = httpsHeader["userinfo"] ? httpsHeader["userinfo"].get<std::string>():"";
  

                
                if(authcheck( request, msg ))   
                {
                    if failed  return reason of failure
                }
               
               
                if(newpass)
                {
                    generate new auth tocken  with email id and new paassword

                    tocken.set( "uid", emailid );
                    tocken.set( "key", pass + "@" +  pass);
                    tocken.set( "exp", "3600" );
                    tocken.set( "perm", "r" );  // permission read or write . All the customer will have read only permssion. Only vendor will have w mode

                }
                     
                 on success it will have auth token with expire time

                 on failure it will have reason of failure

                
             
            }
        
        
        ## PUT API for andrioid

            if(request.getURI() == "/api/camera")    // add or change  the camera information. And to enable storage
            {
            
                std::string tokenid = httpsHeader["tokenid"].get<std::string>();  
                std::string newcameraid = httpsHeader["newcameraid"].get<std::string>();  // To add more camera

                bool cloudStorage =  httpsHeader["storage"] ? httpsHeader["storage"].get<bool>():false;  // Tto enable storage

                if( cloudStorage)
                int days= httpsHeader["retention"].get<std::string>();  
              
              
                 
                 on success it will have success msg

                 on failure it will have reason of failure

                
           }


            Delete API for andrioid

            if(request.getURI() == "/api/delcamera")   
            {
            
                std::string tokenid = httpsHeader["tokenid"].get<std::string>();  
                std::string delCameraID = httpsHeader["cameraid"].get<std::string>();  // To add more camera
                
                 on success it will have success msg

                 on failure it will have reason of failure

            }






# APIs Exposed to Camera Vendor

        # POST API for camera

            if(request.getURI() == "/api/register")
            {


                // https header 
                std::string cameraid = httpsHeader["cameraid"].get<std::string>()   // scan barcode of camera should create with JSON having Mac ID,Local IP,VPN IP specific to camera/device.
                std::string cert = httpsHeader["cert"].get<std::string>();  // One time public certificate during camera commissioning
                std::string cameratype = httpsHeader["cameraType"].get<std::string>();   Baby-Monitor , AI-Dog, AI-Humaniod, AI-FACED-REQ, 
                bool ptz = httpsHeader["ptz"].get<bool>();   fixed camera or PTZ
                std::string firmwareVersion = httpsHeader["firmwareVersion"].get<std::string>();
                std::string serviceid = httpsHeader["service"].get<std::string>();    // Kinesis-WEBRTC(.04 *12 USD), Kinesis-HLS ,  EC2-WEBRTC( .07 USD PER YEAR) , RTSP


                 if(authcheck( request, msg ))   // first time any password
                {
                    if failed  return reason of failure
                }
               
               
                 
                 
                 on success it will return following.   We do not need to return "AWS_KVS_CACERT_PATH" since during camera commissioning we have given cert to camera
                #7 days retention period

                 #For Kinesis-WEBRTC (.04 *12 USD PER YEAR)

                 "AWS_DEFAULT_REGION":"ap-xxxx"
                 "AWS_SECRET_ACCESS_KEY":"yyyyyyyyyy"
                 "AWS_ACCESS_KEY_ID":"xxxxxxxxx"
                 "sessionid":"sessionid"

                 optional only for developers
                 "DEBUG_LOG_SDP":"TRUE"
                 "AWS_KVS_LOG_LEVEL":1
                 "AWS_KVS_CACERT_PATH":"if missing, "



                 #For Kinesis-HLS
                 In addtion of to above
                 
                 "AWS_IOT_CORE_THING_NAME":"camera_name"
                 "AWS_IOT_CORE_CREDENTIAL_ENDPOINT":"xxxxxxxxxxxxx.credentials.iot.ap-south-1.amazonaws.com"
                 "AWS_IOT_CORE_ROLE_ALIAS":"camera_role_alias"


                 #EC2-WEBRTC( .07 USD PER YEAR)

                 "tokenid":"authtoken"


                # For RTSP

                 Success Only

            }
            
           # Post API for camera
            else if(request.getURI() == "/api/channel")    // create and get channel/signalling information with Signaling channel Name/ARN
            {
            
                std::string sessionid = httpsHeader["sessionid"].get<std::string>();  
                
                std::string newcameraid = httpsHeader["cameraid"].get<std::string>();  // To add more camera

               
                 
                 on success it will have  "channelName or Signaling channel ARN"


                 #EC2-WEBRTC

                 
                  on success it will have  "channelName or Signaling channel ARN"

                  Based on laod balance it will return websocket path.  We will maintain count of active channel in database  

                  wss://ipcamera.adapptonline.com/channelName
                  wss://ipcamera.adapptonline1.com/channelName
                  wss://ipcamera.adapptonline2.com/channelName
           }
          else if(request.getURI() == "/api/Storage")    // if customer paid for storage
           {
            
                std::string sessionid = httpsHeader["sessionid"].get<std::string>();  
                std::string newcameraid = httpsHeader["cameraid"].get<std::string>(); 
                std::string channel = httpsHeader["channel"].get<std::string>(); 
         
                 
                on success it will have  "channelName or Signaling channel ARN"

           }

        # Delete API for camera

            if(request.getURI() == "/api/channel")     // Delete channel 
            {
            
                std::string tokenid = httpsHeader["tokenid"].get<std::string>();  
                std::string newcameraid = httpsHeader["cameraid"].get<std::string>();  // To add more camera
                std::string channelName = httpsHeader["channelName"].get<std::string>(); or  std::string channelARN = httpsHeader["channelARN"].get<std::string>(); // To add more camera
                
                 on success it will have success msg

                 on failure it will have reason of failure

            }

      # Trigger GStreamer for HLS Protocol. For our legacy HLS camera decommissioning json are as follows
           if(request.getURI() == "/api/triggerGstreamer")     // trigger Gstreamer using KVS link
           {
                std::string streamName = httpsHeader["streamName"].get<std::string>();  //Video stream name
                
                 on success it will have success msg and upload streams to kinesis video streams

                 on failure it will have reason of failure

            
            
                  #For amazon-kinesis-video-streams-producer
                       "AWS_DEFAULT_REGION":"ap-xxxxxx-1"
                       "AWS_SECRET_ACCESS_KEY":"yyyyyyyyyyyyyyy"
                       "AWS_ACCESS_KEY_ID":"xxxxxxxxx"
                       "sessionid":"sessionid"
            
                  # our legacy HLS camera decommissioning json are as follows
                  ```
                  {
                      "additionalDetails":
                          {
                              "deviceType": "3rd Party Sensor",
                              "deviceCategory": "Input Device",
                              "deviceId": "xxxxxxxx",
                              "communicationProtocol": "Direct Communication",
                              "LIP": "XXX.XXX.XXX.XX",
                              "vpnIP": "XX.XX.XX.XXX"
                          },
                     "deviceDetails":
                          {
                              "name": "Device",
                              "class": "IP_Camera-placed",
                              "posx": 0,
                              "posy": 0,
                              "height": 50,
                              "width": 50,
                              "zindex": 1,
                              "cielingHeight": 10
                          },
                      "bleAddr": "0",
                      "cameraEventTypeId": [],
                      "deviceTypeId": "IP_Camera"
                  }
           }



## Webbrtc P2P Streaming for audio &  video and datachannel( Vendor will do it)

   1. Live Video Streaming will happen with P2P, once App send SDP Offer. Same for Audio.  

   2. Recorded Veoo Streaming will happen with datachannel or video channel once App send recorded clips request

   

        Let suppose we have 2 events as follows. 30 Seconds H264 Clip will be recorded as


        /dev/sd0/MotionEv/Cam1_2023-11-21-07-40-17_780.mp4  (Motion Events )
          
        /dev/sd0/FacialRecEv/Cam1_2023-11-21-08-40-17_790.mp4 ( Facial recognition Events) 



        We have two events with Cam1. Motion Events at time 2023-11-21-07h-40min-17s_780ms  and Facial recognition Events at time 2023-11-21-08h-40m-17s_790ms respectively.


        Event information and  Clips will not be stored at AWS. Only on demand from Android APP, event information will be provided to APP.

        Notification of Events( Motion Clips) could be done with SMS or Telegram.

        Websocket Apis wss://example.com/Cam1
        /MotionEv/023-11-21-08   will return list of MotionEvents at hour 8
        /FacialRecEv/   will return list of dates  
        /Cam1/  will return types of events  for example Facial Recognition, Motion Events etc




# For RTSP

Vedor need to expose rest apis for the configuration of IP, Subnet and Gateway.  Encoder selection



## APIS for PTZ
   TBD



