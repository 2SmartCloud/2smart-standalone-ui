import React from 'react';
import { shallow } from 'enzyme';
import GenericSortButton from './GenericSortButton';

describe('GenericSortButton component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<GenericSortButton {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should have reversed class for ASC order', () => {
        wrapper.setProps({ searchOrder: 'ASC' });

        const icon = wrapper.find('.sortIcon');

        expect(icon.hasClass('reversed')).toBeTruthy();
    });

    describe('handleChangeOrder()', () => {
        it('should set ASC order if DESC was given', () => {
            wrapper.setProps({ searchOrder: 'DESC' });

            instance.handleChangeOrder();

            expect(instance.props.onChange).toHaveBeenCalledWith('ASC');
        });

        it('should set DESC order if ASC was given', () => {
            wrapper.setProps({ searchOrder: 'ASC' });

            instance.handleChangeOrder();

            expect(instance.props.onChange).toHaveBeenCalledWith('DESC');
        });
    });

    function getMockProps() {
        return {
            searchOrder : 'DESC',
            onChange    : jest.fn()
        };
    }
});
