import React         from 'react';
import { shallow }   from 'enzyme';
import getMockStore  from '../../../__mocks__/storeMock';
import Notifications from './Notifications';
import WifiTowerIcon from '../../base/icons/WifiTower';
import Header        from './Header';

window.loadingSpinner = {
    stop : jest.fn()
};

describe('Header admin component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Header {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();

        expect(wrapper.find(WifiTowerIcon).length).toBe(1);
        expect(wrapper.find(Notifications).length).toBe(1);
    });

    function getMockProps() {
        return {
            newDevices   : {}
        };
    }

    function getMockAppState() {
        return {
            discovery : {
                discoveries : {
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            onIconClick  : jest.fn(),
            handleLogout : jest.fn(),
            closeModal   : jest.fn(),
            openPopup    : jest.fn()
        };
    }
});
