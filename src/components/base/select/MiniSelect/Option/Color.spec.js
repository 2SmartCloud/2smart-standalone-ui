import React from 'react';
import { shallow } from 'enzyme';
import ColorOption from './Color';

describe('ColorOption component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ColorOption {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should set backgroundColor', () => {
        const colorEl = wrapper.find('.ColorOption');

        expect(colorEl.props().style.backgroundColor).toBe('#FFF');
    });

    function getMockProps() {
        return {
            option   : { color: '#FFF' },
            onChange : jest.fn()
        };
    }
});

