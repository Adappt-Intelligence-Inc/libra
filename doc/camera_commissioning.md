# Camera commissioning with wifi password 

## Steps to commission Hualai Camera 

### Start Mobile Android APP or directly call Rest APIs 

#### Login as admin 

#### First Generate unique ID for the camera as mentioned beneath.  On this planet only Adappt can generate and validate this ID. This ID can not be duplicated or recreated. 


#### Maintain a database for camera ID with Mac address.[ This work would be out sourced to other team]

####  Generate QR code from camera ID and then print QR on camera & camera box.

#### Press the next screen button in Android, which will show the QR code. QR code is encoded with information( wifi ssid, pasword and  camera ID ).
    
    1. Start websocket signalling Client to listen for "Joined" event.

    2. websocket signalling channel name would be same as camera ID 

    3. Keep logging message "still watiing for camera to focus on APP QR screen" 
    
    3. Keep Android in acvite mode and log every 500 millsecs .

    4. Do not allow the Android app to move to next screen.



### Take camera in your left Hand 

#### Press the reset button of camera, if camera is not in factory setting mode.

#### Camera would be in scan mode, when the wifi password is missing or when wifi password is wrong

####  Bring camera and focus it on Android screen

###  Camera decodes wifi ssid, pasword and camera ID, then configure the IP

    1. Register the Camera with Register Rest API [Postman API](Api_Test.pdf)
    
    2. Then camera starts websocket signalling channel  
    
    3. websocket signalling channel name would be same as camera ID 

    4. Send the event "CreateOrJoin" to signalling channel. 

    5. Signalling server will send "Joined" Event to Android APP
    




### Take the Mobile in your right hand
   
    1. Android APP screen moves to next screen, you will see the video stream.

    2. ICE candidate will be logged

    3. SDP will be logged 


## Steps to generate camera id 
[Postman API](Api_Test.pdf)


## Indicators 

1. LED should be RED as long as wifi is not working or password of wifi is wrong.

2. Audio should keep playing for Camera to scan QR code from Android APP.


