import React                         from 'react';
import { shallow }                   from 'enzyme';
import getMockStore                  from '../../../../__mocks__/storeMock';
import { WIDGET_ADVANCED_CONF_MOCK } from '../../../../__mocks__/widgetsMock';
import GeneralTab                    from './GeneralTab';
import ColorSelect                   from './tab/ColorSelect';
import Input                         from '../../../base/inputs/String';
import EntityControl                 from '../../../base/controls/Entity';
import { getWidgetBackgroundColor }  from '../../../../utils/theme/widget/getColors';
import Theme, { THEMES } from '../../../..//utils/theme';

jest.mock('../../../../utils/theme/widget/getColors', () => ({
    getWidgetBackgroundColor: jest.fn()
}));


describe('GeneralTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<GeneralTab {...mockProps} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(Input)).toHaveLength(1);
        expect(wrapper.find(EntityControl)).toHaveLength(1);
        expect(wrapper.find(ColorSelect)).toHaveLength(1);

    });

    function getMockAppState() {
        return {
            client : {
                widget : {
                    activeValueTab:0,
                    activeValue:{
                        dataType    : 'string',
                        activeValue : 'theermostat'
                    },
                    currTopic : {
                        dataType : 'string'
                    },
                    currGroup : { },
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

    const initialTopics= [{
        deviceId   : "fat",
        propertyId : "enum-proc",
        topic      : "sweet-home/fat/enum-unit/enum-proc",
        value      : "sweet-home/fat/enum-unit/enum-proc",
        label      : "sweet-home/fat/enum-unit/enum-proc"
    },{
        deviceId   : "fat",
        propertyId : "int-proc",
        topic      : "sweet-home/fat/enum-unit/int-proc",
        value      : "sweet-home/fat/enum-unit/int-proc",
        label      : "sweet-home/fat/enum-unit/int-proc"
    }];

    const initialGroups = [{ 
        topic        : 'groups-of-properties/6',
        label        : 'Six group',
        value        : 'groups-of-properties/6',
        deviceId     : '6',
        hardwareType : 'group',
        propertyType : 'group',
        type         : 'color',
        dataType     : 'float'
    }, { 
        topic        : 'groups-of-properties/7',
        label        : 'Seven group',
        value        : 'groups-of-properties/7',
        deviceId     : '7',
        hardwareType : 'group',
        propertyType : 'group',
        type         : 'color',
        dataType     : 'float'
    }]

    function getMockProps() {
        return {
            topics        : initialTopics,
            groups        : initialGroups,
            onTopicChange : jest.fn(),
            onGroupChange : jest.fn()
        };
    }

    function getMockBoundActions() {
        return {
            setWidgetOption : jest.fn(),
            setErrors       : jest.fn()
        };
    }
});
