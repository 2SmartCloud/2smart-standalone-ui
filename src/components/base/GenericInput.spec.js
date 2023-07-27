import React from 'react';
import { shallow } from 'enzyme';
import GenericInput from './GenericInput';

describe('GenericInput component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<GenericInput {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('calling onError() with error="TIMEOUT" should close control', () => {
        instance.openControl();

        expect(wrapper.state().isOpen).toBeTruthy();

        instance.onError('TIMEOUT');

        expect(wrapper.state().isOpen).toBeFalsy();
    });

    function getMockProps() {
        return {
            onSubmit : jest.fn()
        };
    }
});
