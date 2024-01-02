#CC      = gcc
#CFLAGS  = -g
RM      = rm -f

default: all

all: hello

hello: hello.c
	$(CC) -O2 -fpic $(CFLAGS) -o hello hello.c

clean veryclean:
	$(RM) hello
