import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import LoadingNotification from '../../base/LoadingNotification';
import CustomForm from './shared/CustomForm';
import ServiceEditContainer from './ServiceEditContainer';
import history from '../../../history';
import { NOT_FOUND, SERVICES } from '../../../assets/constants/routes';
import { MARKET_SERVICES_MOCK_LIST } from '../../../__mocks__/marketServicesMock';
import {USER_SERVICES_LIST_MOCK, REST_ADAPTER_SERVICE} from '../../../__mocks__/userServicesMock';

jest.mock('../../../actions/userServices');
jest.mock('../../../history');

describe('ServiceEditContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ServiceEditContainer {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({
            marketServices : { isFetching: true }
        });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('should render form', () => {
        const form = wrapper.find(CustomForm);

        expect(form).toBeTruthy();
    });

    it('should call redirectByTimeout if configuration is not found', () => {
        instance.redirectByTimeout = jest.fn();

        wrapper.setProps({
            marketServices : { list: [], isFetching: false },
            userServices   : { list: [], isFetching: false },
        });

        expect(instance.redirectByTimeout).toHaveBeenCalled();
    });

    it('handleModalOpen() should set open state for modal', () => {
        instance.handleModalOpen({ title: 'test', text: 'text', labels: { submit: 'submit', cancel: 'cancel' } });

        expect(wrapper.state().modal.isOpen).toBeTruthy();
        expect(wrapper.state().modal.isProcessing).toBeFalsy();
        expect(wrapper.state().modal.title).toBe('test');
        expect(wrapper.state().modal.text).toBe('text');
        expect(wrapper.state().modal.labels).toEqual({ submit: 'submit', cancel: 'cancel' });
    });

    it('handleModalClose() should set closed state', () => {
        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBeFalsy();
        expect(wrapper.state().modal.isProcessing).toBeUndefined();
        expect(wrapper.state().modal.title).toBeUndefined();
        expect(wrapper.state().modal.text).toBeUndefined();
        expect(wrapper.state().modal.labels).toBeUndefined();
    });

    describe('handleUpdateService()', () => {
        // old logic

        // it('should call for confirmation modal if service has running state', () => {
        //     const service = { state: 'started' };
        //     const payload = { test: 'test' };

        //     spyOn(instance, 'getServiceToEdit').and.returnValue(service);
        //     spyOn(instance, 'handleConfirmModalOpen').and.stub();

        //     instance.handleUpdateService(payload);

        //     expect(instance.handleConfirmModalOpen).toHaveBeenCalledWith(service, payload);
        // });

        it('should call update otherwise', () => {
            const service = { state: 'stopped' };
            const payload = { test: 'test' };

            spyOn(instance, 'getServiceToEdit').and.returnValue(service);
            spyOn(instance, 'updateService').and.stub();

            instance.handleUpdateService(payload);

            expect(instance.updateService).toHaveBeenCalledWith(payload);
        });
    });

    it('handleConfirmUpdate() should close modal and call update', () => {
        instance.modalContext = { test: 'test' };

        spyOn(instance, 'handleModalClose').and.stub();
        spyOn(instance, 'updateService').and.stub();

        instance.handleConfirmUpdate();

        expect(instance.handleModalClose).toHaveBeenCalled();
        expect(instance.updateService).toHaveBeenCalledWith({ test: 'test' });
    });

    // old logic

    // it('handleConfirmModalOpen() should call open modal', () => {
    //     spyOn(instance, 'getServiceConfiguration').and.callFake(type => ({ label: type }));
    //     spyOn(instance, 'handleModalOpen').and.stub();

    //     const service = { type: 'knx' };
    //     const fields = { test: 'test' };
    //     const expected = {
    //         title  : 'Update knx',
    //         text   : 'To add the change for the instance knx\nwe will do an update for this instance.',
    //         labels : { submit: 'Yes, update', cancel: 'Cancel' }
    //     };

    //     instance.handleConfirmModalOpen(service, fields);

    //     expect(instance.modalContext).toEqual(fields);
    //     expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);
    // });

    it('handlePushBack() should do navigation back ', () => {
        instance.handlePushBack();

        expect(history.push).toHaveBeenCalledWith(SERVICES);
    });

    it('handleStartProcessing() should set processing state', () => {
        wrapper.setState({
            isProcessing : false,
            errors       : { test: 'test' }
        });

        instance.handleStartProcessing();

        expect(wrapper.state().isProcessing).toBeTruthy();
        expect(wrapper.state().errors).toBeNull();
    });

    it('handleSuccess() should set success state and navigate back', () => {
        spyOn(instance, 'handlePushBack').and.stub();

        wrapper.setState({ isProcessing: true });

        instance.handleSuccess();

        expect(wrapper.state().isProcessing).toBeFalsy();
        expect(instance.handlePushBack).toHaveBeenCalled();
    });

    it('handleError() should set error state', () => {
        wrapper.setState({ isProcessing: true });

        instance.handleError({ fields: { test: 'test' } });

        expect(wrapper.state().isProcessing).toBeFalsy();
        expect(wrapper.state().errors).toEqual({ test: 'test' });
    });

    it('handleInteract() should clear error for given field name', () => {
        const givenErrors = {
            field1 : 'value1',
            field2 : 'value2',
            field3 : 'value3'
        };
        const expectedErrors = {
            field1 : 'value1',
            field2 : null,
            field3 : 'value3'
        };

        wrapper.setState({ errors: givenErrors });

        instance.handleInteract('field2');

        expect(wrapper.state().errors).toEqual(expectedErrors);
    });

    it('getServiceConfiguration() should return configuration for given service type', () => {
        const result = instance.getServiceConfiguration('knx');
        const idField= {
            label : 'Service ID',
            name  : 'ID',
            type  : 'id'
        }
        expect(result).toEqual({
            ...MARKET_SERVICES_MOCK_LIST[0],
            fields: [...MARKET_SERVICES_MOCK_LIST[0].fields, idField]
        });
    });


    it('getInitialState() should return initial state for rest-adapter', () => {
        const result = instance.getInitialState(REST_ADAPTER_SERVICE);

        expect(result).toEqual({...REST_ADAPTER_SERVICE.params,ID:'1'});
    });


    it('getServiceToEdit() should return service from list by id url query param', () => {
       const result = instance.getServiceToEdit();

       expect(result).toEqual(USER_SERVICES_LIST_MOCK[0]);
    });

    describe('updateService', () => {
        it('should call update request and handle processing', async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();

            const payload = { test: 'test', test2: 'test2' };

            await instance.updateService(payload);

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.updateBridgeEntity).toHaveBeenCalledWith('1', payload);
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if update request failed', async () => {
            wrapper.setProps({
                updateBridgeEntity : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.updateService({ test: 'test', test2: 'test2' });

            expect(instance.props.updateBridgeEntity).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
        });
    });

    function getMockProps() {
        return { match: { params: { id: '1' } } };
    }

    function getMockAppState() {
        return {
            marketServices : {
                list       : MARKET_SERVICES_MOCK_LIST,
                isFetching : false
            },
            userServices : {
                list       : USER_SERVICES_LIST_MOCK,
                isFetching : false,
                isUpdating : false
            }
        };
    }

    function getMockBoundActions() {
        return {
            updateBridgeEntity : jest.fn()
        };
    }
});
