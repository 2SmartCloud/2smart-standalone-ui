import React from 'react';
import { shallow } from 'enzyme';

import NotificationSingleValue from './NotificationSingleValue';

describe('NotificationSingleValue', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<NotificationSingleValue />);
        instance = wrapper.instance();
    });

    it('Should be created', () => {
        wrapper.setProps({ options: [{
            id      : 0,
            label   : 'label',
            type : 'test'
        }]});

        expect(instance).toBeTruthy();
    });
});