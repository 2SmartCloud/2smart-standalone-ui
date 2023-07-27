import React                         from 'react';
import { shallow }                   from 'enzyme';
import getMockStore                  from '../../../../__mocks__/storeMock';
import { WIDGET_ADVANCED_CONF_MOCK } from '../../../../__mocks__/widgetsMock';
import AdvancedTab                   from './AdvancedTab';
import Row                           from './tab/Row';
import StringInput                   from './tab/StringInput';
import IntegerInput                  from './tab/IntegerInput';
import FloatInput                    from './tab/FloatInput';
import BooleanInput                  from './tab/BooleanInput';
import SelectInput                   from './tab/SelectInput';
import ColorSelect                   from './tab/ColorSelect';

describe('AdvancedTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<AdvancedTab {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(Row)).toHaveLength(6);
    });

    it('should display error message if current entity has not been selected', () => {
        wrapper.setProps({ isFirstStepCompleted: false });

        expect(wrapper.text()).toBe('Please choose an entity');
    });

    it('should render all required fields', () => {
        expect(wrapper.find(StringInput)).toHaveLength(1);
        expect(wrapper.find(IntegerInput)).toHaveLength(1);
        expect(wrapper.find(FloatInput)).toHaveLength(1);
        expect(wrapper.find(BooleanInput)).toHaveLength(1);
        expect(wrapper.find(SelectInput)).toHaveLength(1);
        expect(wrapper.find(ColorSelect)).toHaveLength(1);
    });

    it('handleFieldChange() should call setWidgetOption', () => {
        instance.handleFieldChange('stringField')('asdasd');

        const expected = { key: 'stringField', value: 'asdasd', isAdvanced: true };

        expect(instance.props.setWidgetOption).toHaveBeenCalledWith(expected);
    });

    function getMockAppState() {
        return {
            client : {
                widget : {
                    activeValueTab:0,
                    activeValue:{
                        dataType : 'string',
                        activeValue: 'theermostat'
                    },
                    currTopic : {
                        dataType : 'string'
                    },
                    params   : {},
                    advanced : {
                        stringField : undefined,
                        minValue    : undefined,
                        maxValue    : undefined,
                        toggle      : 'true',
                        chartType   : 'line',
                        chartColor  : ''

                    },
                    error : {}
                }
            }
        };
    }

    function getMockProps() {
        return {
            advancedSettings : WIDGET_ADVANCED_CONF_MOCK,
            isFirstStepCompleted: true
        };
    }

    function getMockBoundActions() {
        return {
            setWidgetOption : jest.fn(),
            setErrors       : jest.fn()
        };
    }
});
