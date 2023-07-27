import React from 'react';
import { shallow } from 'enzyme';
import Base from './Base';

describe('Base component', () => {
    let instance;
    let wrapper;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Base {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    function getMockProps() {
        return {
            children : 'test'
        };
    }
});

