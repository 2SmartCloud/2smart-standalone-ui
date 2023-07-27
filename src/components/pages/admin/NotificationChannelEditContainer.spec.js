import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import LoadingNotification from '../../base/LoadingNotification';
import CustomForm from './shared/CustomForm';
import NotificationChannelEditContainer, {
    REDIRECT_TIMEOUT
} from './NotificationChannelEditContainer';
import history from '../../../history';
import { NOT_FOUND, NOTIFICATION_CHANNELS } from '../../../assets/constants/routes';
import { NOTIFICATION_CHANNELS_LIST_MOCK, USER_NOTIFICATION_CHANNELS_LIST_MOCK } from '../../../__mocks__/notificationChannelsMock';

jest.mock('../../../actions/userServices');
jest.mock('../../../history');

jest.useFakeTimers();

describe('NotificationChannelEditContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        history.push.mockClear();

        const mockProps = getMockProps();
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<NotificationChannelEditContainer {...mockProps} store={mockStore} />).dive().dive();
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

    it('should do redirect if there is no configuration and channel info', () => {
        wrapper.setProps({
            channels     : { list: [{ id: 'some_wrong_id' }] },
            userChannels : { list: [{ id: 'some_wrong_id' }] }
        });

        jest.advanceTimersByTime(REDIRECT_TIMEOUT);

        expect(history.push).toHaveBeenCalledWith(NOT_FOUND);
    });

    it('redirectByTimeout() should call history push after timeout', () => {
        instance.redirectByTimeout();

        jest.advanceTimersByTime(REDIRECT_TIMEOUT);

        expect(history.push).toHaveBeenCalledWith(NOT_FOUND);
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

    describe('handleUpdateChannel()', () => {
        it('should call update', () => {
            const channel = { id: '1' };
            const payload = { test: 'test' };

            spyOn(instance, 'getChannelToEdit').and.returnValue(channel);
            spyOn(instance, 'updateChannel').and.stub();

            instance.handleUpdateChannel(payload);

            expect(instance.updateChannel).toHaveBeenCalledWith(payload);
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

    it('getChannelConfiguration() should return configuration for given channel type', () => {
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

    it('getChannelToEdit() should return channel from list by id url query param', () => {
        const result = instance.getChannelToEdit();

        expect(result).toEqual(USER_NOTIFICATION_CHANNELS_LIST_MOCK[0]);
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

    describe('updateChannel', () => {
        xit('should call update request and handle processing', async () => {
            spyOn(instance, 'handleStartProcessing').and.stub();
            spyOn(instance, 'handleSuccess').and.stub();

            const payload = {
                type: 'telegram',
                alias: 'test2',
                configuration: {}
            };

            await instance.updateChannel(payload);

            expect(instance.handleStartProcessing).toHaveBeenCalled();
            expect(instance.props.updateUserNotificationChannel).toHaveBeenCalled();
            expect(instance.handleSuccess).toHaveBeenCalled();
        });

        it('should handle error if update request failed', async () => {
            wrapper.setProps({
                updateUserNotificationChannel : jest.fn().mockReturnValue(Promise.reject({ code: 'error' }))
            });
            spyOn(instance, 'handleError').and.stub();

            await instance.updateChannel({ test: 'test', test2: 'test2' });

            expect(instance.props.updateUserNotificationChannel).toHaveBeenCalled();
            expect(instance.handleError).toHaveBeenCalledWith({ code: 'error' });
        });
    });

    function getMockProps() {
        return { match: { params: { id: '1' } } };
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
            updateUserNotificationChannel : jest.fn()
        };
    }
});
