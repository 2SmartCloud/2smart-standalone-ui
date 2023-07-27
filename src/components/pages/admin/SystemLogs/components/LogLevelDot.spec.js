import React from 'react';
import { shallow } from 'enzyme';
import LogLevelDot from './LogLevelDot';

describe('LogLevelDot component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<LogLevelDot {...mockProps}  />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    it('should render nothing if no logLevel provided', () => {
        wrapper.setProps({ level: undefined });

        const node = wrapper.find('.LogLevel');

        expect(node).toHaveLength(0);
    });

    describe('each level should have own color', () => {
        it('error', () => {
            wrapper.setProps({ level: 'error' });

            const dot = wrapper.find('.dot');

            expect(dot.props().className.includes('red')).toBeTruthy();
        });

        it('warning', () => {
            wrapper.setProps({ level: 'warning' });

            const dot = wrapper.find('.dot');

            expect(dot.props().className.includes('orange')).toBeTruthy();
        });

        it('info', () => {
            wrapper.setProps({ level: 'info' });

            const dot = wrapper.find('.dot');

            expect(dot.props().className.includes('blue')).toBeTruthy();
        });
    });

    function getMockProps() {
        return {
            level : 'warning'
        };
    }
});
