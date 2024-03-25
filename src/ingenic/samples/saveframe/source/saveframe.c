/*
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
#include <fcntl.h>
#include <stdio.h>
#include <errno.h>
#include <stdint.h>
#include <unistd.h>
#include <stdlib.h>

#include "com/amazonaws/kinesis/video/capturer/VideoCapturer.h"

#define VIDEO_BUFFER_SIZE               (1 * 1024 * 1024UL)
#define SENSOR_ADAPTION_DELAY_MICRO_SEC (500 * 1000UL)

#define CONVERT_NV12_TO_RGB24

#ifdef CONVERT_NV12_TO_RGB24

#define RGB24_FRAME_WIDTH  (416)
#define RGB24_FRAME_HEIGHT (320)
#define RGB_FRAME_SIZE     (RGB24_FRAME_WIDTH * RGB24_FRAME_HEIGHT * 3UL)

int NV12_TO_RGB24(uint8_t* yuyv, uint8_t* rgbBuffer, size_t width, size_t height)
{
    const int nv_start = width * height;
    uint32_t i, j, index = 0, rgb_index = 0;
    uint8_t y, u, v;
    int r, g, b, nv_index = 0;

    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            nv_index = i / 2 * width + j - j % 2;

            y = yuyv[rgb_index];
            u = yuyv[nv_start + nv_index];
            v = yuyv[nv_start + nv_index + 1];

            r = y + (140 * (v - 128)) / 100;                         // r
            g = y - (34 * (u - 128)) / 100 - (71 * (v - 128)) / 100; // g
            b = y + (177 * (u - 128)) / 100;                         // b

            if (r > 255)
                r = 255;
            if (g > 255)
                g = 255;
            if (b > 255)
                b = 255;
            if (r < 0)
                r = 0;
            if (g < 0)
                g = 0;
            if (b < 0)
                b = 0;

            index = i * width * 3 + 3 * j;

            rgbBuffer[index] = r;
            rgbBuffer[index + 1] = g;
            rgbBuffer[index + 2] = b;

            rgb_index++;
        }
    }
    return 0;
}
#endif


enum H264SliceType {
  none  =0,
  sps   =7,
  pps   =8,
  idr     =5,   // IDR picture. Do not confuse with IDR KEY Frame
  nonidr  =1,
  aud  =9
};

 enum H264SframeType {
  none1  =0,
  i   =3, 
  p   =2,
  b   =1,  
  
};


struct H264Pars { ///< H264 parameters
  short unsigned slice_type;
  short unsigned frameType;
    
};
/**
*   Set pointer just after start code (00 .. 00 01), or to EOF if not found:
*
*   NZ NZ ... NZ 00 00 00 00 01 xx xx ... xx (EOF)
*                               ^            ^
*   non-zero head.............. here ....... or here if no start code found
*
*/
static const uint8_t *find_start_code(const uint8_t *h264_data, int h264_data_bytes, int *zcount)
{
    const uint8_t *eof = h264_data + h264_data_bytes;
    const uint8_t *p = h264_data;
    do
    {
        int zero_cnt = 1;
        const uint8_t* found = (uint8_t*)memchr(p, 0, eof - p);
        p = found ? found : eof;
        while (p + zero_cnt < eof && !p[zero_cnt]) zero_cnt++;
        if (zero_cnt >= 2 && p[zero_cnt] == 1)
        {
            *zcount = zero_cnt + 1;
            return p + zero_cnt + 1;
        }
        p += zero_cnt;
    } while (p < eof);
    *zcount = 0;
    return eof;
}

/**
*   Locate NAL unit in given buffer, and calculate it's length
*/
static const uint8_t *find_nal_unit(const uint8_t *h264_data, int h264_data_bytes, int *pnal_unit_bytes)
{
    const uint8_t *eof = h264_data + h264_data_bytes;
    int zcount;
    const uint8_t *start = find_start_code(h264_data, h264_data_bytes, &zcount);
    const uint8_t *stop = start;
    if (start)
    {
        stop = find_start_code(start, (int)(eof - start), &zcount);
        while (stop > start && !stop[-1])
        {
            stop--;
        }
    }

    *pnal_unit_bytes = (int)(stop - start - zcount);
    return start;
}


    //////////////////////////////////////////////////////////////////////
int parse_nal( const unsigned char *nal, int length)
{

    const unsigned char *eof = nal + length;
    int payload_type, sizeof_nal,frameType;
    for (;;nal++)
    {

        nal = find_nal_unit(nal, (int)(eof - nal), &sizeof_nal);
        if (!sizeof_nal)
            break;
    
        payload_type = nal[0] & 31;
        frameType =  (( nal[0] & 96) >> 5);
         //printf("frameType= %d \n " , frameType);
        if (9 == payload_type)
            continue;  // access unit delimiter, nothing to be done

        switch( payload_type)
        {
        case 7:
             printf("sps\n");
            break;
        case 8:
            printf("pps\n");
            break;
        case 5:
             printf("idr\n");
           break;
           
         case 1:
             printf("nonidr\n");
           break;
           
        default:

            break;
        };

    }
                
}
            
int main(int argc, char** argv)
{
    if (argc != 3) {
        printf("Usage: saveframe-static FILE NUM\n");
        return -EINVAL;
    }

    const char nalstamp[] = {0,0,0,1};
     
    int ret = 0;
    int fd = -1;
    VideoCapturerHandle videoCapturerHandle = NULL;
    uint8_t videoBuffer[VIDEO_BUFFER_SIZE];
    uint64_t timestamp = 0;
    size_t frameSize = 0;
    char outPutNameBuffer[128];

    videoCapturerHandle = videoCapturerCreate();

    if (videoCapturerSetFormat(videoCapturerHandle, VID_FMT_H264, VID_RES_1080P)) {
            printf("Failed to set video capturer format\n");
            return -1;
        }


    for (int i = 0; i < atoi(argv[2]); ++i) {
        sprintf(outPutNameBuffer, "%s-%d", argv[1], i);
        fd = open(outPutNameBuffer, O_RDWR | O_CREAT, 0x644);

         printf("%s %s\n", __func__,  outPutNameBuffer);

        if (fd < 0) {
            printf("Failed to open file %s\n", outPutNameBuffer);
            ret = -EAGAIN;
        } else if (!videoCapturerHandle) {
            printf("Failed to create video capturer\n");
            ret = -EAGAIN;
        // } else if (videoCapturerSetFormat(videoCapturerHandle, VID_FMT_H264, VID_RES_1080P)) {
        //     printf("Failed to set video capturer format\n"); // we can not change resolution onfly. Bug report to ingenic team.
        //     ret = -EAGAIN;
        } else if (videoCapturerAcquireStream(videoCapturerHandle)) {
            printf("Failed to acquire video stream\n");
            ret = -EAGAIN;
        }

        // Now we try to capture a raw frame
        if (!ret) {
            // Camera sensor might need some time to adaptive lights
            usleep(SENSOR_ADAPTION_DELAY_MICRO_SEC);

            if (videoCapturerGetFrame(videoCapturerHandle, videoBuffer, VIDEO_BUFFER_SIZE, &timestamp, &frameSize)) {
                printf("Failed to get frame\n");
                ret = -EAGAIN;
            } else {
                videoCapturerReleaseStream(videoCapturerHandle);
            }
        
            parse_nal( videoBuffer, frameSize);
            
                        
            
            //////////////////////////////////////////////////////////////////////////
            
            
            char p1 = videoBuffer[0];
            char p2 = videoBuffer[1];
            char p3 = videoBuffer[2];
            char p4 = videoBuffer[3];
            char p5 = videoBuffer[4];
            char p6 = videoBuffer[5];
            int nsize= 4;
            uint16_t tmp1 =  *(   (uint16_t*)&videoBuffer[4]);
                  // tmp1 = tmp1   << 8  | videoBuffer[5]  ;
           
             
            struct H264Pars  h264_pars;
            
            if(! strncmp( videoBuffer,  nalstamp, nsize ))
            {
                
                if (frameSize > (nsize +1)) 
                { 
                    h264_pars.slice_type = (   tmp1 & 31 );
                    h264_pars.frameType =  (( tmp1 & 96) >> 5);
                }
                
                
            }

#ifdef CONVERT_NV12_TO_RGB24
            uint8_t rgbBuffer[RGB_FRAME_SIZE] = {0};
            NV12_TO_RGB24(videoBuffer, rgbBuffer, RGB24_FRAME_WIDTH, RGB24_FRAME_HEIGHT);

            if (write(fd, rgbBuffer, RGB_FRAME_SIZE) != RGB_FRAME_SIZE) {
                printf("Failed to write frame to file\n");
                ret = -EAGAIN;
            } else {
                printf("Frame with size %ld capturered at %ld, saved as %s\n", RGB_FRAME_SIZE, timestamp, outPutNameBuffer);
            }
#else
            if (write(fd, videoBuffer, frameSize) != frameSize) {
                printf("Failed to write frame to file\n");
                ret = -EAGAIN;
            } else {
                printf("Frame with size %ld capturered at %ld, saved as %s\n", frameSize, timestamp, outPutNameBuffer);
            }
#endif
        }

        if (fd >= 0) {
            close(fd);
        }
    }

    // Clean up
    if (videoCapturerHandle) {
        videoCapturerDestroy(videoCapturerHandle);
    }

    return ret;
}
