import moment from 'moment';

moment.updateLocale('en', {
    relativeTime : {
        future : 'in %s',
        past   : '%s ago',
        s      : 'now',
        ss     : 'now',
        m      : '1 minute',
        mm     : '%d minutes',
        h      : '1 hour',
        hh     : '%d hours',
        d      : '1 day',
        dd     : '%d days',
        M      : '1 month',
        MM     : '%d months',
        y      : '1 year',
        yy     : '%d years'
    }
});

export function  getHumanizeLabel(lastActivity) {
    const now = moment();
    const timestamp = Number(lastActivity);
    const lastSeen = moment(timestamp);

    if (!lastActivity || !lastSeen.isValid()) return '';

    const diff = now.diff(lastSeen);
    const duration = moment.duration(diff);
    const durationLabel = duration.humanize();
    const prefix = duration.asSeconds() > 59 ? ' ago' : '';

    return `${durationLabel}${prefix}`;
}
