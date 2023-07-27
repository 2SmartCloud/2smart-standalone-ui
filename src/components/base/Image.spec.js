import React from 'react';
import { shallow } from 'enzyme';
import Image from './Image';

describe('Image component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<Image {...mockProps} />);
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should have className from props', () => {
        wrapper.setProps({
            src       : 'someSrc',
            className : 'className'
        });

        const imageElements = wrapper.find('.className');

        expect(imageElements.length).toBe(1);
    });

    it('should render fallback if src not specified', () => {
        wrapper.setProps({
            src            : '',
            className      : 'className',
            renderFallback : jest.fn()
        });
        const imageElements = wrapper.find('.className');

        expect(imageElements.length).toBe(0);
        expect(instance.props.renderFallback).toHaveBeenCalled();
    });


    it('handleLoadError() should set isLoadError into true', () => {
        instance.handleLoadError();

        expect(instance.state.isLoadError).toBe(true);
    });

    xit('handleLoadError() should be called if image src load with error', () => {
        wrapper.setProps({
            src : 'someFakeSrc'
        });

        expect(instance.handleLoadError).toHaveBeenCalled();
    });

    function getMockProps() {
        return {
            src            : '',
            className      : 'sss',
            alt            : 'some',
            renderFallback : () => 'fallback_text'
        };
    }
});
