import React from 'react';
import { shallow } from 'enzyme';

import CustomDatePickerItem from './CustomDatePickerItem';

describe('CustomDatePickerItem', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CustomDatePickerItem />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    })

    it('should handleClick() call onClick prop', () => {
        wrapper.setProps({ onClick: jest.fn(), index: 0 });

        instance.handleClick();

        expect(instance.props.onClick).toBeCalledWith(instance.props.index);
    });

    it('should handleMouseEnter() call onMouseEnter prop', () => {
        wrapper.setProps({ onMouseEnter: jest.fn(), index: 0 });

        instance.handleMouseEnter();

        expect(instance.props.onMouseEnter).toBeCalledWith(instance.props.index);
    });

    it('should handleMouseLeave() call onMouseLeave prop', () => {
        wrapper.setProps({ onMouseLeave: jest.fn(), index: 0 });

        instance.handleMouseLeave();

        expect(instance.props.onMouseLeave).toBeCalledWith(instance.props.index);
    });

    it('should set initial classes with default props', () => {
        const dateItemElement = wrapper.find('.CustomDatePickerItem.selectedStart.selectedEnd.inRange.notActive');
        expect(dateItemElement.length).toBe(0);
    });

    it('should set classes with prop isStartRange', () => {
        wrapper.setProps({
            isStartRange : true,
        })
        const dateItemElement = wrapper.find('.selectedStart');
        expect(dateItemElement.length).toBe(1);
    });

    it('should set classes with prop isEndRange', () => {
        wrapper.setProps({
            isEndRange : true,
        })
        const dateItemElement = wrapper.find('.selectedEnd');
        expect(dateItemElement.length).toBe(1);
    });

    it('should set classes with prop isNotActive', () => {
        wrapper.setProps({
            isNotActive : true,
        })
        const dateItemElement = wrapper.find('.notActive');
        expect(dateItemElement.length).toBe(2);
    });

    it('should set classes with prop isSingle', () => {
        wrapper.setProps({
            isSingle : true,
        })
        const dateItemElement = wrapper.find('.active');
        expect(dateItemElement.length).toBe(1);
    });

    it('should set classes with prop isRange', () => {
        wrapper.setProps({
            isRange : true,
        })
        const dateItemElement = wrapper.find('.inRange');
        expect(dateItemElement.length).toBe(2);
    })
});
