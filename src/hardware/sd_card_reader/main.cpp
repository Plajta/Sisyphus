#include <stdio.h>
#include <iostream>
#include <fstream>
#include <vector>
#include "pico/stdlib.h"
#include "sd_card.h"
#include "ff.h"

int main() {

    FRESULT fr;
    FATFS fs;
    FIL fil;
    int ret;
    char buf[100];

    // Initialize chosen serial port
    stdio_init_all();

    // Wait for user to press 'enter' to continue
    printf("\r\nSD card test. Press 'enter' to start.\r\n");
    while (true) {
        buf[0] = getchar();
        if ((buf[0] == '\r') || (buf[0] == '\n')) {
            break;
        }
    }

    // Initialize SD card
    if (!sd_init_driver()) {
        printf("ERROR: Could not initialize SD card\r\n");
        while (true);
    }

    // Mount drive
    fr = f_mount(&fs, "0:", 1);
    if (fr != FR_OK) {
        printf("ERROR: Could not mount filesystem (%d)\r\n", fr);
        while (true);
    }

    char filename[100];

    //získíní názvu souboru
    printf("Nyní zadejte nazev souboru:\r\n");
    int i = 0;
    while (true) {
        buf[0] = getchar();
        if((buf[0] == '\r') || (buf[0] == '\n')) {
            break;
        }else{
            const char* str = new char[2]{buf[0],'\0'};
            printf(str);
            filename[i] = buf[0];
        i++;
        }
    }
    filename[++i] = '\0';

    printf("\r\nfilename:\r\n");
    printf(filename);
    printf("\r\n");

    // Open file for writing ()
    fr = f_open(&fil, filename, FA_WRITE | FA_CREATE_ALWAYS);
    if (fr != FR_OK) {
        printf("ERROR: Could not open file (%d)\r\n", fr);
        while (true);
    }

    //print to file
    printf("Nyní zadejte nazev obsah:");
    while (true) {
        buf[0] = getchar();
        if (buf[0] == 4) {
            break;
        } else {
            const char* str = new char[2]{buf[0], '\0'};
            ret = f_printf(&fil, str);
            printf(str);
            if ((buf[0] == '\r') || (buf[0] == '\n')) {
                printf("\r\n");
                ret = f_printf(&fil, "\r\n");
            }
            if (ret < 0) {
                printf("ERROR: Could not write to file (%d)\r\n", ret);
                f_close(&fil);
                while (true);
    }
        }
    }

    // Close file
    fr = f_close(&fil);
    if (fr != FR_OK) {
        printf("ERROR: Could not close file (%d)\r\n", fr);
        while (true);
    }

    // Unmount drive
    f_unmount("0:");

    printf("Data uspesne zapsana\r\n");
    // Loop forever doing nothing
    while (true) {
        sleep_ms(1000);
    }
}