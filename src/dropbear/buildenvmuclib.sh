
# #CPU_ARGS="-march=mips32 -msoft-float -Wa,-msoft-float"

# /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/

# export GRPC_CROSS_COMPILE:=true
# CC = mips-linux-gnu-gcc
# CXX = mips-linux-gnu-g++
# LD = mips-linux-gnu-ld
# AR = mips-linux-gnu-ar
# STRIP = mips-linux-gnu-strip
# ./configure --host=mips-linux CC=mips-linux-gnu-gcc CXX=mips-linux-gnu-g++ --with-protoc=protoc


# cmake .. -DBOARD=FILE -DUSE_MUCLIBC=ON -DBOARD_DESTINATION_PLATFORM=arm-unknown-linux-uclibc

# CFLAGS += -muclibc
# LDFLAG += -muclibc


# cd nano-4.3

# ./configure --prefix=${INSTALLPATH} --host=mipsel-linux --enable-utf8 --enable-nls --enable-color --enable-multibuffer --enable-nanorc

# # Last known good configuration:
# #./configure --prefix=/root/Main/_install --host=mipsel-linux --enable-utf8 --disable-nls --enable-color --enable-extra --enable-multibuffer --enable-nanorc

# make -j4
# make install





# export INSTALLPATH="/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit"
# TOOLCHAIN=$INSTALLPATH/bin
# CROSS_COMPILE=$TOOLCHAIN/mips-linux-gnu-
# export CC=${CROSS_COMPILE}gcc
# export CXX=${CROSS_COMPILE}g++
# export LD=${CROSS_COMPILE}ld
# export AR=${CROSS_COMPILE}ar
# export STRIP=${CROSS_COMPILE}strip
# export NM=${CROSS_COMPILE}nm
# export CFLAGS="-static -O2 -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/"
# export CPPFLAGS="-static -O2 -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/ -I${INSTALLPATH}/_install/include/ncursesw/"
# export LDFLAGS="-static  -O2 -L${INSTALLPATH}/lib -L${INSTALLPATH}/_install/lib/"







#./configure --host=mips-linux-gnu --disable-database --disable-db-install --with-fallbacks=vt100,vt102,vt300,screen,xterm,xterm-256color,tmux-256color,screen-256color --without-manpages --without-normal --without-progs --without-debug --without-test --enable-widec --prefix=${INSTALLPATH}/_install


#!/usr/bin/env bash

# export INSTALLPATH="/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit"
# export SDKPATH="/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/sdk/4.7.2/"
# TOOLCHAIN=$INSTALLPATH/bin
# CROSS_COMPILE=$TOOLCHAIN/mips-linux-gnu-
# export CC=${CROSS_COMPILE}gcc
# export CXX=${CROSS_COMPILE}g++
# export LD=${CROSS_COMPILE}ld
# export AR=${CROSS_COMPILE}ar
# export CFLAGS="-O2 -muclibc -march=mips32r2 -fPIC -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/ -I${SDKPATH}/include/"
# export CPPFLAGS="-O2 -muclibc -fPIC  -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/ I${SDKPATH}/include/"
# export LDFLAGS="-O2 -muclibc -L${INSTALLPATH}/lib -L${INSTALLPATH}/_install/lib/ -L${SDKPATH}/lib/uclibc/"





export INSTALLPATH="/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit"
TOOLCHAIN=$INSTALLPATH/bin
CROSS_COMPILE=$TOOLCHAIN/mips-linux-gnu-
export CC=${CROSS_COMPILE}gcc
export CXX=${CROSS_COMPILE}g++
export LD=${CROSS_COMPILE}ld
export AR=${CROSS_COMPILE}ar
export STRIP=${CROSS_COMPILE}strip
export NM=${CROSS_COMPILE}nm
export CFLAGS="-static -O2 -muclibc -march=mips32r2 -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/"
export CPPFLAGS="-static -O2 -muclibc  -I${INSTALLPATH}/include -I${INSTALLPATH}/_install/include/ -I${INSTALLPATH}/_install/include/ncursesw/"
export LDFLAGS="-static  -O2 -muclibc  -L${INSTALLPATH}/lib -L${INSTALLPATH}/_install/lib/"
