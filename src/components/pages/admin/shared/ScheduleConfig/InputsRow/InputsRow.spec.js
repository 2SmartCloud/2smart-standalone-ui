import React from 'react';
import { shallow } from 'enzyme';

import InputsRow from './InputsRow';

describe('InputsRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<InputsRow  {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('handleOpenModal should call onOpenModal prop', () => {
        instance.handleOpenModal();

        expect(instance.props.onOpenModal).toHaveBeenCalledWith(instance.props.id);
    });

    it('handleRemoveField should call onRemove prop', () => {
        instance.handleRemoveField();

        expect(instance.props.onRemove).toHaveBeenCalledWith(instance.props.id);
    });

    it('should render inputs', () => {
        const inputElement = wrapper.find('input');

        instance.render();

        expect(inputElement.length).toBe(2);
    });

    function getMockProps() {
        return {
            startValue   : 'test',
            endValue     : 'test',
            errorMessage : '',
            id           : 0,
            isInvisible  : false,
            onOpenModal  : jest.fn(),
            onRemove     : jest.fn()
        };
    }
});