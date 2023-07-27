import React from 'react';
import { shallow } from 'enzyme';

import { MONTH_DAYS } from '../../../../../../assets/constants/schedule';

import CustomDatePicker from './CustomDatePicker';
import CustomDatePickerItem from '../CustomDatePickerItem';

describe('CustomDatePicker', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CustomDatePicker />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should componentDidMount() call createDefaultRange() on active prop', () => {
        wrapper.setProps({ active: Array.from(Array(31).keys())});

        spyOn(instance, 'createDefaultRange');

        instance.componentDidMount();

        expect(instance.createDefaultRange).toHaveBeenCalledWith(instance.props.active);
    });

    it('should handleChange() call dateItemNotClicked()', () => {
        const index = 1;

        instance.isClick = false;

        spyOn(instance, 'dateItemNotClicked');
        spyOn(instance, 'dateItemIsClicked');

        instance.handleChange(index);

        expect(instance.dateItemNotClicked).toHaveBeenCalled();
        expect(instance.dateItemIsClicked).not.toHaveBeenCalled();
    });

    it('should handleChange() call dateItemIsClicked()', () => {
        instance.isClick = true;

        spyOn(instance, 'dateItemNotClicked');
        spyOn(instance, 'dateItemIsClicked');

        instance.handleChange();

        expect(instance.dateItemIsClicked).toHaveBeenCalled();
        expect(instance.dateItemNotClicked).not.toHaveBeenCalled();
    });

    it('should createHoveredRange() created range', () => {
        const prevMask = [ ...instance.state.mask ];
        const rangeArray = Array.from(Array(10).keys());

        instance.createHoveredRange(0, 10);

        rangeArray.forEach((item, index) => {
            const isRange = (prevMask[index + 1] !== instance.state.mask[index + 1])
                && (instance.state.mask[index + 1] === 3);

            expect(isRange).toBeTruthy();
        });
    });

    it('should removeHoveredRange() remove range', async () => {
        await instance.createHoveredRange(0, 10);

        expect(instance.state.mask.includes(3)).toBeTruthy();

        await instance.removeHoveredRange(10, 0)

        expect(instance.state.mask.includes(3)).toBeFalsy();
    });

    it('should clearRange() clear range on the edge', () => {
        wrapper.setState({ mask: [ 2, 3, 3, 3, 3, 3, 4] });

        const arr = [ ...instance.state.mask ];

        instance.clearRange(arr, 3, -1);
        instance.clearRange(arr, 3, 1);

        const result = instance.state.mask.filter(item => item !== 0);

        expect(result.length).toBe(1);
    });

    it('should CustomDatePickerItem mapping', () => {
        wrapper.setProps({ options: MONTH_DAYS});

        const datePickerElement = wrapper.find(CustomDatePickerItem);

        expect(datePickerElement.length).toBe(MONTH_DAYS.length);
    });

    it('should mask state be changed by prop active', () => {

        expect(wrapper.state().mask.includes(0)).toBeTruthy();

        const activeItems = MONTH_DAYS.map(item => item.value);

        instance.createDefaultRange(activeItems);

        expect(wrapper.state().mask.includes([0])).toBeFalsy();
    })
});
