export function dumpWidget(widgetData) {
    const {
        isMulti,
        selectedTopics,
        advanced,
        activeValue,
        name,
        bgColor,
        type,
        screen } = widgetData;

    return {
        name,
        bgColor,
        screen,
        type,
        topics : isMulti
            ? selectedTopics.map((topic, index) => dumpTopicData({ ...topic, order: index }))
            : [ dumpTopicData(activeValue) ],
        advanced : { ...advanced }
    };
}

function dumpTopicData(topicData) {
    const { topic, label,  deviceId, nodeId, propertyId, dataType,
        hardwareType, propertyType, order = 0 } = topicData;

    return {
        topic,
        topicName : label,
        deviceId,
        nodeId,
        propertyId,
        dataType,
        hardwareType,
        propertyType,
        order
    };
}
