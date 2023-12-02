/*******************************************
Shared include file for the samples
*******************************************/
#ifndef __DEVICE_READ_INCLUDE__
#define __DEVICE_READ_INCLUDE__

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavdevice/avdevice.h>
    
    
int initReaddevice(void);
int read_device( AVPacket *outpkt);
void exitdevice();

#ifdef __cplusplus
}
#endif
#endif /* __DEVICE_READ_INCLUDE__ */
