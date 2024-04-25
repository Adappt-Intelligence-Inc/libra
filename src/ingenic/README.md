
# Supported Boards T31

## Steps

mdkir /workspace/adappt/

git clone git@github.com:Adappt-Intelligence-Inc/libra.git

cd /workspace/adappt/libra/src/ingenic

check the path of T31 SDK and untrar the T31 SDK.

source buildenv.sh   Note: incase if your board is supporting ulibc, or different version of toolchain please adjust the path and replace glibc with ulibc at buildenv.sh. Let me know if help is required on the same 

mkdir build

cd build 

apt-get install pkg-config cmake libcap2 libcap-dev


## Webrtc

## For faster compilation 

Note: in future will gt rid of below steps and remove the dependency on AWS.    

git clone below repository to /var/tmp/download/  

cd /var/tmp/download/  

git clone  https://github.com/aws/aws-sdk-cpp.git

git clone  https://github.com/google/benchmark

git clone  https://github.com/google/googletest.git

git clone  https://github.com/zserge/jsmn.git

git clone  https://github.com/awslabs/amazon-kinesis-video-streams-producer-c.git

git clone  https://github.com/ARMmbed/mbedtls.git

git clone  https://github.com/openssl/openssl.git

git clone  https://github.com/cisco/libsrtp.git

git clone  https://github.com/sctplab/usrsctp.git

git clone  https://github.com/warmcat/libwebsockets.git


cd /workspace/adappt/libra/src/ingenic/build

cmake .. -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=T31 --log-level=VERBOSE

for debug

cmake .. -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=FILE -DCMAKE_BUILD_TYPE=Debug --log-level=VERBOSE 


#For uclibc

cmake .. -DUSE_MUCLIBC=ON -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=T31 --log-level=VERBOS


## For Recording

cd ..

rm build   //director 

git clean -xfd


mkdir build  cd build


cmake .. -DBOARD=T31 -DBUILD_WEBRTC_SAMPLES=OFF -DBUILD_SAVE_FRAME_SAMPLES=ON  -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON --log-level=VERBOSE



## HLS

cd ..

rm build   //director 

git clean -xfd


mkdir build  cd build

cmake .. -DBUILD_WEBRTC_SAMPLES=OFF -DBUILD_KVS_SAMPLES=ON -DBOARD=FILE -DBUILD_STATIC_LIBS=ON  -DCMAKE_BUILD_TYPE=Debug --log-level=VERBOSE



make VERBOSE=1






## Note

All the binaries will be generated for glibc
