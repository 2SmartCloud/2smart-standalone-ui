import moment from 'moment';
import uuidv4 from 'uuid/v4';

export function mapSystemLogTOToSystemLog(systemLog) {
    const { containerName, logMessage, timestamp, logLevel } = systemLog;

    return {
        id          : uuidv4(),
        container   : containerName,
        message     : ensureString(logMessage),
        time        : moment(timestamp).format('HH:mm, DD/MM/YYYY'),
        timePrecise : moment(timestamp).format('HH:mm:ss, DD/MM/YYYY'),
        level       : logLevel
    };
}

export function mapSystemLogsQuery(query) {
    const { searchQuery, sortOrder, logLevel, limit } = query;

    return {
        search : searchQuery,
        sortBy : 'time',
        order  : sortOrder,
        level  : logLevel,
        limit
    };
}

function ensureString(value) {
    return typeof value === 'object'
        ? JSON.stringify(value, undefined, 4)
        : value;
}
