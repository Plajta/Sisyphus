#include <cstdint>
#include <hardware/gpio.h>
#include <hardware/i2c.h>
#include <pico/time.h>
#include <stdio.h>
#include <sys/_intsup.h>
#include "pico/stdlib.h"
#include "APDS9960.h"

#define LED_PIN 22

void rgb_led_on(){gpio_put(LED_PIN, 1);}
void rgb_led_off(){gpio_put((LED_PIN),0);}

int main() 
{
    // Initialize standard I/O
    stdio_init_all();

    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);

    sleep_ms(5000); // TEST

    rgb_led_on();

    // Initialize I2C
    i2c_inst_t *i2c = i2c0;
	i2c_init(i2c, 100 * 1000);
    gpio_set_function(PICO_DEFAULT_I2C_SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(PICO_DEFAULT_I2C_SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(PICO_DEFAULT_I2C_SDA_PIN);
    gpio_pull_up(PICO_DEFAULT_I2C_SCL_PIN);

    printf("I2C instance: %p\n", i2c);

    // Initialize the APDS9960 sensor
    APDS9960 apds;
    uint16_t ambient_light = 0;
    uint16_t red_light = 0;
    uint16_t green_light = 0;
    uint16_t blue_light = 0;

    // other vars
    int curr_page = 0;

    printf("\n");
    printf("------------------------------------\n");
    printf("APDS-9960 - Color Sensor\n");
    printf("------------------------------------\n");

    // Initialize APDS-9960 (configure I2C and initial values)
    if (!apds.init(i2c) || !apds.enableLightSensor(false)) 
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

            if (ambient_light > 2000 || ambient_light < 200){
                if (ambient_light < 200) curr_page = 0; // no page inserted
                if (ambient_light > 2000) curr_page = -1; // invalid page inserted
            }
            else{
                if (red_light > green_light && red_light > blue_light) curr_page = 1; // red light
                else if (green_light > red_light && green_light > blue_light) curr_page = 2; // green light
                else if (blue_light > red_light && blue_light > green_light) curr_page = 3; // blue light
            }
            
            printf("Currently on page: %d\n", curr_page);
        }

        // Wait 1 second before the next reading
        sleep_ms(500);
    }

    return 0;
}