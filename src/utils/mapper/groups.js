
export function mapGroupEntityToGroup(entity) {
    const { id, entityTopic, name, value } = entity;

    return {
        id,
        rootTopic : entityTopic,
        value,
        settable  : true,
        label     : name
    };
}

export function mapGroupEntityUpdateToGroup(entity) {
    const { id, entityTopic, name, value } = entity;

    return {
        ...(id && { id }),
        ...(entityTopic && {  rootTopic: entityTopic }),
        ...(entity.hasOwnProperty('value') && { value }),
        ...(name && { label: name })
    };
}


export function mapGroupsToEntities(list, widgetType, dataType, withValueAttribute = false) {
    return list.map(
        group => ({
            topic        : withValueAttribute ? `${group.rootTopic}/$value` : group.rootTopic,
            label        : group.label,
            value        : group.rootTopic,
            deviceId     : group.id,
            nodeId       : null,
            propertyId   : null,
            hardwareType : 'group',
            propertyType : 'group',
            type         : widgetType,
            dataType
        })
    );
}
