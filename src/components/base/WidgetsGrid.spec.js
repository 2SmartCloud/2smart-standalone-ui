import React                from 'react';
import { shallow }          from 'enzyme';
import getMockStore         from '../../__mocks__/storeMock';
import { DEVICES_MOCK }     from '../../__mocks__/deviceMock';
import { GROUPS_LIST }      from '../../__mocks__/groupsListMock';
import { WIDGET_LIST_MOCK } from '../../__mocks__/widgetsMock';
import {
    TOPICS_LIST,
    TOPIC_ORDERS,
    PROPERTIES_LIST
}                           from '../../__mocks__/topicsList';
import WidgetsGrid          from './WidgetsGrid';
import BaseMultiWidget      from './baseMultiWidget';

import Base                 from './baseWidget/BaseWidget';

jest.mock('../../actions/client/widget');
jest.mock('../../utils/detect');

describe('WidgetsGrid component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<WidgetsGrid {...mockProps} store={mockStore} />).shallow().dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render widgets list', () => {
        expect(wrapper.find(Base)).toHaveLength(4);
        expect(wrapper.find(BaseMultiWidget)).toHaveLength(1);
    });

    it('getPropertyByIds() should return related to given widget property', () => {
        const response = instance.getPropertyByIds(WIDGET_LIST_MOCK[0]);
        const expected = {
            "value": "—"
        };

        expect(response).toEqual(expected);
    });

    it('getTopicsProperties() should return properties related to all topics', () => {
        const response = instance.getTopicsProperties(TOPICS_LIST, TOPIC_ORDERS);
        const expected = PROPERTIES_LIST;

        expect(response).toEqual(expected);
    });

    it('getTopicsProperties() should return properties related to all topics and set isNoDataForWidget to true', () => {
        const response = instance.getTopicsProperties([TOPICS_LIST[0]], TOPIC_ORDERS);
        const expected = [PROPERTIES_LIST[0]];

        expect(response).toEqual(expected);
        expect(wrapper.find(BaseMultiWidget).prop('isNoDataForWidget')).toBeTruthy();
    });


    it('getWidgetsMinScales() should return scales object', () => {
        const response = instance.getWidgetsMinScales();

        expect(Object.keys(response)).toHaveLength(3);
        expect('lg' in response).toBeTruthy();
        expect('md' in response).toBeTruthy();
        expect('lg' in response).toBeTruthy();
        for (const key of Object.keys(response)) {
            expect(response[key]).toHaveLength(5);
            expect(response[key].every(obj => 'w' in obj && 'h' in obj)).toBeTruthy();
        }
    });

    function getMockAppState() {
        return {
            homie : {
                devices    : DEVICES_MOCK,
                thresholds : {}
            },
            groups: {
                list:GROUPS_LIST
            },
            client : {
                widget    : {},
                dashboard : {
                    isDeleting : false
                },
            },
            applicationInterface : {
                modal : {
                    isOpen : false
                }
            }
        }
    }

    function getMockProps() {
        return {
            screen     : {
                widgets : WIDGET_LIST_MOCK,
            },
            isUpdating : false
        };
    }

    function getMockBoundActions() {
        return {
            deleteWidget        : jest.fn(),
            updateWidget        : jest.fn(),
            getTopicsByDataType : jest.fn(),
            clearValues         : jest.fn(),
            selectTopic         : jest.fn(),
            selectWidget        : jest.fn()
        };
    }
});
