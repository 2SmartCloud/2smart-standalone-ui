import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import { scenariosList } from '../../../__mocks__/scenariosMock';
import { tresholds, mappedSortedMultiScenarioSetpoints } from '../../../__mocks__/tresholdsMock';
import { EXTENSIONS_ENTITIES_MOCK_LIST, EXTENSIONS_MOCK_LIST } from '../../../__mocks__/extensionServiceMock';

import ScenariosContainer from './ScenariosContainer';

const scenarioWithSetpoint = [
    {
        id        : '1',
        isEditAllowed: true,
        typeId    : null,
        name      : 'multi',
        mode      : 'ADVANCED',
        title     : 'wertyuiwasedrftgyhujlkl; drftyuhjioklp;[] df',
        status    : 'ACTIVE',
        language  : 'JS',
        params    : null,
        setpoints : mappedSortedMultiScenarioSetpoints
    }
];

describe('ScenariosContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ScenariosContainer store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should fetch data on mount', () => {
        spyOn(instance, 'fetchData').and.stub();

        instance.componentDidMount();

        expect(instance.fetchData).toHaveBeenCalled();
    });

    it('fetchData() should fetch data', () => {
        instance.fetchData();

        expect(instance.props.getScenarios).toHaveBeenCalled();
    });

    it('getSetpoinsValues() should return scenarios list with setpoint entities', () => {
        wrapper.setProps({
            scenarios : {
                list       : scenariosList,
                isFetching : false
            }
        });
        const scenariosWithSetpoints = instance.getSetpoinsValues();

        expect(scenariosWithSetpoints).toEqual(scenarioWithSetpoint);
    });


    function getMockAppState() {
        return {
            installedExtensions : {
                list       : [],
                isFetching : false,
                isUpdating : false
            },
            scenarios : {
                list       : scenariosList,
                isFetching : false,
                isUpdating : false
            },
            homie : {
                thresholds         : tresholds,
                isTresholdFetching : false
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
            }
        };
    }

    function getMockBoundActions() {
        return {
            getScenarios : jest.fn()
        };
    }
});
