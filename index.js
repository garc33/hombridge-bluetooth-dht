const SerialPort = require('serialport');
const EventEmitter = require('events');
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-bluetooth-dht-sensor", "BluetoothDHTSensor", BluetoothDHTSensor, true);
}

function BluetoothDHTSensor(log, config) {
    this.log = log;
    this.name = config["name"];
    this.jsonEmitter = new EventEmitter();

    this.port = new SerialPort(config["port"], {
        parser: SerialPort.parsers.readline('\n')
    });

    setInterval((function () {
        if (!this.port.readable) {
            this.port.open();
        }
    }).bind(this), 1000);

    this.port.on('data', function (data) {
        try {
            jsonEmitter.emit('data', JSON.parse(data));
        } catch (e) {
            this.log('Received invalid JSON : ', e);
        }
    }).bind(this);
}

BluetoothDHTSensor.prototype = {
    getTemperature: function (callback) {
        this.jsonEmitter.once('data', (json) => {
            callback(null, json.temperature);
        });
    },

    getHumidity: function (callback) {
        this.jsonEmitter.once('data', (json) => {
            callback(null, json.humidity);
        });
    },

    getServices: function () {
        this.temperatureService = new Service.TemperatureSensor(this.name);
        this.temperatureService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .setProps({ minValue: 0, maxValue: 100 })
            .on('get', this.getTemperature.bind(this));
        
        this.humidityService = new Service.HumiditySensor(this.name);
        this.humidityService
            .getCharacteristic(Characteristic.CurrentHumidity)
            .setProps({ minValue: 0, maxValue: 100 })
            .on('get', this.getHumidity.bind(this));

        return [this.temperatureService, this.humidityService];
    }
}

