# Rest API Interface for RTSP and Webrtc

## Common APIs for Cloud and NVR. We are targetting AWS in this doc.

## Rules

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
  
   7. OTA FPT server is hosted on S3 bucket. https://ip-camera-storage.s3.ap-south-1.amazonaws.com/sdfirm-1.0.0.tar.gz. To upload firmware [s3_upload](s3_File_Upload.py)
      
   8. You can test some of our existing apis with following [Postman API](Api_Test.pdf)
      1. First loging with Post API api/login
      2. Then generate Camera ID with GET API api/cameraid. This is very unique camera id only Adappt can generate and validate it.
      3. Then Register Camera with above generated cameraid Post API api/register
      4. Other APIs are listed beneath

 
 ## Android Side APIS            

        ## POST API for andrioid


            if(request.getURI() == "/api/login")    // /User data storage with cameraid
            {

                // https header 
                std::string emailid = httpsHeader["emailid"].get<std::string>();  
                std::string pass = httpsHeader["psw"].get<std::string>();

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
                json userinfo = httpsHeader["userinfo"] ? httpsHeader["userinfo"];
  
                
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

###  Scope
This document defines the ONVIF specific streaming extensions for live and replay streaming. The correspond-
ing web service APIs to retrieve the streaming URIs are defined in separate documents and are not covered
in this document.

### To play at VLC rtsp://root:60056006@10.86.8.16:560/adappt-media/media.amp?videocodec=h264&resolution=768x576&fps=25
With Digest Autentication

### Application / User interface
Audio stream
Video stream
Metadata stream (XML)

Access Unit One or more frames or samples of audio, video, or metadata which are contained in a group of RTP packets having the same presentation time.
The metadata streaming container format allows well-defined, real-time streaming of analytics, PTZ status and notification data.

Metadata streams are also transported by RTP. The usage of payload type, marker and timestamp for RTP
header for the metadata stream is defined in the following way:

#### A dynamic payload type (96-127) shall be used for payload type which is assigned in the process of

```
a RTSP session setup.
```
#### The RTP marker bit shall be set to “1” when the XML document is closed.

#### It is RECOMMENDED to use an RTP timestamp representing the creation time of the RTP packet with

```
a RTP clock rate of 90000 Hz. Only UTC timestamps shall be used within the metadata stream. The
synchronization of video and audio data streams is done using RTCP.
```
The Metadata payload is an XML document with root node tt:MetaDataStream. There is no limitation on the
size of the XML document. If GZIP compression is used, the payload starts with a GZIP header according to
RFC 1952 followed by the compressed data. A marker bit signals the end of the compressed data. When a syn-
chronization point (see section “Synchronization Points” of the ONVIF Media Service Specification) is request-
ed for the stream, the previous XML document shall be closed and a new one started. It is RECOMMENDED
to start new XML documents after 1 second, at the longest. The RTP timestamp of the Metadata stream has
no specific meaning. The Metadata stream multiplexes Metadata from different sources. This specification de-
fines placeholders for the Scene Description of the Video Analytics, the PTZ Status of the PTZ controller and


the Notifications of the Event Configuration. A device can select which of these parts should be multiplexed
into the Metadata during the Media Configuration (see seciont “Metadata Configuration” of the ONVIF Media
Service Specification). Each part can appear multiple times in arbitrary order within the document. A Metadata
connection can be bi-directional using the backchannel mechanism (see Section 5.3).

Metadata stream contains the following elements:

• VideoAnalyticsStream

• PTZStream

• EventStream

The place-holders for the different metadata sources have the following XMLstructure:

<xs:complexType name="VideoAnalyticsStream">
<xs:choice minOccurs="0" maxOccurs="unbounded">
<xs:element name="Frame" type="tt:Frame"/>
...
</xs:choice>
</xs:complexType>
<xs:complexType name="PTZStream">
<xs:choice minOccurs="0" maxOccurs="unbounded">
<xs:element name="PTZStatus" type="tt:PTZStatus"/>
...
</xs:choice>
</xs:complexType>
<xs:complexType name="EventStream">
<xs:choice minOccurs="0" maxOccurs="unbounded">
<xs:element ref="wsnt:NotificationMessage"/>
...
</xs:choice>
</xs:complexType>

Note: For a PTZ supported device, the PTZStream in metadata provides the PTZ position information, when-
ever there is a change in the PTZ position, whereas PTZStatus defined inside VideoAnalyticsStream, provides
PTZ position information at the time of generating scene description.

The following is an example of a metadata XML document:

<?xml version="1.0" encoding="UTF-8"?>
<tt:MetadataStream xmlns:tt="http://www.onvif.org/ver10/schema">
<tt:VideoAnalytics>
<tt:Frame UtcTime="2024-01-10T12:24:57.321">
...
</tt:Frame>
<tt:Frame UtcTime="2024-01-10T12:24:57.621">
...
</tt:Frame>
</tt:VideoAnalytics>
</tt:MetadataStream>
<?xml version="1.0" encoding="UTF-8"?>
<tt:MetadataStream xmlns:tt="http://www.onvif.org/ver10/schema">
<tt:Event>
<wsnt:NotificationMessage>
<wsnt:Message>
<tt:Message UtcTime= "2024-01-10T12:24:57.628">
...
</tt:Message>
</wsnt:Message>
</wsnt:NotificationMessage>
</tt:Event>
</tt:MetadataStream>


## Streaming configurations for the following video codecs are provided:

 • JPEG (over RTP)
 
 • H.264, baseline
 
 • H.264, main 
 
 • H.264, extended 
 
 • H.264, high
 
 • HEVC
 
 • G.711 [ITU-T G.711 uLaw]
 
 • G.726 [ITU-T G.726]
 
 • AAC [ISO 14496-3]


### RTCP

The RTP Control Protocol provides feedback on quality of service being provided by RTP and synchronization
of different media streams. The RTCP protocol shall conform to [RFC 3550].

For a feedback request, [RFC 4585] and [RFC 5104] should be supported.

server client

#### RTCP SR

#### RTCP RR

```
Figure 3: RTCP sequence
```
### Media synchronization

A client MAY receive audio and video streams simultaneously from more than one device. In this case, each
stream uses a different clock (from data acquisition to packet receiving). RTCP Sender Reports (SR) are used
to synchronize different media streams. RTCP SRs shall conform to [RFC 3550].

The RTCP Sender Report (SR) packet has fields for the RTP timestamp and for a wall clock timestamp (absolute
date and time, 64bit NTP

A device shall support RTCP Sender Report for media synchronization. The client should use RTCP for the
media synchronization.

```
0 1 2 3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
V P RC PT=SR=200 length
SSRC of sender
NTP timestamp, most significant word
NTP timestamp, least significant word
RTP timestamp

The wall clock should be common in the device and each timestamp value should be determined properly.
The client can synchronize different media streams at the appropriate timing based on the RTP clock and wall
clock timestamps (see Figure 5).

In case of multiple devices, the NTP timestamp should be common to all devices, and the NTP server should
be required in the system

### Playback

Playback is initiated by means of the RTSP PLAY method. For example:


PLAY rtsp://192.168.0.1/path/to/recording RTSP/1.0
Cseq: 123
Session: 12345678
Require: onvif-replay
Range: clock=20090615T114900.440Z-
Rate-Control: no

The ReversePlayback capability defined in the ONVIF Replay Control Service Specification signals if a device
supports reverse playback. Reverse playback is indicated using the Scale header field with a negative value.
For example to play in reverse without no data loss a value of –1.0 would be used.

PLAY rtsp://192.168.0.1/path/to/recording RTSP/1.0
Cseq: 123
Session: 12345678
Require: onvif-replay
Range: clock=20090615T114900.440Z-
Rate-Control: no
Scale: -1.0

If a device supports reverse playback it shall accept a Scale header with a value of –1.0. A device MAY accept
other values for the Scale parameter. Unless the Rate-Control header is set to “no” (see below), the Scale
parameter is used in the manner described in [RFC 2326]. If Rate-Control is set to “no”, the Scale parameter, if
it is present, shall be either 1.0 or –1.0, to indicate forward or reverse playback respectively. If it is not present,
forward playback is assumed.

###  Range header field

A device shall support the Range field expressed using absolute times as defined by [RFC 2326]. Absolute
times are expressed using the utc-range from [RFC 2326].

Either open or closed ranges may be used. In the case of a closed range, the range is increasing (end time
later than start time) for forward playback and decreasing for reverse playback. The direction of the range shall
correspond to the value of the Scale header.

In all cases, the first point of the range indicates the starting point for replay.

The time itsel shall be given as

utc-range = "clock" ["=" utc-range-spec]
utc-range-spec = ( utc-time "-" [ utc-time ] ) / ( "-" utc-time )
utc-time = utc-date "T" utc-clock "Z"
utc-date = 8DIGIT
utc-clock = 6DIGIT [ "." 1*9DIGIT ]

as defined in [RFC2326].

Examples:

PLAY rtsp://192.168.0.1/path/to/recording RTSP/1.0
Cseq: 123
Session: 12345678
Require: onvif-replay
Range: clock=20090615T114900.440Z-20090615T115000Z
Rate-Control: no
PLAY rtsp://192.168.0.1/path/to/recording RTSP/1.0
Cseq: 123
Session: 12345678


Require: onvif-replay
Range: clock=20090615T115000.440Z-20090615T114900Z
Rate-Control: no
Scale: -1.0

###  Rate-Control header field

This specification introduces the Rate-Control header field, which may be either “yes” or “no”. If the field is not
present, “yes” is assumed, and the stream is delivered in real time using standard RTP timing mechanisms. If
this field is “no”, the stream is delivered as fast as possible, using only the flow control provided by the transport
to limit the delivery rate.

The important difference between these two modes is that with “Rate-Control=yes”, the server is in control of the
playback speed, whereas with “Rate-Control=no” the client is in control of the playback speed. Rate-controlled
replay will typically only be used by non-ONVIF specific clients as they will not specify “Rate-Control=no”.

When replaying multiple tracks of a single recording, started by a single RTSP PLAY command and not using
rate-control, the data from the tracks should be multiplexed in time in the same order as they were recorded.

An ONVIF compliant RTSP server shall support operation with “Rate-Control=no” for playback.


