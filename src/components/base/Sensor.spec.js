import React from 'react';
import { shallow } from 'enzyme';

import getMockStore from '../../__mocks__/storeMock';
import Sensor from './Sensor';


describe('PropertyRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore();
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<Sensor {...mockProps} store={mockStore} />).dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });


    it('handleRemoveError() should remove sensor error', () => {
        const valueToSet = 'value';
        const hardwareType = 'node';
        const propertyType = 'sensors';
        const { nodeId, deviceId, id } = instance.props;

        instance.handleRemoveError();

        expect(instance.props.removeAttributeErrorAndHideToast).toHaveBeenCalledWith({ propertyType, hardwareType, deviceId, nodeId, propertyId: id, field: 'value' });
    });

    it('setValue() should set value', () => {
        const valueToSet = 'value';
        const hardwareType = 'node';
        const propertyType = 'sensors';
        const { nodeId, deviceId, id, isRetained } = instance.props;

        instance.setValue({ value: valueToSet });

        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalledWith({ propertyType, hardwareType, deviceId, nodeId, propertyId: id, field: 'value', value: valueToSet, isRetained });
    });


    function getMockProps() {
        return {
            deviceId : 'device-1',
            nodeId   : 'some',
            id       : 'test-1'
        };
    }

    function getMockBoundActions() {
        return {
            setAsyncAttributeDispatcher      : jest.fn(),
            removeAttributeErrorAndHideToast : jest.fn(),
            deleteValErr                     : jest.fn()
        };
    }
});
