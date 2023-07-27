import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../../__mocks__/storeMock';
import ServicesContainer from './ServicesContainer';

jest.mock('../../../actions/marketServices');
jest.mock('../../../actions/userServices');

describe('ServicesContainer component', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<ServicesContainer store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    function getMockAppState() {
        return {
            marketServices : {
                list       : [],
                isFetching : false
            },
            userServices : {
                list       : [],
                isFetching : false
            }
        };
    }

    function getMockBoundActions() {
        return {};
    }
});
