import * as dateUtils from './date';

const MOCK_DATE = 1598957157018; // 01.09.20 13:45:57

describe('notifications mappers', () => {
    describe('formatDate()', () => {
        it('should format date', () => {
            const result = dateUtils.formatDate({ date: MOCK_DATE, format: 'DD.MM.YY' })

            expect(result).toEqual('01.09.20');
        });
    });
});
