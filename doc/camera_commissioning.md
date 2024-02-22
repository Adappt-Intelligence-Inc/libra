# Camera commissioning with wifi password 

## Steps to commission Hualai Camera 

### Start Mobile Android APP or directly call Rest APIs 

#### Login as admin 

#### Firt Generate unique ID for the camera as mentioned beneath.  On this planent only Adapt can generate and Validate this ID.  This ID can not be duplicated or recreated.

#### Maintain a data base for camera ID with Mac address.

####  Gnerate QR code from camera ID and then print QR on camera and camera box.

#### Press the next screen button in Android, which will show the QR code which is encode with information( wifi ssid, pasword and  camera ID ). Do not allow the Android app to move to next screen,
    
    1. Start websocket signalling Client to listen for Joined event.

    2. websocket signalling channel name would be same as camera ID 

    3. Keep logging message "still watiing for camera to focus on APP QR screen" 
    
    3. Keep Android in acvite mode and log every 500 millsecs  



### Take camera in your left Hand 

#### Press the reset button of camera, if camera is not in factory setting mode.

#### Camera would be in scan mode, when the wifi password is missing or when wifi password is wrong

####  Bring camera and focus it on Android screen

###  Camera decodes wifi ssid, pasword and camera ID, then configure the IP

    1. Then Starts websocket signalling channel  
    
    2. websocket signalling channel name would be same as camera ID 

    3. Send the event CreateOrJoin to signalling channel




### Take the Mobile  in your right hand
   
    1. Android APP screen moves to next screen, you will see the video stream.

    2. ICE candidate will be logged

    3. SDP will be logged 


## Steps to generate camera id 
[Postman API](Api_Test.pdf)





