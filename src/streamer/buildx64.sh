rm -rf build
mkdir build

git clean -xfd

cd build 

cmake .. -DUSE_OPENSSL=OFF -DUSE_MBEDTLS=ON -DBUILD_STATIC_LIBS=ON  -DBUILD_LIBSRTP_DESTINATION_PLATFORM=mips-linux-gnu -DBOARD=FILE -DCMAKE_BUILD_TYPE=Debug --log-level=VERBOSE

cd ../
