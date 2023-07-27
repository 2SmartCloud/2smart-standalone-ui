import React from 'react';
import { shallow } from 'enzyme';

import MultipleSelectItem from './MultipleSelectItem';

describe('MultipleSelectItem', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<MultipleSelectItem {...mockProps} />)

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should handleClick be called', () => {
        wrapper.setProps({ onClick: jest.fn()});
        instance.handleClick();

        expect(instance.props.onClick).toBeCalledWith(instance.props.value);
    });

    it('should set initial classes with default props', () => {
        const itemElement = wrapper.find('.MultipleSelectItem');
        expect(itemElement.length).toBe(1);
    });

    it('should set classes with props isActive', () => {
        wrapper.setProps({
            isActive : true
        });

        const itemElement = wrapper.find('.MultipleSelectItem.active');
        expect(itemElement.length).toBe(1);
    });

    it('should set classes with props isWeekend', () => {
        wrapper.setProps({
            isWeekend : true
        });

        const itemElement = wrapper.find('.MultipleSelectItem.weekend');
        expect(itemElement.length).toBe(1);
    });

    it('should MultipleSelectItem clicked', () => {
        wrapper.find('div').simulate('click');
        wrapper.setProps({ isActive : true });

        const itemElement = wrapper.find('.MultipleSelectItem.active');

        expect(itemElement.length).toBe(1);
    });

    function getMockProps() {
        return {
                label : 'Monday',
                value : '1',
                isActive : false,
                isWeekend : false
        }
    }
});
