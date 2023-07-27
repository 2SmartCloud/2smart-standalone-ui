import React from 'react';
import { shallow } from 'enzyme';

import { MONTH_LIST } from '../../../../../../assets/constants/schedule';

import MultipleSelectList from './MultipleSelectList';
import MultipleSelectItem from '../MultipleSelectItem';

describe('MultipleSelectList', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<MultipleSelectList {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should handleClick be called', () => {
        wrapper.setProps({ onChange: jest.fn() });
        const value = '1';

        instance.handleClick(value);

        expect(instance.props.onChange).toBeCalledWith(value);
    });

    it('should MultipleSelectItem mapping', () => {
        wrapper.setProps({
            options : MONTH_LIST
        });

        const multipleSelectElement = wrapper.find(MultipleSelectItem);

        expect(multipleSelectElement.length).toBe(MONTH_LIST.length);
    });

    function getMockProps() {
        return {
            options   : [],
            active    : []
        }
    }
});
