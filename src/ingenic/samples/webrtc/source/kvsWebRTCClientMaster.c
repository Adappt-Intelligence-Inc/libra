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

#include "Samples.h"
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "com/amazonaws/kinesis/video/capturer/AudioCapturer.h"
#include "com/amazonaws/kinesis/video/capturer/VideoCapturer.h"
#include "com/amazonaws/kinesis/video/player/AudioPlayer.h"

#define VIDEO_FRAME_BUFFER_SIZE_BYTES      (256 * 1024UL)
#define AUDIO_FRAME_BUFFER_SIZE_BYTES      (1024UL)
#define HUNDREDS_OF_NANOS_IN_A_MICROSECOND 10LL

#define SAMPLE_VIDEO_FRAME_DURATION (HUNDREDS_OF_NANOS_IN_A_SECOND / DEFAULT_FPS_VALUE)
#define DEFAULT_FPS_VALUE                        25

extern PSampleConfiguration gSampleConfiguration;
static AudioCapturerHandle audioCapturerHandle = NULL;
static AudioPlayerHandle audioPlayerHandle = NULL;
static VideoCapturerHandle videoCapturerHandle = NULL;



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
            return 1;
            printf("pps\n");
            break;
        case 5:
             printf("idr\n");
           break;
           
         case 1:
           //  printf("nonidr\n");
           break;
           
        default:

            break;
        };

    }
    
    return 0;          
}

static void sessionOnShutdown(UINT64 customData, PSampleStreamingSession pSampleStreamingSession)
{
    DLOGD("Shut down session %s\n", pSampleStreamingSession->peerId);
    audioPlayerReleaseStream(audioPlayerHandle);
}

static void remoteAudioFrameHandler(UINT64 customData, PFrame pFrame)
{
    PSampleStreamingSession pSampleStreamingSession = (PSampleStreamingSession) customData;

    DLOGV("Frame received. TrackId: %" PRIu64 ", Size: %u, Flags %u", pFrame->trackId, pFrame->size, pFrame->flags);

    if (pSampleStreamingSession->firstFrame) {
        pSampleStreamingSession->firstFrame = FALSE;
        pSampleStreamingSession->startUpLatency = (GETTIME() - pSampleStreamingSession->offerReceiveTime) / HUNDREDS_OF_NANOS_IN_A_MILLISECOND;
        DLOGI("Start up latency from offer to first frame: %" PRIu64 "ms\n", pSampleStreamingSession->startUpLatency);

        streamingSessionOnShutdown(pSampleStreamingSession, NULL, sessionOnShutdown);

        if (audioPlayerAcquireStream(audioPlayerHandle)) {
            DLOGE("audioPlayerAcquireStream failed");
        }
    }

    audioPlayerWriteFrame(audioPlayerHandle, pFrame->frameData, pFrame->size);
}

static void writeFrameToAllSessions(const UINT64 timestamp, PVOID pData, const SIZE_T size, const PCHAR const trackId)
{
    STATUS status = STATUS_SUCCESS;
    BOOL isVideo = TRUE;
    Frame frame = {
        .presentationTs = timestamp,
        .frameData = pData,
        .size = size,
    };

    if (!STRNCMP(trackId, SAMPLE_VIDEO_TRACK_ID, STRLEN(SAMPLE_VIDEO_TRACK_ID))) {
        isVideo = TRUE;
    } else if (!STRNCMP(trackId, SAMPLE_AUDIO_TRACK_ID, STRLEN(SAMPLE_AUDIO_TRACK_ID))) {
        isVideo = FALSE;
    } else {
        DLOGE("unknown trackId: %s", trackId);
        return;
    }

    MUTEX_LOCK(gSampleConfiguration->streamingSessionListReadLock);
    for (int i = 0; i < gSampleConfiguration->streamingSessionCount; ++i) {
        
        if(!gSampleConfiguration->sampleStreamingSessionList[i]->recordedStream)
        {
            if (isVideo) {
                status = writeFrame(gSampleConfiguration->sampleStreamingSessionList[i]->pVideoRtcRtpTransceiver, &frame);
            } else {
                status = writeFrame(gSampleConfiguration->sampleStreamingSessionList[i]->pAudioRtcRtpTransceiver, &frame);
            }
            if (status != STATUS_SRTP_NOT_READY_YET) {
                if (status != STATUS_SUCCESS) {
                    DLOGV("writeFrame() failed with 0x%08x", status);
                } else if (gSampleConfiguration->sampleStreamingSessionList[i]->firstFrame && status == STATUS_SUCCESS) {
                    PROFILE_WITH_START_TIME(gSampleConfiguration->sampleStreamingSessionList[i]->offerReceiveTime, "Time to first frame");
                    gSampleConfiguration->sampleStreamingSessionList[i]->firstFrame = FALSE;
                }
            }
        }
    }
    MUTEX_UNLOCK(gSampleConfiguration->streamingSessionListReadLock);
}


STATUS readFrameFromDisk(PBYTE pFrame, PUINT32 pSize, PCHAR frameFilePath)
{
    STATUS retStatus = STATUS_SUCCESS;
    UINT64 size = 0;
    CHK_ERR(pSize != NULL, STATUS_NULL_ARG, "[KVS Master] Invalid file size");
    size = *pSize;
    // Get the size and read into frame
    CHK_STATUS(readFile(frameFilePath, TRUE, pFrame, &size));
CleanUp:

    if (pSize != NULL) {
        *pSize = (UINT32) size;
    }

    return retStatus;
}

INT32 main(INT32 argc, CHAR* argv[])
{
    STATUS retStatus = STATUS_SUCCESS;
    UINT32 frameSize;
    PSampleConfiguration pSampleConfiguration = NULL;
    PCHAR pChannelName;
    SignalingClientMetrics signalingClientMetrics;
    signalingClientMetrics.version = SIGNALING_CLIENT_METRICS_CURRENT_VERSION;

    SET_INSTRUMENTED_ALLOCATORS();
    UINT32 logLevel = setLogLevel();

#ifndef _WIN32
    signal(SIGINT, sigintHandler);
#endif

    /* Media Interface Construct */
    AudioCapability audioCapability = {0};
    audioCapturerHandle = audioCapturerCreate();
    if (!audioCapturerHandle) {
    } else {
        audioCapturerGetCapability(audioCapturerHandle, &audioCapability);
        DLOGD("AudioCapturer Capability: formats[%x], channels[%x], sampleRates[%x], bitDepths[%x]", audioCapability.formats,
              audioCapability.channels, audioCapability.sampleRates, audioCapability.bitDepths);
        if (audioCapturerSetFormat(audioCapturerHandle, AUD_FMT_G711A, AUD_CHN_MONO, AUD_SAM_8K, AUD_BIT_16)) {
            DLOGE("Unable to set AudioCapturer format");
            audioCapturerDestroy(audioCapturerHandle);
            audioCapturerHandle = NULL;
        }
        else
        {
             DLOGI("Board AudioCapturer initialized");
        }
    }

    audioPlayerHandle = audioPlayerCreate();
    if (!audioPlayerHandle) {
        DLOGE("AudioPlayer init failed");
    } else {
        audioPlayerGetCapability(audioPlayerHandle, &audioCapability);
        DLOGD("AudioPlayer Capability: formats[%x], channels[%x], sampleRates[%x], bitDepths[%x]", audioCapability.formats, audioCapability.channels,
              audioCapability.sampleRates, audioCapability.bitDepths);

        if (audioPlayerSetFormat(audioPlayerHandle, AUD_FMT_G711A, AUD_CHN_MONO, AUD_SAM_8K, AUD_BIT_16)) {
            DLOGE("Unable to set AudioPlayer format");
            audioPlayerDestroy(audioPlayerHandle);
            audioPlayerHandle = NULL;
        }
    }
    DLOGI("Board AudioPlayer initialized\n");

    videoCapturerHandle = videoCapturerCreate();
    CHK_ERR(videoCapturerHandle, STATUS_INVALID_OPERATION, "VideoCapturer init failed");

    VideoCapability videoCapability = {0};
    videoCapturerGetCapability(videoCapturerHandle, &videoCapability);
    DLOGD("VudioCapturerCapability: formats[%x], resolutions[%x]", videoCapability.formats, videoCapability.resolutions);

    CHK_STATUS_ERR(videoCapturerSetFormat(videoCapturerHandle, VID_FMT_H264, VID_RES_1080P), STATUS_INVALID_OPERATION, "Unable to set video format");
    DLOGI("Board VideoCapturer initialized");
    /* Media Interface Construct */

    // do trickleIce by default
    printf("[KVS Master] Using trickleICE by default\n");

#ifdef IOT_CORE_ENABLE_CREDENTIALS
    CHK_ERR((pChannelName = getenv(IOT_CORE_THING_NAME)) != NULL, STATUS_INVALID_OPERATION, "AWS_IOT_CORE_THING_NAME must be set");
#else
    pChannelName = argc > 1 ? argv[1] : SAMPLE_CHANNEL_NAME;
#endif

    CHK_STATUS(createSampleConfiguration(pChannelName, SIGNALING_CHANNEL_ROLE_TYPE_MASTER, FALSE, FALSE, logLevel, &pSampleConfiguration));

    // Set the audio and video handlers
    if (videoCapturerHandle) {
        pSampleConfiguration->videoSource = sendVideoPackets;
	pSampleConfiguration->recordvideoSource = recordsendVideoPackets;
    }
    if (audioCapturerHandle) {
        pSampleConfiguration->audioSource = sendAudioPackets;
        pSampleConfiguration->mediaType = SAMPLE_STREAMING_AUDIO_VIDEO;
    } else {
        pSampleConfiguration->mediaType = SAMPLE_STREAMING_VIDEO_ONLY;
    }
    if (audioPlayerHandle) {
        pSampleConfiguration->receiveAudioVideoSource = sampleReceiveAudioVideoFrame;
    }
    pSampleConfiguration->onDataChannel = onDataChannel;
    DLOGI("[KVS Master] Finished setting handlers");

    listDir("/mnt/record");

    // Initialize KVS WebRTC. This must be done before anything else, and must only be done once.
    CHK_STATUS(initKvsWebRtc());
    DLOGI("[KVS Master] KVS WebRTC initialization completed successfully");

    CHK_STATUS(initSignaling(pSampleConfiguration, SAMPLE_MASTER_CLIENT_ID));
    DLOGI("[KVS Master] Channel %s set up done ", pChannelName);

    // Checking for termination
    CHK_STATUS(sessionCleanupWait(pSampleConfiguration));
    DLOGI("[KVS Master] Streaming session terminated");

CleanUp:

    if (retStatus != STATUS_SUCCESS) {
        DLOGE("[KVS Master] Terminated with status code 0x%08x", retStatus);
    }

    DLOGI("[KVS Master] Cleaning up....");
    if (pSampleConfiguration != NULL) {
        // Kick of the termination sequence
        ATOMIC_STORE_BOOL(&pSampleConfiguration->appTerminateFlag, TRUE);

        if (pSampleConfiguration->mediaSenderTid != INVALID_TID_VALUE) {
            THREAD_JOIN(pSampleConfiguration->mediaSenderTid, NULL);
        }

        retStatus = signalingClientGetMetrics(pSampleConfiguration->signalingClientHandle, &signalingClientMetrics);
        if (retStatus == STATUS_SUCCESS) {
            logSignalingClientStats(&signalingClientMetrics);
        } else {
            DLOGE("[KVS Master] signalingClientGetMetrics() operation returned status code: 0x%08x", retStatus);
        }
        retStatus = freeSignalingClient(&pSampleConfiguration->signalingClientHandle);
        if (retStatus != STATUS_SUCCESS) {
            DLOGE("[KVS Master] freeSignalingClient(): operation returned status code: 0x%08x", retStatus);
        }

        retStatus = freeSampleConfiguration(&pSampleConfiguration);
        if (retStatus != STATUS_SUCCESS) {
            DLOGE("[KVS Master] freeSampleConfiguration(): operation returned status code: 0x%08x", retStatus);
        }
    }
    DLOGI("[KVS Master] Cleanup done");
    CHK_LOG_ERR(retStatus);

    /* Media Interface Destruct */
    if (audioCapturerHandle) {
        audioCapturerDestroy(audioCapturerHandle);
        audioCapturerHandle = NULL;
    }

    if (audioPlayerHandle) {
        audioPlayerDestroy(audioPlayerHandle);
        audioPlayerHandle = NULL;
    }

    if (videoCapturerHandle) {
        videoCapturerDestroy(videoCapturerHandle);
        videoCapturerHandle = NULL;
    }

    printf("Board SDK exited\n");
    /* Media Interface Destruct */

    RESET_INSTRUMENTED_ALLOCATORS();

    // https://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
    // We can only return with 0 - 127. Some platforms treat exit code >= 128
    // to be a success code, which might give an unintended behaviour.
    // Some platforms also treat 1 or 0 differently, so it's better to use
    // EXIT_FAILURE and EXIT_SUCCESS macros for portability.
    return STATUS_FAILED(retStatus) ? EXIT_FAILURE : EXIT_SUCCESS;
}
PVOID recordsendVideoPackets(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleConfiguration pSampleConfiguration = (PSampleConfiguration) args;
    RtcEncoderStats encoderStats;
    Frame frame;
    UINT32 fileIndex = 0, frameSize;
    CHAR filePath[MAX_PATH_LEN + 1];
    STATUS status;
    UINT32 i;
    UINT64 startTime, lastFrameTime, elapsed;
    MEMSET(&encoderStats, 0x00, SIZEOF(RtcEncoderStats));
    CHK_ERR(pSampleConfiguration != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");

    frame.presentationTs = 0;
    startTime = GETTIME();
    lastFrameTime = startTime;
    
    
    int fd = -1;
    char outPutNameBuffer[128];
    int ncount = 0;
   // pSampleConfiguration->startrec = 0;
    

    int countFailed = 0;
    int countNoSession = 0;
    
    while (!ATOMIC_LOAD_BOOL(&pSampleConfiguration->appTerminateFlag)) {
        
        if( ATOMIC_LOAD_BOOL(&pSampleConfiguration->newRecording))
        {
            fileIndex = 0;
            ATOMIC_STORE_BOOL(&pSampleConfiguration->newRecording, FALSE);
        }
        
        
        fileIndex = fileIndex  + 1;
        SNPRINTF(filePath, MAX_PATH_LEN, "/mnt/record/%s/frame-%04d.h264",  pSampleConfiguration->timeStamp, fileIndex);
        STATUS st = readFrameFromDisk(NULL, &frameSize, filePath);
        if(st != STATUS_SUCCESS)
        {
            retStatus = STATUS_SUCCESS;
            fileIndex = 0;
            if( ++countFailed > 3)
            {
                goto CleanUp;  ;    
            }
             
            continue;
        }
        
        
        // Re-alloc if needed
        if (frameSize > pSampleConfiguration->recordBufferSize) {
            pSampleConfiguration->pRecordFrameBuffer = (PBYTE) MEMREALLOC(pSampleConfiguration->pRecordFrameBuffer, frameSize);
            CHK_ERR(pSampleConfiguration->pRecordFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] Failed to allocate video frame buffer");
            pSampleConfiguration->recordBufferSize = frameSize;
        }

        frame.frameData = pSampleConfiguration->pRecordFrameBuffer;
        frame.size = frameSize;

        //CHK_STATUS(readFrameFromDisk(frame.frameData, &frameSize, filePath));
        st = readFrameFromDisk(frame.frameData, &frameSize, filePath);
        if(st != STATUS_SUCCESS)
        {
            retStatus = STATUS_SUCCESS;
            fileIndex = 0;
            if( ++countFailed > 3)
            {
               goto CleanUp;  ;    
            }
            continue;
        }
             
        countFailed = 0;
        if(!pSampleConfiguration->streamingSessionCount && ++countNoSession > 4000 )
        {
             goto CleanUp;
        }
    
        // based on bitrate of samples/h264SampleFrames/frame-*
        encoderStats.width = 640;
        encoderStats.height = 480;
        encoderStats.targetBitrate = 262000;
        frame.presentationTs += SAMPLE_VIDEO_FRAME_DURATION;
        MUTEX_LOCK(pSampleConfiguration->streamingSessionListReadLock);
        for (i = 0; i < pSampleConfiguration->streamingSessionCount; ++i) {
            countNoSession = 0;
            if( pSampleConfiguration->sampleStreamingSessionList[i]->recordedStream)
            {
                status = writeFrame(pSampleConfiguration->sampleStreamingSessionList[i]->pVideoRtcRtpTransceiver, &frame);
                if (pSampleConfiguration->sampleStreamingSessionList[i]->firstFrame && status == STATUS_SUCCESS) {
                    PROFILE_WITH_START_TIME(pSampleConfiguration->sampleStreamingSessionList[i]->offerReceiveTime, "Time to first frame");
                    pSampleConfiguration->sampleStreamingSessionList[i]->firstFrame = FALSE;
                }
                encoderStats.encodeTimeMsec = 4; // update encode time to an arbitrary number to demonstrate stats update
                updateEncoderStats(pSampleConfiguration->sampleStreamingSessionList[i]->pVideoRtcRtpTransceiver, &encoderStats);
                if (status != STATUS_SRTP_NOT_READY_YET) {
                    if (status != STATUS_SUCCESS) {
                        DLOGV("writeFrame() failed with 0x%08x", status);
                    }
                }
            }
            
            
        }
        MUTEX_UNLOCK(pSampleConfiguration->streamingSessionListReadLock);

        // Adjust sleep in the case the sleep itself and writeFrame take longer than expected. Since sleep makes sure that the thread
        // will be paused at least until the given amount, we can assume that there's no too early frame scenario.
        // Also, it's very unlikely to have a delay greater than SAMPLE_VIDEO_FRAME_DURATION, so the logic assumes that this is always
        // true for simplicity.
        elapsed = lastFrameTime - startTime;
        THREAD_SLEEP(SAMPLE_VIDEO_FRAME_DURATION - elapsed % SAMPLE_VIDEO_FRAME_DURATION);
        lastFrameTime = GETTIME();
    }

CleanUp:
    /* for (i = 0; i < pSampleConfiguration->streamingSessionCount; ++i) {
        if( pSampleConfiguration->sampleStreamingSessionList[i]->recordedStream)
            ATOMIC_STORE_BOOL(&pSampleConfiguration->sampleStreamingSessionList[i]->terminateFlag, TRUE);
     }
    CVAR_BROADCAST(pSampleConfiguration->cvar);
            
//    ATOMIC_STORE_BOOL(&pSampleConfiguration->interrupted, FALSE);
//    ATOMIC_STORE_BOOL(&pSampleConfiguration->mediaThreadStarted, FALSE);
//    ATOMIC_STORE_BOOL(&pSampleConfiguration->appTerminateFlag, FALSE);
//    ATOMIC_STORE_BOOL(&pSampleConfiguration->recreateSignalingClient, FALSE);
//    ATOMIC_STORE_BOOL(&pSampleConfiguration->connected, FALSE);
    
   // retStatus = STATUS_SUCCESS;
   */
   // printf("Error in Recording thread, filepath=%s\n", filePath);
    DLOGI("[KVS Master] Closing recording thread %s", filePath);
    CHK_LOG_ERR(retStatus);

    return (PVOID) (ULONG_PTR) retStatus;
}



PVOID sendVideoPackets(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleConfiguration pSampleConfiguration = (PSampleConfiguration) args;
    void* pFrameBuffer = NULL;
    UINT64 timestamp = 0;
    UINT64 lastFrameTime = 0;
    SIZE_T frameSize = 0;
    int fd = -1;
    char outPutNameBuffer[128];

    BOOL firstFrame = TRUE;
    
    int ncount = 0;
    

    CHK_ERR(pSampleConfiguration != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");

    pFrameBuffer = MEMALLOC(VIDEO_FRAME_BUFFER_SIZE_BYTES);

    CHK_ERR(pFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] OOM when allocating buffer");
    CHK_ERR(videoCapturerHandle != NULL, STATUS_NULL_ARG, "[KVS Master] VideoCapturerHandle is NULL");
    CHK_ERR(videoCapturerAcquireStream(videoCapturerHandle) == 0, STATUS_INVALID_OPERATION, "[KVS Master] Acquire video stream failed");

    int getFrameStatus = 0;
    while (!ATOMIC_LOAD_BOOL(&pSampleConfiguration->appTerminateFlag)) {
        getFrameStatus = videoCapturerGetFrame(videoCapturerHandle, pFrameBuffer, VIDEO_FRAME_BUFFER_SIZE_BYTES, &timestamp, &frameSize);
        switch (getFrameStatus) {
            case 0:
                
               
        if( ATOMIC_LOAD_BOOL(&pSampleConfiguration->startrec)  )
        {
           
              // Get the current time in seconds since the Unix epoch.
            //time_t now = time(NULL);

            // Convert the time_t to a uint64_t.
            //timestamp = (uint64_t)now;
  
           // This buffer is large enough to hold the timestamp string, including the null terminator.
           // Use sprintf to format the timestamp into the buffer.
           if(pSampleConfiguration->dirName[0] == 0 )
           {    
               firstFrame = TRUE;
               lastFrameTime=  GETTIME();
               sprintf(pSampleConfiguration->dirName, "/mnt/record/%"PRIu64, lastFrameTime/10000);
               sprintf(pSampleConfiguration->filename, "%"PRIu64, lastFrameTime/10000);
               
               mkdir(pSampleConfiguration->dirName,  0700);
           }

            if( firstFrame && parse_nal( pFrameBuffer, frameSize) || !firstFrame )
            {

                firstFrame = FALSE;

                sprintf(outPutNameBuffer, "%s/frame-%.4d.h264",    pSampleConfiguration->dirName, ++ncount);
                fd = open(outPutNameBuffer, O_RDWR | O_CREAT, 0x644);

                if (fd < 0) {
                    printf("Failed to open file %s\n", outPutNameBuffer);
                } 

                if (write(fd, pFrameBuffer, frameSize) != frameSize) {
                     printf("Failed to write frame to file\n");
                } 
                else 
                {
                    //printf("Frame with size %ld capturered at %ld, saved as %s\n", frameSize, timestamp, outPutNameBuffer);
                }

                if (fd >= 0) {
                    close(fd);
                }
                
                if( ncount > 2000)
                {
                   ATOMIC_STORE_BOOL(&pSampleConfiguration->startrec, FALSE); 
                }
            }
            else
            {
               // printf("Error Frame is not IDR frame, it does not have PPS and SPS\n");
            }
                

        } else if( !ATOMIC_LOAD_BOOL(&pSampleConfiguration->startrec) && ncount  )
        {
            
           MUTEX_LOCK(pSampleConfiguration->recordReadLock);
           insert_at_tail(pSampleConfiguration->filename);
           MUTEX_UNLOCK(pSampleConfiguration->recordReadLock);
            
            
           
           ATOMIC_STORE_BOOL(&pSampleConfiguration->startrec, FALSE); 
           ncount = 0;
           pSampleConfiguration->dirName[0] = 0; 
            
        }
  
                // successfully get a frame
                writeFrameToAllSessions(timestamp * HUNDREDS_OF_NANOS_IN_A_MICROSECOND, pFrameBuffer, frameSize, SAMPLE_VIDEO_TRACK_ID);
                break;
            case -EAGAIN:
                // frame is not ready yet
                usleep(1000);
                break;
            default:
                DLOGE("videoCapturerGetFrame failed");
        }
    }

CleanUp:
    DLOGI("[KVS Master] Closing video thread");

    videoCapturerReleaseStream(videoCapturerHandle);

    CHK_LOG_ERR(retStatus);

    MEMFREE(pFrameBuffer);
    pFrameBuffer = NULL;

    return (PVOID) (ULONG_PTR) retStatus;
}

PVOID sendAudioPackets(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleConfiguration pSampleConfiguration = (PSampleConfiguration) args;
    void* pFrameBuffer = NULL;
    UINT64 timestamp = 0;
    SIZE_T frameSize = 0;

    CHK_ERR(pSampleConfiguration != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");

    pFrameBuffer = MEMALLOC(AUDIO_FRAME_BUFFER_SIZE_BYTES);

    CHK_ERR(pFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] OOM when allocating buffer");
    CHK_ERR(audioCapturerHandle != NULL, STATUS_NULL_ARG, "[KVS Master] AudioCapturerHandle is NULL");
    CHK_ERR(audioCapturerAcquireStream(audioCapturerHandle) == 0, STATUS_INVALID_OPERATION, "[KVS Master] Acquire audio stream failed");

    int getFrameStatus = 0;
    while (!ATOMIC_LOAD_BOOL(&pSampleConfiguration->appTerminateFlag)) {
        getFrameStatus = audioCapturerGetFrame(audioCapturerHandle, pFrameBuffer, AUDIO_FRAME_BUFFER_SIZE_BYTES, &timestamp, &frameSize);
        switch (getFrameStatus) {
            case 0:
                // successfully get a frame
                writeFrameToAllSessions(timestamp * HUNDREDS_OF_NANOS_IN_A_MICROSECOND, pFrameBuffer, frameSize, SAMPLE_AUDIO_TRACK_ID);
                break;
            case -EAGAIN:
                // frame is not ready yet
                usleep(1000);
                break;
            default:
                DLOGE("audioCapturerGetFrame failed");
        }
    }

CleanUp:
    DLOGI("[KVS Master] closing audio thread");

    audioCapturerReleaseStream(audioCapturerHandle);

    CHK_LOG_ERR(retStatus);

    MEMFREE(pFrameBuffer);
    pFrameBuffer = NULL;

    return (PVOID) (ULONG_PTR) retStatus;
}

PVOID sampleReceiveAudioVideoFrame(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleStreamingSession pSampleStreamingSession = (PSampleStreamingSession) args;
    CHK_ERR(pSampleStreamingSession != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");
    CHK_STATUS(transceiverOnFrame(pSampleStreamingSession->pVideoRtcRtpTransceiver, (UINT64) pSampleStreamingSession, sampleVideoFrameHandler));
    CHK_STATUS(transceiverOnFrame(pSampleStreamingSession->pAudioRtcRtpTransceiver, (UINT64) pSampleStreamingSession, remoteAudioFrameHandler));

CleanUp:

    return (PVOID) (ULONG_PTR) retStatus;
}
