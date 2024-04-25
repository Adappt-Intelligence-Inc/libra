#!/bin/bash
set -e

TOP=$(pwd)
echo "TOP = $TOP"

rm -rf 3rdparty/install
mkdir 3rdparty/install


INSTALLPATH=/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_540/mips-gcc540-glibc222-64bit-r3.3.0
#INSTALLPATH="/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit"
TOOLCHAIN=$INSTALLPATH/bin
RTSP_CROSS=$TOOLCHAIN/mips-linux-gnu-

 echo "Build OpenSSL"
 cd 3rdparty
 rm -rf openssl
 if [[ ! -f openssl-1.1.1t.tar.gz ]]; then
     wget 'https://www.openssl.org/source/openssl-1.1.1t.tar.gz'
 fi
 tar xvf openssl-1.1.1t.tar.gz
 mv openssl-1.1.1t openssl
 cd openssl
 ./Configure linux-mips32 no-async --prefix="$TOP/3rdparty/install"
 make clean
 make -j$(nproc) CC="${RTSP_CROSS}gcc"
 make -j$(nproc) install
 cd ../../

 echo "Build freetype2"
 cd 3rdparty
 rm -rf freetype
 if [[ ! -f freetype-2.13.0.tar.xz ]]; then
     wget 'https://download-mirror.savannah.gnu.org/releases/freetype/freetype-2.13.0.tar.xz'
 fi
 tar xvf freetype-2.13.0.tar.xz
 mv freetype-2.13.0 freetype
 cd freetype
 CC="${RTSP_CROSS}gcc" ./configure --host mipsel-linux-gnu --prefix="$TOP/3rdparty/install/" --with-png=no --with-brotli=no --with-harfbuzz=no --with-zlib=no
 make -j$(nproc)
 make install
 cd ../../

echo "Build ffmpeg"
cd 3rdparty
rm -rf ffmpeg
if [[ ! -f ffmpeg-3.4.10.tar.xz ]]; then
    wget 'https://ffmpeg.org/releases/ffmpeg-3.4.10.tar.xz'
fi
tar xvf ffmpeg-3.4.10.tar.xz
mv ffmpeg-3.4.10 ffmpeg
cd ffmpeg
./configure --disable-zlib --target-os=linux --arch=mipsel --cpu=mips32r2 --disable-msa --ranlib="${RTSP_CROSS}ranlib" --nm="${RTSP_CROSS}nm" --ar="${RTSP_CROSS}ar" --cc="${RTSP_CROSS}gcc" --cxx="${RTSP_CROSS}g++" --strip="${RTSP_CROSS}strip" --prefix="$TOP/3rdparty/install" --enable-gpl  --cross-prefix=mips-linux-gnu --enable-cross-compile  --enable-version3
make -j$(nproc)
make install
cd ../../

echo "Build libconfig"
cd 3rdparty
rm -rf libconfig
if [[ ! -f libconfig-1.7.3.tar.gz ]]; then
    wget 'https://hyperrealm.github.io/libconfig/dist/libconfig-1.7.3.tar.gz';
fi
tar xvf libconfig-1.7.3.tar.gz
mv libconfig-1.7.3 libconfig
cd libconfig
CC="${RTSP_CROSS}gcc" CXX="${RTSP_CROSS}g++" ./configure --host mipsel-linux-gnu --prefix="$TOP/3rdparty/install"
make -j$(nproc)
make install
cd ../../

echo "Build live555"
cd 3rdparty/live
if [[ -f Makefile ]]; then
    make distclean
fi
./genMakefiles rtsp
RTSP_ROOT="${TOP}" RTSP_CROSS="${RTSP_CROSS}" make -j$(nproc)
RTSP_ROOT="${TOP}" RTSP_CROSS="${RTSP_CROSS}" make install
cd ../../

echo ${RTSP_CROSS}


echo "Build rtspserver"
rm -rf build
mkdir build
cd build
cmake -DRTSP_CROSS="${RTSP_CROSS}" ..
make
cd ..
