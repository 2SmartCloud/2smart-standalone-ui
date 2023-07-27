import React from 'react';
import { shallow } from 'enzyme';
import { MARKET_SERVICES_MOCK_LIST } from '../../../../__mocks__/marketServicesMock';
import * as sort from '../../../../utils/sort';
import MarketList from './MarketList';
import MarketListRow from './MarketListRow';

describe('MarketList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        setupSpies();

        const mockProps = getMockProps();

        wrapper = shallow(<MarketList {...mockProps } />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render no services message if there is no services', () => {
        wrapper.setProps({ list: [] });

        const noServices = wrapper.find('.noServicesMessage');

        expect(noServices).toBeDefined();
    });

    it('should render services list', () => {
        wrapper.setProps({ list: MARKET_SERVICES_MOCK_LIST });

        const servicesRows = wrapper.find(MarketListRow);

        expect(servicesRows.length).toBeGreaterThan(0);
    });

    describe('getFilteredList()', () => {
        it('should return ordered list', () => {
            wrapper.setProps({ list: MARKET_SERVICES_MOCK_LIST.slice(0, 4) });

            const result = instance.getFilteredList();
            const expected = [
                {
                    name   : 'knx',
                    label  : 'KNX Bridge',
                    icon   : 'foo/bar/icon.svg',
                    fields : [
                        {
                            name    : 'KNX_CONNECTION_IP_ADDR',
                            type    : 'string',
                            label   : 'Connection IP',
                            default : '192.168.1.1'
                        },
                        {
                            name    : 'KNX_CONNECTION_IP_PORT',
                            type    : 'integer',
                            label   : 'Connection port',
                            default : 502
                        },
                        {
                            name  : 'KNX_CONNECTION_PHYS_ADDR',
                            type  : 'string',
                            label : 'Physical address of the ip interface'
                        }
                    ],
                    status : 'installed'
                },
                {
                    name   : 'modbus',
                    label  : 'Modbus Bridge',
                    fields : [],
                    status : 'not-installed'
                },
                {
                    name   : 'test',
                    label  : 'Test',
                    fields : [],
                    status : 'not-installed'
                },
                {
                    name   : 'xiaomi',
                    label  : 'Xiaomi Bridge',
                    fields : [],
                    status : 'has-update'
                }
            ];

            expect(result).toEqual(expected);
        });

        it('should return filtered by searchQuery and ordered list', () => {
            wrapper.setProps({
                searchQuery : 'm',
                list        : MARKET_SERVICES_MOCK_LIST.slice(0, 4)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    name   : 'modbus',
                    label  : 'Modbus Bridge',
                    fields : [],
                    status : 'not-installed'
                },
                {
                    name   : 'xiaomi',
                    label  : 'Xiaomi Bridge',
                    fields : [],
                    status : 'has-update'
                }
            ];

            expect(result).toEqual(expected);
        });
    });

    it('getPaginatedList()', () => {
        wrapper.setProps({ currentPage: 2 });

        const result = instance.getPaginatedList(MARKET_SERVICES_MOCK_LIST);

        expect(result).toHaveLength(10);
        expect(result).toEqual(MARKET_SERVICES_MOCK_LIST.slice(10, 20));
    });

    function setupSpies() {
        spyOn(sort, 'sortMarketServices').and.callFake(list => list.sort(testSortComparator));
    }

    function getMockProps() {
        return {
            list             : [],
            sortOrder        : 'ASC',
            viewMode         : 'list',
            currentPage      : 1,
            onChangePage     : jest.fn(),
            onInstallService : jest.fn(),
            onCheckUpdates   : jest.fn(),
            onUpdateService  : jest.fn(),
            onDeleteService  : jest.fn()
        };
    }
});

function testSortComparator(a, b) {
    const aField = a.label;
    const bField = b.label;

    return aField.localeCompare(bField);
}
