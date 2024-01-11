#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <sys/stat.h>

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <netdb.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>

int lookup_host (const char *host)
{
  struct addrinfo hints, *res, *result;
  int errcode;
  char addrstr[100];
  void *ptr;

  memset (&hints, 0, sizeof (hints));
  hints.ai_family = PF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  hints.ai_flags |= AI_CANONNAME;

  errcode = getaddrinfo (host, NULL, &hints, &result);
  if (errcode != 0)
    {
      perror ("getaddrinfo failed");
      return -1;
    }
  
  res = result;

  printf ("Host: %s\n", host);
  while (res)
    {
      inet_ntop (res->ai_family, res->ai_addr->sa_data, addrstr, 100);

      switch (res->ai_family)
        {
        case AF_INET:
          ptr = &((struct sockaddr_in *) res->ai_addr)->sin_addr;
          break;
        case AF_INET6:
          ptr = &((struct sockaddr_in6 *) res->ai_addr)->sin6_addr;
          break;
        }
      inet_ntop (res->ai_family, ptr, addrstr, 100);
      printf ("IPv%d address: %s (%s)\n", res->ai_family == PF_INET6 ? 6 : 4,
              addrstr, res->ai_canonname);
      res = res->ai_next;
    }
  
  freeaddrinfo(result);

  return 0;
}


int main(int argc, char **argv) 
{


	printf("Hello Arvind\n");

    
    char hostname[] = "www.google.com";

    lookup_host(hostname);


    int data1 = STDIN_FILENO;
    int data2 = STDOUT_FILENO;

    char control[CMSG_SPACE(sizeof(data1)) + CMSG_SPACE(sizeof(data2))];
    struct msghdr mh = {
        .msg_namelen = 0,
        .msg_iovlen = 0,
        .msg_control = control,
        .msg_controllen = sizeof(control),
        .msg_flags = 0
    };

    struct cmsghdr *cmh = CMSG_FIRSTHDR(&mh);
    if (cmh == NULL) {
        puts("Can't get first cmsg");
        return 1;
    }
    cmh->cmsg_len = CMSG_LEN(sizeof(data1));
    cmh->cmsg_level = SOL_SOCKET;
    cmh->cmsg_type = SCM_RIGHTS;
    memcpy(CMSG_DATA(cmh), &data1, sizeof(data1));

    cmh = CMSG_NXTHDR(&mh, cmh);
    if (cmh == NULL) {
        puts("Can't get second cmsg");
        return 1;
    }
    cmh->cmsg_len = CMSG_LEN(sizeof(data2));
    cmh->cmsg_level = SOL_SOCKET;
    cmh->cmsg_type = SCM_RIGHTS;
    memcpy(CMSG_DATA(cmh), &data2, sizeof(data2));


    struct stat fileStat;
    if(stat(argv[1],&fileStat) < 0)    
        return 1;


}