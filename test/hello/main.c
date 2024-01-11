/*

cmake command
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=RELEASE  …



*/





#include <stdio.h>	/* for printf */
#include <stdint.h>	/* for uint64 definition */
#include <stdlib.h>	/* for exit() definition */
#include <time.h>	/* for clock_gettime */
#include <pthread.h>


#define BILLION 1000000000L

int localpid(void) 
{
	static int a[9] = { 0 };
	return a[0];
}



void work()
{

int val =1;

printf("worker tid=%d\n", val);

 val = 100;
}

int main (){

printf("hello\n");

pthread_t handle;
int data = 0;

uint64_t diff;
	struct timespec start, end;
	int i;

	/* measure monotonic time */
	clock_gettime(CLOCK_MONOTONIC, &start);	/* mark start time */
	sleep(1);	/* do stuff */
	clock_gettime(CLOCK_MONOTONIC, &end);	/* mark the end time */

	diff = BILLION * (end.tv_sec - start.tv_sec) + end.tv_nsec - start.tv_nsec;
	printf("elapsed time = %llu nanoseconds\n", (long long unsigned int) diff);


  pthread_create(&handle, NULL, work, NULL);    
  pthread_join(handle, NULL);
  printf("final = %d\n", data);

  return 0;
}
