import React              from 'react';
import { shallow }        from 'enzyme';
import { Close }          from '@material-ui/icons';
import InfiniteScroll     from 'react-infinite-scroller';

import globalEscHandler   from '../../../utils/globalEscHandler';
import getMockStore       from '../../../__mocks__/storeMock';
import Notification       from './NotificationsPopup/Notification';
import NotificationsPopup from './NotificationsPopup.js';

jest.mock('../../../utils/globalEscHandler');

const MOCK_NOTIFICATION = {
    type      : 'text',
    message   : 'message',
    createdAt : 12345678,
    isRead    : true
}

describe('NotificationsPopup', () => {
    let wrapper;

    beforeEach(() => {
        jest.spyOn(React, 'useEffect').mockImplementation(f => f());

        const mockBoundActions = getMockBoundActions();
        const mockStore = getMockStore(getMockAppState);

        wrapper = shallow(<NotificationsPopup store={mockStore} {...mockBoundActions} />).dive().dive();
    });

    describe('on init', () => {
        xit('should register globalEscHandler', () => {
            globalEscHandler.register = jest.fn().mockReturnValue(true);

            expect(globalEscHandler.register).toHaveBeenCalled();
        });
    });

    it('should be created', () => {
        expect(wrapper).toBeTruthy();

        expect(wrapper.find(Close)).toHaveLength(1);
        expect(wrapper.find('.control')).toHaveLength(2);
    });

    it('should render loader if props.isFetching === true and list.length == 0', () => {
        wrapper.setProps({ isFetching: true, list: [] });

        expect(wrapper.find('.loaderWrapper')).toHaveLength(1);
    });

    it('shouldn\'t render loader if props.isFetching === false || list.length !== 0', () => {
        wrapper.setProps({ isFetching: true, list: [{ id: '2', ...MOCK_NOTIFICATION }] });

        expect(wrapper.find('.loaderWrapper')).toHaveLength(0);

        wrapper.setProps({ isFetching: false, list: [] });

        expect(wrapper.find('.loaderWrapper')).toHaveLength(0);
    });

    it('should render notifications list.length !== 0', () => {
        wrapper.setProps({ isFetching: true, list: [{ id: '2', ...MOCK_NOTIFICATION }] });

        expect(wrapper.find(InfiniteScroll)).toHaveLength(1);
        expect(wrapper.find(Notification)).toHaveLength(1);
    });

    it('should render max 20 entities on init', () => {
        wrapper.setProps({
            isFetching : true,
            list       : new Array(25).fill('').map((item, index) => ({ id : `${index}`, ...MOCK_NOTIFICATION }))
        });

        expect(wrapper.find(Notification)).toHaveLength(20);
    });

    function getMockBoundActions() {
        return {
            id           : 'notificationId',
            notification : {
                type      : 'text',
                message   : 'message',
                createdAt : 1234556775,
                isRead    : false
            },
            isSelected       : true,
            onToggleSelected : jest.fn()
        };
    }

    function getMockAppState() {
        return {
            notifications:{
                isFetching : false,
                list       : []
            }
        };
    }
});
