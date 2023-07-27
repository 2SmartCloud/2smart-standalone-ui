import React from 'react';
import { shallow } from 'enzyme';
import Option from './index';
import LabelOption from './Label';
import ColorOption from './Color';

describe('Option component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Option {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render LabelOption by default', () => {
        const options = wrapper.find(LabelOption);

        expect(options).toHaveLength(1);
    });

    it('should render ColorOption for color selectType', () => {
        wrapper.setProps({ selectType: 'color' });

        const options = wrapper.find(ColorOption);

        expect(options).toHaveLength(1);
    });

    function getMockProps() {
        return {
            selectType : undefined,
            option     : { label: 'test' }
        };
    }
});
