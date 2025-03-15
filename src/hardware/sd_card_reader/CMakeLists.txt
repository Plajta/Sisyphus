cmake_minimum_required(VERSION 3.13)

include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)

# Set the project name
project(sd_card_reader C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

include($ENV{PICO_SDK_PATH}/external/pico_sdk_import.cmake)


# Initialize the Pico SDK
pico_sdk_init()

# Add the subdirectory for the no-OS-FatFS-SD-SDIO-SPI-RPi-Pico library
add_subdirectory(lib/no-OS-FatFS-SD-SPI-RPi-Pico/FatFs_SPI)

# Add your executable
add_executable(${PROJECT_NAME}
    main.cpp
    hw_config.c
    # Add other source files here
)

# Link the necessary libraries
target_link_libraries(${PROJECT_NAME}
    pico_stdlib
    FatFs_SPI
    hardware_spi
)

# Enable USB output, disable UART output
pico_enable_stdio_usb(${PROJECT_NAME} 1)
pico_enable_stdio_uart(${PROJECT_NAME} 0)

# Create map/bin/hex/uf2 files
pico_add_extra_outputs(${PROJECT_NAME})
