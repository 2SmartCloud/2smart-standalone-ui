import React from 'react';
import { shallow } from 'enzyme';

import CitySingleValue from './CitySingleValue';

describe('CitySingleValue', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CitySingleValue />);
        instance = wrapper.instance();
    });

    it('Should be created', () => {
        wrapper.setProps({ options: [{
            id      : 0,
            label   : 'label',
            value   : '22.333,55.123',
            country : 'UA'
        }]});

        expect(instance).toBeTruthy();
    });
});