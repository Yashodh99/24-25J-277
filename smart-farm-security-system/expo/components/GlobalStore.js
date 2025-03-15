
import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

const store = {
  weatherCondition: '',
  setWeatherCondition(value) {
    this.weatherCondition = value;
    emitter.emit('weatherChange', value);
  },
  subscribe(callback) {
    emitter.on('weatherChange', callback);
  },
  unsubscribe(callback) {
    emitter.off('weatherChange', callback);
  },
};

export default store;
