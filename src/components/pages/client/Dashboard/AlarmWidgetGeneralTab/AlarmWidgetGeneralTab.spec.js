import React                 from 'react';
import { shallow }           from 'enzyme';
import getMockStore          from '../../../../../__mocks__/storeMock';
import {
    TOPICS_LIST,
    PROPERTIES_LIST
}                            from '../../../../../__mocks__/topicsList';
import GeneralTab            from '../GeneralTab';
import AlarmWidgetGeneralTab from './AlarmWidgetGeneralTab';

jest.mock('../../../../../utils/theme/widget/getColors', () => ({
    getWidgetBackgroundColor: jest.fn()
}));


describe('AlarmWidgetGeneralTab component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockProps = getMockProps();

        wrapper = shallow(<AlarmWidgetGeneralTab  {...mockProps} store={mockStore}  />).dive().dive();

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
        expect(wrapper.find(GeneralTab).length).toBe(1);
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
                    selectedTopics:[],
                    topics:[TOPICS_LIST],
                    error : {}
                }
            }
        };
    }

    function getMockProps() {
        return {
            onTopicSelect       : jest.fn(),
            onTopicsOrderChange : jest.fn(),
            onTopicDelete       : jest.fn(),
            changeColor         : jest.fn(),
            changeName          : jest.fn(),
        };
    }
});
