import * as sort from './sort';

const backups = [
    { timestamp: 1586340001290 },
    { timestamp: 1586244545431 },
    { timestamp: 1586307020974 },
    { timestamp: 1586336754880 },
    { timestamp: 1586332800767 },
    { timestamp: 1586278801200 }
];

describe('sort utils', () => {
    describe('sortBackups()', () => {
        it('should sort in ascending order', () => {
            const expected = [
                { timestamp: 1586244545431 },
                { timestamp: 1586278801200 },
                { timestamp: 1586307020974 },
                { timestamp: 1586332800767 },
                { timestamp: 1586336754880 },
                { timestamp: 1586340001290 }
            ];

            const result = sort.sortBackups(backups, 'ASC');

            expect(result).toEqual(expected);
        });

        it('should sort in descending order', () => {
            const expected = [
                { timestamp: 1586340001290 },
                { timestamp: 1586336754880 },
                { timestamp: 1586332800767 },
                { timestamp: 1586307020974 },
                { timestamp: 1586278801200 },
                { timestamp: 1586244545431 }
            ];

            const result = sort.sortBackups(backups, 'DESC');

            expect(result).toEqual(expected);
        });
    });


    describe('sortEntitiesByType()', () => {
        const entities = [
            { label: 'some', type: 'device' },
            { label: 'abc', type: 'device' },
            { label: 'Dfe', type: 'device' },
            { label: 'Gfl', type: 'device' },
            { label: 'wop', type: 'node' }
        ];

        it('should sort in ascending order by default if typesOrder not defined', () => {
            const expected = [
                { label: 'abc', type: 'device' },
                { label: 'Dfe', type: 'device' },
                { label: 'Gfl', type: 'device' },
                { label: 'some', type: 'device' },
                { label: 'wop', type: 'node' }
            ];

            const result = sort.sortEntitiesByType(entities);

            expect(result).toEqual(expected);
        });

        it('should sort by typesOrder in ascending order', () => {
            const typesOrder = [ 'node', 'device' ];

            const expected = [
                { label: 'wop', type: 'node', sortOrder: 0 },
                { label: 'abc', type: 'device', sortOrder: 1 },
                { label: 'Dfe', type: 'device', sortOrder: 1 },
                { label: 'Gfl', type: 'device', sortOrder: 1 },
                { label: 'some', type: 'device', sortOrder: 1 }
            ];

            const result = sort.sortEntitiesByType(entities, typesOrder);

            expect(result).toEqual(expected);
        });
    });
});
