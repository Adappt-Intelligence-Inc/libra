cmake_minimum_required(VERSION 2.9)
project(rtspserver)

message("MY_VARIABLE=${RTSP_CROSS}")

set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR mips)
set(CMAKE_C_COMPILER ${RTSP_CROSS}gcc)
set(CMAKE_CXX_COMPILER ${RTSP_CROSS}g++)

aux_source_directory(./src SRC_LIST)

set(CMAKE_CXX_FLAGS "--std=c++11 -Wall -Wextra -Wno-unused-parameter -O3")
set(CMAKE_LINKER_FLAGS "-static")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

add_subdirectory(./src)
