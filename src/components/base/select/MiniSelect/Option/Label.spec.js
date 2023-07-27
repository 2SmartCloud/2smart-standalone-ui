import React from 'react';
import { shallow } from 'enzyme';
import LabelOption from './Label';

describe('LabelOption component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LabelOption {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should set label', () => {
        const labelEl = wrapper.find('.label');

        expect(labelEl.props().children).toBe('test');
    });

    it('should render icon', () => {
        const iconEl = wrapper.find('.icon');

        expect(iconEl.props().src).toBe('foo/bar.svg');
    });

    function getMockProps() {
        return {
            option   : { label: 'test', icon: 'foo/bar.svg' },
            onChange : jest.fn()
        };
    }
});

