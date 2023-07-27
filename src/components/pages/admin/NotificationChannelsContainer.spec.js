import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import NotificationChannelsContainer from './NotificationChannelsContainer';

jest.mock('../../../actions/marketServices');
jest.mock('../../../actions/userServices');

describe('NotificationChannelsContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<NotificationChannelsContainer store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockAppState() {
        return {
            notificationChannels: {
                channels : {
                    list       : [],
                    isFetching : false
                },
                userChannels : {
                    list       : [],
                    isFetching : false
                }
            }
        };
    }

    function getMockBoundActions() {
        return {};
    }
});
