import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import LoadingNotification from '../../base/LoadingNotification';
import CustomForm from './shared/CustomForm';
import NotificationChannelCreateContainer from './NotificationChannelCreateContainer';
import history from '../../../history';
import { NOT_FOUND, NOTIFICATION_CHANNELS } from '../../../assets/constants/routes';
import { NOTIFICATION_CHANNELS_LIST_MOCK, USER_NOTIFICATION_CHANNELS_LIST_MOCK } from '../../../__mocks__/notificationChannelsMock';

jest.mock('../../../actions/userServices');
jest.mock('../../../history');

describe('NotificationChannelCreateContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<NotificationChannelCreateContainer {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({
            channels : { isFetching: true }
        });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('should render form', () => {
        const form = wrapper.find(CustomForm);

        expect(form).toBeTruthy();
    });

    it('should do redirect if configuration is not found', () => {
        wrapper.setProps({
            channels : { list: [] }
        });

        expect(history.push).toHaveBeenCalledWith(NOT_FOUND);
    });

    describe('handleAddNotificationChannel()', () => {
        it('should call create request and handle processing' ,async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();

            const expectedPayload = {
                type          : 'telegram',
                alias         : 'some',
                configuration : {}
            };

            await instance.handleAddNotificationChannel({ alias: 'some' });

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.createUserNotificationChannel).toHaveBeenCalledWith(expectedPayload);
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if create request failed', async () => {
            wrapper.setProps({
                createUserNotificationChannel : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.handleAddNotificationChannel({ test: 'test', test2: 'test2' });

            expect(instance.props.createUserNotificationChannel).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
        });
    });

    it('handlePushBack() should do navigation back ', () => {
        instance.handlePushBack();

        expect(history.push).toHaveBeenCalledWith(NOTIFICATION_CHANNELS);
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

    it('getChannelConfiguration() should return configuration for given service type', () => {
        const result = instance.getChannelConfiguration('telegram');

        expect(result).toEqual({
            fields : [
                {
                    name        : 'alias',
                    type        : 'string',
                    label       : 'Name*',
                    placeholder : 'Name'
                },
                ...NOTIFICATION_CHANNELS_LIST_MOCK[0].configuration.fields || []
            ]
        });
    });

    if('getTrimmedValues() should return obj with trimmed values', () => {
        const obj = {
            id: '  ddd ',
            some: '    some',
            some3: 'some3   '
        };
        const result = instance.getTrimmedValues(obj);

        expect(result).toBe({ id: 'ddd', some: 'some', some3: 'some3' });
    });

    function getMockProps() {
        return { location: { query: { type: 'telegram' } } };
    }

    function getMockAppState() {
        return {
            notificationChannels: {
                channels : {
                    list       : NOTIFICATION_CHANNELS_LIST_MOCK,
                    isFetching : false
                },
                userChannels : {
                    list       : USER_NOTIFICATION_CHANNELS_LIST_MOCK,
                    isFetching : false,
                    isUpdating : false
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            createUserNotificationChannel : jest.fn()
        };
    }
});
