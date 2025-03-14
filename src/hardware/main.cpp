#include <stdio.h>
#include "pico/stdlib.h"
#include "APDS9960.h"

int main() 
{
    // Initialize standard I/O
    stdio_init_all();

    // Initialize the APDS9960 sensor
    APDS9960 apds;
    uint16_t ambient_light = 0;
    uint16_t red_light = 0;
    uint16_t green_light = 0;
    uint16_t blue_light = 0;

    printf("\n");
    printf("------------------------------------\n");
    printf("APDS-9960 - Color Sensor\n");
    printf("------------------------------------\n");

    // Initialize APDS-9960 (configure I2C and initial values)
    if (!apds.init() || !apds.enableLightSensor(false)) 
    {
        printf("APDS-9960 init failed!\n");
        return 1;
    }

    // Wait for initialization and calibration to finish
    sleep_ms(500);

    while (1) 
    {
        // Read the light levels (ambient, red, green, blue)
        if (!apds.readAmbientLight(ambient_light) ||
            !apds.readRedLight(red_light) ||
            !apds.readGreenLight(green_light) ||
            !apds.readBlueLight(blue_light)) 
        {
            printf("Error reading light values\n");
        }
        else 
        {
            printf("Ambient: %d Red: %d Green: %d Blue: %d\n",
                   ambient_light, red_light, green_light, blue_light);
        }

        // Wait 1 second before the next reading
        sleep_ms(1000);
    }

    return 0;
}