import * as extensions from './index';
import {
    EXTENSIONS_ENTITIES_NOT_SERIALIZED_MOCK_LIST,
    EXTENSIONS_MOCK_LIST,
    EXTENSIONS_ENTITIES_MOCK_LIST} from '../../../__mocks__/extensionServiceMock';
    import config from '../../../../config';


describe('extension mapper', () => {
    it('mapExtension entity', () => {

        const result = extensions.mapExtensionEntity(EXTENSIONS_ENTITIES_NOT_SERIALIZED_MOCK_LIST[0]);

        expect(result).toEqual(EXTENSIONS_ENTITIES_MOCK_LIST[0]);
    });

    it('mapExtensionEntityUpdate entity', () => {

        const result = extensions.mapExtensionEntityUpdate({iconFilename: 'icon'});

        expect(result).toEqual({
            icon: `${config.apiUrl}/api/static/extension/icons/icon`
        });
    });

    it('mapExtensionEntityUpdate entity', () => {

        const result = extensions.mapExtension(EXTENSIONS_MOCK_LIST[0]);

        expect(result).toEqual({
            ...EXTENSIONS_MOCK_LIST[0],
            state : 'uninstalled'
        });
    });

    it('getExtensionTitle entity', () => {
        const smartTitle = extensions.getExtensionTitle('@2smart/time-relay');
        const randomTitle = extensions.getExtensionTitle('random-module');

        expect(smartTitle).toEqual('Time relay');
        expect(randomTitle).toEqual('random-module');
    });
});
