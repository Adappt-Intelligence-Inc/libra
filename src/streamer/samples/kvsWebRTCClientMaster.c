#include "Samples.h"
#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>

extern PSampleConfiguration gSampleConfiguration;
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

#ifdef IOT_CORE_ENABLE_CREDENTIALS
    CHK_ERR((pChannelName = getenv(IOT_CORE_THING_NAME)) != NULL, STATUS_INVALID_OPERATION, "AWS_IOT_CORE_THING_NAME must be set");
#else
    pChannelName = argc > 1 ? argv[1] : SAMPLE_CHANNEL_NAME;
#endif

    CHK_STATUS(createSampleConfiguration(pChannelName, SIGNALING_CHANNEL_ROLE_TYPE_MASTER, TRUE, TRUE, logLevel, &pSampleConfiguration));

    // Set the audio and video handlers
    pSampleConfiguration->audioSource = sendAudioPackets;
    pSampleConfiguration->videoSource = sendVideoPackets;
    pSampleConfiguration->recordvideoSource = recordsendVideoPackets;
    pSampleConfiguration->receiveAudioVideoSource = sampleReceiveAudioVideoFrame;

    if (argc > 2 && STRNCMP(argv[2], "1", 2) == 0) {
        pSampleConfiguration->channelInfo.useMediaStorage = TRUE;
    }

#ifdef ENABLE_DATA_CHANNEL
    pSampleConfiguration->onDataChannel = onDataChannel;
#endif
    pSampleConfiguration->mediaType = SAMPLE_STREAMING_AUDIO_VIDEO;
    DLOGI("[KVS Master] Finished setting handlers");

    // Check if the samples are present

    CHK_STATUS(readFrameFromDisk(NULL, &frameSize, "./h264SampleFrames/frame-0001.h264"));
    DLOGI("[KVS Master] Checked sample video frame availability....available");

    CHK_STATUS(readFrameFromDisk(NULL, &frameSize, "./opusSampleFrames/sample-001.opus"));
    DLOGI("[KVS Master] Checked sample audio frame availability....available");

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

    RESET_INSTRUMENTED_ALLOCATORS();

    // https://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
    // We can only return with 0 - 127. Some platforms treat exit code >= 128
    // to be a success code, which might give an unintended behaviour.
    // Some platforms also treat 1 or 0 differently, so it's better to use
    // EXIT_FAILURE and EXIT_SUCCESS macros for portability.
    return STATUS_FAILED(retStatus) ? EXIT_FAILURE : EXIT_SUCCESS;
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
             continue; 
        }
        
        
        // Re-alloc if needed
        if (frameSize > pSampleConfiguration->videoBufferSize) {
            pSampleConfiguration->pVideoFrameBuffer = (PBYTE) MEMREALLOC(pSampleConfiguration->pVideoFrameBuffer, frameSize);
            CHK_ERR(pSampleConfiguration->pVideoFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] Failed to allocate video frame buffer");
            pSampleConfiguration->videoBufferSize = frameSize;
        }

        frame.frameData = pSampleConfiguration->pVideoFrameBuffer;
        frame.size = frameSize;

        //CHK_STATUS(readFrameFromDisk(frame.frameData, &frameSize, filePath));
        st = readFrameFromDisk(frame.frameData, &frameSize, filePath);
        if(st != STATUS_SUCCESS)
        {
            retStatus = STATUS_SUCCESS;
            fileIndex = 0;
            continue; 
        }
             

        // based on bitrate of samples/h264SampleFrames/frame-*
        encoderStats.width = 640;
        encoderStats.height = 480;
        encoderStats.targetBitrate = 262000;
        frame.presentationTs += SAMPLE_VIDEO_FRAME_DURATION;
        MUTEX_LOCK(pSampleConfiguration->streamingSessionListReadLock);
        for (i = 0; i < pSampleConfiguration->streamingSessionCount; ++i) {
            
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
    printf("filepath=%s\n", filePath);
    DLOGI("[KVS Master] Closing video thread");
    CHK_LOG_ERR(retStatus);

    return (PVOID) (ULONG_PTR) retStatus;
}



PVOID sendVideoPackets(PVOID args)
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
    
    BOOL firstFrame = TRUE;
    
    int fd = -1;
    char outPutNameBuffer[128];
    int ncount = 0;
    pSampleConfiguration->startrec = 0;
    
    pSampleConfiguration->dirName[0] = 0; 

    while (!ATOMIC_LOAD_BOOL(&pSampleConfiguration->appTerminateFlag)) {
        fileIndex = fileIndex % NUMBER_OF_H264_FRAME_FILES + 1;
        SNPRINTF(filePath, MAX_PATH_LEN, "./h264SampleFrames/frame-%04d.h264", fileIndex);

        CHK_STATUS(readFrameFromDisk(NULL, &frameSize, filePath));

        // Re-alloc if needed
        if (frameSize > pSampleConfiguration->videoBufferSize) {
            pSampleConfiguration->pVideoFrameBuffer = (PBYTE) MEMREALLOC(pSampleConfiguration->pVideoFrameBuffer, frameSize);
            CHK_ERR(pSampleConfiguration->pVideoFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] Failed to allocate video frame buffer");
            pSampleConfiguration->videoBufferSize = frameSize;
        }

        frame.frameData = pSampleConfiguration->pVideoFrameBuffer;
        frame.size = frameSize;

        CHK_STATUS(readFrameFromDisk(frame.frameData, &frameSize, filePath));
        
        
        
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
               mkdir(pSampleConfiguration->dirName,  0700);
           }

            if( firstFrame && parse_nal( frame.frameData, frameSize) || !firstFrame )
            {

                firstFrame = FALSE;

                sprintf(outPutNameBuffer, "%s/frame-%.4d.h264",    pSampleConfiguration->dirName, ++ncount);
                fd = open(outPutNameBuffer, O_RDWR | O_CREAT, 0x644);

                if (fd < 0) {
                    printf("Failed to open file %s\n", outPutNameBuffer);
                } 

                if (write(fd, frame.frameData, frameSize) != frameSize) {
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
            
           ATOMIC_STORE_BOOL(&pSampleConfiguration->startrec, FALSE); 
           ncount = 0;
           pSampleConfiguration->dirName[0] = 0; 
            
        }
  
        

        // based on bitrate of samples/h264SampleFrames/frame-*
        encoderStats.width = 640;
        encoderStats.height = 480;
        encoderStats.targetBitrate = 262000;
        frame.presentationTs += SAMPLE_VIDEO_FRAME_DURATION;
        MUTEX_LOCK(pSampleConfiguration->streamingSessionListReadLock);
        for (i = 0; i < pSampleConfiguration->streamingSessionCount; ++i) {
            
            if( !pSampleConfiguration->sampleStreamingSessionList[i]->recordedStream)
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
    DLOGI("[KVS Master] Closing video thread");
    CHK_LOG_ERR(retStatus);

    return (PVOID) (ULONG_PTR) retStatus;
}

PVOID sendAudioPackets(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleConfiguration pSampleConfiguration = (PSampleConfiguration) args;
    Frame frame;
    UINT32 fileIndex = 0, frameSize;
    CHAR filePath[MAX_PATH_LEN + 1];
    UINT32 i;
    STATUS status;

    CHK_ERR(pSampleConfiguration != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");
    frame.presentationTs = 0;

    while (!ATOMIC_LOAD_BOOL(&pSampleConfiguration->appTerminateFlag)) {
        fileIndex = fileIndex % NUMBER_OF_OPUS_FRAME_FILES + 1;
        SNPRINTF(filePath, MAX_PATH_LEN, "./opusSampleFrames/sample-%03d.opus", fileIndex);

        CHK_STATUS(readFrameFromDisk(NULL, &frameSize, filePath));

        // Re-alloc if needed
        if (frameSize > pSampleConfiguration->audioBufferSize) {
            pSampleConfiguration->pAudioFrameBuffer = (UINT8*) MEMREALLOC(pSampleConfiguration->pAudioFrameBuffer, frameSize);
            CHK_ERR(pSampleConfiguration->pAudioFrameBuffer != NULL, STATUS_NOT_ENOUGH_MEMORY, "[KVS Master] Failed to allocate audio frame buffer");
            pSampleConfiguration->audioBufferSize = frameSize;
        }

        frame.frameData = pSampleConfiguration->pAudioFrameBuffer;
        frame.size = frameSize;

        CHK_STATUS(readFrameFromDisk(frame.frameData, &frameSize, filePath));

        frame.presentationTs += SAMPLE_AUDIO_FRAME_DURATION;

        MUTEX_LOCK(pSampleConfiguration->streamingSessionListReadLock);
        for (i = 0; i < pSampleConfiguration->streamingSessionCount; ++i) {
            status = writeFrame(pSampleConfiguration->sampleStreamingSessionList[i]->pAudioRtcRtpTransceiver, &frame);
            if (status != STATUS_SRTP_NOT_READY_YET) {
                if (status != STATUS_SUCCESS) {
                    DLOGV("writeFrame() failed with 0x%08x", status);
                } else if (pSampleConfiguration->sampleStreamingSessionList[i]->firstFrame && status == STATUS_SUCCESS) {
                    PROFILE_WITH_START_TIME(pSampleConfiguration->sampleStreamingSessionList[i]->offerReceiveTime, "Time to first frame");
                    pSampleConfiguration->sampleStreamingSessionList[i]->firstFrame = FALSE;
                }
            }
        }
        MUTEX_UNLOCK(pSampleConfiguration->streamingSessionListReadLock);
        THREAD_SLEEP(SAMPLE_AUDIO_FRAME_DURATION);
    }

CleanUp:
    DLOGI("[KVS Master] closing audio thread");
    return (PVOID) (ULONG_PTR) retStatus;
}

PVOID sampleReceiveAudioVideoFrame(PVOID args)
{
    STATUS retStatus = STATUS_SUCCESS;
    PSampleStreamingSession pSampleStreamingSession = (PSampleStreamingSession) args;
    CHK_ERR(pSampleStreamingSession != NULL, STATUS_NULL_ARG, "[KVS Master] Streaming session is NULL");
    CHK_STATUS(transceiverOnFrame(pSampleStreamingSession->pVideoRtcRtpTransceiver, (UINT64) pSampleStreamingSession, sampleVideoFrameHandler));
    CHK_STATUS(transceiverOnFrame(pSampleStreamingSession->pAudioRtcRtpTransceiver, (UINT64) pSampleStreamingSession, sampleAudioFrameHandler));

CleanUp:

    return (PVOID) (ULONG_PTR) retStatus;
}
