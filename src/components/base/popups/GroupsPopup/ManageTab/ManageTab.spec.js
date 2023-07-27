import React from 'react';
import { shallow,mount } from 'enzyme';
import ManageTab from './ManageTab';
import BorderedList from '../../../list/BorderedList';
import { GROUPS_LIST } from '../../../../../__mocks__/groupsListMock';
import * as groupActions from '../../../../../actions/groups';

jest.mock('../../../../../actions/homie');
jest.mock('../../../../../history');

const serahcedList=[ {
        id: "2",
        rootTopic: "groups-of-properties/2",
        label: "Second group",
        value:''
    },{
        id: "22",
        rootTopic: "groups-of-properties/2",
        label: "New second group",
        value:''
    }
]

describe('ManageTab', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockBoundActions = getMockBoundActions();
        const mockProps=getMockProps();
        wrapper = shallow(<ManageTab  {...mockProps}  {...mockBoundActions}/>);

        instance = wrapper.instance();
        instance.input = {
            input: {
                focus: jest.fn()
            }
          }
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should search groups by searchQuery', () => {
        instance.handleSearchInputChange('second');

        const borderedListProps = wrapper.find(BorderedList).props().list;

        expect(borderedListProps).toEqual(serahcedList);
    });


    it('handleCreateNewGroup()  shouldn\'t create groups if trimmed value is empty string', () => {
        wrapper.setState({
            groupName: ''
        });

        instance.handleCreateNewGroup(({ preventDefault: () => {} }));

        expect(wrapper.state().isCreateProcessing).toBeFalsy();
        expect(wrapper.state().groupErr).toBe("Field should not be empty");
    });

    it('handleCreateNewGroup() success', async () => {
        wrapper.setState({
            groupName: 'group'
        })
        spyOn(instance, 'handleProcessingGroupCreate').and.stub();;
        spyOn(instance, 'handleSuccessGroupCreate').and.stub();;

        
        await instance.handleCreateNewGroup(({ preventDefault: () => {} }));
       

        expect(instance.handleProcessingGroupCreate).toHaveBeenCalled();
        expect(instance.handleSuccessGroupCreate).toHaveBeenCalled();
        expect(instance.props.onCreate).toHaveBeenCalled();
    });


    it('handleCreateNewGroup() error ', async () => {
        wrapper.setState({
            groupName: 'group'
        })
    
        wrapper.setProps({
            onCreate : jest.fn().mockReturnValue(Promise.reject({ code: 'EXISTS' }))
        });

        spyOn(instance, 'handleProcessingGroupCreate').and.stub();;
        spyOn(instance, 'handleErrorGroupCreate').and.stub();;


        await instance.handleCreateNewGroup(({ preventDefault: () => {} }));


        expect(instance.handleProcessingGroupCreate).toHaveBeenCalled();
        expect(instance.handleErrorGroupCreate).toHaveBeenCalled();

        expect(instance.props.onCreate).toHaveBeenCalled();
    });



    it('handleDeleteGroupConfirm() success', async () => {
        wrapper.setState({
            groupName: 'group'
        })
        spyOn(instance, 'handleProccessingGroupDelete').and.stub();;
        spyOn(instance, 'handleSuccessGroupDelete').and.stub();;

        
        await instance.handleDeleteGroupConfirm();
       

        expect(instance.handleProccessingGroupDelete).toHaveBeenCalled();
        expect(instance.handleSuccessGroupDelete).toHaveBeenCalled();
        expect(instance.props.onDelete).toHaveBeenCalled();
    });


    it('handleDeleteGroupConfirm() error ', async () => {
        wrapper.setState({
            groupName: 'group'
        })
    
        wrapper.setProps({
            onDelete : jest.fn().mockReturnValue(Promise.reject({ code: 'EXISTS' }))
        });

        spyOn(instance, 'handleProccessingGroupDelete').and.stub();;
        spyOn(instance, 'handleErrorGroupDelete').and.stub();;


        await instance.handleDeleteGroupConfirm();


        expect(instance.handleProccessingGroupDelete).toHaveBeenCalled();
        expect(instance.handleErrorGroupDelete).toHaveBeenCalled();

        expect(instance.props.onDelete).toHaveBeenCalled();
    });




    function getMockProps() {
        return {
            groups : GROUPS_LIST
        };
    }

    function getMockBoundActions() {
        return {
            onCreate : jest.fn(),
            onDelete : jest.fn(),
        };
    }
});

