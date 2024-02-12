# Android Webrtc APP

## Steps to test adappt.ar app

1. Git clone  git@github.com:Adappt-Intelligence-Inc/libra.git

2. Open Androd Studio  mobapp

3. Sync Gradle

4. Connect you mobile phone for USB debugging, Slelect your Mobile Device at Androd Studio

5. Build

6. Run  ( you will see app running in you android phone)


7. Run T31 camera or with Browser you can test with  https://ipcamera.adapptonline.com/. Then Add Camera


## For Manual Testing after installing apk


### Enable USB debugger of Android

1. Enable Android setting, about and then tap version detail for 6 & 7 times till debug option is enable
2. Click USB Debugger


### login to linux and windows connect USB 

adb devices  

List of devices attached

* daemon started successfully

2447cae5	device

 adb -s  2447cae5 shell

 adb logcat -s "libjingle"

 adb uninstall adappt.ar.webrtccodelab

adb install app-debug.apk

### Browser 

https://ipcamera.adapptonline.com/

grant access to camera and mic at browswer

add camera


### Note
This is working example of WebRTC app from [official webrtc src](https://webrtc.googlesource.com/src/+/refs/heads/master/examples/androidapp/) which can be built with the latest Android Studio(3.6.3).

This app uses a dependency to latest webrtc Android library: org.webrtc:google-webrtc:1.0.28513

