import { USER_SERVICES_ENTITY_TYPE }         from '../actions/userServices';
import { MARKET_SERVICES_ENTITY_TYPE }       from '../actions/marketServices';
import { NOTIFICATION_CHANNELS_ENTITY_TYPE } from '../actions/notificationChannels';
import { NOTIFICATION_ENTITY_TYPE }          from '../actions/notifications';
import { SYSTEM_UPDATES_ENTITY_TYPE }        from '../actions/systemUpdates';
import { ALIAS_ENTITY_TYPE }                 from '../actions/alias';
import { EXTENSION_ENTITY_TYPE }             from '../actions/extensions';
import { DISCOVERY_ENTITY_TYPE }             from '../actions/discovery';

class SmartHome {
    constructor({
        homieClient,
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
    }) {
        this.homieClient = homieClient;
        this.handleAddNewDevice = handleAddNewDevice;
        this.handleAddNewNode = handleAddNewNode;
        this.handleAddNewSensor = handleAddNewSensor;
        this.handleAddNewDeviceTelemetry = handleAddNewDeviceTelemetry;
        this.handleAddNewDeviceOption = handleAddNewDeviceOption;
        this.handleAddNewNodeTelemetry = handleAddNewNodeTelemetry;
        this.handleAddNewNodeOption = handleAddNewNodeOption;
        this.handleAddNewThreshold = handleAddNewThreshold;
        this.handleHardwareDelete = handleHardwareDelete;
        this.handleAddNewBridgeEntity = handleAddNewBridgeEntity;
        this.handleAddNewBridgeTypeEntity = handleAddNewBridgeTypeEntity;
        this.handleAddNewGroupEntity = handleAddNewGroupEntity;
        this.handleAddNewDiscovery = handleAddNewDiscovery;
        this.handleAddNewNotificationChannel = handleAddNewNotificationChannel;
        this.handleAddNewNotification = handleAddNewNotification;
        this.handleSystemUpdates = handleSystemUpdates;
        this.handleAddNewAlias = handleAddNewAlias;
        this.handleAddNewExtension = handleAddNewExtension;
        this.handleAddNewScenario = handleAddNewScenario;
        this.isRunning = false;
        this.defferedFunctions = [];
    }

    async init() {
        try {
            await this.homieClient.initWorld();
            this.isRunning = true;
            this.defferedFunctions.forEach(({ resolve, getResult }) => resolve(getResult()));
            this.onNewDeviceAdded();
            this.onNewNodeAdded();
            this.onNewSensorAdded();
            this.onNewDeviceTelemetryAdded();
            this.onNewDeviceOptionAdded();
            this.onNewNodeTelemetryAdded();
            this.onNewNodeOptionAdded();
            this.onNewThreshold();
            this.onNewScenario();
            this.onDelete();
            this.onNewEntityAdded();
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    initializeEntityClass(type) {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.initializeEntityClass(type);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });

        // return this.homieClient.initializeEntityClass(type);
    }

    destroyEntityClass(type) {
        return this.homieClient.destroyEntityClass(type);
    }

    getDevices() {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getDevices();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getThresholds() {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getThresholds();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getScenarios(type) {
        return new Promise(resolve => {
            const getResult = () => this.homieClient.getScenarios(type);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getEntities(type) {
        return new Promise(resolve => {
            const getResult = () => this.homieClient.getEntities(type);

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    getDeviceById(id) {
        return this.homieClient.getDeviceById(id);
    }

    getThresholdById(scenarioId, id) {
        return this.homieClient.getThresholdById(scenarioId, id);
    }

    getEntityById(type, id) {
        return this.homieClient.getEntityById(type, id);
    }

    getInstanceByTopic(topic) {
        return this.homieClient.getInstanceByTopic(topic);
    }

    createEntityRequest(type, payload, ...rest) {
        return this.homieClient.createEntityRequest(type, payload, ...rest);
    }

    deleteEntityRequest(type, id) {
        const entity = this.getEntityById(type, id);

        return entity.deleteRequest();
    }

    onNewDeviceAdded() {
        this.homieClient.onNewDeviceAdded(({ deviceId }) => {
            const newDevice = this.homieClient.getDeviceById(deviceId);

            this.handleAddNewDevice(newDevice);
        });
    }

    onNewNodeAdded() {
        this.homieClient.onNewNodeAdded(({ deviceId, nodeId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newNode = device.getNodeById(nodeId);

            this.handleAddNewNode(newNode);
        });
    }

    onNewSensorAdded() {
        this.homieClient.onNewSensorAdded(({ deviceId, nodeId, sensorId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newSensor = node.getSensorById(sensorId);

            this.handleAddNewSensor(newSensor);
        });
    }

    onNewDeviceTelemetryAdded() {
        this.homieClient.onNewDeviceTelemetryAdded(({ deviceId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newTelemetry = device.getTelemetryById(telemetryId);

            this.handleAddNewDeviceTelemetry(newTelemetry);
        });
    }

    onNewDeviceOptionAdded() {
        this.homieClient.onNewDeviceOptionAdded(({ deviceId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const newOption = device.getOptionById(optionId);

            this.handleAddNewDeviceOption(newOption);
        });
    }

    onNewNodeTelemetryAdded() {
        this.homieClient.onNewNodeTelemetryAdded(({ deviceId, nodeId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newTelemetry = node.getTelemetryById(telemetryId);

            this.handleAddNewNodeTelemetry(newTelemetry);
        });
    }

    onNewNodeOptionAdded() {
        this.homieClient.onNewNodeOptionAdded(({ deviceId, nodeId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);
            const node = device.getNodeById(nodeId);
            const newOption = node.getOptionById(optionId);

            this.handleAddNewNodeOption(newOption);
        });
    }

    onNewThreshold() {
        this.homieClient.onNewThreshold(({ thresholdId, scenarioId }) => {
            const threshold = this.homieClient.getThresholdById(scenarioId, thresholdId);

            this.handleAddNewThreshold(threshold);
        });
    }

    onNewScenario() {
        this.homieClient.onNewScenario(({ scenarioId }) => {
            const scenario = this.homieClient.getScenarioById(scenarioId);

            this.handleAddNewScenario(scenario);
        });
    }

    onDelete() {
        this.homieClient.onDelete((data) => {
            this.handleHardwareDelete(data);
        });
    }

    onNewEntityAdded() {
        this.homieClient.onNewEntityAdded(({ type, entityId }) => {
            const newEntity = this.homieClient.getEntityById(type, entityId);

            let handler;

            switch (type) {
                case USER_SERVICES_ENTITY_TYPE:
                    handler = this.handleAddNewBridgeEntity;
                    break;
                case MARKET_SERVICES_ENTITY_TYPE:
                    handler = this.handleAddNewBridgeTypeEntity;
                    break;
                case 'GROUP_OF_PROPERTIES':
                    handler = this.handleAddNewGroupEntity;
                    break;
                case NOTIFICATION_CHANNELS_ENTITY_TYPE:
                    handler = this.handleAddNewNotificationChannel;
                    break;
                case NOTIFICATION_ENTITY_TYPE:
                    handler = this.handleAddNewNotification;
                    break;
                case SYSTEM_UPDATES_ENTITY_TYPE:
                    handler = this.handleSystemUpdates;
                    break;
                case ALIAS_ENTITY_TYPE:
                    handler = this.handleAddNewAlias;
                    break;
                case EXTENSION_ENTITY_TYPE:
                    handler = this.handleAddNewExtension;
                    break;
                case DISCOVERY_ENTITY_TYPE:
                    handler = this.handleAddNewDiscovery;
                    break;
                default:
                    break;
            }

            if (handler) handler(newEntity);
            else console.error('onNewEntityAdded() error: HANDLER IS NOT DEFINED');
        });
    }
}

export default SmartHome;
