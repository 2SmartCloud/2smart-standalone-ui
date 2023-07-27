import produce from 'immer';
import {
    GET_DEVICES,
    UPDATE_DEVICE_TELEMETRY_ATTRIBUTE,
    UPDATE_DEVICE_OPTION_ATTRIBUTE,
    UPDATE_NODE_TELEMETRY_ATTRIBUTE,
    UPDATE_NODE_OPTION_ATTRIBUTE,
    UPDATE_NODE_ATTRIBUTE,
    UPDATE_DEVICE_ATTRIBUTE,
    UPDATE_SENSOR_ATTRIBUTE,
    GET_THRESHOLDS,
    SET_THRESHOLD_PROCESSING,
    UPDATE_THRESHOLD,
    HANDLE_DEVICE_DELETE,
    HANDLE_NODE_DELETE,
    HANDLE_THRESHOLD_DELETE,
    UPDATE_HOMIE_STATE,
    CHANGE_ATRIBUTE_PROCESSING_STATUS,
    ADD_ATTRIBUTE_ERROR,
    REMOVE_ATTRIBUTE_ERROR,
    GET_SCENARIOS_HOMIE,
    HANDLE_SCENARIO_DELETE
} from '../actions/homie';
import {
    PROCESSING_FIELDS,
    ERRORS_FIELDS
} from '../assets/constants/homie';

const initialState = {
    devices            : {},
    thresholds         : {},
    scenarios          : {},
    events             : [],
    isTresholdFetching : true,
    iScenariosFetching : true,
    isFetching         : true
};

export default produce((draft, action) => { //  eslint-disable-line complexity
    switch (action.type) {
        case GET_DEVICES:
            draft.devices = action.payload;
            draft.isFetching = false;

            break;
        case GET_SCENARIOS_HOMIE:
            draft.scenarios = action.payload;
            draft.iScenariosFetching = false;

            break;
        case UPDATE_DEVICE_ATTRIBUTE: {
            const { deviceId, field, value } = action;

            draft.devices[deviceId][field] = value;
            break;
        }
        case UPDATE_NODE_ATTRIBUTE: {
            const { field, value, deviceId, nodeId } = action;
            const device = draft.devices[deviceId];
            const node = device.nodes.find(({ id }) => id === nodeId);

            node[field] = value;
            break;
        }
        case UPDATE_SENSOR_ATTRIBUTE: {
            const {
                field,
                value,
                propertyId,
                deviceId,
                nodeId
            } = action;
            const device = draft.devices[deviceId];
            const node = device.nodes.find(({ id }) => id === nodeId);
            const sensor = node.sensors.find(({ id }) => id === propertyId);

            sensor[field] = value;

            break;
        }
        case UPDATE_DEVICE_TELEMETRY_ATTRIBUTE: {
            const {
                field,
                value,
                propertyId,
                deviceId
            } = action;
            const device = draft.devices[deviceId];
            const telemetry = device.telemetry.find(({ id }) => id === propertyId);

            telemetry[field] = value;

            break;
        }
        case UPDATE_DEVICE_OPTION_ATTRIBUTE: {
            const {
                field,
                value,
                propertyId,
                deviceId
            } = action;
            const device = draft.devices[deviceId];
            const option = device.options.find(({ id }) => id === propertyId);

            option[field] = value;

            break;
        }
        case UPDATE_NODE_TELEMETRY_ATTRIBUTE: {
            const {
                field,
                value,
                nodeId,
                deviceId,
                propertyId
            } = action;
            const device = draft.devices[deviceId];
            const node = device.nodes.find(({ id }) => id === nodeId);
            const telemetry = node.telemetry.find(({ id }) => id === propertyId);

            telemetry[field] = value;

            break;
        }
        case UPDATE_NODE_OPTION_ATTRIBUTE: {
            const {
                field,
                value,
                nodeId,
                deviceId,
                propertyId
            } = action;
            const device = draft.devices[deviceId];
            const node = device.nodes.find(({ id }) => id === nodeId);
            const option = node.options.find(({ id }) => id === propertyId);

            option[field] = value;

            break;
        }

        case CHANGE_ATRIBUTE_PROCESSING_STATUS: {
            const {
                propertyType,
                hardwareType,
                nodeId,
                deviceId,
                propertyId,
                field,
                prcessingStatus
            } = action;
            const device     = draft.devices[deviceId];
            const thresholds = draft.thresholds;
            let propertyToProcess;


            if (hardwareType === 'threshold') {
                propertyToProcess = thresholds[nodeId].find(({ id }) => id === propertyId);
            } else {
                const hardwareToProcess = hardwareType === 'node'
                    ? device.nodes.find(({ id }) => id === nodeId)
                    : device;

                propertyToProcess = propertyType === 'settings'
                    ? hardwareToProcess
                    : hardwareToProcess[propertyType].find(({ id }) => id === propertyId);
            }

            const processingField = PROCESSING_FIELDS[field];

            propertyToProcess[processingField] = prcessingStatus;

            break;
        }
        case REMOVE_ATTRIBUTE_ERROR: {
            const {
                propertyType,
                hardwareType,
                nodeId,
                deviceId,
                propertyId,
                field
            } = action;
            const device =  draft?.devices?.[deviceId];
            const thresholds = draft?.thresholds;
            let property;

            if (hardwareType === 'threshold') {
                property = thresholds?.[nodeId]?.find(({ id }) => id === propertyId);
            } else {
                const hardwareToProcess = hardwareType === 'node'
                    ? device?.nodes?.find(({ id }) => id === nodeId)
                    : device;

                property = propertyType === 'settings'
                    ? hardwareToProcess
                    : hardwareToProcess?.[propertyType]?.find(({ id }) => id === propertyId);
            }

            const errorField = ERRORS_FIELDS[field];

            property[errorField] = {
                isExist : false
            };

            break;
        }


        case ADD_ATTRIBUTE_ERROR: {
            const { deviceId, nodeId, propertyId, hardwareType, propertyType, field, value } = action.error;
            const device =  draft.devices[deviceId];
            const thresholds = draft.thresholds;
            let property;

            if (hardwareType === 'threshold') {
                property = thresholds[nodeId].find(({ id }) => id === propertyId);
            } else {
                const hardwareToProcess = hardwareType === 'node'
                    ? device.nodes.find(({ id }) => id === nodeId)
                    : device;

                property =  propertyType === 'settings'
                    ? hardwareToProcess
                    : hardwareToProcess[propertyType].find(({ id }) => id === propertyId);
            }

            const processingField = PROCESSING_FIELDS[field];
            const errorField = ERRORS_FIELDS[field];

            property[processingField] = false;
            property[errorField] = {
                value,
                isExist : true
            };
            break;
        }
        case GET_THRESHOLDS: {
            draft.thresholds = action.thresholds;
            draft.isTresholdFetching = false;
            break;
        }
        case SET_THRESHOLD_PROCESSING: {
            const { id } = action;

            draft.events.push({
                type        : 'PROCESSING',
                thresholdId : id
            });

            break;
        }
        case UPDATE_THRESHOLD: {
            const { scenarioId, thresholdId, field, value } = action;
            const threshold = draft.thresholds[scenarioId].find(thr => thr.id === thresholdId);

            threshold[field] = value;
            break;
        }
        case HANDLE_DEVICE_DELETE: {
            const { deviceId } = action;

            delete draft.devices[deviceId];

            break;
        }
        case HANDLE_SCENARIO_DELETE: {
            const { scenarioId } = action;

            delete draft.scenarios[scenarioId];

            break;
        }
        case HANDLE_NODE_DELETE: {
            const { deviceId, nodeId } = action;
            const device = draft.devices[deviceId];
            const { nodes } = device;

            device.nodes = nodes.filter(node => node.id !== nodeId);

            break;
        }
        case HANDLE_THRESHOLD_DELETE: {
            const { scenarioId, thresholdId } = action;
            const thresholds = draft.thresholds[scenarioId] || [];
            const filtered = thresholds.filter(th => th.id !== thresholdId);

            draft.thresholds[scenarioId] = filtered;
            break;
        }
        case UPDATE_HOMIE_STATE: {
            const { updateSchema } = action.payload;

            for (const deviceId of Object.keys(updateSchema.devices)) {
                if (updateSchema.devices.hasOwnProperty(deviceId)) {
                    const draftDevice = draft.devices[deviceId];
                    const patchDevice = updateSchema.devices[deviceId];

                    if (draftDevice) {
                        const {
                            nodes     : patchNodes,
                            options   : patchOptions,
                            telemetry : patchTelemetries,
                            ...patchDeviceAttributes
                        } = patchDevice;

                        Object.assign(draftDevice, patchDeviceAttributes);

                        patchSubjectArray(draftDevice, patchOptions, 'options');
                        patchSubjectArray(draftDevice, patchTelemetries, 'telemetry');

                        patchNodesArray(draftDevice, patchNodes);
                    } else {
                        draft.devices[deviceId] = patchDevice;
                    }
                }
            }

            for (const scenarioId of Object.keys(updateSchema?.scenarios || {})) {
                if (updateSchema.scenarios.hasOwnProperty(scenarioId)) {
                    const draftScenario = draft.scenarios[scenarioId];
                    const patchScenario = updateSchema.scenarios[scenarioId];

                    if (draftScenario) {
                        draft.scenarios[scenarioId] = {
                            ...(draftScenario || {}),
                            ...(patchScenario || {})
                        };
                    } else {
                        draft.scenarios[scenarioId] = patchScenario;
                    }
                }
            }

            for (const scenarioId of Object.keys(updateSchema.thresholds)) {
                if (updateSchema.thresholds.hasOwnProperty(scenarioId)) {
                    const patchScenarioThresholds = updateSchema.thresholds[scenarioId];

                    patchSubjectArray(draft.thresholds, patchScenarioThresholds, scenarioId);
                }
            }

            if (draft.events.length) {
                draft.events = draft.events.filter(event => {
                    const key = event.deviceId === 'threshold'
                        ? event.propertyId
                        : `${event.deviceId}:${event.nodeId}:${event.propertyId}`;

                    return !updateSchema.eventsToRemove.has(key);
                });
            }

            // Hotfix
            pruneDevices(draft.devices);

            break;
        }
        default:
            break;
    }
}, initialState);

function patchSubjectArray(draftSubject, patchArray, propertyType) {
    if (!patchArray?.length) return;

    for (const patchProperty of patchArray) {
        if (!draftSubject[propertyType]) draftSubject[propertyType] = [];

        const draftSubjectProperty = draftSubject[propertyType].find(({ id }) => id === patchProperty.id);

        if (draftSubjectProperty) {
            Object.assign(draftSubjectProperty, patchProperty);
        } else {
            draftSubject[propertyType].push(patchProperty);
        }
    }
}

function patchNodesArray(draftDevice, patchNodes) {
    if (!patchNodes?.length) return;

    for (const patchNode of patchNodes) {
        if (!draftDevice.nodes) draftDevice.nodes = [];

        const draftNode = draftDevice.nodes.find(({ id }) => id === patchNode.id);

        if (draftNode) {
            const {
                sensors   : patchNodeSensors,
                options   : patchNodeOptions,
                telemetry : patchNodeTelemetries,
                ...patchNodeAttributes
            } = patchNode;

            Object.assign(draftNode, patchNodeAttributes);

            patchSubjectArray(draftNode, patchNodeSensors, 'sensors');
            patchSubjectArray(draftNode, patchNodeOptions, 'options');
            patchSubjectArray(draftNode, patchNodeTelemetries, 'telemetry');
        } else {
            draftDevice.nodes.push(patchNode);
        }
    }
}

// Remove devices without id property
function pruneDevices(draftDevices) {
    for (const key of Object.keys(draftDevices)) {
        if (draftDevices.hasOwnProperty(key)) {
            const device = draftDevices[key];

            if (!device.id) {
                delete draftDevices[key];
            }
        }
    }
}
