# Rest API Interface for webrtc, RTSP, HLS, Mpeg-Dash

## Common APIs for Cloud and NVR. We are targetting AWS in this doc.

# Rules

1. Mapping between UserID(emaild) & cameraId will be done with Public SSL Certificate generated for Camera. During camera commissioning, public pem will be created from APP and shared to Camera.

2. All User Info will be in Json Format.

3. Use Post APIs for Creation, Put for Updation and Delete for deletion.
   
4. We can not share or Use long-term access key and access key ID at camera nor at Android APP. Instead we can do any of the following
   
   1. Generate temporary security credentials. Temporary security credentials include an access key ID and a secret access key, but they also include a security token that indicates when the credentials expire. After they expire, they're no longer valid.

   2. We will provide API for the temporary keys and sessionids.
  



   
5. Supported protocols
   
   1. Kinesis-WEBRTC cost around .03 *12 USD per year
   
   2. EC2-WEBRTC, cost around .07 USD PER YEAR
   
   3. Kinesis-HLS & Kinesis-HLS. Our legacy sensors works with HLS only
   
   4. RTSP. Vendor need to provide own webpage and restapi to configure camera, network and colors of image.

   5. Notification of Events( Motion Clips) could be done with SMS or Telegram.

   6. All the recoridng on SD card should be 30 seconds motion Mp4 clips. Recorded clips should not be stored in cloud.
  
   7. OTA FPT server is hosted by Vendor only. We do not have any APIs for the same.

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
            else if(request.getURI() == "/api/Channel")    // create and get channel/signalling information with Signaling channel Name/ARN
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

            if(request.getURI() == "/api/Channel")     // Delete channel 
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



