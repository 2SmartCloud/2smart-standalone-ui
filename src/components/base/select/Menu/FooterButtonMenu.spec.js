import React from 'react';
import { shallow } from 'enzyme';
import FooterButtonMenu from './FooterButtonMenu';

describe('FooterButtonMenu component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<FooterButtonMenu {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    function getMockProps() {
        return {
            children     : (<div>test</div>),
            footerButton : (<button>button</button>)
        };
    }
});
