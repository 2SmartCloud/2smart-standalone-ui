/* eslint-disable no-cond-assign */
import config                              from '../../config';
import smartHome                           from '../smartHome/smartHomeSingleton';
import store                               from '../store';
import {
    PROCESSING_FIELDS,
    GET_ATTRIBUTE_TYPE_BY_HARDWARE
}                                          from '../assets/constants/homie';

import { attributeDispatcher }             from '../utils/homie/dispatcherSingleton';
import { getPropertyByType }               from '../utils/homie/getPropertyByType';
import { mapScenarioHomie }                from '../utils/mapper/homie';
import {
    getHomieErrorMessage,
    HOMIE_ERROR_MAP
}                                          from '../utils/homie/errors';
import EventCache                          from '../utils/homie/EventCache';
import { getInstanceByTopic }              from '../utils/homie/getEntities';
import {
    callValErrNotification,
    hideValErrToastNotification
}                                          from './interface';
import { runTimeseriesResolve }            from './client/timeseries';
import { onDeleteBridgeEntity }            from './userServices';
import {
    onDeleteGroupEntity,
    startGroupValueProcessing,
    setGroupValueError,
    removeGroupValueError
}                                          from './groups';
import { onDeleteAliasEntity }             from './alias';
import { onDeleteUserNotificationChannel } from './notificationChannels';
import {
    EXTENSION_ENTITY_TYPE,
    onExtensionDelete
}                                          from './extensions';
import {
    DISCOVERY_ENTITY_TYPE,
    onDiscoveryDelete
}                                          from './discovery';
import {
    NOTIFICATION_ENTITY_TYPE,
    onNotificationDelete
}                                          from './notifications';

export const GET_DEVICES                       = 'GET_DEVICES';
export const GET_SCENARIOS_HOMIE               = 'GET_SCENARIOS_HOMIE';
export const UPDATE_DEVICE_ATTRIBUTE           = 'UPDATE_DEVICE_ATTRIBUTE';
export const UPDATE_SENSOR_ATTRIBUTE           = 'UPDATE_SENSOR_ATTRIBUTE';
export const UPDATE_NODE_ATTRIBUTE             = 'UPDATE_NODE_ATTRIBUTE';
export const UPDATE_DEVICE_TELEMETRY_ATTRIBUTE = 'UPDATE_DEVICE_TELEMETRY_ATTRIBUTE';
export const UPDATE_DEVICE_OPTION_ATTRIBUTE    = 'UPDATE_DEVICE_OPTION_ATTRIBUTE';
export const UPDATE_NODE_TELEMETRY_ATTRIBUTE   = 'UPDATE_NODE_TELEMETRY_ATTRIBUTE';
export const UPDATE_NODE_OPTION_ATTRIBUTE      = 'UPDATE_NODE_OPTION_ATTRIBUTE';
export const ADD_ATTRIBUTE_ERROR               = 'ADD_ATTRIBUTE_ERROR';
export const REMOVE_EVENT                      = 'REMOVE_EVENT';
export const GET_THRESHOLDS                    = 'GET_THRESHOLDS';
export const UPDATE_THRESHOLD                  = 'UPDATE_THRESHOLD';
export const SET_THRESHOLD_PROCESSING          = 'SET_THRESHOLD_PROCESSING';
export const HANDLE_DEVICE_DELETE              = 'HANDLE_DEVICE_DELETE';
export const HANDLE_NODE_DELETE                = 'HANDLE_NODE_DELETE';
export const HANDLE_THRESHOLD_DELETE           = 'HANDLE_THRESHOLD_DELETE';
export const UPDATE_GROUP                      = 'UPDATE_GROUP';
export const UPDATE_HOMIE_STATE                = 'UPDATE_HOMIE_STATE';
export const REMOVE_ATTRIBUTE_ERROR            = 'REMOVE_ATTRIBUTE_ERROR';

export const CHANGE_ATRIBUTE_PROCESSING_STATUS = 'CHANGE_ATRIBUTE_PROCESSING_STATUS';

const updateAttributeMethods = {
    'DEVICE_OPTION'       : updateDeviceOptionAttribute,
    'DEVICE_TELEMETRY'    : updateDeviceTelemetryAttribute,
    'NODE_OPTION'         : updateNodeOptionAttribute,
    'NODE_TELEMETRY'      : updateNodeTelemetryAttribute,
    'SENSOR'              : updateSensorAttribute,
    'GROUP_OF_PROPERTIES' : updateGroupAttribute,
    'THRESHOLD'           : updateThresholdAttribute
};

const ERROR_MESSAGES_WITH_NO_TOASTS = [
    'Error with sending test message'
];

export const eventCache = new EventCache({
    debounceTime : 100,
    cacheSize    : +config.mqttCacheLimit,
    handler      : updateSchema => store.dispatch(updateHomieState(updateSchema))
});

export function getThresholds() {
    return async dispatch => {
        const thresholds = await smartHome.getThresholds();
        const serializedThresholds = {};

        for (const scenarioId in thresholds) {
            if (thresholds.hasOwnProperty(scenarioId)) {
                const scenarioThresholds = thresholds[scenarioId];

                for (const threshold of scenarioThresholds) {
                    threshold.onAttributePublish(handlePublishEvent);
                    // threshold.onErrorPublish(handleErrorPublish);

                    if (!serializedThresholds[scenarioId]) serializedThresholds[scenarioId] = [];

                    serializedThresholds[scenarioId].push(threshold.serialize());
                }
            }
        }

        dispatch({
            type       : GET_THRESHOLDS,
            thresholds : serializedThresholds
        });
    };
}

export function getDevices() {
    return async dispatch => {
        try {
            const devices = await smartHome.getDevices();
            const serializedDevices = {};

            for (const key in devices) {
                if (devices.hasOwnProperty(key)) {
                    const device = devices[key];

                    device.onAttributePublish(handlePublishEvent);
                    // device.onErrorPublish(handleErrorPublish);
                    serializedDevices[key] = device.serialize();
                }
            }
            dispatch({
                type    : GET_DEVICES,
                payload : serializedDevices
            });
            runTimeseriesResolve();
        } catch (error) {
            console.log(error);
        }
    };
}

export function getScenariosHomie() {
    return async dispatch => {
        const entities = await smartHome.getScenarios();
        const serializedEntities = {};

        for (const key in entities) {
            if (entities.hasOwnProperty(key)) {
                const entity = entities[key];

                entity.onAttributePublish(handlePublishEvent);
                entity.onErrorPublish(params => dispatch(handleAttributeError(params)));

                serializedEntities[key] = mapScenarioHomie(entity.serialize());
            }
        }

        dispatch({
            type    : GET_SCENARIOS_HOMIE,
            payload : serializedEntities
        });
    };
}

export function updateScenarioState(scenarioTopic, isActive) {
    return async () => {
        const scenario = getInstanceByTopic(scenarioTopic);
        const field = 'state';
        const processingField =  PROCESSING_FIELDS[field];

        eventCache.push({
            type : 'UPDATE_EVENT',
            data : { type: 'SCENARIO', field: processingField, value: true, scenarioId: scenario?.id }
        });

        scenario.setAttribute('state', isActive);
    };
}

export function handlePublishEvent(params) {
    const { field, value, type = '', device = null, node = null, property = null, threshold = null, scenario } = params;
    let deviceId;
    let nodeId = null;
    let propertyId = null;
    let scenarioId = null;

    switch (type) {     // eslint-disable-line default-case
        case 'DEVICE':
            deviceId = device.getId();
            break;
        case 'SCENARIO':
            scenarioId = scenario?.id;
            break;
        case 'NODE':
            deviceId = device.getId();
            nodeId = node.getId();
            break;
        case 'DEVICE_TELEMETRY':
        case 'DEVICE_OPTION':
        case 'NODE_SETTING':
            deviceId = device.getId();
            propertyId = property.getId();
            break;
        case 'SENSOR':
        case 'NODE_TELEMETRY':
        case 'NODE_OPTION':
            deviceId = device.getId();
            nodeId = node.getId();
            propertyId = property.getId();
            break;
        case 'THRESHOLD': {
            const thresholdId = threshold.getId();

            deviceId = 'threshold';
            nodeId     = threshold.getScenarioId();
            propertyId = thresholdId;
            break;
        }
    }

    eventCache.push({
        type : 'UPDATE_EVENT',
        data : { field, value, type, deviceId, nodeId, propertyId, scenarioId }
    });

    // if (
    //     (property && property.retained === 'false') ||
    //     (threshold && threshold.retained === 'false')
    // ) {
    //     setTimeout(() => eventCache.push({
    //         type : 'UPDATE_EVENT',
    //         data : { field, value: '', type, deviceId, nodeId, propertyId }
    //     }), 1000);
    // }

    const processingField =  PROCESSING_FIELDS[field];

    eventCache.push({
        type : 'UPDATE_EVENT',
        data : { field: processingField, value: false, type, deviceId, nodeId, propertyId, scenarioId }
    });
}


export function handlePublishError({
    code,
    message,
    fields,
    entityId = null,
    deviceId = null,
    nodeId = null,
    propertyId = null
}) {
    return dispatch => {
        const hasFields = fields && Object.keys(fields).length;

        if (ERROR_MESSAGES_WITH_NO_TOASTS.includes(message)) return;

        if (code !== HOMIE_ERROR_MAP.VALIDATION || (code === HOMIE_ERROR_MAP.VALIDATION && !hasFields)) {
            const errorNotificationMeta = entityId ? { entityId, code, message } : { deviceId, nodeId, propertyId };

            dispatch(callValErrNotification({
                meta    : errorNotificationMeta,
                title   : code ? getHomieErrorMessage(code) : 'Unknown error',
                message : message || 'Something went wrong. Please try again later.'
            }));
        }
    };
}
export function handleAttributeError({
    hardwareType,
    propertyType,
    code,
    message,
    fields,
    field,
    deviceId = null,
    nodeId = null,
    propertyId = null,
    type,
    scenario
}) {
    return (dispatch) => {
        const scenarioId = scenario?.id;

        if (type === 'SCENARIO' && field === 'state') {
            const processingField =  PROCESSING_FIELDS[field];

            eventCache.push({
                type : 'UPDATE_EVENT',
                data : { type: 'SCENARIO', field: processingField, value: false, scenarioId }
            });
        } else if (hardwareType === 'group') {
            dispatch(setGroupValueError(deviceId, { code, message, fields }));
        } else {
            dispatch({
                type  : ADD_ATTRIBUTE_ERROR,
                error : {
                    value : message,
                    hardwareType,
                    propertyType,
                    propertyId,
                    deviceId,
                    nodeId,
                    field
                }
            });
        }

        dispatch(handlePublishError({ code, message, fields, deviceId, nodeId, propertyId, scenarioId }));
    };
}

export function removeWidgetError(params) {
    return dispatch => {
        const { hardwareType, propertyType, deviceId, nodeId = null, propertyId = null, field = 'value' } = params;

        if (propertyType === 'scenario') {
            return;
        } else if (hardwareType === 'group') {
            dispatch(removeGroupValueError(deviceId));
        } else {
            dispatch(removeAttributeError({
                propertyType,
                hardwareType,
                nodeId,
                deviceId,
                propertyId,
                field
            }));
        }
    };
}

export function removeAttributeError({ hardwareType, propertyType, deviceId, nodeId = null, propertyId = null, field = 'value' }) {
    return dispatch => {
        dispatch({
            type : REMOVE_ATTRIBUTE_ERROR,
            propertyType,
            hardwareType,
            nodeId,
            deviceId,
            propertyId,
            field
        });
    };
}

export function removeAttributeErrorAndHideToast({ hardwareType, propertyType, deviceId, nodeId = null, propertyId = null, field = 'value' }) {
    return (dispatch, getState) => {
        dispatch(removeAttributeError({ hardwareType, propertyType, deviceId, nodeId, propertyId, field  }));

        const toasts = getState().applicationInterface.activeToasts;
        const toast = toasts.find(({ meta: tMeta }) => {
            return tMeta.deviceId === deviceId && tMeta.nodeId === nodeId && tMeta.propertyId === propertyId;
        });

        if (!toast) return;

        dispatch(hideValErrToastNotification({ meta: toast.meta }));
    };
}

// eslint-disable-next-line
export function setAsyncAttributeDispatcher({ hardwareType, propertyType, deviceId, nodeId = null, propertyId = null, type, field = 'value', value, isRetained = true }) {
    return async dispatch => {
        try {
            if (hardwareType === 'group') {
                dispatch(startGroupValueProcessing(deviceId));
            } else {
                dispatch(startAttributeProcessing({
                    hardwareType,
                    propertyType,
                    deviceId,
                    nodeId,
                    propertyId,
                    field
                }));
            }
            const attributeType = type || GET_ATTRIBUTE_TYPE_BY_HARDWARE[hardwareType][propertyType][field];

            await attributeDispatcher.setAsyncAttribute({
                hardwareType,
                propertyType,
                deviceId,
                nodeId,
                propertyId,
                field,
                value,
                type : attributeType
            });

            // if (!isRetained) {
            //     eventCache.push({
            //         type : 'UPDATE_EVENT',
            //         data : { field, value: '', type: attributeType, deviceId, nodeId, propertyId }
            //     });
            // }
        } catch (err) {
            dispatch(handleAttributeError({
                ...err,
                hardwareType,
                propertyType,
                field,
                deviceId,
                nodeId,
                propertyId
            }));
        }
    };
}

function startAttributeProcessing({   hardwareType, propertyType, deviceId, nodeId = null, propertyId = null, field = 'value' }) {
    return {
        type            : CHANGE_ATRIBUTE_PROCESSING_STATUS,
        hardwareType,
        propertyType,
        deviceId,
        nodeId,
        propertyId,
        field,
        prcessingStatus : true
    };
}


export function updateAttributeDispatcher({ type, params }) {
    return dispatch => {
        const method = updateAttributeMethods[type];

        dispatch(method({ ...params }));
        dispatch({
            type : REMOVE_EVENT,
            ...params
        });
    };
}

export function updateGroupAttribute({ deviceId, field, value }) {
    return dispatch => {
        dispatch({
            type    : UPDATE_GROUP,
            payload : {
                id : deviceId,
                field,
                value

            }
        });
    };
}

export function updateThresholdAttribute({ nodeId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type        : UPDATE_THRESHOLD,
            scenarioId  : nodeId,
            thresholdId : propertyId,
            field,
            value
        });
    };
}

export function updateSensorAttribute({ deviceId, nodeId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type : UPDATE_SENSOR_ATTRIBUTE,
            deviceId,
            nodeId,
            propertyId,
            field,
            value
        });
    };
}

export function updateNodeTelemetryAttribute({ deviceId, nodeId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type : UPDATE_NODE_TELEMETRY_ATTRIBUTE,
            deviceId,
            nodeId,
            propertyId,
            field,
            value
        });
    };
}

export function updateNodeOptionAttribute({ deviceId, nodeId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type : UPDATE_NODE_OPTION_ATTRIBUTE,
            deviceId,
            nodeId,
            propertyId,
            field,
            value
        });
    };
}

export function updateDeviceTelemetryAttribute({ deviceId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type : UPDATE_DEVICE_TELEMETRY_ATTRIBUTE,
            deviceId,
            propertyId,
            field,
            value
        });
    };
}

export function updateDeviceOptionAttribute({ deviceId, propertyId, field, value }) {
    return dispatch => {
        dispatch({
            type : UPDATE_DEVICE_OPTION_ATTRIBUTE,
            deviceId,
            propertyId,
            field,
            value
        });
    };
}

export function setDeviceName(id, name) {
    return dispatch => {
        dispatch(setAsyncAttributeDispatcher({
            hardwareType : 'device',
            propertyType : 'settings',
            deviceId     : id,
            value        : name,
            field        : 'title'
        }));
    };
}


export function setNodeName(deviceId, nodeId, name) {
    return dispatch => {
        dispatch(setAsyncAttributeDispatcher({
            hardwareType : 'node',
            propertyType : 'settings',
            deviceId,
            nodeId,
            value        : name,
            field        : 'title'
        }));
    };
}

export function deleteHardware(hardwareType, deviceId, nodeId) {
    return dispatch => {
        switch (hardwareType) {
            case 'device':
                dispatch(deleteDevice(deviceId));
                break;
            case 'node':
                dispatch(deleteNode(deviceId, nodeId));
                break;
            default:
                break;
        }
    };
}

export function deleteDevice(deviceId) {
    return () => {
        const device = smartHome.getDeviceById(deviceId);

        device.deleteRequest();
    };
}

export function deleteNode(deviceId, nodeId) {
    return () => {
        const device = smartHome.getDeviceById(deviceId);
        const node = device.getNodeById(nodeId);

        node.deleteRequest();
    };
}

export function handleHardwareDelete({ type, deviceId, nodeId, entityId, scenarioId, thresholdId }) {
    return dispatch => {
        switch (type) {
            case 'DEVICE':
                dispatch(handleDeviceDelete(deviceId));
                break;

            case 'NODE':
                dispatch(handleNodeDelete(deviceId, nodeId));
                break;

            case 'BRIDGE':
                dispatch(onDeleteBridgeEntity(entityId));
                break;

            case 'GROUP_OF_PROPERTIES':
                dispatch(onDeleteGroupEntity(entityId));
                break;

            case 'TOPICS_ALIASES':
                dispatch(onDeleteAliasEntity(entityId));
                break;

            case 'THRESHOLD':
                dispatch({
                    type : HANDLE_THRESHOLD_DELETE,
                    scenarioId,
                    thresholdId
                });
                break;

            case 'NOTIFICATION_CHANNELS':
                dispatch(onDeleteUserNotificationChannel(entityId));
                break;
            case EXTENSION_ENTITY_TYPE:
                dispatch(onExtensionDelete(entityId));
                break;

            case DISCOVERY_ENTITY_TYPE:
                dispatch(onDiscoveryDelete({ id: entityId }));
                break;

            case NOTIFICATION_ENTITY_TYPE:
                dispatch(onNotificationDelete(entityId));
                break;
            case 'SCENARIO':
                dispatch(handleScenarioDelete(scenarioId));
                break;
            default:
                break;
        }
    };
}

export function handleDeviceDelete(deviceId) {
    eventCache.push({
        type : 'DELETE_EVENT',
        data : { type: 'DEVICE', deviceId }
    });

    return dispatch => {
        dispatch({
            type : HANDLE_DEVICE_DELETE,
            deviceId
        });
    };
}

export const HANDLE_SCENARIO_DELETE = 'HANDLE_SCENARIO_DELETE';

export function handleScenarioDelete(scenarioId) {
    eventCache.push({
        type : 'DELETE_EVENT',
        data : { type: 'SCENARIO', scenarioId }
    });

    return dispatch => {
        dispatch({
            type : HANDLE_SCENARIO_DELETE,
            scenarioId
        });
    };
}


export function handleNodeDelete(deviceId, nodeId) {
    eventCache.push({
        type : 'DELETE_EVENT',
        data : { type: 'NODE', deviceId, nodeId }
    });

    return dispatch => {
        dispatch({
            type : HANDLE_NODE_DELETE,
            deviceId,
            nodeId
        });
    };
}


export function handleNotificationChannelDelete(deviceId, nodeId) {
    return dispatch => {
        dispatch({
            type : HANDLE_NODE_DELETE,
            deviceId,
            nodeId
        });
    };
}


export function attachGroup(deviceId, nodeId, propertyId, groupId, propertyType, hardwareType) {
    return async dispatch => {
        try {
            if (hardwareType === 'threshold') {
                const threshold = smartHome.getThresholdById(nodeId, propertyId);

                await threshold.addGroupRequest(groupId);
            } else {
                const device = smartHome.getDeviceById(deviceId);
                const hardWareEntity =  hardwareType === 'device' ? device : device.getNodeById(nodeId);
                const sensor = getPropertyByType(hardWareEntity, propertyType, propertyId);

                await sensor.addGroupRequest(groupId);
            }
        } catch (error) {
            dispatch(handlePublishError(error));
            throw error;
        }
    };
}

export function unAttachGroup(deviceId, nodeId, propertyId, groupId, propertyType, hardwareType) {
    return async dispatch => {
        try {
            if (hardwareType === 'threshold') {
                const threshold = smartHome.getThresholdById(nodeId, propertyId);

                await threshold.deleteGroupRequest(groupId);
            } else {
                const device = smartHome.getDeviceById(deviceId);
                const hardWareEntity =  hardwareType === 'device' ? device : device.getNodeById(nodeId);
                const sensor = getPropertyByType(hardWareEntity, propertyType, propertyId);

                await sensor.deleteGroupRequest(groupId);
            }
        } catch (error) {
            dispatch(handlePublishError(error));
            throw error;
        }
    };
}

function updateHomieState(updateSchema) {
    // console.log('### Update homie state', updateSchema);
    return dispatch => {
        dispatch({
            type    : UPDATE_HOMIE_STATE,
            payload : { updateSchema }
        });
    };
}


/*
export function handleErrorPublish({ type,   value, device = null, node = null, property = null, threshold, field }) {
    return (dispatch) => {
        let deviceId;
        let nodeId = null;
        let propertyId = null;
        const { hardwareType, propertyType } = GET_HARDWARE_TYPE_BY_ATTRIBUTE[type];

        switch (type) {
            case 'DEVICE': {
                deviceId = device.getId();
                break;
            }
            case 'NODE': {
                const _device = node.getDevice();

                nodeId = node.getId();
                deviceId = _device.getId();
                break;
            }
            case 'NODE_OPTION':
            case 'NODE_TELEMETRY': {
                const _device = node.getDevice();

                nodeId = node.getId();
                deviceId = _device.getId();
                propertyId = property.getId();
                break;
            }
            case 'DEVICE_OPTION':
            case 'DEVICE_TELEMETRY': {
                deviceId = device.getId();
                propertyId = property.getId();
                break;
            }
            case 'THRESHOLD': {
                const scenarioId = threshold.getScenarioId();
                const thresholdId = threshold.getId();

                deviceId = 'threshold';
                nodeId     = scenarioId;
                propertyId = thresholdId;
                break;
            }
            case 'SENSOR': {
                const _node =  property.getNode();

                deviceId = property.getDevice().getId();
                nodeId = _node.getId();
                propertyId = property.getId();
                break;
            }
            default:
                break;
        }

        dispatch(handleAttributeError({
            code    : value.code,
            message : value.message,
            fields  : value.fields,
            field,
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId }));
    };
}
 */

export function getIDsByTopic(topic) {
    return () => {
        const ids = {
            deviceId     : undefined,
            nodeId       : undefined,
            propertyId   : undefined,
            propertyType : undefined,
            hardwareType : undefined,
            dataType     : undefined,
            scenarioId   : undefined
        };

        try {
            const { instance, type } = smartHome.getInstanceByTopic(topic) || {};

            ids.dataType = instance?.dataType;

            switch (type) {     // eslint-disable-line default-case
                case 'DEVICE':
                    ids.deviceId = instance?.id;
                    break;
                case 'NODE':
                    ids.deviceId = instance?.device?.id;
                    ids.nodeId   = instance?.id;
                    break;
                case 'DEVICE_TELEMETRY':
                case 'DEVICE_OPTION':
                    ids.deviceId   = instance?.device?.id;
                    ids.propertyId = instance?.id;
                    ids.hardwareType = 'device';
                    break;
                case 'SENSOR':
                case 'NODE_TELEMETRY':
                case 'NODE_OPTION':
                    ids.deviceId   = instance?.device?.id;
                    ids.nodeId     = instance?.node?.id;
                    ids.propertyId = instance?.id;
                    ids.hardwareType = 'node';
                    break;
                case 'THRESHOLD':
                    ids.deviceId   = 'threshold';
                    ids.nodeId     = instance?.scenarioId;
                    ids.propertyId = instance?.id;
                    ids.hardwareType = 'threshold';
                    ids.propertyType = 'threshold';
                    break;
                case 'GROUP_OF_PROPERTIES':
                    ids.deviceId  = instance?.id;
                    ids.hardwareType = 'group';
                    ids.propertyType = 'group';
                    break;
                case 'SCENARIO':
                    ids.scenarioId = instance?.id;
                    ids.propertyType = 'scenario';
                    break;
            }

            switch (type) {     // eslint-disable-line default-case
                case 'SENSOR':
                    ids.propertyType = 'sensors';
                    break;
                case 'DEVICE_TELEMETRY':
                case 'NODE_TELEMETRY':
                    ids.propertyType = 'telemetry';
                    break;
                case 'DEVICE_OPTION':
                case 'NODE_OPTION':
                    ids.propertyType = 'options';
                    break;
            }

            ids.type = type;
            // ids.propertyType = type;
        } catch (error) {
            console.log(`Get instance by topic ("${topic}") error: `, error);
        }

        return ids;
    };
}
