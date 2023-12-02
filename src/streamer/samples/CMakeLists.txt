cmake_minimum_required(VERSION 3.6.3)

project(KinesisVideoWebRTCClientSamples LANGUAGES C)

#set(OPEN_SRC_INSTALL_PREFIX "${CMAKE_CURRENT_SOURCE_DIR}/open-source" CACHE PATH "Libraries will be downloaded and build in this directory.")

message("OPEN_SRC_INSTALL_PREFIX=${OPEN_SRC_INSTALL_PREFIX}")

find_package(PkgConfig REQUIRED)


include_directories(${OPEN_SRC_INSTALL_PREFIX}/include)
include_directories(${OPEN_SRC_INCLUDE_DIRS})
link_directories(${OPEN_SRC_INSTALL_PREFIX}/lib)

# copy sample frames to this subproject build folder, in case developer runs sample program with command `kvsWebrtcClientMaster` from `build/samples` dir.
file(COPY "${CMAKE_CURRENT_SOURCE_DIR}/opusSampleFrames" DESTINATION .)
file(COPY "${CMAKE_CURRENT_SOURCE_DIR}/h264SampleFrames" DESTINATION .)

add_executable(
  kvsWebrtcClientMaster
  Common.c
  kvsWebRTCClientMaster.c devicePlayer.c)
target_link_libraries(kvsWebrtcClientMaster kvsWebrtcClient kvsWebrtcSignalingClient kvsCommonLws kvspicUtils websockets avformat avcodec swscale avutil avdevice avfilter swresample)

add_executable(
  kvsWebrtcClientViewer
  Common.c
  kvsWebRTCClientViewer.c devicePlayer.c)
target_link_libraries(kvsWebrtcClientViewer kvsWebrtcClient kvsWebrtcSignalingClient kvsCommonLws kvspicUtils websockets avformat avcodec swscale avutil avdevice avfilter swresample )

add_executable(
        discoverNatBehavior
        discoverNatBehavior.c)
target_link_libraries(discoverNatBehavior kvsWebrtcClient)

install(TARGETS kvsWebrtcClientMaster kvsWebrtcClientViewer discoverNatBehavior
  RUNTIME DESTINATION bin
)

