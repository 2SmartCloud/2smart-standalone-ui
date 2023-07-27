import React from 'react';
import { shallow } from 'enzyme';
import BaseSelect from '../../../base/select/BaseSelect';
import SetupScenarioSelect from './SetupScenarioSelect';

describe('SetupScenarioSelect component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<SetupScenarioSelect {...mockProps} />);
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

    it('handleSelect() should call onCreate with SIMPLE mode', () => {
        instance.handleSelect({ value: '1' });

        expect(instance.props.onCreate).toHaveBeenCalledWith({ mode: 'SIMPLE', type: '1' });
    });

    it('handleButtonClick() should call onCreate with ADVANCED mode', () => {
        instance.handleButtonClick();

        expect(instance.props.onCreate).toHaveBeenCalledWith({ mode: 'ADVANCED' });
    });

    it('getNoOptionsMessage()', () => {
        const result = instance.getNoOptionsMessage();

        expect(result).toBe('Add extensions from Market');
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
