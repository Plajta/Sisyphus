#include <cstdint>
#include <stdio.h>
#include <string.h>
#include "pico/stdlib.h"
#include "sd_card.h"
#include "ff.h"

#define BUFFER_SIZE 1024
#define MAX_FILENAME_LEN 100

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
            
            // Echo the character back
            putchar(c);
            
            if (c == '\n' || c == '\r') {
                break;
            }
            buffer[i++] = (char)c;
        }
        buffer[i] = '\0'; // Null terminate
        
        printf("\n"); // Add a newline after command
        
        // Process the command
        if (is_equal(buffer, "send-data")) {
            printf("ready\n");
        }
        else if (is_equal(buffer, "end-data")) {
            printf("ok\n");
            receive_mode = 0;
            content_iter = 0;
        }
        else if (is_equal(buffer, "filename")) {
            printf("ok\n");
            receive_mode = 1;
        }
        else if (strlen(buffer) > 0) {
            if (receive_mode == 1) {
                // Store the filename in our filename buffer
                strncpy(filename, buffer, MAX_FILENAME_LEN - 1);
                filename[MAX_FILENAME_LEN - 1] = '\0'; // Ensure null termination
                
                printf("Filename set to: '%s'\n", filename);
                receive_mode = 2;
                content_iter = 0;
                printf("Ready for content\n");
            }
            else if (receive_mode == 2) {
                printf("Content chunk %d received (%d bytes)\n", content_iter, (int)strlen(buffer));
                content_iter += 1;
                
                // Here you would process/save the content
                // For example, append to a file named 'filename'
            }
            else {
                printf("Unknown command: %s\n", buffer);
                printf("Available commands: send-data, filename, end-data\n");
            }
        }
        
        // Small delay to avoid flooding console
        sleep_ms(100);
    }
    
    return 0;
}