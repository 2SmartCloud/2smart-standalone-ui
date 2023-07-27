export const HOMIE_SCENARIOS = {
    device: {
        id: 'device',
        state: 'true',
        rootTopic: 'scenarios/device',
        name: 'device',
        dataType: 'boolean',
        thresholds: [
            'int1',
            'boolean1'
        ]
    },
    ertyui: {
        id: 'ertyui',
        state: 'true',
        rootTopic: 'scenarios/ertyui',
        name: 'ertyui',
        dataType: 'boolean',
        thresholds: [
            'setpoint'
        ]
    }
};