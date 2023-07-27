import * as json from './json';

describe('json utils', () => {
    describe('safeParseJSON()', () => {
        it('valid json', () => {
            const obj = { test: [ 'test' ] };

            const result = json.safeParseJSON(JSON.stringify(obj));

            expect(result).toEqual(obj);
        });

        it('invalid json', () => {
            const result = json.safeParseJSON('{ invalid }');

            expect(result).toEqual({});
        });

        it('invalid with default value', () => {
            const result = json.safeParseJSON('{ invalid }', 'default');

            expect(result).toEqual('default');
        })
    });
});
