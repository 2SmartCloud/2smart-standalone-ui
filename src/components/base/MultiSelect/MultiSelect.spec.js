import React               from 'react';
import { shallow }         from 'enzyme';
import MultiSelect         from './MultiSelect.js';
import Chip                from '../Chip';
import ProcessingIndicator from '../ProcessingIndicator';
import {
    GROUPS_LIST,
    SELCTED_GROUPS_LIST
}                          from '../../../__mocks__/groupsListMock';

describe('MultiSelect', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockAppState();

        wrapper = shallow(<MultiSelect  {...mockProps} />);

        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('Should render selected groups', () => {
        wrapper.setProps({
            values : SELCTED_GROUPS_LIST
        })
        const values = wrapper.find(Chip);
    
        expect(values).toHaveLength(2);
    });

    it('Should render empty message', () => {
        expect(wrapper.find('.infoWrapper')).toHaveLength(1);
    });

    
    it('Should render spinner on select groups block', () => {
        wrapper.setState({
            isLoading : true
        })
        expect(wrapper.find(ProcessingIndicator)).toHaveLength(1)
    });

    it('Should select option', async () => {
        instance.handleOptionAttach({id:'id', label:'label'});

        expect(wrapper.state().isLoading).toBeTruthy();

        await instance.props.onValueDelete();

        expect(instance.props.onValueSelect).toBeCalled();
        expect(wrapper.state().isLoading).toBeFalsy();
    });

    
    it('Should delete option from selected',async () => {
        instance.handleValueDelete({id:'id', label:'label'});
        expect(wrapper.state().isLoading).toBeTruthy();
        
        await instance.props.onValueDelete();
        
        expect(instance.props.onValueDelete).toBeCalled();
        expect(wrapper.state().isLoading).toBeFalsy();
    });

    

    function getMockAppState() {
        return {
            options       : GROUPS_LIST,
            values        : [],
            onValueSelect : jest.fn(),
            onValueDelete : jest.fn(),
            emptyMessages : [ 'empty message' ]
        };
    }
});
