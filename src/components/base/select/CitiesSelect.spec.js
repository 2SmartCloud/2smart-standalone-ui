import React from 'react';
import { shallow } from 'enzyme';

import CitiesSelect from './CitiesSelect';
import AsyncSelect from './AsyncSelect';

describe('CitiesSelect', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<CitiesSelect />);
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

    it('Should AsyncSelect be rendered', () => {
        const selectElement = wrapper.find(AsyncSelect);

        expect(selectElement.length).toBe(1);
    });
});