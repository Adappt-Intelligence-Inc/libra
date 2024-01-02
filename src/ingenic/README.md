
# Supported Boards T31

## Steps

mdkir /workspace/adappt/

git clone git@github.com:Adappt-Intelligence-Inc/libra.git

cd /workspace/adappt/libra/src/ingenic

check the path of T31 SDK and untrar the T31 SDK.

source buildenv.sh

mkdir build

cd build 



## Webrtc

cmake .. -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=T31 --log-level=VERBOSE



## Saveframe

cmake .. -DBOARD=T31 -DBUILD_WEBRTC_SAMPLES=OFF -DBUILD_SAVE_FRAME_SAMPLES=ON  -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON --log-level=VERBOSE



## HLS

cmake .. -DBUILD_WEBRTC_SAMPLES=OFF -DBUILD_KVS_SAMPLES=ON -DBOARD=FILE -DBUILD_STATIC_LIBS=ON  -DCMAKE_BUILD_TYPE=Debug --log-level=VERBOSE



make VERBOSE=1




## For faster compilation 


git clone below repository to /workspace/adappt/download/

GIT_REPOSITORY    https://github.com/aws/aws-sdk-cpp.git

GIT_REPOSITORY  https://github.com/google/benchmark

GIT_REPOSITORY    https://github.com/google/googletest.git

GIT_REPOSITORY    https://github.com/zserge/jsmn.git

GIT_REPOSITORY    https://github.com/awslabs/amazon-kinesis-video-streams-producer-c.git

GIT_REPOSITORY  https://github.com/ARMmbed/mbedtls.git

GIT_REPOSITORY    https://github.com/openssl/openssl.git

GIT_REPOSITORY    https://github.com/cisco/libsrtp.git

GIT_REPOSITORY    https://github.com/sctplab/usrsctp.git

GIT_REPOSITORY https://github.com/warmcat/libwebsockets.git


## Note

All the binaries will be generated for glibc