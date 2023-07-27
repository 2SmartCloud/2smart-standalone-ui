import React from 'react';
import { shallow } from 'enzyme';
import SetupServiceSelect from './SetupServiceSelect';
import BaseSelect from '../../../base/select/BaseSelect';


describe('SetupServiceSelect component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SetupServiceSelect {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should set options list to BaseSelect props', () => {
        const baseSelect = wrapper.find(BaseSelect);
        const baseSelectProps = baseSelect.props();

        expect(baseSelectProps.options).toEqual(getOptions());
    });

    it('handleSelect() should call onCreate prop', () => {
        instance.handleSelect({ value: { test: 'test' } });

        expect(instance.props.onCreate).toHaveBeenCalledWith({ test: 'test' });
    });

    it('getNoOptionsMessage()', () => {
        const result = instance.getNoOptionsMessage();

        expect(result).toBe('There are no installed services');
    });

    function getMockProps() {
        return {
            options  : getOptions(),
            onCreate : jest.fn()
        };
    }

    function getOptions() {
        return [
            { value: 'test', label: 'test' },
            { value: 'test2', label: 'test2' }
        ];
    }
});
