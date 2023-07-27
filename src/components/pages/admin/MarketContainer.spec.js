import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import { EXTENSIONS_ENTITIES_MOCK_LIST, EXTENSIONS_MOCK_LIST } from '../../../__mocks__/extensionServiceMock';
import MarketContainer from './MarketContainer';

jest.mock('../../../actions/marketServices');


describe('MarketContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<MarketContainer store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockAppState() {
        return {
            marketServices : {
                list       : [],
                isFetching : false
            },
            userServices : {
                list       : [],
                isFetching : false
            },
            extensions : {
                installedEntities : {
                    list       : EXTENSIONS_ENTITIES_MOCK_LIST,
                    isFetching : true
                },
                list        : EXTENSIONS_MOCK_LIST,
                isFetching  : false,
                isUpdating  : false,
                searchQuery : '',
                sortOrder   : 'ASC',
                currentPage : 1
            },
            location : { pathname: 'market#extensions' }
        };
    }

    function getMockBoundActions() {
        return {
            setMarketSearchQuery     : jest.fn(),
            setMarketSortOrder       : jest.fn(),
            setMarketCurrentPage     : jest.fn(),
            installMarketService     : jest.fn(),
            checkMarketServiceUpdate : jest.fn(),
            updateMarketService      : jest.fn(),
            deleteMarketService      : jest.fn(),
            setExtensionsSearchQuery : jest.fn(),
            setExtensionsSortOrder   : jest.fn(),
            checkExtensionUpdate     : jest.fn(),
            setExtensionsCurrentPage : jest.fn(),
            getExtensions            : jest.fn(),
            updateExtension          : jest.fn(),
            deleteExtension          : jest.fn(),
            createExtensionEntity    : jest.fn()
        };
    }
});
