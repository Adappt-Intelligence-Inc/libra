set(RTSPDOM_SOURCE
  main.cpp
  IMP.cpp
  Encoder.cpp
  Logger.cpp
  RTSP.cpp
  IMPServerMediaSubsession.cpp
  IMPDeviceSource.cpp
  OSD.cpp
  GPIO.cpp
  Motion.cpp
  MotionClip.cpp
  MotionTSMux.cpp
  MotionMP4Mux.cpp
  CVR.cpp
  Scripts.cpp
  MuxQueue.cpp
  Config.cpp
  Night.cpp
  SunTrack.cpp
)

add_executable(${PROJECT_NAME} ${RTSPDOM_SOURCE})
target_include_directories(${PROJECT_NAME} PUBLIC
  ../3rdparty/install/include
  ../3rdparty/install/include/liveMedia
  ../3rdparty/install/include/groupsock
  ../3rdparty/install/include/UsageEnvironment
  ../3rdparty/install/include/BasicUsageEnvironment
  ../3rdparty/install/include/freetype2
  ../blob/include
)
target_link_directories(${PROJECT_NAME} PUBLIC
  ../3rdparty/install/lib
  ../blob/lib
)
target_link_libraries(${PROJECT_NAME}
  pthread
  imp alog rt crypto ssl
  liveMedia
  groupsock
  BasicUsageEnvironment
  UsageEnvironment
  freetype.a
  avdevice
  avformat
  avfilter
  avcodec
  swresample
  swscale
  avutil
  config++
)
