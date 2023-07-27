import moment from 'moment';
import * as logs from './logs';

describe('logs mappers', () => {
    describe('mapSystemLogTOToSystemLog()', () => {
        it('generic message', () => {
            const given = {
                containerName : 'Test container',
                logMessage    : 'Error message',
                timestamp     : 1584354211387,
                logLevel      : 'error'
            };
            const expected = {
                container   : 'Test container',
                message     : 'Error message',
                time        : moment(1584354211387).format('HH:mm, DD/MM/YYYY'),
                timePrecise : moment(1584354211387).format('HH:mm:ss, DD/MM/YYYY'),
                level       : 'error'
            };

            const { id, ...result } = logs.mapSystemLogTOToSystemLog(given);

            expect(result).toEqual(expected);
            expect(id).toBeDefined();
        });

        it('object message should be serialized to JSON', () => {
            const given = {
                containerName : 'Test container',
                logMessage    : { type: 'error', message: 'error message' },
                timestamp     : 1584354211387,
                logLevel      : 'error'
            };

            const result = logs.mapSystemLogTOToSystemLog(given);

            expect(JSON.parse(result.message)).toEqual({ type: 'error', message: 'error message' });
        });
    });

    it('mapSystemLogsQuery()', () => {
        const given = {
            searchQuery : 'test',
            sortOrder   : 'asc',
            logLevel    : 'warning',
            limit       : 10
        };
        const expected = {
            search : 'test',
            sortBy : 'time',
            order  : 'asc',
            level  : 'warning',
            limit  : 10
        };

        const result = logs.mapSystemLogsQuery(given);

        expect(result).toEqual(expected);
    });
});
