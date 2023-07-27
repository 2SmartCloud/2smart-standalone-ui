import moment from 'moment';

export function mapBackupTO(backup) {
    const { backupName, birthTime } = backup;
    const time = moment(birthTime).format('HH:mm, DD/MM/YYYY');
    const label = `${backupName} ${time}`;

    return {
        name        : backupName,
        timestamp   : birthTime,
        value       : label,
        timePrecise : moment(birthTime).format('HH:mm:ss, DD/MM/YYYY'),
        label,
        time
    };
}
