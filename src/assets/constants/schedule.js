import moment from 'moment';

const weekdays = moment.weekdays()
    .map((weekday, index) => ({
        id    : index,
        label : weekday,
        value : `${index}`
    }));

export const DAYS_OF_WEEK = weekdays.concat(weekdays.shift());

export const MONTH_DAYS = [ ...Array(31).keys() ]
    .map((item, index) => ({
        id    : index,
        label : `${index + 1}`,
        value : `${index + 1}`
    }));

export const MONTH_LIST = moment.months()
    .map((month, index) => ({
        id    : index,
        label : month,
        value : `${index}`
    }));

export const DEFAULT_CRON_EXP = '0 0 * * *';
