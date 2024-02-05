/*  For testing reset api use Postman
 * https://web.postman.co/workspace/My-Workspace~292b44c7-cae4-44d6-8253-174622f0233e/request/create?requestId=e6995876-3b8c-4b7e-b170-83a733a631db
 */


#include "Settings.h"
#include "base/error.h"
#include "base/logger.h"


#include <cctype>  // isprint()
#include <cerrno>
#include <iterator>  // std::ostream_iterator
#include <sstream>  // std::ostringstream

//#define LOGGING_LOG_TO_FILE 1
/* Class variables. */

struct Settings::Configuration Settings::configuration;
struct Settings::CameraSetting Settings::cameraSetting;
struct Settings::UserSetting Settings::userSetting;

uv_rwlock_t Settings::rwlock_tCam;
uv_rwlock_t Settings::rwlock_tUser;
        
/* Class methods. */

void Settings::init()
{
    uv_rwlock_init(&rwlock_tCam);
    uv_rwlock_init(&rwlock_tUser);
}

void Settings::exit()
{
    uv_rwlock_destroy(&rwlock_tCam);
    uv_rwlock_destroy(&rwlock_tUser);
}

void Settings::SetCameraConf(json &cnfg)
{
    if( cnfg.is_null() )
    {
         Settings::cameraSetting.root["rtsp"] = json::object();
        
    }
    else
     Settings::cameraSetting.root = cnfg; 
   
}

void Settings::SetUserConf(json &cnfg)
{
    if( cnfg.is_null() )
    {
         Settings::userSetting.root["users"] = json::object();
        
    }
    else
     Settings::userSetting.root = cnfg; 
   
}


void Settings::SetConfiguration(json &cnfg)
{
//    std::string stringValue;
//    std::vector<std::string> logTags;
//
//    //  std::cout << cnfg.dump(4) << std::flush;
//
//    if (cnfg.find("logTags") != cnfg.end())
//    {
//        // there is an entry with key "foo"
//        json &j = cnfg["logTags"];
//        if (j.is_array())
//        {
//            for (json::iterator it = j.begin(); it != j.end(); ++it)
//            {
//                logTags.push_back(it->get<std::string>());
//            }
//        }
//    }


    if (cnfg.find("rtcMinPort") != cnfg.end())
    {
        Settings::configuration.rtcMinPort = cnfg["rtcMinPort"].get<uint16_t>();
    }

    if (cnfg.find("rtcMaxPort") != cnfg.end())
    {
        Settings::configuration.rtcMaxPort = cnfg["rtcMaxPort"].get<uint16_t>();
    }


    if (cnfg.find("vp9Enc") != cnfg.end()) { Settings::configuration.vp9Enc = cnfg["vp9Enc"].get<uint16_t>(); }

    if (cnfg.find("nvidiaEnc") != cnfg.end())
    {
        Settings::configuration.nvidiaEnc = cnfg["nvidiaEnc"].get<uint16_t>();
    }

    if (cnfg.find("quicksyncEnc") != cnfg.end())
    {
        Settings::configuration.quicksyncEnc = cnfg["quicksyncEnc"].get<uint16_t>();
    }

    if (cnfg.find("VAAPIEnc") != cnfg.end())
    {
        Settings::configuration.VAAPIEnc = cnfg["VAAPIEnc"].get<uint16_t>();
    }


    if (cnfg.find("haswell") != cnfg.end()) { Settings::configuration.haswell = cnfg["haswell"].get<bool>(); }
    
    if (cnfg.find("tcpRtsp") != cnfg.end()) { Settings::configuration.tcpRtsp = cnfg["tcpRtsp"].get<bool>(); }
    

    if (cnfg.find("NATIVE") != cnfg.end()) { Settings::configuration.native = cnfg["NATIVE"].get<uint16_t>(); }


    if (cnfg.find("x264Enc") != cnfg.end())
    {
        Settings::configuration.x264Enc = cnfg["x264Enc"].get<uint16_t>();
    }

    if (cnfg.find("Mp4Size_Key") != cnfg.end())
    {
        Settings::configuration.Mp4Size_Key = cnfg["Mp4Size_Key"].get<uint16_t>();
    }

    if (cnfg.find("SegSize_key") != cnfg.end())
    {
        Settings::configuration.SegSize_key = cnfg["SegSize_key"].get<uint16_t>();
    }
        
    
    // if (cnfg.find("rtsp") != cnfg.end()) {
    //     Settings::configuration.rtsp = cnfg["rtsp"];
    // }

    if (cnfg.find("cam_reconnect") != cnfg.end()) {
        Settings::configuration.cam_reconnect = cnfg["cam_reconnect"].get<uint16_t>();
    }

    if (cnfg.find("logLevel") != cnfg.end())
    {  // trace, debug, info, warn
        // TBD // Move logger setting from main to here
        //  Initialize the Logger.

        std::string loglevel = cnfg["logLevel"].get<std::string>();

        base::Level ld = base::getLevelFromString(loglevel.c_str());

#if LOGGING_LOG_TO_FILE
        base::Logger::instance().add(
            new base::RotatingFileChannel("webrtcserver", "/var/log/webrtcserver", ld));
        base::Logger::instance().setWriter(new base::AsyncLogWriter);
#else
        base::Logger::instance().add(new base::ConsoleChannel("webrtcserver", ld));
#endif
    }


    if (cnfg.find("dtlsCertificateFile") != cnfg.end())
    {
        Settings::configuration.dtlsCertificateFile = cnfg["dtlsCertificateFile"].get<std::string>();
    }


    if (cnfg.find("dtlsPrivateKeyFile") != cnfg.end())
    {
        Settings::configuration.dtlsPrivateKeyFile = cnfg["dtlsPrivateKeyFile"].get<std::string>();
    }

    if (cnfg.find("listenIps") != cnfg.end()) { Settings::configuration.listenIps = cnfg["listenIps"]; }
    
    
    if (cnfg.find("storage") != cnfg.end())
    {
        Settings::configuration.storage = cnfg["storage"];;
    }
        


    /* Post configuration. */

    // Set logTags.
  //  if (!logTags.empty()) Settings::SetLogTags(logTags);

    // Validate RTC ports.
    if (Settings::configuration.rtcMaxPort < Settings::configuration.rtcMinPort)
        base::uv::throwError("rtcMinPort cannot be less than than rtcMinPort");

    // Set DTLS certificate files (if provided),
    Settings::SetDtlsCertificateAndPrivateKeyFiles();
}

void Settings::PrintConfiguration()
{
    std::vector<std::string> logTags;
    std::ostringstream logTagsStream;

    if (Settings::configuration.logTags.info) logTags.emplace_back("info");


    if (!logTags.empty())
    {
        std::copy(logTags.begin(), logTags.end() - 1, std::ostream_iterator<std::string>(logTagsStream, ","));
        logTagsStream << logTags.back();
    }

    //	MS_DEBUG_TAG(info, "<configuration>");
    //
    //	MS_DEBUG_TAG(info, "  logTags             : ", logTagsStream.str().c_str());
    //	MS_DEBUG_TAG(info, "  rtcMinPort          : ", Settings::configuration.rtcMinPort);
    //	MS_DEBUG_TAG(info, "  rtcMaxPort          : ", Settings::configuration.rtcMaxPort);
    //	if (!Settings::configuration.dtlsCertificateFile.empty())
    //	{
    //		MS_DEBUG_TAG(
    //		  info, "  dtlsCertificateFile : ", Settings::configuration.dtlsCertificateFile.c_str());
    //		MS_DEBUG_TAG(
    //		  info, "  dtlsPrivateKeyFile  : ", Settings::configuration.dtlsPrivateKeyFile.c_str());
    //	}
    //
    //	MS_DEBUG_TAG(info, "</configuration>");
}


// void Settings::SetLogLevel(std::string& level)
// {
//

// 	// Lowcase given level.
// 	Utils::String::ToLowerCase(level);

// 	if (Settings::string2LogLevel.find(level) == Settings::string2LogLevel.end())
// 		base::uv::throwError("invalid value '%s' for logLevel", level.c_str());

// 	Settings::configuration.logLevel = Settings::string2LogLevel[level];
// }

void Settings::SetLogTags(const std::vector<std::string> &tags)
{
    // Reset logTags.
    struct LogTags newLogTags;

    for (auto &tag : tags)
    {
        if (tag == "info") newLogTags.info = true;
    }

    Settings::configuration.logTags = newLogTags;
}

void Settings::SetDtlsCertificateAndPrivateKeyFiles()
{
    if (!Settings::configuration.dtlsCertificateFile.empty()
        && Settings::configuration.dtlsPrivateKeyFile.empty())
    {
        base::uv::throwError("missing dtlsPrivateKeyFile");
    }
    else if (
        Settings::configuration.dtlsCertificateFile.empty()
        && !Settings::configuration.dtlsPrivateKeyFile.empty())
    {
        base::uv::throwError("missing dtlsCertificateFile");
    }
    else if (
        Settings::configuration.dtlsCertificateFile.empty()
        && Settings::configuration.dtlsPrivateKeyFile.empty())
    {
        return;
    }

    // std::string &dtlsCertificateFile = Settings::configuration.dtlsCertificateFile;
    // std::string &dtlsPrivateKeyFile = Settings::configuration.dtlsPrivateKeyFile;

    try
    {
        // Utils::File::CheckFile(dtlsCertificateFile.c_str());
    }
    catch (const std::exception &error)
    {
        base::uv::throwError("dtlsCertificateFile: " + std::string(error.what()));
    }

    try
    {
        // Utils::File::CheckFile(dtlsPrivateKeyFile.c_str());
    }
    catch (const std::exception &error)
    {
        base::uv::throwError("dtlsPrivateKeyFile: " + std::string(error.what()));
    }

    // Settings::configuration.dtlsCertificateFile = dtlsCertificateFile;
    // Settings::configuration.dtlsPrivateKeyFile = dtlsPrivateKeyFile;
}


void Settings::saveFile(const std::string &path, const std::string &dump)
{
    std::ofstream ofs(path, std::ios::binary | std::ios::out);
    if (!ofs.is_open()) throw std::runtime_error("Cannot open output file: " + path);


    ofs << dump;

    ofs.close();
}


void Settings::postNode(json &node ) // complete json
{
    std::string dump;
    uv_rwlock_wrlock(&rwlock_tCam);

    Settings::cameraSetting.root["rtsp"] = node ;

    dump =  Settings::cameraSetting.root.dump(4) ;

    uv_rwlock_wrunlock(&rwlock_tCam);

    saveFile( "./webrtcStats.js", dump   ); 

}

bool Settings::putNode(json &node , std::vector<std::string> & vec )  // only one node
{
    bool ret = false;
    std::string dump;
    uv_rwlock_wrlock(&rwlock_tCam);
      
    json &rtsp =   Settings::cameraSetting.root["rtsp"] ;
    
    for (auto& [key, value] : node.items())
    {
       
       //if (rtsp.find(key) == rtsp.end()) 
       {
            rtsp[key] = value;
            vec.push_back(key);
            ret = true;
       }
    }
    dump =  Settings::cameraSetting.root.dump(4) ;
    uv_rwlock_wrunlock(&rwlock_tCam);
    
    saveFile( "./webrtcStats.js", dump   );
    
    return ret;
     
}


bool Settings::deleteNode(json &node , std::vector<std::string> & vec  )
{
    bool ret = false;
    std::string dump;


   // if(node.is_object()

    uv_rwlock_wrlock(&rwlock_tCam);
    json &rtsp =  Settings::cameraSetting.root["rtsp"];

     for (json::iterator it = node.begin(); it != node.end(); ++it)
    //for (auto& [key, value] : node.items())
    {
       std::string key;

       if(node.is_object())
          key = it.key();
       else
          key = *it;

       if (rtsp.find(key) != rtsp.end())
       {
            rtsp.erase(key);
            vec.push_back(key);
            ret = true;
       }

    }

    dump =  Settings::cameraSetting.root.dump(4) ;

    uv_rwlock_wrunlock(&rwlock_tCam);

    saveFile( "./webrtcStats.js", dump   );

    return ret;

}

json Settings::getJsonNode()
{
    std::string ret;
    uv_rwlock_rdlock(&rwlock_tCam);

    json &rtsp =  Settings::cameraSetting.root["rtsp"];
   
    uv_rwlock_rdunlock(&rwlock_tCam);
    return rtsp;
}

std::string Settings::getNode()
{
    std::string ret;
    uv_rwlock_rdlock(&rwlock_tCam);

    json &rtsp =  Settings::cameraSetting.root["rtsp"];
    ret = rtsp.dump(4) ;
    uv_rwlock_rdunlock(&rwlock_tCam);
    return ret;
}

bool Settings::setNodeState(std::string &id , std::string  status)
{
    bool ret = false;
    std::string dump;

    uv_rwlock_wrlock(&rwlock_tCam);
    json &rtsp =   Settings::cameraSetting.root["rtsp"];
    if (rtsp.find(id) != rtsp.end())
    {
        rtsp[id]["state"]= status;
        ret = true;
    }

    dump =  Settings::cameraSetting.root.dump(4) ;

    uv_rwlock_wrunlock(&rwlock_tCam);

    saveFile( "./webrtcStats.js", dump   );


    return ret;
}

bool Settings::getNodeState(std::string id ,  std::string  key ,   std::string  &value)
{

    bool ret = false;

     uv_rwlock_rdlock(&rwlock_tCam);

    json &rtsp =   Settings::cameraSetting.root["rtsp"];
  ///  std::string dump =  Settings::encSetting.root.dump(4) ;
     
    if (rtsp.find(id) != rtsp.end() && rtsp[id].find(key) != rtsp[id].end())
    {
       value =  rtsp[id][key];
       ret = true;
    }

  uv_rwlock_rdunlock(&rwlock_tCam);


    return ret;
}


bool Settings::getJsonNodeState(std::string id , json& value)
{

    bool ret = false;

     uv_rwlock_rdlock(&rwlock_tCam);

    json &rtsp =   Settings::cameraSetting.root["rtsp"];
  ///  std::string dump =  Settings::encSetting.root.dump(4) ;
     
    if (rtsp.find(id) != rtsp.end() )
    {
       value =  rtsp[id];
       ret = true;
    }

    uv_rwlock_rdunlock(&rwlock_tCam);


    return ret;
}

///////////////////////////user////////////////////////////////////////////////
bool Settings::putUser(std::string user, json &node )  // only one node
{
    bool ret = false;
    std::string dump;
    uv_rwlock_wrlock(&rwlock_tUser);
      
    json &rtsp =   Settings::userSetting.root["users"] ;
    
    //for (auto& [key, value] : node.items())
    {
       
       //if (rtsp.find(key) == rtsp.end()) 
       {
            rtsp[user] = node;
            ret = true;
       }
    }
    dump =  Settings::userSetting.root.dump(4) ;
    uv_rwlock_wrunlock(&rwlock_tUser);
    
    saveFile( "./users.js", dump   );
    
    return ret;
     
}


bool Settings::deleteUser(json &node , std::vector<std::string> & vec  )
{
    bool ret = false;
    std::string dump;


   // if(node.is_object()

    uv_rwlock_wrlock(&rwlock_tUser);
    json &rtsp =  Settings::userSetting.root["users"];

     for (json::iterator it = node.begin(); it != node.end(); ++it)
    //for (auto& [key, value] : node.items())
    {
       std::string key;

       if(node.is_object())
          key = it.key();
       else
          key = *it;

       if (rtsp.find(key) != rtsp.end())
       {
            rtsp.erase(key);
            vec.push_back(key);
            ret = true;
       }

    }

    dump =  Settings::userSetting.root.dump(4) ;

    uv_rwlock_wrunlock(&rwlock_tUser);

    saveFile( "./users.js", dump   );

    return ret;

}

json Settings::getJsonUser()
{
    std::string ret;
    uv_rwlock_rdlock(&rwlock_tUser);

    json &rtsp =  Settings::userSetting.root["users"];
   
    uv_rwlock_rdunlock(&rwlock_tUser);
    return rtsp;
}

std::string Settings::getUser()
{
    std::string ret;
    uv_rwlock_rdlock(&rwlock_tUser);

    json &rtsp =  Settings::userSetting.root["users"];
    ret = rtsp.dump(4) ;
    uv_rwlock_rdunlock(&rwlock_tUser);
    return ret;
}

///////////////////////////user///////////////////////////////////////////////

#undef LOGGING_LOG_TO_FILE
