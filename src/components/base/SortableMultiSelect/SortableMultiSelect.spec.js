import React from 'react';
import { shallow } from 'enzyme';
import SortableMultiSelect from './SortableMultiSelect';
import Chip from '../Chip';
import TopicSelect from '../select/TopicSelect';

import ValuesContainer from './ValuesContainer';

import {PROPERTIES_LIST} from '../../../__mocks__/topicsList';

describe('SortableMultiSelect', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockAppState();

        wrapper = shallow(<SortableMultiSelect  {...mockProps} />);
  
        instance = wrapper.instance();
    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });
/* 
    it('Should render selected groups', () => {
        wrapper.setProps({
            values :[ PROPERTIES_LIST[0] ]
        })
        const values = wrapper.find(Chip);
    
        expect(values).toHaveLength(1);
    });
 */
    it('Should render empty message', () => {
        expect(wrapper.find('.infoWrapper')).toHaveLength(1);
    });

    
    it('Should select option', async () => {
        instance.handleOptionAttach({id:'id', label:'label'});

        expect(instance.props.onValueSelect).toBeCalled();
    });

    
    it('Should delete option from selected',async () => {
        instance.handleValueDelete({id:'id', label:'label'});
       
        expect(instance.props.onValueDelete).toBeCalled();
    });

    
    it('Should render select', () => {
        wrapper.setProps({values:[PROPERTIES_LIST[0]]})      
 
        expect(wrapper.find(TopicSelect).prop('options')).toEqual([PROPERTIES_LIST[1]])
        expect(wrapper.find(ValuesContainer).prop('values')).toEqual([PROPERTIES_LIST[0]])
    
    });

    

    function getMockAppState() {
        return {
            options : PROPERTIES_LIST,
            values  : [],
            onValueSelect   : jest.fn(),
            onValueDelete : jest.fn(),
            onOrderChange: jest.fn()
        };
    }
});
