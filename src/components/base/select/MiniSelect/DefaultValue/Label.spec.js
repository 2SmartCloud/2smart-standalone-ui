import React from 'react';
import { shallow } from 'enzyme';
import LabelDefaultValue from './Label';

describe('LabelDefaultValue component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LabelDefaultValue {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should set label', () => {
        const labelEl = wrapper.find('.LabelDefaultValue');

        expect(labelEl.props().children).toBe('test');
    });

    function getMockProps() {
        return {
            defaultValue : { label: 'test' }
        };
    }
});

