# Steps to comile Ingenic Samples for video Streaming

## git clone sample to stream from camera sensor

git clone https://github.com/Adappt-Intelligence-Inc/libra.git

mkdir /workspace/adappt/

cd  /workspace/adappt/


cd libra/src/ingenic/3rdparty/T31/samples/libimp-samples/


vi Makefile and set your correct Ingenic Sdk/Kent SDK path



## In your ubuntu or linux machine where you have Ingenic Sdk/ Kent SDK/Cross Compilation Tool Chain, create symbolic links to mips crosscompiler binaries or Export path 

cd  /usr/bin

use ln -s command to create symbolic links for gcc compilers

mips-linux-gnu-gcc -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-gcc
mips-linux-gnu-ld -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-ld
mips-linux-gnu-ar -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-ar
mips-linux-gnu-strip -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-strip
mips-linux-gnu-nm -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-nm
mips-linux-gnu-g++ -> /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/mips-linux-gnu-g++


## Otherwise set PATH to   


export PATH=/workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/bin/:$PATH


make 


copy sample-Change-Resolution  to Kent camera  /tmp folder with uart serial communication serio.py/ nc command


## run 

./sample-Change-Resolution  you will  see video ouput message




# Example to copy files to camera

1.  ./serio.py -s README.md  -d /tmp/readme.txt -p /dev/ttyUSB0

	To get serio.py git@github.com:devttys0/serio.git  and then install missing python module. It will copy the files over serial port or telnet


2. On destination machine run the following command: nc -l -p 1234 > out.file

   On source machine run the following command: nc -w 3 192.168.0.35 1234 < out.file
