import React from 'react';
import { shallow } from 'enzyme';
import Switch from './Switch';

describe('Switch component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<Switch status={'ACTIVE'} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('isChecked() should be truthy if status is ACTIVE', () => {
        wrapper.setProps({ status: 'ACTIVE' });

        expect(instance.isChecked()).toBeTruthy();
    });

    it('isChecked() should be falsy if status is not ACTIVE', () => {
        wrapper.setProps({ status: 'INACTIVE' });

        expect(instance.isChecked()).toBeFalsy();
    });
});
