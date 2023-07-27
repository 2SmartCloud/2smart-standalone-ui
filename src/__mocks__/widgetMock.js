import {WIDGET_ADVANCED_CONF_MOCK} from './widgetsMock';

export const WIDGETS_LIST_MOCK = [
    {
        component : jest.fn(),
        type      : 'string',
        label     : 'Sting',
        dataTypes : [ 'integer', 'float', 'boolean', 'string', 'enum', 'color' ]
    },
    {
        component : jest.fn(),
        type      : 'enum',
        label     : 'List',
        dataTypes : [ 'enum' ],
        scales    : { w: 2, h: 1 },
        editable  : true
    },
    {
        component        : jest.fn(),
        type             : 'gauge',
        label            : 'Gauge',
        dataTypes        : [ 'integer', 'float' ],
        scales           : { w: 2, h: 2 },
        advancedSettings : WIDGET_ADVANCED_CONF_MOCK
    }
];


export const WIDGETS_MAP = {
    'string'      : {
        component : jest.fn(),
        type      : 'string',
        dataTypes : [ 'integer', 'float', 'boolean', 'string', 'enum', 'color' ]
    },
    'color'      : {
        component : jest.fn(),
        type      : 'color',
        dataTypes : [ 'color' ]
    },
    'card'      : {
        component : jest.fn(),
        type      : 'card',
        label        : 'Card',
        dataTypes : [ 'integer', 'float', 'boolean', 'string', 'enum', 'color' ],
        isMulti      : true
    },
    'pushButton'  : {
        component : jest.fn(),
        type      : 'pushButton',
        label     : 'Push Button',
        dataTypes : [ 'boolean' ],
        retained  : false
    },
    'testWithRetainedTrue'  : {
        component : jest.fn(),
        type      : 'pushButton',
        dataTypes : [ 'boolean' ],
        retained  : true
    },
    'testWithRetainedFalse': {
        component : jest.fn(),
        type      : 'pushButton',
        dataTypes : [ 'boolean' ],
        retained  : false
    },
    'testWithRetainedUndefined': {
        component : jest.fn(),
        type      : 'pushButton',
        dataTypes : [ 'boolean' ],
        retained  : void 0
    },
}

export const WIDGETS_MAP_MOCK = WIDGETS_LIST_MOCK.reduce((acc, widget) => {
    const { type, ...opts } = widget;

    return { ...acc, [type]: opts };
}, {});

export const THERMOSTAT_DEFAULT_STEP_INT_MOCK = 1;
export const THERMOSTAT_DEFAULT_STEP_FLOAT_MOCK = 0.1;


export const WIDGET_COLORS_MOCK = [
    { value: 'blue-green' },
    { value: 'white' },
    { value: 'blue' },
    { value: 'green' }
];
