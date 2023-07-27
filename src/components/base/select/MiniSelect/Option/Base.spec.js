import React from 'react';
import { shallow } from 'enzyme';
import BaseOption from './Base';

describe('BaseOption component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<BaseOption {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('handleOptionClick() should call onChange prop', () => {
        instance.handleOptionClick('test');

        expect(instance.props.onChange).toHaveBeenCalledWith('test');
    });

    describe('isOptionSelected() should return true for selected option', () => {
        it('defaultValue equals option', () => {
            wrapper.setProps({
                option       : { value: 'foo' },
                defaultValue : { value: 'foo' },
                value        : undefined
            });

            const result = instance.isOptionSelected();

            expect(result).toBeTruthy();
        });

        it('value equals option', () => {
            wrapper.setProps({
                option       : { value: 'foo' },
                defaultValue : undefined,
                value        : { value: 'foo' }
            });

            const result = instance.isOptionSelected();

            expect(result).toBeTruthy();
        });

        it('value equals options', () => {
            wrapper.setProps({
                option       : { value: 'foo' },
                defaultValue : { value: 'bar' },
                value        : { value: 'foo' }
            });

            const result = instance.isOptionSelected();

            expect(result).toBeTruthy();
        });

        it('value not equals options', () => {
            wrapper.setProps({
                option       : { value: 'foo' },
                defaultValue : { value: 'foo' },
                value        : { value: 'bar' }
            });

            const result = instance.isOptionSelected();

            expect(result).toBeFalsy();
        });
    });

    function getMockProps() {
        return {
            onChange : jest.fn(),
            children : 'test',
            option   : {}
        };
    }
});

