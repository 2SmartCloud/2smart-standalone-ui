import moment from 'moment';
import * as backups from './backups';

describe('backups mappers', () => {
    it('mapBackupTO()', () => {
        const now = new Date().valueOf();

        const given = {
            backupName : 'dump_10.tar.gz',
            birthTime  : now
        };
        const expected = {
            name        : 'dump_10.tar.gz',
            timestamp   : now,
            time        : moment(now).format('HH:mm, DD/MM/YYYY'),
            timePrecise : moment(now).format('HH:mm:ss, DD/MM/YYYY'),
            value       : `dump_10.tar.gz ${moment(now).format('HH:mm, DD/MM/YYYY')}`,
            label       : `dump_10.tar.gz ${moment(now).format('HH:mm, DD/MM/YYYY')}`
        };

        const result = backups.mapBackupTO(given);

        expect(result).toEqual(expected);
    });
});
