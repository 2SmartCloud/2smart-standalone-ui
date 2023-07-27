import moment from 'moment';

const mapper = {
    id                 : 'id',
    event              : 'event',
    status             : 'status',
    entityTopic        : 'entityTopic',
    'last-update'      : 'lastUpdate',
    'available-update' : 'availableUpdate'
};

const transformers = {
    id                 : plainTransform,
    event              : plainTransform,
    status             : plainTransform,
    entityTopic        : plainTransform,
    'last-update'      : dateTransform,
    'available-update' : dateTransform
};

export function mapSystemUpdatesEntityToSystemUpdate(systemUpdatesEntity) {
    return {
        id              : systemUpdatesEntity.id,
        entityTopic     : systemUpdatesEntity.entityTopic,
        status          : systemUpdatesEntity.status,
        event           : systemUpdatesEntity.event,
        lastUpdate      : dateTransform(systemUpdatesEntity['last-update']),
        availableUpdate : dateTransform(systemUpdatesEntity['available-update'])
    };
}

export function updateField({ field, value }) {
    const toField = mapper[field];
    const toValue = transformers[field](value);

    return { [toField]: toValue };
}

function plainTransform(val) {
    return val;
}

function dateTransform(val) {
    return moment(+val).format('DD.MM.YYYY');
}
