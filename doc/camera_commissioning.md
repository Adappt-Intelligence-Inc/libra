# Camera commissioning with wifi password 

## Steps to commission Hualai Camera 

### Start Android APP( adda)   or directly call Rest APIs 

#### Login as admin 

#### Firt Generate unique ID for the camera.  On this planent only Adapt can generate this ane Validate this ID.  This ID can not be duplicated or recreated.

#### Maintain a data base for this ID with Mac address.

####  Gnerate QR code from this ID and print QR on camera and camera box

#### Press the next screen button in Android, which will show the QR code  encode with information( wifi ssid, pasword and  camera ID ). Do not allow the Android app to move to next screen,
    
    1. Start websocket signalling Client to listen for Camera Joined event.

    2. websocket signalling channel name would be same as camera ID 

    3. Keep logging still watiing for camera to focus on APP QR screen 
    
    3. Keep Android in acvite mode and log every 500 millsecs  



### Take camera in your left Hand 

#### Press the reset button of camera, If camera is not fresh from factory)

#### Camera would be in scan mode, if the wifi password is missing or if wifi password is wrong

####  Bring camera amd focus it on Android screen

###  Camera decodes wifi ssid, pasword and camera ID, then configure the IP

    1. Start websocket signalling channel  
    
    2. websocket signalling channel name would be same as camera ID 

    3. Send the event CreateOrJoin 




### Take the Mobile  in your right hand
   
   1. you sill see APP screen moves to next screen, you will see the video stream.

   2. ICE candidate will be logged

   3. SDP will be logged 


## Steps to generate camera id 
[Postman API](WebRtc_Apis.pdf)
[Postman WorkSpace](https://planetary-meadow-94281.postman.co/workspace/Team-Workspace~a03d6d10-cebc-4bff-84d1-f70f55797d87/collection/18375432-e28e7a39-7b81-4291-bfb0-7965729c2ec3?action=share&creator=18375432&active-environment=18375432-89ac961d-718c-4dee-b2d8-625a562220a0)





