export function getPropertyByType(node, propertyType, propertyId) {
    const getters = {
        sensors   : (id) => node.getSensorById(id),
        telemetry : (id) => node.getTelemetryById(id),
        options   : (id) => node.getOptionById(id)
    };

    return getters[propertyType](propertyId);
}

export function getGroupdForNode({ devices, deviceId, propertyId, nodeId, propertyType }) {
    const   sensorGroupsArrayOfId = devices[deviceId]
        .nodes.find(node => node.id === nodeId)
        [propertyType].find(property => property.id === propertyId)
        .groups;

    return sensorGroupsArrayOfId;
}

export function getGroupdForDevice({ devices, deviceId, propertyId, propertyType }) {
    const sensorGroupsArrayOfId = devices[deviceId]
        [propertyType].find(property => property.id === propertyId)
        .groups;

    return sensorGroupsArrayOfId;
}

export function getGroupdForThreshold({ nodeId, propertyId, thresholds }) {
    return thresholds[nodeId].find(({ id }) => id === propertyId).groups || [];
}

export function getGroupByHardwareType({ hardwareType, ...rest }) {
    const getters = {
        node      : (types) => getGroupdForNode(types),
        device    : (types) => getGroupdForDevice(types),
        threshold : (types) => getGroupdForThreshold(types)
    };

    return getters[hardwareType]({ ...rest });
}

