:cmake -DBUILD_STATIC_LIBS=OFF DBUILD_GSTREAMER_PLUGIN=OFF -DBUILD_JNI=FLASE -DCMAKE_BUILD_TYPE=Debug  ..

cmake .. -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=FILE -DCMAKE_BUILD_TYPE=Debug --log-level=VERBOSE 

Please do not forget to install following pakagages

apt-get install pkg-config cmake libcap2 libcap-dev



python3 -m http.server 8000
 

