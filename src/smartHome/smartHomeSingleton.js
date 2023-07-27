import MQTTTransport from 'homie-sdk/lib/Broker/mqtt';
import Homie         from 'homie-sdk/lib/homie/Homie';
import HomieClient   from 'homie-sdk/lib/homie/HomieClient';
import {
    decoratedCallToastNotification as handleOffline,
    decoratedHideToastNotification as handleConnect
}                    from '../actions/interface';
import {
    dispatchHandleHardwareDelete as handleHardwareDelete,
    decoratedHandleAddNewBridgeEntity as handleAddNewBridgeEntity,
    decoratedHandleAddNewGroupEntity as handleAddNewGroupEntity,
    decoratedAddNewDiscovery as handleAddNewDiscovery,
    decoratedHandleAddNewBridgeTypeEntity as handleAddNewBridgeTypeEntity,
    decoratedHandleAddNewNotificationChannel as handleAddNewNotificationChannel,
    decoratedHandleAddNewNotification as handleAddNewNotification,
    decoratedHandleSystemUpdates as handleSystemUpdates,
    decoratedHandleAddNewAlias as handleAddNewAlias,
    decoratedHandleAddNewExtension as handleAddNewExtension
} from '../actions/decoratedHomie';
import {
    addNewDevice as handleAddNewDevice,
    addNewNode as handleAddNewNode,
    addNewSensor as handleAddNewSensor,
    addNewDeviceTelemetry as handleAddNewDeviceTelemetry,
    addNewDeviceOption as handleAddNewDeviceOption,
    addNewNodeTelemetry as handleAddNewNodeTelemetry,
    addNewNodeOption as handleAddNewNodeOption,
    addNewThreshold as handleAddNewThreshold,
    addNewScenario as handleAddNewScenario
}                    from '../actions/homieHandlers';
import config        from './../../config';

import SmartHome     from './SmartHome';

let disconnectTimer = null;
const disconnectTimerInterval = 2000;

const tlsConf = config.env === 'demo' ? {} : { tls: { enable: true, selfSigned: true } };
const transport = new MQTTTransport({
    uri      : config.brokerUrl,
    username : config.mqttUsername,
    password : config.mqttPassword,
    session  : `session-2smart-ui_${Math.random().toString(16).substr(2, 8)}`,
    ...tlsConf
});

function processConnect() {
    clearTimeout(disconnectTimer);
    handleConnect();
}

function processOffline() {
    clearTimeout(disconnectTimer);
    disconnectTimer = setTimeout(handleOffline, disconnectTimerInterval);
}

const homie = new Homie({ transport });

homie.on('offline', processOffline);
homie.on('online', processConnect);
const homieClient = new HomieClient({ homie });
const smartHome = new SmartHome({ homieClient,
    handleAddNewDevice,
    handleAddNewNode,
    handleAddNewSensor,
    handleAddNewDeviceTelemetry,
    handleAddNewDeviceOption,
    handleAddNewNodeTelemetry,
    handleAddNewNodeOption,
    handleAddNewThreshold,
    handleHardwareDelete,
    handleAddNewBridgeEntity,
    handleAddNewGroupEntity,
    handleAddNewDiscovery,
    handleAddNewBridgeTypeEntity,
    handleAddNewNotificationChannel,
    handleAddNewNotification,
    handleSystemUpdates,
    handleAddNewAlias,
    handleAddNewExtension,
    handleAddNewScenario
});

window.homie = homie;
window.homieClient = homieClient;

export default smartHome;
