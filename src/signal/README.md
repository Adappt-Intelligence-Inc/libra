## Steps to Test

#browse

http://ec2-65-2-130-244.ap-south-1.compute.amazonaws.com/
 
http://65.2.130.244/

#load test

http://65.2.130.244/load.html


## To run at serve side 

git clone   https://github.com/Adappt-Intelligence-Inc/libra

cd  /workspace/adappt/libra/src/signal/websocket

npm install  

node index.js & 

nohup  to pidid 

or npm start 


## To Estimate WebsocketCost
Run the load and check the billings 


## To Measure the perfomance and delays

Check the load, latency and delays of http(s) and websocket with any of the free tools available on the net.

Give the proper name to streaming server and arrage the ssl certificates

compare the performance of websocket with socket.io


## For Performance Tunning of websocket

https://www.linkedin.com/pulse/ec2-tuning-1m-tcp-connections-using-linux-stephen-blum

https://serverfault.com/questions/577526/does-aws-ec2-have-limits-on-concurrent-connections#:~:text=By%20default%201024%20connection%20are,increased%20upto%2065535%20connections%20max

https://www.zigpoll.com/blog/max-concurrent-socket-connections-node-express

https://github.com/socketio/socket.io/issues/1732

https://domwatson.codes/2021/06/socketio-load-testing.html

https://socket.io/docs/v4/performance-tuning/#at-the-socketio-level

https://blog.caustik.com/2012/08/19/node-js-w1m-concurrent-connections/

https://github.com/socketio/socket.io/discussions/4475

https://sauravomar01.medium.com/achieve-600k-concurrent-websocket-connections-f8ca3f5beac3

https://stackoverflow.com/questions/15872788/maximum-concurrent-socket-io-connections