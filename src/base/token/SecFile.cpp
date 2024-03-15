/*
 * Copyright (c) 2011-2013 by Arvind Umrao.
 * 
 */

#include "SecFile.h"
#include "base/filesystem.h"
//#include <sys/file.h>

#include <iostream>
#include <cstdio>

#include "base/logger.h"
using namespace base;







bool SecFile::readFile(std::string &fileName,  std::string &content)
{
   return base::fs::readfile(fileName, content  );
}

bool SecFile::writeFile(std::string &fileName,  std::string &content)
{

    return base::fs::savefile(fileName, content.c_str(), content.size()  );
}