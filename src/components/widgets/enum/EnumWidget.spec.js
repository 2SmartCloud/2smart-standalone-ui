import React from 'react';
import { shallow } from 'enzyme'
import EnumWidget from './EnumWidget';
import ProcessingIndicator from '../../base/ProcessingIndicator'
import CriticalValue from '../../base/CriticalValue';
import EnumWidgetSelect from '../../base/select/EnumWidgetSelect';


jest.useFakeTimers();

describe('EnumWidget', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockProps();
        wrapper = shallow(<EnumWidget {...mockProps}/>);

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
        expect(wrapper.find(EnumWidgetSelect)).toHaveLength(1);
    });

    it('should render selects value  as label with unit', () => {
        wrapper.setProps({isSettable: false})

        expect(wrapper.find(CriticalValue)).toHaveLength(2);
    });

    function getMockProps() {
        return {
            isLocked     : false,
            isSettable   : true,
            isEditMode   : false,
            isProcessing : false,
            onSetValue   : jest.fn()
        };
    }
});
