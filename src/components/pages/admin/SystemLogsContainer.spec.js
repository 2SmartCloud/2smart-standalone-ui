import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import SystemLogsContainer from './SystemLogsContainer';

describe('SystemLogsContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<SystemLogsContainer location={{}} store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeDefined();
    });

    function getMockAppState() {
        return {
            systemLogs : {
                list : []
            }
        };
    }

    function getMockBoundActions() {
        return {
            getSystemLogs      : jest.fn(),
            getMoreLogs        : jest.fn(),
            setLogsSearchQuery : jest.fn(),
            setLogsSortOrder   : jest.fn(),
            setLogsLevel       : jest.fn(),
            resetLogsLimit     : jest.fn()
        };
    }
});
