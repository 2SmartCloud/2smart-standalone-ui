import React         from 'react';
import { shallow }   from 'enzyme';
import getMockStore  from '../../../__mocks__/storeMock';
import BellIcon      from '../../base/icons/Bell';
import Notifications from './Notifications';

window.loadingSpinner = {
    stop : jest.fn()
};

describe('Notifications admin component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Notifications {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();

        expect(wrapper.find(BellIcon).length).toBe(1);
    });

    it('should render .withCounter if props.counter > 0', () => {
        wrapper.setProps({ counter: 10 });

        expect(wrapper.find('.withCounter').length).toBe(1);

        wrapper.setProps({ counter: 0 });

        expect(wrapper.find('.withCounter').length).toBe(0);
    });

    function getMockProps() {
        return {
            list      : [],
            openPopup : jest.fn()
        };
    }

    function getMockAppState() {
        return {
            notifications : {
                list : []
            }
        };
    }

    function getMockBoundActions() {
        return {
            openPopup : jest.fn()
        };
    }
});
