import React from 'react';
import { shallow } from 'enzyme';
import ServicesList from './ServicesList';
import * as sort from '../../../../utils/sort';
import { USER_SERVICES_LIST_MOCK } from '../../../../__mocks__/userServicesMock';
import ProcessingIndicator from '../../../base/ProcessingIndicator';
import ServicesListRow from './ServicesListRow';

describe('ServicesList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        setupSpies();

        const mockProps = getMockProps();

        wrapper = shallow(<ServicesList {...mockProps} />);
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

    it('should render loader if isUpdating is true', () => {
        wrapper.setProps({ isUpdating: true });

        const loader = wrapper.find(ProcessingIndicator);

        expect(loader).toBeDefined();
    });

    it('should render services list', () => {
        wrapper.setProps({ list: USER_SERVICES_LIST_MOCK });

        const servicesRows = wrapper.find(ServicesListRow);

        expect(servicesRows.length).toBeGreaterThan(0);
    });

    describe('getFilteredList()', () => {
        it('should return ordered list', () => {
            wrapper.setProps({
                list : USER_SERVICES_LIST_MOCK.slice(0, 4)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    id: '3',
                    title: 'Awesome bridge',
                    type: 'modbus',
                    state  : 'started',
                    params : {}
                },
                {
                    id: '1',
                    title: 'Bridge test',
                    type: 'knx',
                    state  : 'started',
                    params : {}
                },
                {
                    id: '4',
                    type: 'knx',
                    state  : 'started',
                    params : {}
                },
                {
                    id: '2',
                    type: 'modbus',
                    state  : 'started',
                    params : {}
                }
            ];

            expect(result).toEqual(expected);
        });

        it('should return filtered by searchQuery and ordered list', () => {
            wrapper.setProps({
                searchQuery : 'bridge',
                list        : USER_SERVICES_LIST_MOCK.slice(0, 4)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    id: '3',
                    title: 'Awesome bridge',
                    type: 'modbus',
                    state  : 'started',
                    params : {}
                },
                {
                    id: '1',
                    title: 'Bridge test',
                    type: 'knx',
                    state  : 'started',
                    params : {}
                }
            ];

            expect(result).toEqual(expected);
        });
    });

    it('getPaginatedList()', () => {
        wrapper.setProps({ currentPage: 2 });

        const result = instance.getPaginatedList(USER_SERVICES_LIST_MOCK);

        expect(result).toHaveLength(10);
        expect(result).toEqual(USER_SERVICES_LIST_MOCK.slice(10, 20));
    });

    function setupSpies() {
        spyOn(sort, 'sortBridges').and.callFake(list => list.sort(testSortComparator));
    }

    function getMockProps() {
        return {
            list              : [],
            sortOrder         : 'ASC',
            currentPage       : 1,
            onChangePage      : jest.fn(),
            onDeleteService   : jest.fn(),
            activateService   : jest.fn(),
            deactivateService : jest.fn()
        };
    }
});

function testSortComparator(a, b) {
    const aField = a.title || a.type;
    const bField = b.title || b.type;

    return aField.localeCompare(bField);
}
