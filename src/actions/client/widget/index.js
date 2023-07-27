import tsManager                     from '../../../timeseries/Manager';
import { mapWidget }                 from '../../../utils/mapper/widget';
import { dumpWidget }                from '../../../utils/dump/widget';
import {
    THERMOSTAT_DEFAULT_STEP_INT,
    THERMOSTAT_DEFAULT_STEP_FLOAT,
    WIDGETS_MAP
}                                    from '../../../assets/constants/widget';
import api                           from '../../../apiSingleton';
import history                       from '../../../history';
import { NOT_FOUND }                 from '../../../assets/constants/routes';
import store                         from '../../../store';
import { getIDsByTopic }             from '../../../actions/homie';
import meta                          from '../../../components/base/toast/meta';
import { hideToastNotification }     from '../../interface';
import { serializeWidgetData }       from '../timeseries';
import { removeClientPanelAccess }   from '../../user';
import { mapGroupsToEntities }   from '../../../utils/mapper/groups';
import {
    checkIsValueDeleted,
    getSortedOptionsByTitle
}                                    from '../../../utils/getSelectOpions';
import { getTopicsListWithAliases }  from '../../../utils/homie/getTopics';
import { getInstanceByTopic }        from '../../../utils/homie/getEntities';

import { sortWidgetTypesByPriority } from '../../../utils/sort';

export const SET_WIDGET_OPTION = 'SET_WIDGET_OPTION';
export const SET_WIDGET_ADVANCED_OPTIONS = 'SET_WIDGET_ADVANCED_OPTIONS';
export const GET_TOPICS_BY_DATA_TYPE = 'GET_TOPICS_BY_DATA_TYPE';
export const CREATING_NEW_WIDGET = 'CREATING_NEW_WIDGET';
export const CREATE_NEW_WIDGET = 'CREATE_NEW_WIDGET';
export const ERROR_FETCHING_CREATE_WIDGET = 'ERROR_FETCHING_CREATE_WIDGET';
export const DELETING_WIDGET = 'DELETING_WIDGET';
export const DELETE_WIDGET = 'DELETE_WIDGET';
export const ERROR_FETCHING_DELETE_WIDGET = 'ERROR_FETCHING_DELETE_WIDGET';
export const DELETE_WIDGET_FROM_SCREEN = 'DELETE_WIDGET_FROM_SCREEN';
export const UPDATING_WIDGET = 'UPDATING_WIDGET';
export const ERROR_FETCHING_UPDATE_WIDGET = 'ERROR_FETCHING_UPDATE_WIDGET';
export const CLEAR_WIDGET_VALUE_STATE = 'CLEAR_WIDGET_VALUE_STATE';
export const UPDATE_WIDGET = 'UPDATE_WIDGET';
export const FINISH_FETCHING = 'FINISH_FETCHING';
export const SELECT_TOPIC = 'SELECT_TOPIC';
export const SELECT_GROUP = 'SELECT_GROUP';
export const SELECT_WIDGET = 'SELECT_WIDGET';
export const CHANGE_WIDGET_NAME = 'CHANGE_WIDGET_NAME';
export const CHANGE_WIDGET_COLOR = 'CHANGE_WIDGET_COLOR';
export const SET_ERRORS = 'SET_ERRORS';
export const CHANGE_TAB = 'CHANGE_TAB';
export const CHANGE_ACTIVE_VALUE = 'CHANGE_ACTIVE_VALUE';
export const GET_WIDGET_GROUPS = 'GET_WIDGET_GROUPS';
export const ADD_TOPICS_TO_MULTI_WIDGET = 'ADD_TOPICS_TO_MULTI_WIDGET';
export const DELETE_TOPIC_FROM_MULTI_WIDGET = 'DELETE_TOPIC_FROM_MULTI_WIDGET';
export const CHANGE_TOPICS_ORDER = 'CHANGE_TOPICS_ORDER';
export const SET_TOPIC_BY_KEY_TO_MULTI_WIDGET = 'SET_TOPIC_BY_KEY_TO_MULTI_WIDGET';

export function setWidgetOption({ key, value, isAdvanced = false }) {
    return dispatch => {
        dispatch({
            type : SET_WIDGET_OPTION,
            key,
            value,
            isAdvanced
        });
    };
}


export function setWidgetAdvancedOptions(advanced) {
    return {
        type : SET_WIDGET_ADVANCED_OPTIONS,
        advanced
    };
}

export function getTopicsByDataType(dataType) {
    return (dispatch, getState) => {
        const widgetParams = WIDGETS_MAP[dataType];

        let topics = [];
        const state = getState();
        const { devices, thresholds, scenarios } = state.homie;
        const { list:aliasList } = state.aliases;

        Object.values(devices).forEach(device => {
            const { id } = device;
            const isDeviceActive = device.state === 'ready';

            topics = topics.concat(filterByDataType(id, null, dataType, device.telemetry, 'device', 'telemetry', isDeviceActive));
            topics = topics.concat(filterByDataType(id, null, dataType, device.options, 'device', 'options', isDeviceActive));

            device.nodes.forEach(node => {
                const nodeId = node.id;
                const isNodeActive = node.state === 'ready' && isDeviceActive;

                topics = topics.concat(filterByDataType(id, nodeId, dataType, node.telemetry, 'node', 'telemetry', isNodeActive));
                topics = topics.concat(filterByDataType(id, nodeId, dataType, node.options, 'node', 'options', isNodeActive));
                topics = topics.concat(filterByDataType(id, nodeId, dataType, node.sensors, 'node', 'sensors', isNodeActive));
            });
        });

        for (const scenarioId in thresholds) {
            if (thresholds.hasOwnProperty(scenarioId)) {
                const scenarioThresholds = thresholds[scenarioId];

                topics = topics.concat(filterByDataType('threshold', scenarioId, dataType, scenarioThresholds, 'threshold', 'threshold', true));
            }
        }

        for (const scenarioId in scenarios) {
            if (scenarios.hasOwnProperty(scenarioId)) {
                const scenario = scenarios[scenarioId];

                scenario.dataType = 'boolean';
                scenario.settable = 'true';

                topics = topics.concat(filterByDataType('scenario', scenarioId, dataType, [ scenario ], 'scenario', 'scenario', true));
            }
        }

        const sortedTopics = getSortedOptionsByTitle(topics);
        const topicsWithAliases = getTopicsListWithAliases({ topicsList: sortedTopics, aliasList });

        dispatch({
            type   : GET_TOPICS_BY_DATA_TYPE,
            topics : topicsWithAliases,
            params : {
                isOnlyTopicConnect : !widgetParams.editable,
                type               : dataType,
                label              : widgetParams.label,
                isMulti            : !!widgetParams.isMulti
            }
        });
    };
}


export function getGroups(widgetType) {
    return (dispatch, getState) => {
        const { list } = getState().groups;
        const widgetTypes = WIDGETS_MAP[widgetType].dataTypes;

        const widgetDataType = sortWidgetTypesByPriority(widgetTypes)[0];
        const groupsList =  mapGroupsToEntities(list, widgetType, widgetDataType);

        dispatch({ type: GET_WIDGET_GROUPS, groups: groupsList });
    };
}

export function createWidget(params) {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type : CREATING_NEW_WIDGET
            });

            setTimeout(async () => {
                try {
                    const { screens } = getState().client.dashboard;
                    const { id } = screens.find(({ isActive }) => isActive === true) || { id: null };
                    const { params : widgetParams, ...restFields } = params;
                    const data = { ...widgetParams, ...restFields, screen: id };
                    const widgetData = dumpWidget(data);
                    const widget = mapWidget(await api.widgets.create({ ...widgetData }));
                    const IDS = dispatch(getIDsByTopic(widget?.topic));

                    const runWidgetFetcherPayload = {
                        id    : widget.id,
                        topic : {
                            deviceId     : IDS?.deviceId || '',
                            nodeId       : IDS?.nodeId || '',
                            hardwareType : IDS?.hardwareType || '',
                            propertyId   : IDS?.propertyId || '',
                            propertyType : IDS?.propertyType || ''
                        },
                        interval : widget.advanced.interval
                    };

                    tsManager.runWidgetFetcher(runWidgetFetcherPayload);

                    dispatch({
                        type     : CREATE_NEW_WIDGET,
                        screenId : id,
                        widget
                    });
                    dispatch({ type: FINISH_FETCHING });
                    dispatch({ type: CLEAR_WIDGET_VALUE_STATE });

                    store.dispatch(hideToastNotification(meta.BAD_RESPONSE));

                    resolve();
                } catch (error) {
                    if (error.code === 'FORMAT_ERROR') {
                        const fields = error.fields;

                        setTimeout(() => {
                            dispatch({ type: ERROR_FETCHING_UPDATE_WIDGET, error: fields || {} });
                        }, 500);
                    } if (error.code === 'INVALID_SIGNATURE' || error.code === 'PERMISSION_DENIED') {
                        dispatch(removeClientPanelAccess());
                    } else if (error.code === 'REQUEST_REJECTED') {
                        reject();
                    }
                    reject();
                    throw error;
                }
            }, 500);
        });
    };
}

export function deleteWidget({ id, screen }) {
    return async dispatch => {
        try {
            dispatch({
                type : DELETING_WIDGET
            });

            await api.widgets.delete({ id, screen });

            store.dispatch(hideToastNotification(meta.BAD_RESPONSE));
            tsManager.stopWidgetFetcher(id);

            dispatch({ type: FINISH_FETCHING });
            dispatch({ type: DELETE_WIDGET_FROM_SCREEN, id, screen });
            dispatch({ type: CLEAR_WIDGET_VALUE_STATE });
        } catch (error) {
            const { code } = error || {};

            dispatch({ type: ERROR_FETCHING_DELETE_WIDGET });

            if (code === 'INVALID_SIGNATURE' || code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());
            } else if (code === 'REQUEST_REJECTED') {
                return;
            } else if (code === 'NOT_FOUND') {
                dispatch({ type: DELETE_WIDGET_FROM_SCREEN, id, screen });
                dispatch({ type: CLEAR_WIDGET_VALUE_STATE });
            }
        }
    };
}

export function updateWidget({ id, params }) {
    return async dispatch => {
        try {
            dispatch({
                type : UPDATING_WIDGET
            });
            const widgetData = dumpWidget(params);
            const widget = mapWidget(await api.widgets.edit(id, widgetData));

            tsManager.stopWidgetFetcher(id);    // eslint-disable-line  padding-line-between-statements
            tsManager.runWidgetFetcher(serializeWidgetData(widget));

            dispatch({
                type     : UPDATE_WIDGET,
                screenId : params.screen,
                widget
            });
            dispatch({ type: FINISH_FETCHING });
            dispatch({ type: CLEAR_WIDGET_VALUE_STATE });

            store.dispatch(hideToastNotification(meta.BAD_RESPONSE));
        } catch (error) {
            console.log({ error });

            const { code } = error;

            if (code === 'NOT_FOUND') {
                dispatch(clearValues());

                return history.push(NOT_FOUND);
            } else if (code === 'INVALID_SIGNATURE' || code === 'PERMISSION_DENIED') {
                dispatch(removeClientPanelAccess());
            } else if (code === 'FORMAT_ERROR') {
                const fields = error.fields;

                setTimeout(() => {
                    dispatch({ type: ERROR_FETCHING_UPDATE_WIDGET, error: fields || {} });
                }, 500);
            } else if (code === 'REQUEST_REJECTED') {
                return;
            }
        }
    };
}

export function clearValues() {
    return dispatch => {
        dispatch({ type: CLEAR_WIDGET_VALUE_STATE });
    };
}

export function selectTopic(topic) {
    return dispatch => {
        const { type, dataType } = topic || {};

        if (type === 'thermostat') {
            if (dataType === 'float') {
                dispatch(setWidgetOption({ key: 'step', value: THERMOSTAT_DEFAULT_STEP_FLOAT, isAdvanced: true }));
            }

            if (dataType === 'integer') {
                dispatch(setWidgetOption({ key: 'step', value: THERMOSTAT_DEFAULT_STEP_INT, isAdvanced: true }));
            }
        }

        dispatch({ type: SELECT_TOPIC, topic });
        dispatch(changeActiveValue(topic));
    };
}


export function addTopicsToMultiWidget(topics) {
    return ({ type: ADD_TOPICS_TO_MULTI_WIDGET, topics });
}

export function setTopicByKeyToMultiWidget(topic) {
    return ({ type: SET_TOPIC_BY_KEY_TO_MULTI_WIDGET, topicObj: topic });
}


export function deleteTopicFromMultiWidget(topic) {
    return ({ type: DELETE_TOPIC_FROM_MULTI_WIDGET, topicObj: topic });
}

export function changeTopicOrder(source, destination) {
    return ({ type: CHANGE_TOPICS_ORDER, source, destination });
}

export function selectGroup(group) {
    return dispatch => {
        dispatch(changeActiveValue(group));
        dispatch({ type: SELECT_GROUP, group });
    };
}

export function changeActiveValue(value) {
    const instance = getInstanceByTopic(value?.topic);
    const serialized = instance && instance.serialize ? instance.serialize() : {};

    return ({ type: CHANGE_ACTIVE_VALUE, value: { ...value, ...serialized } });
}


export function changeValueTab(id) {
    return (dispatch, getState) => {
        const { currTopic } = getState().client.widget;

        dispatch({ type: CHANGE_TAB, tab: id });
        dispatch(changeActiveValue(currTopic));
    };
}


export function selectWidgetToEdit(widget) {
    return (dispatch, getState) => {
        const { bgColor, name, id, advanced, topics = [], type, isMulti } = widget;

        dispatch(getTopicsByDataType(type));
        if (!isMulti) {
            dispatch(getGroups(type));

            // if (IDS.hardwareType === 'group') {
            //     dispatch(selectGroup(widget));
            //     dispatch(changeValueTab(1));
            // } else  {
            dispatch(selectTopic(widget));
            //     dispatch(changeValueTab(0));
            // }
        }
        const  availableTopics  = getState().client.widget.topics;
        const withDeletedTopics = topics.length ? checkIsValueDeleted(topics, availableTopics, 'topic') : [];

        dispatch({ type: SELECT_WIDGET, widgetId: id, name, bgColor, advanced, topics: withDeletedTopics });
    };
}

export function selectWidgetToDelete(widget) {
    return dispatch => {
        const {  name, id } = widget;

        dispatch({ type: SELECT_WIDGET, widgetId: id, name });
    };
}

export function changeName(name) {
    return dispatch => {
        dispatch({ type: CHANGE_WIDGET_NAME, name });
    };
}

export function changeColor(bgColor) {
    return dispatch => {
        dispatch({ type: CHANGE_WIDGET_COLOR, bgColor });
    };
}

export function setErrors(error) {
    return dispatch => {
        dispatch({
            type : SET_ERRORS,
            error
        });
    };
}

export function filterByDataType(deviceId, nodeId, dataType, arr, hardwareType, propertyType, isHardwareActive) {
    const widgetParams = WIDGETS_MAP[dataType];
    const { dataTypes, editable, retained:isWidgetRetained } = widgetParams;

    if (!(dataTypes && dataTypes.length)) return [];

    const res = arr
        .filter(val => {
            const isRetainedValid = [ true, false ].includes(isWidgetRetained)
                ? val.retained === `${isWidgetRetained}`
                : true;
            const isSettable = editable ? val.settable === 'true' : true;
            const baseCondition = dataTypes.includes(val.dataType) && isSettable && isRetainedValid;

            return baseCondition;
        })
        .map(({ id, rootTopic, dataType: DT, title, name, settable, retained }) => {
            const label = `${title || name} — ${rootTopic}`;

            return {
                deviceId,
                nodeId,
                hardwareType,
                propertyType,
                propertyId : id,
                topic      : rootTopic,
                value      : rootTopic,
                isActive   : isHardwareActive,
                label,
                name,
                withTitle  : !!title,
                dataType   : DT,
                title,
                type       : dataType,
                isSettable : settable === 'true',
                isRetained : retained === 'true'
            };
        });

    return res;
}
