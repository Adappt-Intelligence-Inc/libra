# Android Webrtc APP

## Enable USB debugger of Android

1. Enable Android setting, about and then tap version detail for 6 & 7 times till debug option is enable
2. Click USB Debugger


## login to linux and windows connect USB 

adb devices  

List of devices attached

* daemon started successfully

2447cae5	device

 adb -s  2447cae5 shell

 adb logcat -s "libjingle"

 adb uninstall adappt.ar.webrtccodelab

adb install app-debug.apk


# Browse 
https://192.168.0.19:1794/

add room


## Simillar links 

https://vivekc.xyz/getting-started-with-webrtc-for-android-daab1e268ff4

http://leadtosilverlining.blogspot.com/2018/04/how-to-build-android-webrtc-mobile-app.html

https://github.com/njovy/AppRTCDemo

http://webrtc.github.io/webrtc-org/native-code/android/

https://github.com/SD810/webrtc_example_android_app

https://github.com/ISBX/apprtc-node-server

https://github.com/Androidhacks7/AppRTC-Android

This is working example of WebRTC app from [official webrtc src](https://webrtc.googlesource.com/src/+/refs/heads/master/examples/androidapp/) which can be built with the latest Android Studio(3.6.3).

This app uses a dependency to latest webrtc Android library: org.webrtc:google-webrtc:1.0.32006

