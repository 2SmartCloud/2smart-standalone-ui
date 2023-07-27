import * as extensions from './index';
import {
    EXTENSIONS_ENTITIES_MOCK_LIST
} from '../../../__mocks__/extensionServiceMock';

it('dumpExtension', () => {
    const result = extensions.dumpExtension(EXTENSIONS_ENTITIES_MOCK_LIST[0]);

    expect(result).toEqual(     {
    name: '@2smart/test-module',
        version: '0.4.0',
        description: '2smart test package',
        link: 'https://www.npmjs.com/package/2smart-test-module',
        language: undefined,
        type: 'simple-scenario'
      });
});

