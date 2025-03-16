#include "pico/stdlib.h"
#include "hardware/irq.h"  // interrupts
#include "hardware/pwm.h"  // pwm
#include "hardware/sync.h" // wait for interrupt
#include "hardware/clocks.h"
#include <cstddef>
#include <hardware/gpio.h>
#include <hardware/i2c.h>
#include <pico/time.h>
#include <stdio.h>
#include <sys/types.h>
#include "APDS9960.h"

//I HATE THIS SO MUCH

#include "koule.h"
#include "anooo.h"
#include "rozmazat.h"

#include "odebrat.h"
#include "vic.h"
#include "jetohovno.h"

#include "namazat.h"
#include "uznechci.h"
#include "zdravim.h"

//I HATE THIS SO MUCH

#define AUDIO_PIN 0
#define AMPLIFIER_ON_PIN 1
#define INT_PIN 21
#define OUTPUT_ENABLE 20
#define SIGNAL_PIN 16
#define SIGNAL_PIN2 17
#define SIGNAL_PIN3 18
#define SIGNAL_PIN4 19
#define FRONTLIGHT_PIN 22

APDS9960 apds;

int wav_position = 0;
uint8_t wav_index = 0;
int audio_pin_slice = 0;

uint32_t wav_data_lengths[16] = {};
uint8_t *wav_data[16] = {NULL};


void audio_set_state(bool state) {
    gpio_put(AMPLIFIER_ON_PIN, state);
    pwm_set_enabled(audio_pin_slice, state);
}

void pwm_interrupt_handler() {
    pwm_clear_irq(pwm_gpio_to_slice_num(AUDIO_PIN));
    if (wav_position < (wav_data_lengths[wav_index]<<3) - 1) {
        // set pwm level
        // allow the pwm value to repeat for 8 cycles this is >>3
        pwm_set_gpio_level(AUDIO_PIN, wav_data[wav_index][wav_position>>3]);
        wav_position++;
    } else {
        // reset to start
        audio_set_state(false);
    }
}

int8_t get_sheet_color() {
    uint16_t ambient_light = 0;
    uint16_t red_light = 0;
    uint16_t green_light = 0;
    uint16_t blue_light = 0;
    if (!apds.readAmbientLight(ambient_light) ||
        !apds.readRedLight(red_light) ||
        !apds.readGreenLight(green_light) ||
        !apds.readBlueLight(blue_light))
    {
        printf("Error reading light sensor\n");
        return -1;
    }

    printf("Light sensor values: %d, %d, %d, %d\n", ambient_light, red_light, green_light, blue_light); // DEBUG

    if (ambient_light > 2000 || ambient_light < 200){
        if (ambient_light < 600) return 0; // no page inserted
        if (ambient_light > 2000) return -1; // invalid page inserted
    }
    if (red_light > green_light && red_light > blue_light) return 1; // red light
    else if (green_light > red_light && green_light > blue_light) return 2; // green light
    else if (blue_light > red_light && blue_light > green_light) return 3; // blue light
    else if (red_light > 0 && green_light > 0 && abs(red_light - green_light) < 10) return 4; // yellow light
    else if (red_light > 0 && blue_light > 0 && abs(red_light - blue_light) < 10) return 5; // purple light

    return -1;
}

void gpio_callback(uint gpio, uint32_t events) {
    gpio_put(FRONTLIGHT_PIN, 1);
    uint8_t button_state = 0;
    wav_position = 0;

    button_state |= gpio_get(SIGNAL_PIN);
    button_state |= gpio_get(SIGNAL_PIN2) << 1;
    button_state |= gpio_get(SIGNAL_PIN3) << 2;
    button_state |= gpio_get(SIGNAL_PIN4) << 3;

    wav_index = button_state;

    int8_t curr_page = get_sheet_color();

    gpio_put(FRONTLIGHT_PIN, 0);

    if (wav_data[wav_index] != NULL && wav_data_lengths[wav_index] != 0){
        audio_set_state(true);
    }


    printf("Button number: %d\n", button_state);
    printf("Current page: %d\n", curr_page);
}

int main() {
    stdio_init_all();
    //GOD PLEASE HELP ME
    //sleep_ms(5000);

    wav_data[8] = ANOOO_DATA;
    wav_data_lengths[8] = ANOOO_DATA_LENGTH;
    wav_data[9] = ROZMAZAR_DATA;
    wav_data_lengths[9] = ROZMAZAR_DATA_LENGTH;
    wav_data[10] = KOULE_DATA;
    wav_data_lengths[10] = KOULE_DATA_LENGTH;

    wav_data[4] = ODEBRAT_DATA;
    wav_data_lengths[4] = ODEBRAT_DATA_LENGTH;
    wav_data[5] = VIC_DATA;
    wav_data_lengths[5] = VIC_DATA_LENGTH;
    wav_data[6] = JETOHOVNO_DATA;
    wav_data_lengths[6] = JETOHOVNO_DATA_LENGTH;

    wav_data[0] = NAMAZAT_DATA;
    wav_data_lengths[0] = NAMAZAT_DATA_LENGTH;
    wav_data[1] = UZNECHCI_DATA;
    wav_data_lengths[1] = UZNECHCI_DATA_LENGTH;
    wav_data[2] = ZDRAVIM_DATA;
    wav_data_lengths[2] = ZDRAVIM_DATA_LENGTH;

    //GOD PLEASE HELP ME
    audio_pin_slice = pwm_gpio_to_slice_num(AUDIO_PIN);
    set_sys_clock_khz(176000, true); // DO NOT REMOVE THE AUDIO ABSOLUTELY EXPLODES
    gpio_set_function(AUDIO_PIN, GPIO_FUNC_PWM);

    gpio_init(INT_PIN);
    gpio_init(AMPLIFIER_ON_PIN);
    gpio_init(SIGNAL_PIN);
    gpio_init(SIGNAL_PIN2);
    gpio_init(SIGNAL_PIN3);
    gpio_init(SIGNAL_PIN4);
    gpio_init(FRONTLIGHT_PIN);
    gpio_init(PICO_DEFAULT_LED_PIN);
    gpio_set_dir(INT_PIN, GPIO_IN);
    gpio_set_dir(AMPLIFIER_ON_PIN, GPIO_OUT);
    gpio_set_dir(SIGNAL_PIN, GPIO_IN);
    gpio_set_dir(SIGNAL_PIN2, GPIO_IN);
    gpio_set_dir(SIGNAL_PIN3, GPIO_IN);
    gpio_set_dir(SIGNAL_PIN4, GPIO_IN);
    gpio_set_dir(FRONTLIGHT_PIN, GPIO_OUT);
    gpio_set_dir(PICO_DEFAULT_LED_PIN, GPIO_OUT);

    i2c_inst_t *i2c = i2c0;
	i2c_init(i2c, 100 * 1000);
    gpio_set_function(PICO_DEFAULT_I2C_SDA_PIN, GPIO_FUNC_I2C);
    gpio_set_function(PICO_DEFAULT_I2C_SCL_PIN, GPIO_FUNC_I2C);
    gpio_pull_up(PICO_DEFAULT_I2C_SDA_PIN);
    gpio_pull_up(PICO_DEFAULT_I2C_SCL_PIN);

    // Initialize APDS-9960 (configure I2C and initial values)
    if (!apds.init(i2c))
    {
        printf("APDS-9960 init failed!\n");
    }
    if (!apds.enableLightSensor(false))
    {
        printf("APDS-9960 light sensor enable failed!\n");
    }

    // Setup PWM interrupt to fire when PWM cycle is complete
    pwm_clear_irq(audio_pin_slice);
    pwm_set_irq_enabled(audio_pin_slice, true);
    // set the handle function above
    irq_set_exclusive_handler(PWM_IRQ_WRAP, pwm_interrupt_handler);
    irq_set_enabled(PWM_IRQ_WRAP, true);



    gpio_set_irq_enabled_with_callback(INT_PIN, GPIO_IRQ_EDGE_RISE, true, &gpio_callback);

    // Setup PWM for audio output
    pwm_config config = pwm_get_default_config();
    /* Base clock 176,000,000 Hz divide by wrap 250 then the clock divider further divides
     * to set the interrupt rate.
     *
     * 11 KHz is fine for speech. Phone lines generally sample at 8 KHz
     *
     *
     * So clkdiv should be as follows for given sample rate
     *  8.0f for 11 KHz
     *  4.0f for 22 KHz
     *  2.0f for 44 KHz etc
     */
    pwm_config_set_clkdiv(&config, 8.0f);
    pwm_config_set_wrap(&config, 250);
    pwm_init(audio_pin_slice, &config, false);

    pwm_set_gpio_level(AUDIO_PIN, 0);

    while(1) {
        __wfi(); // Wait for Interrupt
    }
}
