cmake_minimum_required(VERSION 3.13)

# Include the Pico SDK initialization script

set(PICO_SDK_FETCH_FROM_GIT on)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include($ENV{PICO_SDK_PATH}/pico_sdk_init.cmake)

project(sisyphus)

# Initialize the Pico SDK
pico_sdk_init()

# Add your executable and source files
add_executable(${PROJECT_NAME}
    main.cpp
)

add_library(apds9960
    APDS9960.cpp
)

target_link_libraries(apds9960
    pico_stdlib
    hardware_i2c
)

# Enable USB stdio and disable UART stdio
pico_enable_stdio_usb(${PROJECT_NAME} 1)
pico_enable_stdio_uart(${PROJECT_NAME} 0)

# Link the Pico SDK to your project
target_link_libraries(${PROJECT_NAME} pico_stdlib apds9960 hardware_i2c hardware_gpio hardware_pwm)

# Create map/bin/hex/uf2 files
pico_add_extra_outputs(${PROJECT_NAME})
