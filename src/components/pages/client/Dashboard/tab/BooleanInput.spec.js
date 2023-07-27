import React from 'react';
import { shallow } from 'enzyme';
import BooleanInput from './BooleanInput';

describe('BooleanInput component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<BooleanInput {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleChange() should call onChange', () => {
        instance.handleChange({ value: 'true' });

        expect(instance.props.onChange).toHaveBeenCalledWith('true');
    });

    function getMockProps() {
        return {
            onChange : jest.fn()
        };
    }
});
