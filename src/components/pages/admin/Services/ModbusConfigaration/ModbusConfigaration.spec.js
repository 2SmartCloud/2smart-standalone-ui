import React       from 'react';
import { shallow } from 'enzyme';
import ModbusConfiguration, {
    MODBUS_DATA_PATH
}                  from './ModbusConfiguration';

describe('ModbusConfiguration component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();

        wrapper = shallow(<ModbusConfiguration {...mockProps} />);
        instance = wrapper.instance();
        instance.onInteract = jest.fn();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should provide form view on init', () => {
        expect(wrapper.state().viewMode).toEqual('form');
    });

    it('should render add form button only in form view mode', () => {
        expect(wrapper.find('.addFieldButton').length).toBe(1);

        instance.handleChangeViewMode('json');

        expect(wrapper.find('.addFieldButton').length).toBe(0);
    });

    it('should render json editor if view mode === "json"', () => {
        instance.handleChangeViewMode('json');

        expect(wrapper.find('.editorWrapper').length).toBe(1);
    });

    it('should render form if view mode === "form"', () => {
        instance.handleChangeViewMode('form');

        expect(wrapper.find('.formFieldWrapper').length).toBe(1);
    });

    it('should render form fields if view mode === "form"', () => {
        wrapper.setState({
            formData: ''
        });

        instance.handleAddFormField();
        instance.handleAddFormField();
        instance.handleAddFormField();

        expect(wrapper.find('.fieldWrapper').length).toBe(3);
    });

    it('shouldn\'t render form fields if view mode === "form"', () => {
        instance.handleAddFormField();
        instance.handleAddFormField();
        instance.handleAddFormField();

        wrapper.setState({
            viewMode: 'json'
        });

        expect(wrapper.find('.fieldWrapper').length).toBe(0);
    });

    describe('handleChangeViewMode(mode)', () => {
        it('should set "json" view mode', () => {
            instance.handleChangeViewMode("json");

            expect(wrapper.state().viewMode).toEqual("json");
        });

        it('should set "form" view mode', () => {
            instance.handleChangeViewMode("form");

            expect(wrapper.state().viewMode).toEqual("form");
        });
    });

    describe('handleAddFormField()', () => {
        it('should add node field in nodes list', () => {
            const prevNodesLength = wrapper.find('.fieldWrapper').length;

            instance.handleAddFormField();

            const currentNodesLength =  wrapper.find('.fieldWrapper').length;

            expect(currentNodesLength).toBe(prevNodesLength + 1);
        });

        it('should call onInteract', () => {
            instance.handleAddFormField();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    describe('handleRemoveFormField(formId)()  and ', () => {
        it('should remove node field from nodes list', () => {
            instance.handleAddFormField();

            expect(wrapper.find('.fieldWrapper').length).toBe(1);

            const nodeData = wrapper.state().formData[MODBUS_DATA_PATH][0];

            instance.handleRemoveFormField(nodeData.formId)();

            expect(wrapper.find('.fieldWrapper').length).toBe(0);
        });

        it('should call onInteract', () => {
            instance.handleAddFormField();
            const nodeData = wrapper.state().formData[MODBUS_DATA_PATH][0];

            instance.handleRemoveFormField(nodeData.formId)();

            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    describe('getValueToSubmit()', () => {
        it('should return form value if form includes unique Ids', () => {
            expect(instance.getValueToSubmit()).toEqual(instance.props.initialState);

            wrapper.setState({
                formData: ''
            });

            expect(instance.getValueToSubmit()).toEqual('');

            wrapper.setState({
                formData: void 0
            });

            expect(instance.getValueToSubmit()).toEqual(void 0);
        });

        it('should return exact object structure if nodes exist', () => {
            instance.handleAddFormField();
            instance.handleAddFormField();

            const nodesListWithExtraData = wrapper.state().formData[MODBUS_DATA_PATH].map(node => ({
                ...node,
                extraField: 'some'
            }));

            wrapper.setState({
                formData: {
                    extraField: 333,
                    [MODBUS_DATA_PATH]: nodesListWithExtraData
                }
            });

            const expected = {
                [MODBUS_DATA_PATH]: nodesListWithExtraData.map(node => ({
                    id: '',
                    hardware: ''
                }))
            };

            expect(instance.getValueToSubmit()).toEqual(expected);

            instance.handleChangeViewMode("form");

            expect(instance.getValueToSubmit()).toEqual(expected);
        });
    });

    describe('handleChangeField()', () => {
        it('should change form Data', () => {
            instance.handleAddFormField();

            const formData = wrapper.state().formData[MODBUS_DATA_PATH][0];
            const fieldData = {
                name : 'id',
            };
            const value =  '123456';

            instance.handleChangeField(formData, fieldData)(value);

            expect(wrapper.state().formData[MODBUS_DATA_PATH][0][fieldData.name]).toBe(value);
        });

        it('should call onInteract', () => {
            instance.handleAddFormField();

            const formData = wrapper.state().formData[MODBUS_DATA_PATH][0];
            const fieldData = {
                name : 'id',
            };
            const value =  '123456';

            instance.handleChangeField(formData, fieldData)(value);

            expect(instance.onInteract).toHaveBeenCalled();
        });

        it('should set only numbers for id field', () => {
            instance.handleAddFormField();

            const formData = wrapper.state().formData[MODBUS_DATA_PATH][0];
            const fieldData = {
                name : 'id',
            };
            const value =  'fff123ddd456';

            instance.handleChangeField(formData, fieldData)(value);

            expect(wrapper.state().formData[MODBUS_DATA_PATH][0][fieldData.name]).toBe(value.replace(/\D/g, ''));
        });
    });

    describe('handleChangeJsonField()', () => {
        it('should set any valid JSON as formData value', () => {
            const arrayValue = [ 1,2,3 ];
            instance.handleChangeJsonField(JSON.stringify(arrayValue));
            expect(wrapper.state().formData).toEqual(arrayValue);

            const stringValue = '';
            instance.handleChangeJsonField(JSON.stringify(stringValue));
            expect(wrapper.state().formData).toEqual(stringValue);

            const objectValue = { some: 'some' };
            instance.handleChangeJsonField(JSON.stringify(objectValue));
            expect(wrapper.state().formData).toEqual(objectValue);
        });

        it('should call onInteract', () => {
            instance.handleChangeJsonField(JSON.stringify([ 1,2,3 ]));
    
            expect(instance.onInteract).toHaveBeenCalled();
        });
    });

    it('handleSetValidation(isValid) should set isJsonValid state', () => {
        instance.handleSetValidation(true);
        expect(wrapper.state().isJsonValid).toEqual(true);

        instance.handleSetValidation(false);
        expect(wrapper.state().isJsonValid).toEqual(false);
    });

    function getMockProps() {
        return {
            "field": {
                "name": "nodes.config",
                "type": "modbus-config",
                "label": "Nodes Configuration*",
                "default": {
                    "nodes": []
                },
                "hardwares": [
                    "MB2DI2RO",
                    "MB4RTD",
                    "MB8ROModule.ModbusRTU.Relay.12",
                    "meter.LE-01M",
                    "ModbusRTU.Relay.RS485RB",
                    "ModbusRTU.Relay.with.DIP.RS485RB",
                    "thermometer.SHT20",
                    "thermometer.sm100",
                    "thermometer.t10s-b",
                    "thermometer.XY-MD02",
                    "WP3082ADAM",
                    "WP3084ADAM",
                    "WP8025ADAM",
                    "WP8027ADAM",
                    "YDTH-06"
                ],
                "validation": [
                    "required",
                    "any_object"
                ]
            },
            "initialState": {
                "nodes": []
            },
            "errorText": ""
        };
    }
});
