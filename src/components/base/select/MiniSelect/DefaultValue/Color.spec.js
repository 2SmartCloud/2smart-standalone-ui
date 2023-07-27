import React from 'react';
import { shallow } from 'enzyme';
import Color from './Color';

describe('Color component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Color {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should set backgroundColor', () => {
        const colorEl = wrapper.find('.ColorDefaultValue');

        expect(colorEl.props().style.backgroundColor).toBe('#FFF');
    });

    function getMockProps() {
        return {
            defaultValue : { color: '#FFF' }
        };
    }
});

