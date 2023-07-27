import React                    from 'react';
import { shallow }              from 'enzyme';
import Entities                 from './Entities';
import EntityControl            from '../Entity';
import Chip                     from '../../Chip.js';
import ValuesContainer          from '../../SortableMultiSelect/ValuesContainer';
import {
    DEVICES_MOCK
}                               from '../../../../__mocks__/deviceMock';
import getMockStore             from '../../../../__mocks__/storeMock';

jest.mock('../../../../utils/homie/getEntities', () => ({
    fillEntitiesLabelsByTopics: jest.fn((value) => value),
}));


describe('Entities:control component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();

        wrapper = shallow(<Entities  {...mockProps} store={mockStore}  />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(EntityControl)).toHaveLength(1);
    });

    describe('should render value', () => {
        it('should render draggable list if props.isDraggable === true', () => {
            wrapper.setProps({ isDraggable: true, value: [ { label: '1', id: '1' }, { label: '2', id: '2' } ] });

            expect(wrapper.find(ValuesContainer)).toHaveLength(1);
            
        });

        it('should render chips list if props.isDraggable === false', () => {
            wrapper.setProps({ isDraggable: false, value: [ { label: '1', id: '1' }, { label: '2', id: '2' } ] });

            expect(wrapper.find(Chip)).toHaveLength(2);
        });
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
            onValueSelect : jest.fn(),
            onValueDelete : jest.fn(),
            onOrderChange : jest.fn(),
            options       : [],
            isInvalid     : false,
            isDraggable   : true,
        };
    }
});
