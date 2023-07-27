import React from 'react';
import { shallow } from 'enzyme';
import Base from './Base.js';

// jest.mock('@radial-color-picker/color-wheel');
// jest.mock('@radial-color-picker/rotator');
// jest.mock('../../utils/color');

describe('nothingToShowNotification:Base component', () => {
    let wrapper;
    let instance;

    // global.getComputedStyle = jest.fn().mockReturnValue({
    //     backgroundImage : 'conic'
    // });

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Base {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('shouldn\'t render title if props.withTitle === false', () => {
        wrapper.setProps({ withTitle: false });

        const chipElements = wrapper.find('.title');

        expect(chipElements.length).toBe(0);
    });

    it('should render title if props.withTitle === true', () => {
        wrapper.setProps({ withTitle: true });

        const chipElements = wrapper.find('.title');

        expect(chipElements.length).toBe(1);
    });

    it('shouldn\'t render title if props.withTitle === true', () => {
        wrapper.setProps({ withTitle: false });

        const chipElements = wrapper.find('.title');

        expect(chipElements.length).toBe(0);
    });

    it('should render title if props.withTitle === true', () => {
        wrapper.setProps({ withIcon: true });

        const chipElements = wrapper.find('.icon');

        expect(chipElements.length).toBe(1);
    });

    it('shouldn\'t render title if props.withTitle === true', () => {
        wrapper.setProps({ withIcon: false });

        const chipElements = wrapper.find('.icon');

        expect(chipElements.length).toBe(0);
    });

    function getMockProps() {
        return {
            message: 'Message'
        };
    }
});
