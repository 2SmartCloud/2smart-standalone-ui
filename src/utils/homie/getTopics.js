import { mapGroupsToEntities } from '../mapper/groups';

export function getTopics(devices, aliasList, thresholds, groups = [], scenarios = {}) {
    let topics = [];

    Object.values(devices).forEach(device => {
        const isDeviceActive = device.state === 'ready';

        topics = [
            ...topics,
            ...dumpTopics(device.telemetry, isDeviceActive, 'device', device?.id, null, 'telemetry'),
            ...dumpTopics(device.options, isDeviceActive, 'device', device?.id, null, 'options')
        ];

        device.nodes.forEach(node => {
            const isNodeActive = node.state === 'ready' && isDeviceActive;

            topics = [
                ...topics,
                ...dumpTopics(node.telemetry, isNodeActive, 'node', device?.id, node?.id, 'telemetry'),
                ...dumpTopics(node.options, isNodeActive, 'node', device?.id, node?.id, 'options'),
                ...dumpTopics(node.sensors, isNodeActive, 'node', device?.id, node?.id, 'sensors')
            ];
        });
    });

    for (const scenarioId in thresholds) {
        if (thresholds.hasOwnProperty(scenarioId)) {
            const scenarioThresholds = thresholds[scenarioId];

            topics = [
                ...topics,
                ...dumpTopics(scenarioThresholds, true, 'threshold', null, scenarioId, 'threshold')
            ];
        }
    }

    for (const scenarioId in scenarios) {
        if (scenarios.hasOwnProperty(scenarioId)) {
            const scenario = scenarios[scenarioId];

            topics = [
                ...topics,
                ...dumpTopics([ {
                    ...scenario,
                    dataType  : 'boolean',
                    settable  : 'true',
                    rootTopic : `${scenario.rootTopic}/$state`
                } ], true, 'scenario', 'scenario', scenarioId, 'scenario')
            ];
        }
    }

    const topicsWithAlias = getTopicsListWithAliases({ topicsList: topics, aliasList });

    return [ ...topicsWithAlias, ...mapGroupsToEntities(groups, 'string', 'string', true) ];
}

function dumpTopics(arrayOfTopics, isHardwareActive, hardwareType, deviceId, nodeId, propertyType) {
    const res = arrayOfTopics
        .map(({ id, rootTopic, dataType, title, name }) => {
            return {
                topic      : rootTopic,
                isActive   : isHardwareActive,
                type       : dataType,
                name,
                title,
                hardwareType,
                deviceId,
                nodeId,
                propertyId : id,
                propertyType
            };
        });

    return res;
}

export function filterTopicsByDataType(topics, topicDataTypes) {
    return  topics
        .filter(topic => topic.propertyType === 'group' || topicDataTypes.includes(topic.type))
        .map(({ topic, title, name, label, alias, isActive, ...rest }) => {
            return ({
                ...rest,
                topic,
                isActive,
                value     : topic,
                label,
                name,
                title,
                id        : topic,
                alias,
                withTitle : !!title
            });
        });
}


export function getAliasPropertyByTopicData({
    aliasList = [],
    topic
}) {
    const propertyAlias = aliasList.find(alias => {
        const { connectedTopic } = alias;

        return (topic === connectedTopic);
    });

    return propertyAlias || {};
}

export function getTopicsListWithAliases({ topicsList, aliasList }) {
    return topicsList.map(topicObj => {
        const { topic, title, name } = topicObj;
        const alias = getAliasPropertyByTopicData({
            aliasList,
            topic
        });
        const aliasName = alias?.name ? ` — ${alias.name}` : '';

        const label = `${title || name}${aliasName} — ${topic}`;

        return ({ ...topicObj, label, alias });
    });
}


export function getDevicesWithAlias({
    aliasList = [],
    devices = {}
}) {
    const devicesArray = Object.values(devices);
    const devicesWithAlias = {};

    devicesArray.forEach(device => {
        const nodesWithAliases = device.nodes.map(node => ({
            ...node,
            telemetry : getOptionsWithAlias({ aliasList, options: node.telemetry }),
            options   : getOptionsWithAlias({ aliasList, options: node.options }),
            sensors   : getOptionsWithAlias({ aliasList, options: node.sensors })
        }));

        devicesWithAlias[device.id] = {
            ...device,
            nodes     : nodesWithAliases,
            telemetry : getOptionsWithAlias({ aliasList, options: device.telemetry }),
            options   : getOptionsWithAlias({ aliasList, options: device.options })
        };
    });

    return devicesWithAlias;
}


export function getOptionsWithAlias({
    aliasList = [],
    options = []
}) {
    return options.map(option => {
        const propertyAlias = aliasList.find(alias => {
            const { connectedTopic } = alias;

            return (option.rootTopic === connectedTopic);
        });

        return  { ...option, alias: propertyAlias || {} };
    });
}
