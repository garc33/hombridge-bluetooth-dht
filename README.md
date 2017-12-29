# homebridge-bt-temp-sensor

This is the Homebridge accessory for bluetooth DHT sensor backed by an Arduino.

The Arduino sketch for the DHT sensors is included in the `arduino` directory within this repository.

This project is inspired by https://github.com/themainframe/homebridge-bt-temp-sensor

## Installation

You'll need to use a Bluetooth frontend (like `bluetoothctl`) to pair your HC-06-_like_ devices, then use `rfcomm` to bind the devices to Bluetooth serial ports:

    rfcomm bind rfcomm0 00:11:22:33:44:55

Then configure Homebridge for each Bluetooth DHT sensor you've set up in `~/.homebridge/config.json`:

    ...
    "accessories": [
    ...
        {
            "accessory": "BluetoothDHTSensor",
            "name": "Sensor 1",
            "port": "/dev/rfcomm0"
        },
    ...
    ]
    ...