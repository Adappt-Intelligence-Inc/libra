# libra
IP Camera development

## Requirements doc

https://docs.google.com/document/d/13kiTZpJ7LNrM-XOrU2QQ0pY3FyDLHzBLopvKW-pWVsU/edit

## removed gstreamer and added video4linux2 and mp4 recording

check src/streamer/README.md for steps to compile.

check video4linux2 code for more details.




## video statistics.

Bitrate, Fps, Resolution, QP, Encoder Types( H264/h265), Quality( PSNR, SIMM, VMAF)  and Cost

Streaming and Storage Cost are directly proportional to Bitrate.  Cost does not depend on  Resolution, Encoder Types( H264/h265) and Quality.

Quality is directly proportional to  Fps,  Resolution, Encoder Types( H264/h265),  

Quality is inversely proportional to QP.

 
## capturing audio statistics.
Sampling rate, Encoder type( opus, G7XX, AAC) , Cost


I will share the details for  calculation of PSNR, SIMM, VMAF soon.
