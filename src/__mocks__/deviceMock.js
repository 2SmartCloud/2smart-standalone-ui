import {ALIASES} from './aliasesMock';

export const DEVICES_MOCK = {
    fat : {
        firmwareName    : 'asdad',
        firmwareVersion : '1231231',
        id              : 'fat',
        implementation  : 'dafs',
        localIp         : '112',
        mac             : '2312',
        name            : 'Fat device',
        rootTopic       : 'sweet-home/fat',
        state           : 'ready',
        title           : '',
        nodes           : [
            {
                id        : 'colors',
                name      : 'Color picker',
                type      : 'V1',
                state     : 'ready',
                rootTopic : 'sweet-home/fat/colors',
                title     : '',
                sensors   : [
                    {
                        id        : 'rgb-valid',
                        name      : 'RGB Valid',
                        title     : '',
                        value     : '0,0,0',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'color',
                        unit      : '#',
                        format    : 'rgb',
                        rootTopic : 'sweet-home/fat/colors/rgb-valid',
                        groups    : ['1']
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            },
            {
                id        : 'enum-no-unit',
                name      : 'Enum Sensor',
                type      : 'V1',
                state     : 'init',
                rootTopic : 'sweet-home/fat/enum-no-unit',
                title     : '',
                sensors   : [
                    {
                        id        : 'enum-no-unit',
                        name      : 'ENUM',
                        displayed : true, 
                        title     : '',
                        value     : 'OFF',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'enum',
                        unit      : '#',
                        format    : 'ON,OFF',
                        rootTopic : 'sweet-home/fat/enum-no-unit/enum-no-unit'
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            }
        ],
        options         : [],
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
};


export const DEVICES_MOCK_WITH_ALIASES = {
    fat : {
        firmwareName    : 'asdad',
        firmwareVersion : '1231231',
        id              : 'fat',
        implementation  : 'dafs',
        localIp         : '112',
        mac             : '2312',
        name            : 'Fat device',
        rootTopic       : 'sweet-home/fat',
        state           : 'ready',
        title           : '',
        nodes           : [
            {
                id        : 'colors',
                name      : 'Color picker',
                type      : 'V1',
                state     : 'ready',
                rootTopic : 'sweet-home/fat/colors',
                title     : '',
                sensors   : [
                    {
                        id        : 'rgb-valid',
                        name      : 'RGB Valid',
                        alias     : ALIASES[2],
                        title     : '',
                        value     : '0,0,0',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'color',
                        unit      : '#',
                        format    : 'rgb',
                        rootTopic : 'sweet-home/fat/colors/rgb-valid',
                        groups    : ['1']
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            },
            {
                id        : 'enum-no-unit',
                name      : 'Enum Sensor',
                type      : 'V1',
                state     : 'init',
                rootTopic : 'sweet-home/fat/enum-no-unit',
                title     : '',
                sensors   : [
                    {
                        id        : 'enum-no-unit',
                        name      : 'ENUM',
                        displayed : true,
                        alias     : {},
                        title     : '',
                        value     : 'OFF',
                        settable  : 'true',
                        retained  : 'true',
                        dataType  : 'enum',
                        unit      : '#',
                        format    : 'ON,OFF',
                        rootTopic : 'sweet-home/fat/enum-no-unit/enum-no-unit'
                    }
                ],
                options   : [],
                telemetry : [],
                hidden    : 'false'
            }
        ],
        options         : [],
        telemetry       : [
            {
                dataType  : 'string',
                format    : '',
                id        : 'supply',
                name      : 'Supply',
                alias     : ALIASES[0],
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
                alias     : ALIASES[1],
                title     : '',
                retained  : 'true',
                rootTopic : 'sweet-home/fat/$telemetry/uptime',
                settable  : 'true',
                units     : 'sec',
                value     : '329802842844'
            }
        ]
    }
};



export const TOPICS_MOCK = [
    {
        type  : 'string',
        name      : 'Supply',
        topic : 'sweet-home/fat/$telemetry/supply',
        title     : '',
        alias:{}
    },{
        type  : 'float',
        name      : 'Up time',
        topic : 'sweet-home/fat/$telemetry/uptime',
        title     : '',
    },{
        type  : 'color',
        name  : 'RGB Valid',
        topic : 'sweet-home/fat/colors/rgb-valid',
        title     : '',
    },{
        type  : 'enum',
        name      : 'ENUM',
        topic : 'sweet-home/fat/enum-no-unit/enum-no-unit',
        title     : '',
    }
]

export const TOPICS_MOCK_WITH_ALIASES = [
    {
        alias        : ALIASES[0],
        type         : 'string',
        name         : 'Supply',
        deviceId     : "fat",
        hardwareType : "device",
        nodeId       : null,
        propertyId   : "supply",
        propertyType : "telemetry",
        isActive     : true,
        topic        : 'sweet-home/fat/$telemetry/supply',
        label        : 'Supply — name1 — sweet-home/fat/$telemetry/supply',
        title        : '',

    },{
        alias        : ALIASES[1],
        isActive     : true,
        type         : 'float',
        name         : 'Up time',
        deviceId     : "fat",
        hardwareType : "device",
        nodeId       : null,
        propertyId   : "uptime",
        propertyType : "telemetry",
        topic        : 'sweet-home/fat/$telemetry/uptime',
        label        : 'Up time — name2 — sweet-home/fat/$telemetry/uptime',
        title        : '',
    },{
        alias        : ALIASES[2],
        isActive     : true,
        type         : 'color',
        name         : 'RGB Valid',
        deviceId     : "fat",
        nodeId       : "colors",
        hardwareType : "node",
        propertyId   : "rgb-valid",
        propertyType : "sensors",
        topic        : 'sweet-home/fat/colors/rgb-valid',
        label        : 'RGB Valid — rgb — sweet-home/fat/colors/rgb-valid',
        title        : '',
    },{
        alias        : {},
        isActive     : false,
        type         : 'enum',
        name         : 'ENUM',
        deviceId     : "fat",
        hardwareType : "node",
        nodeId       : "enum-no-unit",
        propertyId   : "enum-no-unit",
        propertyType : "sensors",
        label        : 'ENUM — sweet-home/fat/enum-no-unit/enum-no-unit',
        topic        : 'sweet-home/fat/enum-no-unit/enum-no-unit',
        title        : '',
    }
]
