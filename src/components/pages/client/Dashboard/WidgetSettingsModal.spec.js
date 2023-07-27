import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../../__mocks__/storeMock';
import { WIDGETS_MAP } from '../../../../assets/constants/widget';
import Tabs from '../../../base/Tabs';
import WidgetSettingsModal from './WidgetSettingsModal';

jest.mock('../../../../assets/constants/widget', () => ({
    WIDGETS_MAP: require('../../../../__mocks__/widgetMock').WIDGETS_MAP_MOCK
}));

describe('WidgetSettingsModal component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<WidgetSettingsModal {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
        instance.submitButton = {
            focus : jest.fn()
        };
        instance.isFirstStepCompleted =  jest.fn();

    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('widget() getter should return widget', () => {
        wrapper.setProps({ params: { type: 'string' } });
        const widget = instance.widget;

        expect(widget).toEqual(WIDGETS_MAP['string']);
    });

    it('getPropertiesTabs() should return one General tab by default', () => {
        const tabsWrapper = wrapper.find(Tabs);
        const tabs = tabsWrapper.props().tabs;

        expect(tabs).toHaveLength(1);
        expect(tabs[0].label).toBe('General');
    });

    it('getPropertiesTabs() should return General and Advanced tabs', () => {
        wrapper.setProps({ params: { type: 'gauge' } });

        const tabsWrapper = wrapper.find(Tabs);
        const tabs = tabsWrapper.props().tabs;

        expect(tabs).toHaveLength(2);
        expect(tabs[1].label).toBe('Advanced');
    });

    it('should set default values', async () => {
        wrapper.setProps({params: { type: 'gauge' } });
        instance.isFirstStepCompleted.mockReturnValue(true); 
        await instance.setDefaultValuesToSettings();

        const expected = {
            stringField : 'default',
            minValue    : 6,
            maxValue    : '0.01'
        };

        expect(instance.props.setWidgetAdvancedOptions).toHaveBeenCalledWith(expected);
    });

    describe('handleSaveSettings()', () => {
        it('should call onSave callback', async () => {
            wrapper.setProps({params: { type: 'string' } });

            await instance.handleSaveSettings();

            expect(instance.props.onSave).toHaveBeenCalled();
        });

        xit('should call setErrors callback if validation failed', () => {});

        xit('should set via calling setWidgetAdvancedOptions', () => {});
    });

    function getMockAppState() {
        return {
            client : {
                widget : {
                    groups:[],
                    topics:[],
                    selectedTopics:[],
                    activeValue : {
                        dataType : 'string',
                        propertyType: 'telemetry'
                    },
                    advanced : {
                        stringField : undefined,
                        minValue    : undefined,
                        maxValue    : undefined
                    },
                    error : {}
                }
            }
        };
    }

    function getMockProps() {
        return {
            isOpen  : true,
            onClose : jest.fn(),
            onSave  : jest.fn()
        };
    }

    function getMockBoundActions() {
        return {
            selectTopic              : jest.fn(),
            selectGroup              : jest.fn(),
            setWidgetAdvancedOptions : jest.fn()
        };
    }
});
