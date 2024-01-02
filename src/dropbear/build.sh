#!/bin/sh

export ARCH=mips
export HOST="$ARCH-linux"
TARGET=$1


make $TARGET || exit $?


