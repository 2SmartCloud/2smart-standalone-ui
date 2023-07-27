import React from 'react';
import { shallow } from 'enzyme';
import Chip from '../Chip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ValuesContainer from './ValuesContainer';

import {PROPERTIES_LIST} from '../../../__mocks__/topicsList';

describe('SortableMultiSelect', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
        const mockProps = getMockAppState();

        wrapper = shallow(<ValuesContainer  {...mockProps} />);

        instance = wrapper.instance();

    });

    it('should be created', () => {
        expect(instance).toBeTruthy();
    });

    it('Should render selected groups', async() => {
        instance.handleDragEnd({
            source:{
                droppableId: "droppable",
                index: 0
            },
            destination:{
                droppableId: "droppable",
                index: 1
            }
        });
        expect(instance.props.onOrderChange).toBeCalled();
    });
    

    function getMockAppState() {
        return {
            values  : [],
            onValueDelete : jest.fn(),
            onOrderChange: jest.fn()
        };
    }
});
