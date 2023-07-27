import React from 'react';
import { shallow } from 'enzyme';

import CityOption from './CityOption';
import BaseOption from './BaseOption';

describe('CityOption', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CityOption />);
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

    it('Should BaseOption be rendered', () => {
        const selectElement = wrapper.find(BaseOption);

        expect(selectElement.length).toBe(1);
    });
});