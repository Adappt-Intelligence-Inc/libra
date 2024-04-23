
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