CONFIG_UCLIBC_BUILD=y

CROSS_COMPILE ?= mips-linux-gnu-

CC = $(CROSS_COMPILE)gcc
CPLUSPLUS = $(CROSS_COMPILE)g++
LD = $(CROSS_COMPILE)ld
AR = $(CROSS_COMPILE)ar cr
STRIP = $(CROSS_COMPILE)strip

CFLAGS = $(INCLUDES) -O2 -Wall -march=mips32r2

ifeq ($(CONFIG_UCLIBC_BUILD), y)
CFLAGS += -muclibc
LDFLAG += -muclibc
endif

ifeq ($(CONFIG_UCLIBC_BUILD), y)
SDK_LIB_DIR = /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/sdk/4.7.2/lib/uclibc
else
SDK_LIB_DIR = /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/sdk/4.7.2/lib/glibc
endif

SDK_INC_DIR = /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/sdk/4.7.2/include

INCLUDES = -I$(SDK_INC_DIR)

LIBS = $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a

LDFLAG += -Wl,-gc-sections

SAMPLES = sample-Encoder-video \
	sample-OSD \
	sample-Audio \
	sample-Ai \
	sample-Ao \
	sample-Ai-AEC \
	sample-Ai-Ref \
	sample-dmic \
	sample-dmic-aec \
	sample-dmic-ref \
	sample-Setfps \
	sample-ISP-flip \
	sample-Encoder-jpeg \
	sample-Encoder-yuv \
	sample-Encoder-h264-jpeg \
	sample-Encoder-video-IVS-move \
	sample-Encoder-h264-IVS-base-move\
	sample-Change-Resolution \
	sample-Snap-YUV \
	sample-Encoder-video-IVS-exalgo \
	sample-Framesource \
	sample-EXTFS-Encoder-h264 \
	sample-EXTFS-Encoder-h264-rgba \
	sample-Framesource-algo \

all: 	$(SAMPLES)

sample-Ai: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Ai.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-Ao: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Ao.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-Ai-AEC: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Ai-AEC.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-Ai-Ref: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Ai-Ref.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-dmic: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-dmic.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-dmic-aec: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-dmic-aec.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-dmic-ref: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-dmic-ref.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-Encoder-video: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-video.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-jpeg: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-jpeg.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-yuv: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-Encoder-yuv.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-h264-jpeg: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-h264-jpeg.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-OSD: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-OSD.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Audio: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Audio.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt -ldl
	$(STRIP) $@

sample-Setfps: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Setfps.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-ISP-flip: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-ISP-flip.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-video-IVS-move: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-video-IVS-move.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-h264-IVS-base-move: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-h264-IVS-base-move.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Change-Resolution: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Change-Resolution.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Snap-YUV: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Snap-YUV.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Encoder-video-IVS-exalgo: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Encoder-video-IVS-exalgo.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Framesource: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Framesource.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-EXTFS-Encoder-h264: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-EXTFS-Encoder-h264.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-EXTFS-Encoder-h264-rgba: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-EXTFS-Encoder-h264-rgba.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

sample-Framesource-algo: $(SDK_LIB_DIR)/libimp.a $(SDK_LIB_DIR)/libalog.a sample-common.o sample-Framesource-algo.o
	$(CC) $(LDFLAG) -o $@ $^ $(LIBS) -lpthread -lm -lrt
	$(STRIP) $@

%.o:%.c sample-common.h
	$(CC) -c $(CFLAGS) $< -o $@

clean:
	rm -f *.o *~

distclean: clean
	rm -f $(SAMPLES)
