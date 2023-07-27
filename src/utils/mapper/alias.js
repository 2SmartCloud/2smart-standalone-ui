
export function mapAliasEntityToAlias(entity) {
    const { id, entityTopic, topic, name } = entity;

    return {
        id,
        rootTopic      : entityTopic,
        connectedTopic : topic,
        name
    };
}

export function mapAliasEntityUpdateToAlias(entity) {
    const { id, entityTopic, topic, name  } = entity;

    return {
        ...(id && { id }),
        ...(entityTopic && {  rootTopic: entityTopic }),
        ...(topic && {  connectedTopic: topic }),
        ...(name && {  name })
    };
}

