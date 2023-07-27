import React from 'react';
import { shallow } from 'enzyme';   
import GroupsPopup from './GroupsPopup';


describe('Attach group Popup', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<GroupsPopup {...mockBoundActions} />);
        
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockBoundActions() {
        return {
            onOpenNextPopup : jest.fn(),
            onClose : jest.fn()
        };
    }
});
