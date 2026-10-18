cmake_minimum_required(VERSION 3.16)
project(UniTrackDesktop LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets)

add_executable(unitrack_desktop
    main.cpp
    CalendarViewModel.hpp
)

target_link_libraries(unitrack_desktop PRIVATE
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
)
