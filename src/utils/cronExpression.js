/* eslint-disable func-style */
export const validateCron = {
    minute : (value, isEvery) => {
        if (isEvery && value === 0) return [ '*' ];
        if (isEvery) return [ `*/${value}` ];

        return [ `${value}` ];
    },
    hour : (value, isEvery) => {
        if (isEvery && value === 0) return [ '*' ];
        if (isEvery) return [ `*/${value}` ];

        return [ `${value}` ];
    },
    dayOfTheMonth : (data) => {
        if (!data.length || data.length === 31) return [ '*' ];

        return data;
    },
    dayOfTheWeek : (data) => {
        if (!data.length || data.length === 7) return [ '*' ];

        return data;
    },
    month : (data) => {
        if (!data.length || data.length === 12) return [ '*' ];

        return data;
    }
};

const HOURS = 'HOURS';
const EVERY = '*';

export const splitMultiple = (value, field = undefined) => {
    if (value.includes(',')) {
        return value.split(',');
    }
    if (value.includes('/')) {
        return value;
    }
    if (value.includes('-') && field === HOURS) {
        return value;
    }
    if (value === EVERY) {
        return value;
    }

    return [ value ];
};

export const replaceEvery = (value) => {
    if (typeof value === 'string') {
        const every = value.replace('*/', '');

        return { on: 0, every };
    }

    return { on: value, every: 0 };
};

export const parseCronExpression = (expression) => {
    const [ minutes, hours, dayOfMonth, month, dayOfWeek ] = expression.split(' ');
    const defaultExpression = {
        minutes    : EVERY,
        hours      : EVERY,
        dayOfMonth : EVERY,
        month      : EVERY,
        dayOfWeek  : EVERY
    };

    return Object.assign(defaultExpression, {
        minutes    : replaceEvery(splitMultiple(minutes)),
        hours      : replaceEvery(splitMultiple(hours, HOURS)),
        dayOfMonth : splitMultiple(dayOfMonth),
        month      : splitMultiple(month),
        dayOfWeek  : splitMultiple(dayOfWeek)
    });
};
