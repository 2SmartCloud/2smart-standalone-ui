import React from 'react';
import { shallow } from 'enzyme';
import LoadingNotification from '../../../base/LoadingNotification';
import NotificationChannelsPage from './NotificationChannelsPage';
import { NOTIFICATION_CHANNEL_CREATE } from '../../../../assets/constants/routes';
import {
    NOTIFICATION_CHANNELS_LIST_MOCK,
    USER_NOTIFICATION_CHANNELS_LIST_MOCK
} from '../../../../__mocks__/notificationChannelsMock';
import history from '../../../../history';

jest.mock('../../../../history');

describe('NotificationChannelsPage component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<NotificationChannelsPage {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render loader', () => {
        wrapper.setProps({ userChannels: { isFetching: true } });

        const loader = wrapper.find(LoadingNotification);

        expect(loader).toBeTruthy();
    });

    it('getChannelIconUrl() should return icon url', () => {
        const result = instance.getChannelIconUrl({ type: 'telegram' });

        expect(result).toBe('foo/bar/telegram_icon.svg');
    });

    it('getChannelsOptions() should return options list for services', () => {
        const result = instance.getChannelsOptions();
        const expected = [
            { value: 'telegram', label: 'Telegram', icon: 'foo/bar/telegram_icon.svg' },
            { value: 'slack',    label: 'Slack',    icon: 'foo/bar/slack_icon.svg' }
        ];

        expect(result).toEqual(expected);
    });

    it('handleCreateChannel() should open create channel page with given type', () => {
        const type = 'telegram';

        instance.handleCreateChannel(type);

        expect(history.push).toHaveBeenCalledWith(`${NOTIFICATION_CHANNEL_CREATE}?type=${type}`);
    });

    it('deleteUserChannel() should call delete user channel method', async () => {
        spyOn(instance, 'handleModalClose');
        instance.modalContext = '1';

        await instance.deleteUserChannel('1');

        expect(instance.props.deleteUserChannel).toHaveBeenCalledWith('1');
        expect(instance.handleModalClose).toHaveBeenCalled();
    });

    it('handleDeleteChannelClick() should show delete service modal if service is not started', () => {
        spyOn(instance, 'handleDeleteModalOpen');

        const channel = { id: '1' };

        instance.handleDeleteChannelClick(channel);
        expect(instance.handleDeleteModalOpen).toHaveBeenCalledWith(channel);
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

    xit('handleModalClose() should set closed state', () => {
        wrapper.setState({ modal: { isOpen: true } });
        expect(wrapper.state().modal.isOpen).toBeTruthy();

        instance.handleModalClose();

        expect(wrapper.state().modal.isOpen).toBfeFalsy();
    });

    it('handleDeleteModalOpen() should set context and call delete modal handler', () => {
        spyOn(instance, 'handleModalOpen');
        spyOn(instance, 'deleteUserChannel');
        spyOn(instance, 'getChannelName').and.returnValue('Some name');

        const channel = { id: 'test' };
        const expected = {
            title  : 'Delete Some name',
            text   : 'You will not be able to recover this channel!',
            labels : { submit: 'Yes, delete channel', cancel: 'Cancel' }
        };

        instance.handleDeleteModalOpen(channel);

        expect(instance.modalContext).toBe('test');
        expect(instance.handleModalOpen).toHaveBeenCalledWith(expected);

        instance.modalSubmitHandler();
        expect(instance.deleteUserChannel).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            channels : {
                list : NOTIFICATION_CHANNELS_LIST_MOCK,
                isFetching : false
            },
            userChannels : {
                list : USER_NOTIFICATION_CHANNELS_LIST_MOCK,
                isFetching : false
            },
            setSearchQuery        : jest.fn(),
            setSortOrder          : jest.fn(),
            setCurrentPage        : jest.fn(),
            deleteUserChannel     : jest.fn().mockReturnValue(Promise.resolve()),
            activateUserChannel   : jest.fn().mockReturnValue(Promise.resolve()),
            deactivateUserChannel : jest.fn().mockReturnValue(Promise.resolve())
        };
    }
});
