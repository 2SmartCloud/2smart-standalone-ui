import {
    getEntityLabelByTopic,
    fillEntitiesLabelsByTopics,
    getEntitiesTreeByTopics
} from './getEntities';

const TOPIC = {
    "alias"        : {},
    "dataType"     : "float",
    "deviceId"     : "fat",
    "hardwareType" : "device",
    "label"        : "Up time — sweet-home/fat/$telemetry/uptime",
    "name"         : "Up time",
    "nodeId"       : null,
    "isActive"     : true,
    "propertyId"   : "uptime",
    "propertyType" : "telemetry",
    "title"        : "",
    "topic"        : "sweet-home/fat/$telemetry/uptime",
    "type"         : "card",
    "value"        : "sweet-home/fat/$telemetry/uptime",
    "withTitle"    : false,
};

const TOPIC_ENTITY_LABEL = 'Fat device ➝ Up time';

jest.mock('../../store', () => ({
    getState: jest.fn(() => {
        return {
            homie: {
                devices: {
                    fat : {
                        id              : 'fat',
                        name            : 'Fat device',
                        rootTopic       : 'sweet-home/fat',
                        title           : '',
                        telemetry       : [
                            {
                                dataType  : 'string',
                                format    : '',
                                id        : 'supply',
                                name      : 'Supply',
                                title     : '',
                                retained  : 'true',
                                rootTopic : 'sweet-home/fat/$telemetry/supply',
                                settable  : 'false',
                                units     : '%',
                                value     : '1.4254лдыа'
                            },
                            {
                                dataType  : 'float',
                                format    : '',
                                id        : 'uptime',
                                name      : 'Up time',
                                title     : '',
                                retained  : 'true',
                                rootTopic : 'sweet-home/fat/$telemetry/uptime',
                                settable  : 'true',
                                units     : 'sec',
                                value     : '329802842844'
                            }
                        ]
                    }
                }
            }
        }
    })
}));


describe('getEntities utils', () => {
    it('getEntitiesTreeByTopics() should return entities tree structure', () => {
        const result = getEntitiesTreeByTopics([{
            "deviceId"     : "fat",
            "nodeId"       : null,
            "hardwareType" : "device",
            "propertyType" : "telemetry",
            "propertyId"   : "uptime",
            "isActive"     : true,
            "topic"        : 'sweet-home/fat/$telemetry/uptime',
            "value"        : 'sweet-home/fat/$telemetry/uptime',
            "label"        : 'Up time — sweet-home/fat/$telemetry/uptime',
            "name"         : "Up time",
            "withTitle"    : false,
            "dataType"     : "float",
            "title"        : "",
            "type"         : "card",
            "alias"        : {}
        }]);

        const expected = {
            "fat":  {
                "isActive": true,
                "children":  {
                    "uptime":  {
                        "isActive" : true,
                        "info":  {
                            "dataType"  : "float",
                            "format"    : "",
                            "id"        : "uptime",
                            "name"      : "Up time",
                            "retained"  : "true",
                            "rootTopic" : "sweet-home/fat/$telemetry/uptime",
                            "settable"  : "true",
                            "title"     : "",
                            "units"     : "sec",
                            "value"     : "329802842844",
                        },
                        "searchMeta": [
                            void 0,
                            "sweet-home/fat/$telemetry/uptime",
                            "",
                            "Up time",
                        ],
                        "type": "telemetry",
                        "value":  TOPIC,
                    },
                },
                "searchMeta": [
                    "Fat device",
                    ""
                ],
                "info":  {
                    "id": "fat",
                    "name": "Fat device",
                    "title": "",
                },
                "type": "device",
            },
        }

        expect(result).toEqual(expected);
    });

    describe('getEntityLabelByTopic()', () => {
        it('should return entity by topic', () => {
            const expected = TOPIC_ENTITY_LABEL;

            expect(getEntityLabelByTopic(TOPIC)).toEqual(expected);
        });

        it('should return entity.label if entity is deleted', () => {
            const expected = 'SOME_LABEL';

            expect(getEntityLabelByTopic({ ...TOPIC, deleted: true, label: 'SOME_LABEL' })).toEqual(expected);
        });
    });

    it('fillEntitiesLabelsByTopics() should return topic with entity label', () => {
        const topics= fillEntitiesLabelsByTopics([ TOPIC ]);

        const expected = [{
            ...TOPIC,
            label: TOPIC_ENTITY_LABEL
        }];

        expect(topics).toEqual(expected);
    });
});
