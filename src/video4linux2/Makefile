#
# http://www.gnu.org/software/make/manual/make.html
#
FFMPEG_ROOT = /workspace/ffmpeg

CC:=gcc
INCLUDES:=$(shell pkg-config --cflags sdl)
# CFLAGS:=-Wall -ggdb
# LDFLAGS:=$(shell pkg-config --libs libavformat libavcodec libswresample libswscale libavutil sdl) -lm
# EXE:=tutorial01.out tutorial02.out tutorial03.out tutorial04.out\
# 	tutorial05.out tutorial06.out tutorial07.out

#
# This is here to prevent Make from deleting secondary files.
#

	

#
# $< is the first dependency in the dependency list
# $@ is the target name
#
all: 
	gcc -g -o  usbCamera devicePlayer.c -lavformat -lavcodec -lswscale -lavutil -lavdevice -lavfilter -lswresample -lz -lm -ldl `sdl2-config --cflags --libs`


#gcc -g -o devicePlayer devicePlayer.c ${FFMPEG_ROOT}/libavformat/libavformat.a ${FFMPEG_ROOT}/libavcodec/libavcodec.a ${FFMPEG_ROOT}/libavutil/libavutil.a  ${FFMPEG_ROOT}/libswscale/libswscale.a ${FFMPEG_ROOT}/libswresample/libswresample.a /usr/local/lib/libx264.a   -I${FFMPEG_ROOT}/ -lpthread -lz -lm -ldl -lfdk-aac `sdl2-config --cflags --libs`


# dirs:
# 	mkdir -p obj
# 	mkdir -p bin

# tags: *.c
# 	ctags *.c

# bin/%.out: obj/%.o
# 	$(CC) $(CFLAGS) $< $(LDFLAGS) -o $@

# obj/%.o : %.c
# 	$(CC) $(CFLAGS) $< $(INCLUDES) -c -o $@

clean:
	rm -f ffmpegPlayer


