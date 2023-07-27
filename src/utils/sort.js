const PRIORITY = {
    'integer' : 2,
    'float'   : 1,
    'string'  : 0
};

export function sortDevices(devices, order = 'ASC') {
    return devices.sort((a, b) => {
        const aField = a.title || a.name;
        const bField = b.title || b.name;

        return sortComparator(aField, bField, order);
    });
}

export function sortNodes(items, order = 'ASC') {
    return  items.sort((a, b) => {
        const aField = a.title || a.name || '';
        const bField = b.title || b.name || '';

        return sortComparator(aField, bField, order);
    });
}

export function sortDisplayedProperties(items, order = 'ASC') {
    return items.sort((a, b) => {
        const aDisplayed = a.displayed === 'true';
        const bDisplayed = b.displayed === 'true';

        if (aDisplayed === bDisplayed) {
            const aField = a.title || a.name || '';
            const bField = b.title || b.name || '';

            return sortComparator(aField, bField, order);
        }

        return bDisplayed - aDisplayed;
    });
}

export function sortBridges(bridges, order = 'ASC') {
    return bridges.sort((a, b) => {
        const aField = a.title;
        const bField = b.title;

        return sortComparator(aField, bField, order);
    });
}

export function sortSensors(sensors, order = 'ASC') {
    return sensors.sort((a, b) => {
        const aField = a.title || a.name;
        const bField = b.title || b.name;

        return sortComparator(aField, bField, order);
    });
}


export function sortScenarios(scenarios, order = 'NAME_ASC') {
    return scenarios.sort((a, b) => {
        const [ sortBy, sortOrder ] = order?.split('_') || [];

        if (sortBy === 'NAME') {
            const aField = a.title || a.name;
            const bField = b.title || b.name;

            return sortComparator(aField, bField, sortOrder);
        } else if (sortBy === 'DATE') {
            const aField = +new Date(a.updatedAt);
            const bField = +new Date(b.updatedAt);

            return sortComparator(aField, bField, sortOrder);
        }

        return scenarios;
    });
}

export function sortMarketServices(services, order = 'ASC') {
    return services.sort((a, b) => {
        const aField = a.label;
        const bField = b.label;

        return sortComparator(aField, bField, order);
    });
}

export function sortWidgetTypesByPriority(types) {
    return types.sort((a, b) =>  PRIORITY[a] - PRIORITY[b]);
}

export function sortNotificationChannels(channels, order = 'ASC') {
    return channels.sort((a, b) => {
        const aField = a.alias;
        const bField = b.alias;

        return sortComparator(aField, bField, order);
    });
}

export function sortBackups(backups, order = 'DESC') {
    return backups.sort((a, b) => {
        const aField = a.timestamp;
        const bField = b.timestamp;

        return order === 'ASC'
            ? aField - bField
            : bField - aField;
    });
}

export function sortByField(array, field = 'title', order = 'ASC') {
    return array.sort((a, b) => {
        const aField = a[field];
        const bField = b[field];

        return sortComparator(aField, bField, order);
    });
}

export function sortNotifications(array, order = 'DESC') {
    if (!array || array?.length < 2) return array;

    return [ ...array ]?.sort((a, b) => {
        const aField = +(a?.createdAt || 0);
        const bField = +(b?.createdAt || 0);

        if (aField > bField) return positivCompare(order);
        if (aField < bField) return negativCompare(order);
    }) || [];
}

export function sortEntitiesByType(entities = [], typesOrder = [], sortByActive = false, order = 'ASC') {
    if (!entities) return entities;

    const sortedByLabel = [ ...entities ]?.sort((a, b) => {
        const aField = a?.label?.toLowerCase() || '';
        const bField = b?.label?.toLowerCase() || '';

        return sortComparator(aField, bField, order);
    });

    if (!typesOrder?.length) return sortedByLabel;

    const entitiesWithSortedKeys = sortedByLabel?.map(entity => {
        const sortOrder = typesOrder?.findIndex(type => {
            switch (type) {
                case 'activeDevice':
                    return entity?.type === 'device' && entity.isActive;
                case 'inactiveDevice':
                    return entity?.type === 'device' && !entity.isActive;
                default:
                    return type === entity?.type;
            }
        });

        return ({
            ...entity,
            sortOrder : sortOrder > -1 ? sortOrder : typesOrder?.length + 1
        });
    });

    const sortedByTypes = entitiesWithSortedKeys?.sort((a, b) => {
        const aField = a?.sortOrder;
        const bField = b?.sortOrder;

        if (bField === aField) return 0;

        return aField < bField ? -1 : 1;
    });

    if (!sortByActive) return sortedByTypes;

    const activeItems    = sortedByTypes?.filter(item => item?.isActive);
    const notActiveItems = sortedByTypes?.filter(item => !item?.isActive);

    return [
        ...activeItems,
        ...notActiveItems
    ];
}


function sortComparator(aField = '', bField = '', order) {
    const length = aField.length > bField.length ? aField.length : bField.length;

    for (const index in new Array(length).fill(null)) {      // eslint-disable-line
        if (!aField[index]) return positivCompare(order);
        if (!bField[index]) return negativCompare(order);//! isAscOrder(order);

        let aChar = aField[index].charCodeAt();
        let bChar = bField[index].charCodeAt();

        if (aChar >= 48 && aChar <= 57) aChar += 75;
        if (bChar >= 48 && bChar <= 57) bChar += 75;

        if (aChar > bChar) return positivCompare(order);
        if (aChar < bChar) return negativCompare(order);
    }

    return 0;
}


function positivCompare(order) {
    return (order === 'ASC') ? 1 : -1;
}


function negativCompare(order) {
    return (order === 'ASC') ? -1 : 1;
}
