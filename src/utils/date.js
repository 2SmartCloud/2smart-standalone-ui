import moment                   from 'moment';

export function formatDate({ date, format = 'DD.MM.YY HH:mm:ss' }) {
    return moment(date).format(format);
}
