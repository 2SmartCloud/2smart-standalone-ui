import React        from 'react';
import { shallow }  from 'enzyme';   
import Notification from './Notification.js';
import Checkbox     from './Checkbox';


describe('NotificationsPopup/Notification', () => {
    let wrapper;

    beforeEach(() => {
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Notification {...mockBoundActions} />);
    });

    it('should be created', () => {
        expect(wrapper).toBeTruthy();

        expect(wrapper.find(Checkbox)).toHaveLength(1);
    });

    function getMockBoundActions() {
        return {
            id           : 'notificationId',
            notification : {
                type : 'text',
                message   : 'message',
                createdAt : 1234556775
            },
            isSelected       : true,
            onToggleSelected : jest.fn()
        };
    }
});
