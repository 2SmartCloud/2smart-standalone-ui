import { getHomieErrorMessage } from './errors';

describe('errors utils', () => {
    describe('getHomieErrorMessage()', () => {
        it('should return error message from map', () => {
            expect(getHomieErrorMessage('ERROR')).toBe('Error');
            expect(getHomieErrorMessage('VALIDATION')).toBe('Validation error');
            expect(getHomieErrorMessage('TIMEOUT')).toBe('Timeout error');
        });

        it('should format message from code while code is unknown', () => {
            const given = 'SOME_ANOTHER_ERROR';
            const expected = 'Some another error';

            const result = getHomieErrorMessage(given);

            expect(result).toBe(expected);
        });
    });
});
