import store     from '../../store';
import smartHome from '../../smartHome/smartHomeSingleton';

export function getEntityLabelByTopic(topic, stateData) {
    if (topic?.deleted) return topic?.label || '';

    const state = stateData ? stateData : store?.getState();

    if (!state || !topic) return '';

    const arrowSymbol = '➝';

    if (topic?.propertyType === 'group') {
        return `Groups ${arrowSymbol} ${topic?.label}`;
    }

    const { devices = {}, thresholds = {} } = state.homie;
    const { propertyType, deviceId, nodeId, propertyId, hardwareType } = topic || {};

    const deviceData         = devices?.[deviceId];
    const nodeData           = deviceData?.nodes?.find(node            => node?.id     === nodeId) || {};
    const nodePropertyData   = nodeData?.[propertyType]?.find(property => property?.id === propertyId) || {};
    const devicePropertyData = deviceData?.[propertyType]?.find(property => property?.id === propertyId) || {};

    const deviceLabel         = deviceData?.title || deviceData?.name || '';
    const nodeLabel           = nodeData?.title || nodeData?.name || '';
    const nodePropertyLabel   = nodePropertyData?.title || nodePropertyData?.name || '';
    const devicePropertyLabel = devicePropertyData?.title || devicePropertyData?.name || '';

    const thresholdData = (thresholds[nodeId] || [])?.find(property => property?.id === propertyId);
    const thresholdName = `${thresholdData?.name} (${thresholdData?.id})`;


    switch (hardwareType) {
        case 'node':
            return `${deviceLabel} ${arrowSymbol} ${nodeLabel} ${arrowSymbol} ${nodePropertyLabel}`;
        case 'device':
            return `${deviceLabel} ${arrowSymbol} ${devicePropertyLabel}`;
        case 'threshold':
            return `Thresholds ${arrowSymbol} ${nodeId} ${arrowSymbol} ${thresholdName}`;
        case 'scenario':
            return `Scenarios ${arrowSymbol} ${topic?.name || deviceId}`;
        default:
            return topic?.label || topic?.topic;
    }
}

export function fillEntitiesLabelsByTopics(list) {
    const state = store?.getState();

    if (!list?.length || !state) return [];

    return list?.map(listItem => ({
        ...listItem,
        label : getEntityLabelByTopic(listItem, state)
    }));
}

export function getEntitiesTreeByTopics(topics = []) {
    const state = store?.getState();

    if (!state || !topics?.length) return {};

    const { devices = {}, thresholds = {}, scenarios } = state.homie;

    const data = {};

    topics.forEach(topicData => {
        const { propertyType, deviceId, nodeId, propertyId, hardwareType, isActive } = topicData || {};

        const deviceData = devices?.[deviceId];
        const nodeData   = deviceData?.nodes?.find(node => node?.id === nodeId) || {};
        const nodePropertyData = nodeData?.[propertyType]?.find(property => property?.id === propertyId) || {};
        const devicePropertyData = deviceData?.[propertyType]?.find(property => property?.id === propertyId) || {};

        const deviceSearchMeta = [ deviceData?.name, deviceData?.title ];

        if (hardwareType === 'node') {      // nodes sensors/options/telemetry
            data[deviceId] = {
                info : {
                    id    : deviceId,
                    name  : deviceData?.name,
                    title : deviceData?.title
                },
                searchMeta : deviceSearchMeta,
                type       : 'device',
                isActive   : true,
                children   : {
                    ...(data?.[deviceId]?.children || {}),
                    [nodeId] : {
                        info       : nodeData,
                        searchMeta : [ nodeData?.title, nodeData?.name ],
                        type       : hardwareType,
                        isActive,
                        children   : {
                            ...(data?.[deviceId]?.children?.[nodeId]?.children || {}),
                            [propertyId] : {
                                isActive,
                                type       : `node${propertyType}`,
                                info       : nodePropertyData,
                                searchMeta : [
                                    topicData?.topic,
                                    topicData?.alias?.name,
                                    nodePropertyData?.title,
                                    nodePropertyData?.name
                                ],
                                value : topicData,
                                alias : topicData?.alias
                            }
                        }
                    }
                }
            };
        } else if (hardwareType === 'device') {     // device options/telemetry
            data[deviceId] = {
                info : {
                    id    : deviceId,
                    name  : deviceData?.name,
                    title : deviceData?.title
                },
                isActive   : true,
                searchMeta : deviceSearchMeta,
                type       : 'device',
                children   : {
                    ...(data?.[deviceId]?.children || {}),
                    [propertyId] : {
                        isActive,
                        type       : propertyType,
                        info       : devicePropertyData,
                        searchMeta : [
                            topicData?.alias?.name,
                            topicData?.topic,
                            devicePropertyData?.title,
                            devicePropertyData?.name
                        ],
                        value : topicData
                    }
                }
            };
        } else if (propertyType === 'threshold') {
            const entityKey = 'thresholds';
            const thresholdData = (thresholds[nodeId] || [])?.find(property => property?.id === propertyId);
            const thresholdName = `${thresholdData?.name} (${thresholdData?.id})`;

            data[entityKey] = {
                info : {
                    id   : 'thresholds',
                    name : 'Thresholds'
                },
                isActive   : true,
                searchMeta : [ 'thresholds' ],
                type       : 'thresholds',
                children   : {
                    ...(data?.[entityKey]?.children || {}),
                    [nodeId] : {
                        isActive   : true,
                        type       : 'scenario',
                        searchMeta : [ nodeId ],
                        info       : {
                            id   : nodeId,
                            name : nodeId
                        },
                        children : {
                            ...(data?.[entityKey]?.children?.[nodeId]?.children || {}),
                            [thresholdName] : {
                                isActive : true,
                                type     : propertyType,
                                info     : {
                                    id   : thresholdName,
                                    name : thresholdName
                                },
                                searchMeta : [ topicData?.topic, thresholdName ],
                                value      : topicData
                            }
                        }
                    }
                }
            };
        } else if (propertyType === 'group' && !topicData.isDeleted) {
            const groupsKey = 'groups';

            data[groupsKey] = {
                info : {
                    id   : 'groups',
                    name : 'Groups'
                },
                isActive   : true,
                searchMeta : [ 'groups' ],
                type       : 'groups',
                children   : {
                    ...(data?.[groupsKey]?.children || {}),
                    [topicData?.value] : {
                        isActive : true,
                        type     : 'group',
                        info     : {
                            id   : topicData?.value,
                            name : topicData?.label
                        },
                        searchMeta : [ topicData?.topic, topicData?.label, topicData?.value ],
                        value      : topicData,
                        children   : null
                    }
                }
            };
        } else if (hardwareType === 'scenario') {
            const entityKey = 'scenarios';
            const scenarioName = topicData?.name;
            const scenarioData = scenarios[scenarioName];

            data[entityKey] = {
                info : {
                    id   : 'scenarios',
                    name : 'Scenarios'
                },
                isActive   : true,
                searchMeta : [ 'scenarios' ],
                type       : 'scenarios',
                children   : {
                    ...(data?.[entityKey]?.children || {}),
                    [scenarioName] : {
                        isActive   : scenarioData?.state === 'true',
                        type       : 'scenario',
                        searchMeta : [ scenarioName ],
                        info       : {
                            id   : scenarioName,
                            name : scenarioName
                        },
                        value    : topicData,
                        children : void 0
                    }
                }
            };
        }
    });

    // detect inactive devices
    const entitiesList = [ ...(Object.keys(data || {}) || []) ];
    const devicesList = entitiesList?.filter(key => ![ 'scenarios', 'groups', 'thresholds' ].includes(key));

    devicesList?.forEach(deviceKey => {
        const deviceData = data[deviceKey];

        const deviceChidlren = Object.values(deviceData?.children || {}) || [];

        if (deviceChidlren?.length) {
            const isDeviceInactive = !deviceChidlren?.some(child => child.isActive);

            if (isDeviceInactive) data[deviceKey].isActive = false;
        }
    });

    return data;
}

export function getInstanceByTopic(topic) {
    const { instance } = smartHome.getInstanceByTopic(topic) || {};

    return instance;
}
