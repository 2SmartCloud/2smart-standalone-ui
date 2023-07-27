import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../__mocks__/storeMock';
import PopupContainer from './PopupContainer';
import { GROUPS_LIST } from '../../__mocks__/groupsListMock';

jest.mock('../../actions/groups');
jest.mock('../../actions/homie');
jest.mock('../../actions/interface');
jest.mock('../../history');

describe('PopupContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<PopupContainer  store={mockStore}  {...mockBoundActions}/>).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should fetch data', () => {
        instance.fetchData();

        expect(instance.props.getGroupsEntities).toHaveBeenCalled();
        expect(instance.props.getDiscoveries).toHaveBeenCalled();
        
    });


    it('should close all Popups', () => {
        wrapper.setProps({
            applicationInterface : {
                openedPopups: ['ATTACH_POPUP', 'MANAGE_GROUPS']
            }
        });
        wrapper.setProps({
            applicationInterface : {
                openedPopups: []
            }
        });

        expect(wrapper.isEmptyRender()).toBeTruthy();
    });



    function getMockAppState() {
        return {
            discovery:{
                isFetching:false,
                discoveries:{}
            },
            groups : {
                list       : GROUPS_LIST,
                isFetching : false
            },
            applicationInterface:{
                openedPopups:[]
            }
        };
    }

    function getMockBoundActions() {
        return {
            getGroupsEntities : jest.fn(),
            getDiscoveries    : jest.fn(),
            createGroupEntity : jest.fn(),
            deleteGroupEntity : jest.fn(),
            closeLastPopup    : jest.fn(),
            closeAllPopups    : jest.fn(),
            openPopup         : jest.fn()
        };
    }
});
