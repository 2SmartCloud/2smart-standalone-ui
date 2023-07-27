import React from 'react';
import { shallow } from 'enzyme';

import AsyncSelect from './AsyncSelect';
import Select from './BaseSelect';

describe('AsyncSelect', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        wrapper = shallow(<AsyncSelect />);
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

    it('Should BaseSelect be rendered', () => {
        const selectElement = wrapper.find(Select);

        expect(selectElement.length).toBe(1);
    });

    describe('handleInputChange()', () => {
        let value = 'test';
        let path;

        it('handleInputChange() should call debouncedOnChange', () => {
            wrapper.setProps({
                onInputChange: jest.fn(),
                settings : { basePath: 'test' }
            });

            spyOn(instance, 'debouncedOnChange').and.stub();

            path = instance.props.settings.basePath

            instance.handleInputChange(value);

            expect(instance.debouncedOnChange).toBeCalledTimes(1);
            expect(instance.debouncedOnChange).toHaveBeenCalledWith(path, value);
        });
    });
});

