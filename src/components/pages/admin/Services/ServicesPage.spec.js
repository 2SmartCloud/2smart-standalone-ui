import React from 'react';
import { shallow } from 'enzyme';
import LoadingNotification from '../../../base/LoadingNotification';
import ServicesPage from './ServicesPage';
import { MARKET_SERVICES_MOCK_LIST } from '../../../../__mocks__/marketServicesMock';
import history from '../../../../history';
import { SERVICE_CREATE } from '../../../../assets/constants/routes';

jest.mock('../../../../history');

describe('ServicesPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ServicesPage {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({ userServices: { isFetching: true } });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('getServiceIconUrl() should return icon url', () => {
        const result = instance.getServiceIconUrl({ type: 'knx' });

        expect(result).toBe('foo/bar/icon.svg');
    });

    it('getServiceTypeName() should return service type title', () => {
        const result = instance.getServiceName({ type: 'knx' });

        expect(result).toBe('KNX Bridge');
    });

    it('getServiceTypeName() should return service service name', () => {
        const result = instance.getServiceName({ type: 'knx', params: { DEVICE_NAME: 'Test Bridge' } });

        expect(result).toBe('Test Bridge');
    });

    it('getServiceTypeOptions() should return options list for services', () => {
        const result = instance.getServiceTypeOptions();
        const expected = [
            { value: 'rest-adapter', label: 'REST Adapter', icon: 'icons/rest-adapter.svg' }
        ];

        expect(result).toEqual(expected);
    });

    it('handleCreateService() should open create service page with given type', () => {
        instance.handleCreateService('knx');

        expect(history.push).toHaveBeenCalledWith(`${SERVICE_CREATE}?type=knx`);
    });

    it('stopService() should deactivate service and open delete modal', async () => {
        spyOn(instance, 'handleDeleteModalOpen');
        spyOn(instance, 'handleModalClose');
        instance.modalContext = '1';

        await instance.stopService({ test: 'test' });

        expect(instance.props.deactivateUserService).toHaveBeenCalledWith('1');
        expect(instance.handleModalClose).toHaveBeenCalled();
        expect(instance.handleDeleteModalOpen).toHaveBeenCalledWith({ test: 'test' });
    });

    it('deleteService() should call delete service method', async () => {
        spyOn(instance, 'handleModalClose');
        instance.modalContext = '1';

        await instance.deleteService('1');

        expect(instance.props.deleteUserService).toHaveBeenCalledWith('1');
        expect(instance.handleModalClose).toHaveBeenCalled();
    });

    it('handleDeleteServiceClick() should show stop service modal if service was started', () => {
        spyOn(instance, 'handleStopModalOpen');

        const service1 = { state: 'started' };
        const service2 = { state: 'starting' };

        instance.handleDeleteServiceClick(service1);
        expect(instance.handleStopModalOpen).toHaveBeenCalledWith(service1);

        instance.handleDeleteServiceClick(service2);
        expect(instance.handleStopModalOpen).toHaveBeenCalledWith(service2);
    });

    it('handleDeleteServiceClick() should show delete service modal if service is not started', () => {
        spyOn(instance, 'handleDeleteModalOpen');

        const service = { state: 'stopped' };

        instance.handleDeleteServiceClick(service);
        expect(instance.handleDeleteModalOpen).toHaveBeenCalledWith(service);
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

    it('handleStopModalOpen() should set context and call open modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'stopService');
        spyOn(instance, 'getServiceName').and.returnValue('Service name');

        const service = { id: 'test' };
        const expected = {
            title  : 'Stop Service name',
            text   : 'Your service is running. To delete it you have to stop it.',
            labels : { submit: 'Yes, stop', cancel: 'Cancel' }
        };

        instance.handleStopModalOpen(service);

        expect(instance.modalContext).toBe('test');
        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();
        expect(instance.stopService).toHaveBeenCalledWith(service);
    });

    it('handleDeleteModalOpen() should set context and call delete modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'deleteService');
        spyOn(instance, 'getServiceName').and.returnValue('Service name');

        const service = { id: 'test' };
        const expected = {
            title  : 'Delete Service name',
            text   : 'Are you sure you want to delete this service?',
            labels : { submit: 'Yes, delete service', cancel: 'Cancel' }
        };

        instance.handleDeleteModalOpen(service);

        expect(instance.modalContext).toBe('test');
        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();
        expect(instance.deleteService).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            marketServices : {
                list : MARKET_SERVICES_MOCK_LIST,
                isFetching : false
            },
            userServices : {
                list : [],
                isFetching : false
            },
            setSearchQuery        : jest.fn(),
            setSortOrder          : jest.fn(),
            setCurrentPage        : jest.fn(),
            deleteUserService     : jest.fn().mockReturnValue(Promise.resolve()),
            activateUserService   : jest.fn().mockReturnValue(Promise.resolve()),
            deactivateUserService : jest.fn().mockReturnValue(Promise.resolve())
        };
    }
});
