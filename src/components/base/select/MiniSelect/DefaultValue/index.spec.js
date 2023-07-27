import React from 'react';
import { shallow } from 'enzyme';
import DefaultValue from './index';
import LabelDefaultValue from './Label';
import ColorDefaultValue from './Color';

describe('DefaultValue component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<DefaultValue {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render LabelDefaultValue by default', () => {
        const value = wrapper.find(LabelDefaultValue);

        expect(value).toHaveLength(1);
    });

    it('should render ColorDefaultValue for color selectType', () => {
        wrapper.setProps({ selectType: 'color' });

        const value = wrapper.find(ColorDefaultValue);

        expect(value).toHaveLength(1);
    });

    function getMockProps() {
        return {
            selectType   : undefined,
            defaultValue : {}
        };
    }
});

