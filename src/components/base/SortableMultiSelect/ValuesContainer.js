import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    DragDropContext,
    Droppable,
    Draggable
}                               from 'react-beautiful-dnd';

import Chip                     from '../Chip.js';

import styles                   from './styles.less';

class ValuesContainer extends PureComponent {
    static propTypes = {
        values        : PropTypes.array.isRequired,
        onOrderChange : PropTypes.func.isRequired,
        onValueDelete : PropTypes.func
    }

    static defaultProps = {
        onValueDelete : undefined
    }

    state = {
        values : this.props.values
    }

    handleDragEnd=(result) => {
        const { onOrderChange } = this.props;

        if (!result.destination) {
            return;
        }
        onOrderChange(result.source.index,  result.destination.index);
    }

    renderValues=() => {
        const { values, onValueDelete } = this.props;

        return (
            <>
                { values.map((value, index) => (
                    <Draggable key={value.topic} draggableId={value.topic} index={index}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.chipWrapper}
                            >
                                <Chip
                                    classes           = {{
                                        chipRoot  : styles.chip,
                                        chipLabel : styles.chipLabel
                                    }}
                                    withTooltip       = {false}
                                    key               = {value.topic}
                                    id                = {value.topic}
                                    index             = {index}
                                    data              = {value}
                                    onDeleteIconClick = {onValueDelete}
                                />
                            </div>)
                        }
                    </Draggable>
                )) }
            </>
        );
    }

    render = () => {
        return (
            <DragDropContext onDragEnd={this.handleDragEnd}>
                <Droppable droppableId='droppable'>
                    { (provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {this.renderValues()}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

        );
    };
}

export default ValuesContainer;

