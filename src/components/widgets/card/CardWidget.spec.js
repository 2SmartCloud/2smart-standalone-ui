import React from 'react';
import { shallow } from 'enzyme'
import CardWidget from './CardWidget';
import ProcessingIndicator from '../../base/ProcessingIndicator'
import PropertyRow from '../../pages/admin/Dashboard/PropertyRow';

jest.useFakeTimers();

describe('EnumWidget', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<CardWidget {...mockProps}/>);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render spinner', () => {
        wrapper.setProps({isProcessing: true})
        expect(wrapper.find(ProcessingIndicator)).toHaveLength(1);
    });


    it('should render select', () => {
        expect(wrapper.find(PropertyRow)).toHaveLength(1);
    });
   

    function getMockProps() {
        return {
            properties     : [{
                "label":"ENUM — sweet-home/fat/enum-unit/enum-proc",
                "id":"enum-proc",
                "topic":"sweet-home/fat/enum-unit/enum-proc",
                "dataType":"enum",
                "deviceId":"fat",
                "nodeId":"enum-unit",
                "propertyId":"enum-proc",
                "hardwareType":"node",
                "propertyType":"sensors",
                "order":0,
                "widgetId":136,
            }],
            isEditMode   : false,
            isProcessing : false
        };
    }
});   

