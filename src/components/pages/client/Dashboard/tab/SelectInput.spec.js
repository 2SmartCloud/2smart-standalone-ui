import React from 'react';
import { shallow } from 'enzyme';
import SelectInput from './SelectInput';

describe('SelectInput component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SelectInput {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleChange() should call onChange', () => {
        instance.handleChange({ value: 'test value' });

        expect(instance.props.onChange).toHaveBeenCalledWith('test value');
    });

    function getMockProps() {
        return {
            onChange : jest.fn()
        };
    }
});
