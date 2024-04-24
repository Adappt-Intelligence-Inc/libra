# libra
IP Camera development for fixed Fish Eye and rotating camera. 

Yearly streaming cost per year per camera 5 rupees.


## video statistics.

Bitrate, Fps, Resolution, QP, Encoder Types( H264/h265), Quality( PSNR, SIMM, VMAF)  and Cost

Streaming and Storage Cost are directly proportional to Bitrate.  Cost does not depend on  Resolution, Encoder Types( H264/h265) and Quality.

Quality is directly proportional to  Fps,  Resolution, Encoder Types( H264/h265),  

Quality is inversely proportional to QP.

 
## capturing audio statistics.
Sampling rate, Encoder type( opus, G7XX, AAC) , Cost


I will share the details for  calculation of PSNR, SIMM, VMAF soon.



## How we are ahead?

1. We are using chinese T31 ingenic hardware which is very low in cost. On which we are running very stable software.
   
   1. Libwebrtc and aws Kiniesis aws for streaming 

   2. Same software stack and APIs for NVR and aws cloud storage

   3. Streaming protocol: rtsp webrtc, MPegDash and hls 
   
   4. Video format: h264 & h265 

   5. Audio format:  G.711 

   6.Two way audio ,video conference,  SFU with Media
   

# Night detection and night mode settings

    Whether to enable night detection. Disable this if
    you never want your camera to switch to night mode.
    enabled: true;

    Which night detection system to use.
    Currently, the only supported value is "sun_track"
    mode: "sun_track";

    Whether to use IR LEDs when the camera is in night
    mode. If your camera looks out a window, you probably
    want to disable this.
    infrared: true;

   Whether to enable color at night. If false, the
   camera will switch to black and white mode.
   color: false;


   Sunrise/Sunset night detection.
   With this night detection system, the camera switches
   to night mode after sunset, and switches back to day
   mode after sunrise. These settings are only used if
   the night mode is "sun_track".

   Coordinates of the camera. Used to calculate
   the time of sunrise and sunset.
   latitude: 40.03;
   longitude: -76.28;


  # Motion detection settings

    Enable or disable the motion detection subsystem.
    enabled: true;

    Maintain a prerecord buffer of (at least) this
    many seconds. When a motion event occurs, the
    prerecord buffer is written to the clip file to
    provide context for the motion event.
    pre_time: 5;

    When motion has ceased, wait this many seconds
    before we stop recording.
    post_time: 5;

    Motion detection sensitivity. Range 0-4
    sensitivity: 2;
    
    Debounce: How many sequential frames must indicate
    motion before we start recording. Set to one if you
    want to capture single-frame motion events.
    debounce: 3;

    If true, force the encoder to create IDRs every
    second, thus ensuring the prerecord buffer's
    duration is exactly the duration set in pre_time.
    Setting this to true will increase the storage size
    # of recorded content and may degrade stream performance.
    strict_idr: false;


  # Continuous Video Recording

    Enable or disable the CVR subsystem.
    enabled: false;

    How often, in seconds, the CVR subsystem should
     rotate files. The minimum is 60 seconds.
    rotate_time: 3600;

   # VRB,CBR Bit rate control
   Transport-CC rtcp feedback
    


