import React                     from 'react';
import { shallow }               from 'enzyme';
import Tooltip                   from '@material-ui/core/Tooltip';
import EntityControl             from '../Entity';
import EntityModal               from '../../../base/modals/EntityModal';
import {
    DEVICES_MOCK
}                                from '../../../../__mocks__/deviceMock';
import getMockStore              from '../../../../__mocks__/storeMock';

jest.mock('../../../../utils/homie/getEntities', () => ({
    getEntityLabelByTopic: jest.fn(() => 'label'),
}));


describe('Entity:control component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();

        wrapper = shallow(<EntityControl  {...mockProps} store={mockStore}  />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(Tooltip)).toHaveLength(1);
        expect(wrapper.find('.input')).toHaveLength(1);
    });

    it('handleOpenModal() should set open state', () => {
        instance.handleOpenModal();

        expect(instance.state.isOpen).toBe(true);
    });

    it('handleCloseModal() should set closed state', () => {
        instance.handleOpenModal();
        expect(wrapper.state().isOpen).toBeTruthy();

        instance.handleCloseModal();

        expect(wrapper.state().isOpen).toBeFalsy();
    });

    it('handleSubmit() should call props.onSubmit', () => {
        instance.handleSubmit('value');

        expect(instance.props.onChange).toHaveBeenCalled();
    });

    it('should render EntityModal if state.isOpen === true', () => {
        wrapper.setState({ isOpen: true });

        expect(wrapper.find(EntityModal)).toHaveLength(1);
    });

    it('input click should trigger instance.handleOpenModal()', () => {
        const inputElements = wrapper.find('.input');

        inputElements.at(0).simulate('click');

        expect(wrapper.state().isOpen).toBeTruthy();
    });

    it('should add .invalid className if props.isInvalid === true', () => {
        wrapper.setProps({ isInvalid: true });

        expect(wrapper.find('.EntityControl.invalid')).toHaveLength(1);
    });

    function getMockAppState() {
        return {
            homie: {
                devices: {
                    ...DEVICES_MOCK
                }
            }
        };
    }

    function getMockProps() {
        return {
            value         : [
                {
                    "deviceId"     : "fat",
                    "nodeId"       : null,
                    "hardwareType" : "device",
                    "propertyType" : "telemetry",
                    "propertyId"   : "uptime",
                    "topic"        : 'sweet-home/fat/$telemetry/uptime',
                    "value"        : 'sweet-home/fat/$telemetry/uptime',
                    "label"        : 'Up time — sweet-home/fat/$telemetry/uptime',
                    "name"         : "Up time",
                    "withTitle"    : false,
                    "dataType"     : "float",
                    "title"        : "",
                    "type"         : "card",
                    "alias"        : {}
                }
            ],
            onChange    : jest.fn(),
            options     : [],
            isInvalid   : false,
            isDraggable : true,
        };
    }
});
