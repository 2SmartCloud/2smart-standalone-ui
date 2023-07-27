import React from 'react';
import { shallow } from 'enzyme';
import ChannelsList from './ChannelsList';
import * as sort from '../../../../utils/sort';
import { USER_NOTIFICATION_CHANNELS_LIST_MOCK } from '../../../../__mocks__/notificationChannelsMock';
import ProcessingIndicator from '../../../base/ProcessingIndicator';
import ChannelsListRow from './ChannelsListRow';

describe('ChannelsList component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        setupSpies();

        const mockProps = getMockProps();

        wrapper = shallow(<ChannelsList {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render no services message if there is no channels', () => {
        wrapper.setProps({ list: [] });

        const noServices = wrapper.find('.noChannelsMessage');

        expect(noServices).toBeDefined();
    });

    it('should render loader if isUpdating is true', () => {
        wrapper.setProps({ isUpdating: true });

        const loader = wrapper.find(ProcessingIndicator);

        expect(loader).toBeDefined();
    });

    it('should render channels list', () => {
        wrapper.setProps({ list: USER_NOTIFICATION_CHANNELS_LIST_MOCK });

        const channelsRow = wrapper.find(ChannelsListRow);

        expect(channelsRow.length).toBeGreaterThan(0);
    });

    describe('getFilteredList()', () => {
        it('should return ordered list', () => {
            wrapper.setProps({
                list : USER_NOTIFICATION_CHANNELS_LIST_MOCK.slice(0, 2)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    "id": "2",
                    "entityTopic": "notification-channels/kxc3h9uvlahgkgznqp65",
                    "alias": "someVeryyyySpecialBot",
                    "configuration": {
                        "chatId": "417549154",
                        "token": "bot1127564229:AAEKxtXiJCfDYZyEK60hlQYMytdFhdEfQNc"
                    },
                    "state": "enabled",
                    "type": "telegram"
                },
                {
                    "id": "1",
                    "entityTopic": "notification-channels/9tw9wlpjs5txj8m0rqxx",
                    "alias": "spppp",
                    "configuration": {
                        "chatId": "dd",
                        "token": "dd"
                    },
                    "state": "enabled",
                    "type": "telegram"
                }
            ];

            expect(result).toEqual(expected);
        });

        it('should return filtered by searchQuery and ordered list', () => {
            wrapper.setProps({
                searchQuery : 'someVeryyyySpecial',
                list        : USER_NOTIFICATION_CHANNELS_LIST_MOCK.slice(0, 2)
            });

            const result = instance.getFilteredList();
            const expected = [
                {
                    "id": "2",
                    "entityTopic": "notification-channels/kxc3h9uvlahgkgznqp65",
                    "alias": "someVeryyyySpecialBot",
                    "configuration": {
                        "chatId": "417549154",
                        "token": "bot1127564229:AAEKxtXiJCfDYZyEK60hlQYMytdFhdEfQNc"
                    },
                    "state": "enabled",
                    "type": "telegram"
                }
            ];

            expect(result).toEqual(expected);
        });
    });

    it('getPaginatedList()', () => {
        wrapper.setProps({ currentPage: 2 });

        const result = instance.getPaginatedList(USER_NOTIFICATION_CHANNELS_LIST_MOCK);

        expect(result).toHaveLength(10);
        expect(result).toEqual(USER_NOTIFICATION_CHANNELS_LIST_MOCK.slice(10, 20));
    });

    function setupSpies() {
        spyOn(sort, 'sortBridges').and.callFake(list => list.sort(testSortComparator));
    }

    function getMockProps() {
        return {
            list              : [],
            sortOrder         : 'ASC',
            currentPage       : 1,
            onChangePage      : jest.fn(),
            onDeleteService   : jest.fn(),
            activateService   : jest.fn(),
            deactivateService : jest.fn()
        };
    }
});

function testSortComparator(a, b) {
    const aField = a.alias;
    const bField = b.alias;

    return aField.localeCompare(bField);
}