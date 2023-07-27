import widgetsList from '../../components/widgets';

/* GENERAL WIDGET CONSTANTS */

export const WIDGET_PROCESSING_DELAY = 1000;
export const WIDGETS_GRID_BREAKPOINTS = { lg: 1024, md: 767, sm: 0 };
export const DEFAULT_WIDGET_SCALES = { w: 1, h: 1 };

export const WIDGETS_MAP = widgetsList.reduce((acc, widget) => {
    const { type, ...opts } = widget;

    return { ...acc, [type]: opts };
}, {});
export const WIDGET_OPTIONS = widgetsList.map(widget => ({ value: widget.type, label: widget.label }));
export const WIDGET_TYPES = widgetsList.map(widget => widget.type);
// export const WIDGET_LABELS = widgetsList.map(widget => widget.label);

export const WIDGET_SCALES_MAP = widgetsList.reduce((acc, widget) => {
    const { type, scales } = widget;
    const widgetScales = scales || DEFAULT_WIDGET_SCALES;

    return {
        ...acc,
        [type] : {
            lg : widgetScales,
            md : widgetScales,
            sm : widgetScales
        }
    };
}, {});

/* END */

/* SPECIAL WIDGET CONSTANTS */

export const GAUGE_DEFAULT_MIN = 0;
export const GAUGE_DEFAULT_MAX = 100;

export const THERMOSTAT_DEFAULT_STEP_INT = 1;
export const THERMOSTAT_DEFAULT_STEP_FLOAT = 0.1;

export const SLIDER_DEFAULT_STEP_INT = 1;
export const SLIDER_DEFAULT_STEP_FLOAT = 0.1;
export const SLIDER_DEFAULT_MIN = 0;
export const SLIDER_DEFAULT_MAX = 100;

export const WIDGET_COLORS = [
    { value: 'blue-green' },
    { value: 'white' },
    { value: 'blue' },
    { value: 'green' },
    { value: 'yellow' },
    { value: 'orange' },
    { value: 'red' },
    { value: 'violet' },
    { value: 'light-blue' },
    { value: 'light-green' },
    { value: 'pink' }
];

export const DEFAULT_WIDGET_COLOR_VALUE = 'blue-green';

export const ALARM_WIDGET_TOPICS = [
    {
        hardwareKey   : 'alarmState',
        order         : 0,
        hardwareLabel : 'Alarm state entity',
        isRetained    : true,
        isSettable    : true
    }, {
        hardwareKey   : 'emergency',
        order         : 1,
        hardwareLabel : 'Emergency entity',
        isRetained    : true,
        isSettable    : false
    }, {
        hardwareKey   : 'alarmButton',
        order         : 2,
        hardwareLabel : 'Alarm button entity',
        isRetained    : false,
        isSettable    : true

    }
];

export const BULB_WIDGET_TOPICS = [
    {
        hardwareKey   : 'bulbState',
        order         : 0,
        hardwareLabel : 'Bulb state entity',
        isRetained    : true,
        isSettable    : true,
        dataTypes     : [ 'boolean' ]
    }, {
        hardwareKey   : 'brightnessLevel',
        order         : 1,
        hardwareLabel : 'Brightness level entity',
        isRetained    : true,
        isSettable    : true,
        dataTypes     : [ 'integer', 'float' ]
    }
];

export const SCHEDULE_WIDGET_TOPICS = [
    {
        hardwareKey   : 'startTime',
        order         : 0,
        hardwareLabel : 'Start time entity',
        isRetained    : true,
        isSettable    : true,
        dataTypes     : [ 'string' ]
    }, {
        hardwareKey   : 'endTime',
        order         : 1,
        hardwareLabel : 'End time entity',
        isRetained    : true,
        isSettable    : true,
        dataTypes     : [ 'string' ]
    }
];

export const SIGNAL_PROGRESS_STEPS = {
    NO_SIGNAL : {
        percent : 0,
        label   : 'No signal'
    },
    LOW_SIGNAL : {
        percent : 25,
        label   : 'Low signal'
    },
    MEDIUM_SIGNAL : {
        percent : 50,
        label   : 'Medium signal'
    },
    GOOD_SIGNAL : {
        percent : 75,
        label   : 'Good signal'
    },
    EXCELLENT_SIGNAL : {
        percent : 100,
        label   : 'Excellent signal'
    }
};

export const BATTERY_PROGRESS_STEPS = {
    EMPTY : {
        percent : 24,
        color   : '#E80616',
        label   : 'Empty'
    },
    LOW : {
        percent : 49,
        color   : '#FA7B02',
        label   : 'Low'
    },
    MEDIUM : {
        percent : 74,
        color   : '#fdda64',
        label   : 'Medium'
    },
    FULL : {
        percent : 100,
        color   : '#78C43D',
        label   : 'Full'
    }
};

/* END */
