import React from 'react';
import { shallow } from 'enzyme';
import * as sort from '../../../../utils/sort';
import ProcessingIndicator from '../../../base/ProcessingIndicator';
import ScenariosList from './ScenariosList';
import ScenariosListRow from './ScenariosListRow';
import { SCENARIOS_LIST_MOCK } from '../../../../__mocks__/servicesMock';

describe('ScenariosList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        setupSpies();

        const mockProps = getMockProps();

        wrapper = shallow(<ScenariosList {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render no scenarios message if there is no services', () => {
        wrapper.setProps({ list: [] });

        const noServices = wrapper.find('.noScenariosMessage');

        expect(noServices).toBeDefined();
    });

    it('should render loader if isUpdating is true', () => {
        wrapper.setProps({ isUpdating: true });

        const loader = wrapper.find(ProcessingIndicator);

        expect(loader).toBeDefined();
    });

    it('should render scenarios list', () => {
        wrapper.setProps({ list: SCENARIOS_LIST_MOCK });

        const servicesRows = wrapper.find(ScenariosListRow);

        expect(servicesRows.length).toBeGreaterThan(0);
    });

    it('should open setpoint modal', () => {
        const scenario = {id:'id',title:'title'};

        instance.onSetpointModalOpen(scenario)();
        expect(instance.props.onSetpointsOpen).toHaveBeenCalledWith(scenario);
    });

    describe('getFilteredList()', () => {
        it('should return ordered list', () => {
            wrapper.setProps({
                list : SCENARIOS_LIST_MOCK.slice(0, 4)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    id        : '4',
                    name      : 'scenario-4',
                    rootTopic : 'rootTopic',
                    title     : 'Awesome Scenario 4',
                    mode      : 'SIMPLE',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : '1'
                },
                {
                    id        : '2',
                    name      : 'scenario-2',
                    rootTopic : 'rootTopic',
                    title     : 'Cool Scenario 2',
                    mode      : 'ADVANCED',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : null
                },
                {
                    id        : '3',
                    name      : 'test-3',
                    rootTopic : 'rootTopic',
                    title     : 'My Test 3',
                    mode      : 'ADVANCED',
                    status    : 'INACTIVE',
                    language  : 'JS',
                    typeId    : null
                },
                {
                    id        : '1',
                    name      : 'scenario-1',
                    rootTopic : 'rootTopic',
                    title     : 'Scenario 1',
                    mode      : 'ADVANCED',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : null
                }
            ];

            expect(result).toEqual(expected);
        });

        it('should return filtered by searchQuery and ordered list', () => {
            wrapper.setProps({
                searchQuery : 'scenario',
                list        : SCENARIOS_LIST_MOCK.slice(0, 4)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    id        : '4',
                    name      : 'scenario-4',
                    rootTopic : 'rootTopic',
                    title     : 'Awesome Scenario 4',
                    mode      : 'SIMPLE',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : '1'
                },
                {
                    id        : '2',
                    name      : 'scenario-2',
                    rootTopic : 'rootTopic',
                    title     : 'Cool Scenario 2',
                    mode      : 'ADVANCED',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : null
                },
                {
                    id        : '1',
                    name      : 'scenario-1',
                    rootTopic : 'rootTopic',
                    title     : 'Scenario 1',
                    mode      : 'ADVANCED',
                    status    : 'ACTIVE',
                    language  : 'JS',
                    typeId    : null
                }
            ];

            expect(result).toEqual(expected);
        });
    });

    it('getPaginatedList()', () => {
        wrapper.setProps({ currentPage: 2 });

        const result = instance.getPaginatedList(SCENARIOS_LIST_MOCK);

        expect(result).toHaveLength(10);
        expect(result).toEqual(SCENARIOS_LIST_MOCK.slice(10, 20));
    });

    function setupSpies() {
        spyOn(sort, 'sortScenarios').and.callFake(list => list.sort(testSortComparator));
    }

    function getMockProps() {
        return {
            list               : [],
            isUpdating         : false,
            isSetpointsLoading :false,
            sortOrder          : 'ASC',
            currentPage        : 1,
            onChangePage       : jest.fn(),
            onDeleteScenario   : jest.fn(),
            onSetpointsOpen    : jest.fn(),
            updateScenario     : jest.fn(),
        };
    }
});

function testSortComparator(a, b) {
    const aField = a.title || a.name;
    const bField = b.title || b.name;

    return aField.localeCompare(bField);
}
