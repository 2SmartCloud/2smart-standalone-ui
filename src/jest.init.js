import { configure } from 'enzyme';
import Adapter       from 'enzyme-adapter-react-16';
import '@babel/polyfill';

window.APP_CONF = {
    brokerUrl       : 'ws://localhost:8083/mqtt',
    apiUrl          : 'http://localhost:8000',
    apiPrefix       : '/api/v1/',
    backupApiUrl    : 'http://localhost:9000',
    backupApiPrefix : '/',
    mqttUsername    : '2smart',
    mqttPassword    : '2smart',
    mqttCacheLimit  : 10000,
    env             : 'test'
};

configure({ adapter: new Adapter() });
