cmake_minimum_required(VERSION 3.13 FATAL_ERROR)
project(pthread_task)


SET(CMAKE_EXE_LINKER_FLAGS "-static")
#SET(BUILD_STATIC_LIBRARIES ON)


function(find_static_library LIB_NAME OUT)

    if (WIN32 OR MSVC)
        set(CMAKE_FIND_LIBRARY_SUFFIXES ".lib")
    elseif (UNIX)
        set(CMAKE_FIND_LIBRARY_SUFFIXES ".a")
    endif()      

    find_library(
        FOUND_${LIB_NAME}_STATIC
        ${LIB_NAME}
        )

    if (FOUND_${LIB_NAME}_STATIC)
        get_filename_component(ABS_FILE ${FOUND_${LIB_NAME}_STATIC} ABSOLUTE)
    else()
        message(SEND_ERROR "Unable to find library ${LIB_NAME}")
    endif()

    set(${OUT} ${ABS_FILE} PARENT_SCOPE)

endfunction()


add_executable(pthread_task main.c)


#add_library(libc STATIC IMPORTED)
#set_target_properties(libc PROPERTIES IMPORTED_LOCATION  /workspace/adappt/T31/ISVP-T31-1.1.6-20221229/software/Ingenic-SDK-T31-1.1.6-20221229/resource/toolchain/gcc_472/mips-gcc472-glibc216-64bit/mips-linux-gnu/libc/usr/lib/libc.a)


find_static_library(pthread TSYHREAD)
find_static_library(rt TSRT)
find_static_library(m TSM)
find_static_library(c TSC)


#add_link_options(pthread_task LINKER:-static)

#target_compile_options(pthread_task INTERFACE "-static")



target_link_libraries(pthread_task ${TSRT} pthread ${TSM} )


install(TARGETS pthread_task DESTINATION ${CMAKE_INSTALL_PREFIX})









