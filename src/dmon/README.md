# DMon - Process Monitoring With Style

[![builds.sr.ht status](https://builds.sr.ht/~aperezdc/dmon/commits.svg)](https://builds.sr.ht/~aperezdc/dmon/commits?)

This README contains only some random bits. For more in-depth writing, you
may want to read the articles on DMon:

* 2010/08/27: [DMon: Process monitoring with style](https://perezdecastro.org/2010/dmon-process-monitoring-with-style.html)
* 2010/10/04: [DMon status report: evolution to 0.3.7](https://perezdecastro.org/2010/dmon-status-report-0-3-7.html)
* 2011/07/25: [DMon 0.4: New guts & new features](https://perezdecastro.org/2011/dmon-0-4-new-guts-and-new-features.html)
* 2012/01/07: [DMon 0.4.2 “Three Wise Men” released](https://perezdecastro.org/2012/dmon-0-4-2-released.html)

There are also manual pages, so please take a look at them.


## Bulding standalone binaries

By default all tools are built into a single binary which can be symlinked
with different names to switch between them (àla BusyBox). This is useful
to save space and (to some degree) system memory.

You can build all the DMon tools as separate binaries passing `MULTICALL=0`
when invoking Make:

```sh
make MULTICALL=0
```

Remember to pass the option when doing `make install` as well:

```sh
make MULTICALL=0 install
```


## Building libnofork.so

A tiny `LD_PRELOAD`-able “`libnofork.so`” library can be built by using the
`nofork` Make target. This library overrides the `fork(2)` and `daemon(3)`
functions from the system libraries, in such a way that the process under
effect will not be able of forking. This is interesting for running DMon
with programs that have no option to instruct them not to fork.

## Building libsetunbuf.so


make libsetunbuf.so


A tiny `LD_PRELOAD`-able "`libsetunbuf.so`" library can be built by using the
`setunbuf` Make target. This library uses the `__attribute__((constructor))`
attribute in order to call `setbuf(stdout, NULL);` which turns off the
buffering of stdout on the process running under DMon. This is useful for
viewing the output of your process through DLog in real time.



##To test run test.sh

make sure dmon and dslog are in path

dmon --stderr-redir --max-respawns 20 --environ LD_PRELOAD=libsetunbuf.so ./log.sh -- dslog --priority DEBUG --facility USER log
check /var/tmp/user.log



##To test from command line

dmon -n sh -c 'while echo "Hello World" ; do sleep 1 ; done' -- dslog goal

check /var/tmp/syslog


dslog logs to system sys log
dlog  logs to file


dmon -n sh -c 'while echo "Hello World" ; do sleep 1 ; done' -- dlog log.txt


## Example



#!/bin/sh
mkdaemon() {
    # dmon options
    #   --stderr-redir  Redirects stderr to the log file as well
    #   --max-respawns  Sets the number of times dmon will restart a failed process
    #   --environ       Sets an environment variable. Used to remove buffering on stdout
    #
    # dslog options
    #   --priority      The syslog priority. Set to DEBUG as these are just the stdout of the
    #   --max-files     The number of logs that will exist at once
    #
    max_respawns=$1
    shift
    daemon_name=$1
    shift
    dmon \
      --stderr-redir \
      --max-respawns $max_respawns \
      --environ "LD_PRELOAD=libsetunbuf.so" \
      $@ \
      -- dslog \
        --priority DEBUG \
        --facility USER \
        $daemon_name
}




 mkdaemon 20 iotclient /system/bin/iotclient
 mkdaemon 20 sinker /system/bin/sinker
 mkdaemon 0 iCamera /system/bin/iCamera
 mkdaemon 20 dumpload /system/bin/dumpload
 mkdaemon -1 timesync /system/bin/timesync
 mkdaemon 0 audiocardprocess /system/bin/audiocardprocess
 mkdaemon 20 sinker_checkCloud /system/bin/sinker_checkCloud.sh
