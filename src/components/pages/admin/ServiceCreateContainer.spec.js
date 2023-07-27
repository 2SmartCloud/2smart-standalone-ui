import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import LoadingNotification from '../../base/LoadingNotification';
import CustomForm from './shared/CustomForm';
import ServiceCreateContainer from './ServiceCreateContainer';
import history from '../../../history';
import { NOT_FOUND, SERVICES } from '../../../assets/constants/routes';
import { MARKET_SERVICES_MOCK_LIST } from '../../../__mocks__/marketServicesMock';

jest.mock('../../../actions/userServices');
jest.mock('../../../history');

describe('ServiceCreateContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ServiceCreateContainer {...mockProps} store={mockStore} />).dive().dive();
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
            marketServices : { list: [], isFetching: false }
        });

        expect(instance.redirectByTimeout).toHaveBeenCalled();
    });

    describe('handleAddService()', () => {
        it('should call create request and handle processing' ,async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();

            const expectedPayload = {
                type : 'knx',
                configuration : { test: 'test', test2: 'test2' }
            };

            await instance.handleAddService({ test: 'test', test2: 'test2' });

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.createBridgeEntity).toHaveBeenCalledWith(expectedPayload);
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if create request failed', async () => {
            wrapper.setProps({
                createBridgeEntity : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.handleAddService({ test: 'test', test2: 'test2' });

            expect(instance.props.createBridgeEntity).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
        });
    });

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

        expect(result).toEqual(MARKET_SERVICES_MOCK_LIST[0]);
    });

    function getMockProps() {
        return { location: { query: { type: 'knx' } } };
    }

    function getMockAppState() {
        return {
            marketServices : {
                list       : MARKET_SERVICES_MOCK_LIST,
                isFetching : false
            }
        };
    }

    function getMockBoundActions() {
        return {
            createBridgeEntity : jest.fn()
        };
    }
});
