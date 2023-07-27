import config from '../../../config';
import { safeParseJSON } from '../json';

export function mapServiceTypeEntityToServiceType(serviceType) {
    const { id, title, icon, configuration, state, version } = serviceType;
    const fields = configuration?.fields || [];

    return {
        name       : id,
        label      : title,
        icon       : icon ? `${config.apiUrl}/${icon}` : undefined,
        status     : getBridgeTypeStatus(state),
        exposePort : configuration?.exposePort,
        version,
        state,
        fields
    };
}

export function mapServiceTypeUpdateEntityToServiceTypeUpdate(serviceType) {
    const { id, title, configuration, state, version } = serviceType;

    return {
        ...(id && { name: id }),
        ...(title && { label: title }),
        ...(state && { state }),
        ...(state && { status: getBridgeTypeStatus(state) }),
        ...(version && { version: safeParseJSON(version) }),
        ...(configuration && { fields: safeParseJSON(configuration)?.fields })
    };
}

export function mapBridgeEntityTOToService(entity) {
    const { id, type, configuration, state } = entity;

    return {
        id,
        type,
        state,
        status : getBridgeStatus(state),
        params : configuration
    };
}

export function mapBridgeEntityUpdateTOToServiceUpdate(entity) {
    const { id, type, configuration, state } = entity;

    return {
        ...(id && { id }),
        ...(type && { type }),
        ...(state && { state }),
        ...(state && { status: getBridgeStatus(state) }),
        ...(configuration && { params: JSON.parse(configuration) })
    };
}

export function mapScenarioTypeTOToScenarioType(scenarioType) {
    const { id, title, description, language, configuration, icon } = scenarioType;
    const fields = configuration?.fields || [];

    return {
        id,
        title,
        description,
        language,
        fields,
        icon : icon ? `${config.apiUrl}/${icon}` : undefined
    };
}

export function transformFieldsToFormInitialState(fields) {
    fields.forEach(field => {
        if (field.type === 'topics') field.default = [];
    });


    return fields
        .filter(field => typeof field.default !== 'undefined')
        .reduce((acc, field) => ({
            ...acc,
            [field.name] : field.default
        }), {});
}

function getBridgeStatus(state) {
    switch (state) {
        case 'starting':
        case 'started':
            return 'ACTIVE';
        case 'stopping':
        case 'stopped':
            return 'INACTIVE';
        default:
            return '';
    }
}

function getBridgeTypeStatus(state) {
    switch (state) {
        case 'removing':
        case 'removed':
            return 'not-installed';
        case 'pulling':
        case 'pulled':
            return 'installed';
        default:
            return '';
    }
}
