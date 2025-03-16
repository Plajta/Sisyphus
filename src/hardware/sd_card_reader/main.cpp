#include <cstdint>
#include <stdio.h>
#include <string.h>
#include "pico/stdlib.h"
#include "sd_card.h"
#include "ff.h"

#define BUFFER_SIZE 1024
#define MAX_FILENAME_LEN 100

#define PASS "ok"
#define ERR "kokote"

FRESULT fr;
FATFS fs;
FIL fil;
int ret;

// Function prototypes
bool is_equal(const char* str1, const char* str2) {
    return strcmp(str1, str2) == 0;
}

uint8_t receive_mode = 0;
// mode 0 - general commands
// mode 1 - filename retrieval
// mode 2 - file content retrieval
int content_iter = 0;
char filename[MAX_FILENAME_LEN] = {0}; // Store filename

int main() {
    // Initialize USB and UART
    stdio_init_all();

    // Initialize SD card
    if(!sd_init_driver()) {
        printf("ERROR: Could not initialize SD card\r\n");
        while (true);
    }
    
    // LED for debugging
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    
    // Turn on LED to indicate program is running
    gpio_put(LED_PIN, 1);
    
    // Wait for USB connection before proceeding
    while (!stdio_usb_connected()) {
        // Blink LED to indicate waiting for connection
        gpio_put(LED_PIN, 0);
        sleep_ms(250);
        gpio_put(LED_PIN, 1);
        sleep_ms(250);
    }
    
    // Steady LED to indicate connected
    gpio_put(LED_PIN, 1);
    
    // Important: Add a small delay to ensure USB is fully initialized
    sleep_ms(1000);
    
    char buffer[BUFFER_SIZE];
    
    while (true) {
        int i = 0;
        while (i < BUFFER_SIZE - 1) {
            int c = getchar();
            if (c == PICO_ERROR_TIMEOUT) {
                // No character received
                continue;
            }
            
            if (c == '\n' || c == '\r') {
                break;
            }
            buffer[i++] = (char)c;
        }
        buffer[i] = '\0'; // Null terminate
        
        // Process the command
        if (is_equal(buffer, "send-data")) {
            // Mount drive
            fr = f_mount(&fs, "0:", 1);
            if (fr != FR_OK) {
                printf("%s\n", ERR);
                while (true);
            }
            printf("%s\n", PASS);
        }
        else if (is_equal(buffer, "end-data")) {
            receive_mode = 0;
            content_iter = 0;

            // Close file
            fr = f_close(&fil);
            if (fr != FR_OK) {
                printf("%s\n", ERR);
                while (true);
            }

            // Unmount drive
            f_unmount("0:");
            printf("%s\n", PASS);
        }
        else if (is_equal(buffer, "filename")) {
            printf("%s\n", PASS);
            receive_mode = 1;
        }
        else if (strlen(buffer) > 0) {
            if (receive_mode == 1) {
                // Store the filename in our filename buffer
                strncpy(filename, buffer, MAX_FILENAME_LEN - 1);
                filename[MAX_FILENAME_LEN - 1] = '\0'; // Ensure null termination
                
                printf("%s\n", PASS);
                receive_mode = 2;
                content_iter = 0;

                // Open file for writing ()
                fr = f_open(&fil, filename, FA_WRITE | FA_CREATE_ALWAYS);
                if (fr != FR_OK) {
                    printf("%s\n", ERR);
                    while (true);
                }
            }
            else if (receive_mode == 2) {
                printf("%s\n", PASS);
                content_iter += 1;
                
                // Here you would process/save the content
                // For example, append to a file named 'filename'
                ret = f_printf(&fil, buffer);
                if (ret < 0) {
                    printf("%s\n", ERR);
                    f_close(&fil);
                    while (true);
                }
            }
            else {
                printf("%s\n", ERR);
            }
        }
        
        // Small delay to avoid flooding console
        sleep_ms(100);
    }
    
    return 0;
}