import React from 'react';
import { shallow } from 'enzyme';
import BorderedList from '../list/BorderedList';

import { GROUPS_LIST } from '../../../__mocks__/groupsListMock';


describe('Bordered list', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockBoundActions = getMockBoundActions();
        const mockProps=getMockProps();
        wrapper = shallow(<BorderedList  {...mockProps}  {...mockBoundActions}/>);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('should render Groups list', () => {
        expect(wrapper.find('.option')).toHaveLength(6)
       
    });

    it('should render "No groups label" ', () => {
        expect(wrapper.find('.infoLabel')).toBeTruthy();
    });

    it('should scroll in block " ', () => {
        spyOn(instance, 'scrollToBottom');
        wrapper.setProps({
            totalLength:6
        })

        expect(instance.scrollToBottom).toHaveBeenCalled();
    });



    function getMockProps() {
        return {
            list : GROUPS_LIST,
            totalLength: 5
        };
    }

    function getMockBoundActions() {
        return {
            onDelete : jest.fn(),
        };
    }
});

