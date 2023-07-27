import React from 'react';
import { shallow } from 'enzyme';
import getMockStore from '../../__mocks__/storeMock';
import TagContainer from './TagsContainer';
import { GROUPS_LIST } from '../../__mocks__/groupsListMock';
import {DEVICES_MOCK} from '../../__mocks__/deviceMock';

jest.mock('../../actions/interface');
jest.mock('../../actions/groups');
jest.mock('../../actions/homie');

describe('TagsContainer', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockStore = getMockStore(getMockAppState);
        const mockBoundActions = getMockBoundActions();

        wrapper = shallow(<TagContainer store={mockStore} />).dive().dive();
        wrapper.setProps(mockBoundActions);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });


    it('getSelectedGroupsList() should return groups list according to list of groupsId  ', () => {
        const selectedGroupsList = instance.getSelectedGroupsList(['1']);

        expect(selectedGroupsList).toEqual([ {
            id: "1",
            rootTopic: "groups-of-properties/1",
            label: "First group",
            value:''
        }])
    });

    it('getSensorGroupsArrayOfId() should return groupsId list according to certain property ', () => {
        const selectedGroupsListOfId = instance.getSensorGroupsArrayOfId();
        
        expect(selectedGroupsListOfId).toEqual(['1'])
    });


    function getMockAppState() {
        return {
            groups : {
                list : GROUPS_LIST
            },
            homie:{
                devices: DEVICES_MOCK
            },
            applicationInterface:{
                openedPopupd : ['ATTACH_GROUPS'],
                popupParams  : {
                    deviceId      : 'fat',
                    nodeId        : 'colors' ,
                    propertyId    : 'rgb-valid',
                    propertyType  : 'sensors',
                    hardwareType  : 'node' 
                }
            }
        };
    }

    function getMockBoundActions() {
        return {
            attachGroup : jest.fn(),
            unAttachGroup    : jest.fn()
        };
    }
});
