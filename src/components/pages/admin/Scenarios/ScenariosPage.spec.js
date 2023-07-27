import React from 'react';
import { shallow } from 'enzyme';
import { SCENARIO_CREATE } from '../../../../assets/constants/routes';
import history from '../../../../history';
import LoadingNotification from '../../../base/LoadingNotification';
import ScenariosPage from './ScenariosPage';
import { SIMPLE_SCENARIO_TYPES_MOCK } from '../../../../__mocks__/simpleScenarioTypesMock';

jest.mock('../../../../history');

describe('ScenariosPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ScenariosPage {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render loader', () => {
        wrapper.setProps({ userServices: { isFetching: true } });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('handleCreateScenario() should redirect to the create page', () => {
        instance.handleCreateScenario({ mode: 'SIMPLE', type: 'test' });

        expect(history.push).toHaveBeenCalledWith(`${SCENARIO_CREATE}?mode=SIMPLE&type=test`);
    });

    it('handleDeleteScenarioClick() should set modal context and open modal', () => {
        spyOn(instance, 'handleModalOpen').and.stub();
        spyOn(instance, 'deleteScenario').and.stub();

        const scenario = { id: 'test', title: 'Test Scenario' };
        const expected = {
            title  : 'Delete Test Scenario',
            text   : 'You will not be able to recover this scenario!',
            labels : { submit: 'Yes, delete scenario', cancel: 'Cancel' }
        };

        instance.handleDeleteScenarioClick(scenario);

        expect(instance.modalContext).toBe('test');
        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();
        expect(instance.deleteScenario).toHaveBeenCalled();
    });

    it('handleOpenSetpointsModal() should set open state for setpoint modal', () => {
        instance.handleOpenSetpointsModal({ title: 'Title', id:'id' });

        const expected = {
            isOpen       : true,
            title        : 'Setpoint list of scenario Title',
            scenarioId   : 'id'
        };

        expect(wrapper.state().setpointModal).toEqual(expected);
    });

    it('handleCloseSetpointsModal() should set closed state', () => {
        wrapper.setState({ setpointModal: { isOpen: true } });
        expect(wrapper.state().setpointModal.isOpen).toBeTruthy();

        instance.handleCloseSetpointsModal();

        expect(wrapper.state().setpointModal.isOpen).toBeFalsy();
    });

    it('handleModalOpen() should set open state for modal', () => {
        instance.handleModalOpen({ title: 'Modal title', text: 'modal text', labels: { submit: 'Submit' } });

        const expected = {
            isOpen       : true,
            isProcessing : false,
            title        : 'Modal title',
            text         : 'modal text',
            labels       : { submit: 'Submit' }
        };

        expect(wrapper.state().modal).toEqual(expected);
    });

    it('handleModalClose() should set closed state', () => {
        wrapper.setState({ modal: { isOpen: true } });
        expect(wrapper.state().modal.isOpen).toBeTruthy();

        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBeFalsy();
    });

    it('getSimpleScenarioTypeOptions() should return options list', () => {
        const result = instance.getSimpleScenarioTypeOptions();
        const expected = [
            { value: '1', label: 'Test Title', icon: 'foo/bar.svg' }
        ];

        expect(result).toEqual(expected);
    });

    it('deleteScenario() should call deleteScenario and close modal', async () => {
        spyOn(instance, 'handleModalClose');
        instance.modalContext = '1';

        await instance.deleteScenario('1');

        expect(instance.props.deleteScenario).toHaveBeenCalledWith('1');
        expect(instance.handleModalClose).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            installedExtensions : {
                list       : SIMPLE_SCENARIO_TYPES_MOCK,
                isFetching : false,
                isUpdating : false
            },
            scenarios : {
                list        : [],
                isFetching  : false,
                isUpdating  : false,
                searchQuery : '',
                sortOrder   : 'ASC',
                currentPage : 1
            },
            isTresholdFetching :false,
            setSearchQuery : jest.fn(),
            setSortOrder   : jest.fn(),
            setCurrentPage : jest.fn(),
            updateScenario : jest.fn(),
            deleteScenario : jest.fn()
        };
    }
});
