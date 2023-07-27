import {TOPICS_LIST, TOPIC_ORDERS} from './topicsList';

export const WIDGET_LIST_MOCK = [
    {
        bgColor      : '',
        dataType     : 'color',
        deviceId     : 'fat',
        hardwareType : 'node',
        id           : '1',
        name         : 'Color Picker',
        nodeId       : 'colors',
        propertyId   : 'rgb-valid',
        propertyType : 'sensors',
        topic        : 'sweet-home/fat/colors/rgb-valid',
        type         : 'color',
        advanced     : {}
    },
    {
        bgColor      : '',
        dataType     : 'enum',
        deviceId     : 'fat',
        hardwareType : 'node',
        id           : '2',
        name         : '',
        nodeId       : 'enum-no-unit',
        propertyId   : 'enum-no-unit',
        propertyType : 'sensors',
        topic        : 'sweet-home/fat/enum-no-unit/enum-no-unit',
        type         : 'enum',
        advanced     : {}
    },
    {
        bgColor      : '',
        dataType     : 'float',
        deviceId     : 'fat',
        hardwareType : 'device',
        id           : '3',
        name         : 'Chart',
        nodeId       : null,
        propertyId   : 'uptime',
        propertyType : 'telemetry',
        topic        : 'sweet-home/fat/$telemetry/uptime',
        type         : 'chart',
        advanced     : {
            chartColor : 'blue-green',
            interval   : 15
        }
    },
    {
        bgColor      : '',
        dataType     : 'string',
        deviceId     : 'fat',
        hardwareType : 'device',
        id           : '4',
        name         : '',
        nodeId       : null,
        propertyId   : 'supply',
        propertyType : 'telemetry',
        topic        : 'sweet-home/fat/$telemetry/supply',
        type         : 'string',
        advanced     : {}
    },
    {
        bgColor      : '',
        id           : '5',
        name         : '',
        type         : 'card',
        isMulti      : true,
        advanced     : {}, 
        topics: [TOPICS_LIST[0]],
        orders: TOPIC_ORDERS
    }
];

export const WIDGET_ADVANCED_CONF_MOCK = {
    fields : [
        {
            name         : 'stringField',
            label        : 'String Field',
            type         : 'string',
            defaultValue : 'default',
            fieldOptions : {
                maxLength : 8
            }
        },
        {
            name         : 'minValue',
            label        : 'min value',
            type         : 'integer',
            defaultValue : type => type.length,
            fieldOptions : {
                maxLength : 8
            }
        },
        {
            name         : 'maxValue',
            label        : 'Max value',
            type         : 'float',
            defaultValue : '0.01',
            fieldOptions : {
                maxLength : 8
            }
        },
        {
            name         : 'toggle',
            label        : 'Toggle',
            type         : 'boolean'
        },
        {
            name         : 'chartType',
            label        : 'Chart type',
            type         : 'select',
            fieldOptions : {
                placeholder : 'Select chart type',
                options     : [
                    { value: 'bar', label: 'Bar' },
                    { value: 'line', label: 'Linear' }
                ]
            }
        },
        {
            name         : 'chartColor',
            label        : 'Bar color',
            type         : 'color',
            fieldOptions : {
                placeholder : 'Select color'
            }
        }
    ]
};
