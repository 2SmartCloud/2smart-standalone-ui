import React from 'react';
import { shallow } from 'enzyme';
import ColorWheel from './ColorWheel';

jest.mock('@radial-color-picker/color-wheel');
jest.mock('@radial-color-picker/rotator');
jest.mock('../../utils/color');

describe('ColorWheel component', () => {
    let wrapper;
    let instance;

    global.getComputedStyle = jest.fn().mockReturnValue({
        backgroundImage : 'conic'
    });

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ColorWheel {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('getWheelDiameter() should calculate wheel diameter', () => {
        wrapper.setProps({ width: 120, height: 92 });
        expect(instance.getWheelDiameter()).toBe(80);

        wrapper.setProps({ width: 100, height: 140 });
        expect(instance.getWheelDiameter()).toBe(100);
    });

    it('getWheelDiameter() should return value not higher than MAX_SIZE', () => {
        wrapper.setProps({ width: 1000, height: 1000 });
        expect(instance.getWheelDiameter()).toBe(360);
    });

    function getMockProps() {
        return {};
    }
});
