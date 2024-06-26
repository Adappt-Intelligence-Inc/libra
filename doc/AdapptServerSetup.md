# Steps to setup Adappt Server. 
[Diagram](serversetup.jpeg)

## Steps for setting up HTTPS, Websocet/Signalling and Rest API servers are as follows  

1. Get one lab machine with 4 Cores, 8GB Ram. For 1024 Camera streaming we need atlease 2 Cores machine with 8GB RAM, 20 mbps broadband connection

2. Install Ubuntu 18.04 LTS serve version 

3. apt-get install libssl-dev -y

4. apt-get install gcc-9

5. apt-get install g++-9

6. cd /usr/bin

7. ln -s gcc-9 gcc

8. ln -s g++-9 g++

9. sudo apt update

10. sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates

11. curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

12. apt-get install nodejs


## Network configuration

Static ip, domain name and ssl certificates are required.  But for internal testing we do not need public ips, natted ips will work.

make sure you have  ssl certificate at 

sslCrt: '/var/tmp/key/certificate.crt',

sslKey: '/var/tmp/key/private_key.pem'


## To compile

sudo bash

mkdir /workspace/

cd /workspace/

git clone https://github.com/Adappt-Intelligence-Inc/libra.git 

git checkout EC2-WEBRTC

git branch 

cd /workspace/libra/src/broadcast/main

make clean

make 

change static_ip to your ip 

cat config.js

{
    "dtlsCertificateFile": "/var/tmp/key/cert.pem",
    
    "dtlsPrivateKeyFile": "/var/tmp/key/key.pem",
    
    "storage": "/media/pvi-storage/",
    
    "static_ip": "ipcamera.adapptonline.com",
    
}


cp  webrtc.service  signalling.service /etc/systemd/system

cd /workspace/libra/src/signaller

npm install 

systemctl start webrtc

systemctl start signalling

systemctl status  webrtc

systemctl status  signalling


https://192.168.0.19:8080/ or  https://ipcamera.adapptonline.com:8080/  your ip or domain name.  If successfull you will see Webrtc server 0.1 at browser


https://192.168.0.19   you see login page


https://192.168.0.19/test.html you will see video, join the room and open one more instance to see the webrtc sreaming 




## Lucid Diagram
https://lucid.app/lucidchart/6b9e1f87-4e3c-4c09-8605-7ff75d68e62e/edit?beaconFlowId=21DD5CC3762CD8A4&invitationId=inv_2d4ea627-3448-4ecf-8a34-e8c90cd32b6d&page=0_0#
