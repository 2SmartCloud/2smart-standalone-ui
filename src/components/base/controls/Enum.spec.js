import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import ProcessingIndicator from '../../base/ProcessingIndicator';

import * as homieActions from '../../../actions/homie';
import Enum from './Enum';

jest.useFakeTimers();

describe('EnimControl', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore();
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Enum {...mockProps} store={mockStore} />).dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });


    it('should handle processing start', () => {
        jest.useFakeTimers();


        wrapper.setProps({ isProcessing: true });
        wrapper.update();
        jest.runAllTimers();

        expect(wrapper.state().isProcessing).toBeTruthy();
    });

    it('should handle processing stop', () => {
        spyOn(instance, 'clearTimeout');

        wrapper.setProps({ isProcessing: true });
        wrapper.setProps({ isProcessing: false });

        expect(instance.clearTimeout).toBeCalled();
        expect(wrapper.state().isProcessing).toBeFalsy();
        expect(wrapper.state().isLocked).toBeFalsy();
    });


    it('should setValue', () => {
        instance.handleSetValue({ label: '1', value: '2' });

        expect(instance.props.setValue).toHaveBeenCalled();
        expect(wrapper.state().isLocked).toBeTruthy();
    });


    it('should render spinner if isProcessing is true', () => {
        wrapper.setProps({ isProcessing: true });

        jest.runAllTimers();

        wrapper.update();
        expect(wrapper.find(ProcessingIndicator)).toHaveLength(1);
    });


    function getMockProps() {
        return {
            name       : '',
            value      : '',
            options    : '',
            nodeId     : 'nodeId',
            deviceId   : 'deviceId',
            propertyId : 'propertyId',
            isSettable : true
        };
    }

    function getMockBoundActions() {
        return {
            setValue : jest.fn()
        };
    }
});
