import React from 'react';
import { shallow } from 'enzyme';
import Chip from '../../../base/Chip.js';
import getMockStore from '../../../../__mocks__/storeMock';
import globalEscHandler from '../../../../utils/globalEscHandler';
import * as dispatchSingleton from '../../../../utils/homie/dispatcherSingleton';
import { ALIASES } from '../../../../__mocks__/aliasesMock';
import PropertyRow, { GROUPS_MAX_LENGTH } from './PropertyRow';


jest.mock('../../../../utils/globalEscHandler', () => ({
    register   : jest.fn(),
    unregister : jest.fn()
}));


window.getSelection = jest.fn().mockReturnValue({
    removeAllRanges : jest.fn()
});

describe('PropertyRow component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<PropertyRow {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });


    it('should unsubscribe from observable and unregister handler on unmount', () => {
        const topic = { deviceId: 'device-1', nodeId: 'some', propertyId: 'test-1' };

        instance.componentWillUnmount();

        expect(globalEscHandler.unregister).toHaveBeenCalledWith(instance.handleCloseCopy);
    });

    it('handleOpenCopy() should set state for modal and register esc handler', () => {
        instance.handleOpenCopy();

        expect(wrapper.state().isCopyOpened).toBeTruthy();
        expect(globalEscHandler.register).toHaveBeenCalledWith(instance.handleCloseCopy);
    });

    it('handleCloseCopy() should set state for modal and unregister esc handler', () => {
        wrapper.setState({ isCopyOpened: true });

        instance.handleCloseCopy();

        expect(wrapper.state().isCopyOpened).toBeFalsy();
        expect(globalEscHandler.unregister).toHaveBeenCalledWith(instance.handleCloseCopy);
    });

    it('handleRemoveError() should call removeAttributeErrorAndHideToast', () => {
        instance.handleRemoveError();

        expect(instance.props.removeAttributeErrorAndHideToast).toHaveBeenCalled();
    });

    it('handleRemoveNameError() should delete title errors', () => {
        const { deviceId, hardwareType, propertyType, nodeId, id: propertyId } = instance.props;

        instance.handleRemoveNameError();

        expect(instance.props.removeAttributeErrorAndHideToast).toHaveBeenCalledWith({
            hardwareType,
            propertyType,
            field : 'title',
            deviceId,
            nodeId,
            propertyId
        });
    });

    it('setValue() should set value', () => {
        const valueToSet = 'value';
        const {  deviceId, hardwareType, propertyType, nodeId, id: propertyId } = instance.props;

        instance.setValue({ value: valueToSet });

        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalledWith({ propertyType, hardwareType, deviceId, nodeId, propertyId, value: valueToSet });
    });


    it('setPropertyName() should set new property name', () => {
        const valueToSet = 'newName';
        const { nodeId, deviceId, id, propertyType, hardwareType } = instance.props;

        instance.setPropertyName({ value: valueToSet });

        expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalledWith({ propertyType, hardwareType, deviceId, nodeId, propertyId: id, field: 'title', value: valueToSet });
    });

    it('should render groups list if showGroups prop is true', () => {
        wrapper.setProps({
            showGroups : true
        });

        expect(wrapper.find('.groupsList')).toHaveLength(1);
    });

    it('should render only max groups amount', () => {
        wrapper.setProps({
            showGroups : true,
            groups     : new Array(GROUPS_MAX_LENGTH + 10)
                .fill('')
                .map((group, index) => ({
                    id    : index,
                    label : 'label'
                }))
        });

        expect(wrapper.find(Chip).length).toBe(GROUPS_MAX_LENGTH + 1);
    });

    describe('handleToggleDisplayed() should call setAsyncAttributeDispatcher', () => {
        it('displayed: true', () => {
            const expected = {
                hardwareType : 'node',
                propertyType : 'sensors',
                deviceId     : 'device-1',
                nodeId       : 'some',
                propertyId   : 'test-1',
                field        : 'displayed',
                value        : 'false',
                isRetained   : true
            };

            wrapper.setProps({ displayed: 'true' });

            instance.handleToggleDisplayed();

            expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalledWith(expected);
        });

        it('displayed: false', () => {
            const expected = {
                hardwareType : 'node',
                propertyType : 'sensors',
                deviceId     : 'device-1',
                nodeId       : 'some',
                propertyId   : 'test-1',
                field        : 'displayed',
                value        : 'true',
                isRetained   : true
            };

            wrapper.setProps({ displayed: 'false' });

            instance.handleToggleDisplayed();

            expect(instance.props.setAsyncAttributeDispatcher).toHaveBeenCalledWith(expected);
        });
    });


    function getMockAppState() {
        return {
            aliases : {
                list : ALIASES
            },
            homie : {
                events : []
            },
            groups : {
                list : []
            }
        };
    }

    function getMockProps() {
        return {
            showGroups   : false,
            hardwareType : 'node',
            propertyType : 'sensors',
            deviceId     : 'device-1',
            nodeId       : 'some',
            id           : 'test-1',
            openPopup    : jest.fn()
        };
    }

    function getMockBoundActions() {
        return {
            setAsyncAttributeDispatcher : jest.fn(),
            deleteValErr                : jest.fn(),
            removeAttributeErrorAndHideToast : jest.fn()
        };
    }
});
