
# BUILDING SSH server for Mips Ingenic Cipset 
---------
## Options

telnet ingenic board

cd /lib   check if it has ld.so.1 or  ld-uClibc.so.0 , for  ld-uClibc.so.0 , set env with source buildenvmuclib.sh


For enabling debug add -g in Makefile



## To build for MIPS target architecture

source buildenv.sh or buildenvmuclib.sh if muclib micro controller c libs

And use the buildmips.sh script:

ALT_SHELL=/tmp/bin/sh FAKE_ROOT=1 ./build.sh



## for command line 

mkdir /tmp/dropbear

/mnt/dropbear -F  -p 22 -R -B  -K 3000 -Y herman

add -v for versose mode 


## For service 

cat app_init.sh 

#!/bin/sh

ifconfig eth0 192.168.0.35

route add default gw 192.168.0.1

mount /dev/mmcblk0p1  /mnt/

mkdir -p /tmp/dropbear

/mnt/dropbear  -p 22 -R -B  -K 3000  -Y herman




## For Testing on NOR Flash

cp dbclient dropbear scp   /mnt


## To transfer file with nc command

On destination machine run the following command: nc -l -p 1234 > out.file

On source machine run the following command: nc -w 3 192.168.0.4 1234 < out.file
