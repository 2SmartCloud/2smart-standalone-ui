import React from 'react';
import { shallow } from 'enzyme'
import PushButton from '../../base/PushButton';
import PushButtonWidget from './PushButtonWidget.js';


jest.useFakeTimers();

describe('PushButtonWidget', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<PushButtonWidget {...mockProps}/>);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render push button', () => {
        expect(wrapper.find(PushButton)).toHaveLength(1);
    });

    it('handleClick() should call onSetValue', () => {
        instance.handleClick();

        expect(instance.props.onSetValue).toHaveBeenCalledWith(true);
    });

    function getMockProps() {
        return {
            isSettable   : true,
            isEditMode   : false,
            isLocked     : false,
            isProcessing : false,
            onSetValue   : jest.fn()
        }
    }
});
