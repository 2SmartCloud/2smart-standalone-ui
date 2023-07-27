import React from 'react';
import { shallow } from 'enzyme';
import StringInput from './StringInput';

describe('StringInput component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<StringInput {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockProps() {
        return {
            value    : '',
            onChange : jest.fn()
        };
    }
});
