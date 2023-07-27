import React from 'react';
import { shallow } from 'enzyme';

import NotificationOption from './NotificationOption';
import BaseOption from './BaseOption';

describe('NotificationOption', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<NotificationOption />);
        instance = wrapper.instance();
    });

    it('Should be created', () => {
        wrapper.setProps({ options: [{
            id      : 0,
            label   : 'label',
            value   : 'test',
            type    : 'test'
        }]});

        expect(instance).toBeTruthy();
    });

    it('Should BaseOption be rendered', () => {
        const selectElement = wrapper.find(BaseOption);

        expect(selectElement.length).toBe(1);
    });
});