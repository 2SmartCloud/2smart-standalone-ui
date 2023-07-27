import React from 'react';
import { shallow } from 'enzyme';

import SwitchTab from './SwitchTab';

describe('SwitchTab', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        
        wrapper = shallow(<SwitchTab {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should set initial classes with default props', () => {
        const tabElement = wrapper.find('.Button.active.vertical.nonActiveVertical');

        expect(tabElement.length).toBe(0);
    });

    it('should set classe with props', () => {
        wrapper.setProps({ isActive: true });

        const tabElement = wrapper.find('.Button.active');

        expect(tabElement.length).toBe(1);
        
    });



    function getMockProps() {
        return {
            children   : '',
            className  : '',
            isActive   : false,
            isVertical : false,
            onClick : jest.fn()
        }
    }
});
