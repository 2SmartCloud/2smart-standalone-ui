import React            from 'react';
import { shallow }      from 'enzyme';
import ScenariosListRow from './ScenariosListRow';
import SetpointValue    from './SetpointValue';
import ProIcon          from '../../../base/icons/Pro';
import Image            from '../../../base/Image';

import { SCENARIOS_LIST_MOCK } from '../../../../__mocks__/servicesMock';
import { debug } from 'webpack';

describe('ScenariosListRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ScenariosListRow {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    describe('handleSwitchChange() should call updateScenarioState', () => {
        it('ACTIVE', async () => {
            wrapper.setProps({ scenario: { id: '1', homieState: 'true', type:'simple', rootTopic: 'rootTopic' } });

            await instance.handleSwitchChange();

            expect(instance.props.updateScenarioState).toHaveBeenCalledWith('rootTopic', false);
        });

        it('INACTIVE', async () => {
            wrapper.setProps({ scenario: { id: '1', homieState: 'false', type:'simple', rootTopic: 'rootTopic' } });

            await instance.handleSwitchChange();

            expect(instance.props.updateScenarioState).toHaveBeenCalledWith('rootTopic', true);
        });
    });

    it('handleDeleteScenario() should call deleteScenario prop', () => {
        instance.handleDeleteScenario();

        expect(instance.props.deleteScenario).toHaveBeenCalledWith(instance.props.scenario);
    });


    it('handleOpenSetpointModal  sholuld call openSetpointsModal prop', () => {
        const scenario = {id:'id',title:'title'};
        wrapper.setProps({scenario:scenario});
        instance.handleOpenSetpointModal(scenario);
        expect(instance.props.openSetpointsModal).toHaveBeenCalledWith(scenario);
    });

    it('shouldn\'t render controls if renderControl prop not exist', () => {
        wrapper.setProps({
            scenario:{
                setpoints: [{id:'id',title:'title', value:'value'}]
            }
        });
        const render = shallow(instance.renderSetpoints());

        expect(render.find('.SetpointsContainer').length).toBe(1);
    });

    describe('renderScenarioType() should return scenario type depending on mode', () => {
        it('ADVANCED', () => {
            wrapper.setProps({ scenario: { mode: 'ADVANCED' } });

            const render = shallow(instance.renderScenarioType());

            expect(render.find('.proIcon').length).toBe(1);
        });

        it('SIMPLE', () => {
            wrapper.setProps({ scenario: { mode: 'SIMPLE', icon: 'http://some-icon-url' } });

            const render = shallow(instance.renderScenarioType());

            expect(render.find('.simpleScenarioIcon').length).toBe(1);
        });
    });

    function getMockProps() {
        return {
            renderContent                     : jest.fn(),
            scenario                          : SCENARIOS_LIST_MOCK[0],
            deleteScenario                    : jest.fn(),
            updateScenario                    : jest.fn(),
            updateScenarioState               : jest.fn(),
            callExtensionNotExistNotification : jest.fn(),
            openSetpointsModal                : jest.fn()
        };
    }
});
