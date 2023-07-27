import React, { PureComponent }      from 'react';
import classnames                    from 'classnames/bind';
import PropTypes                     from 'prop-types';

import { fillEntitiesLabelsByTopics } from '../../../../utils/homie/getEntities';
import Chip                          from '../../Chip.js';
import ValuesContainer               from '../../SortableMultiSelect/ValuesContainer';
import EntityControl                 from '../Entity';

import styles                        from './Entities.less';

const cx = classnames.bind(styles);

const CHIP_CLASSES = {
    chipRoot : styles.chip
};

class EntitiesControl extends PureComponent {
    handleValueDelete = value => {
        const { onValueDelete } = this.props;

        if (onValueDelete) onValueDelete(value);
    }

    handleChangeOrder = (source, destination) => {
        const { onOrderChange } = this.props;

        if (onOrderChange) onOrderChange(source, destination);
    }

    renderEmptyMessage = () => {
        const { emptyMessages } = this.props;

        return (
            <div className={styles.infoWrapper}>
                <div className={styles.infoLabel}>
                    { emptyMessages.map((line, index) => (
                        <p key={index}> {/* eslint-disable-line react/no-array-index-key*/}
                            {line}
                        </p>
                    )) }
                </div>
            </div>
        );
    };

    renderValueTooltip = (value) => {
        return (
            <div>
                <div>{value?.label}</div>
                { value?.topic
                    ? (
                        <div>({value?.topic})</div>
                    ) : null
                }
            </div>
        );
    }

    renderValues = (value) => {
        return (
            value.map(valueItem => (
                <Chip
                    key               = {valueItem.id}
                    data              = {valueItem}
                    classes           = {CHIP_CLASSES}
                    onDeleteIconClick = {this.handleValueDelete}
                    renderTooltip     = {this.renderValueTooltip}
                />
            ))
        );
    }

    render() {
        const {
            value,
            onValueSelect,
            options,
            isInvalid,
            isDraggable,
            placeholder
        } = this.props;
        const entityControlsCN = cx('EntitiesControl');

        const processValue = value?.length
            ? fillEntitiesLabelsByTopics(value)
            : [];

        const isValuesExist = !!processValue?.length;

        return (
            <div className={entityControlsCN}>
                <EntityControl
                    value       = {value}
                    options     = {options}
                    onChange    = {onValueSelect}
                    placeholder = {placeholder || 'Select entities'}
                    isInvalid   = {isInvalid}
                    multiple
                />
                <div className={cx(styles.valuesContainer, { notEmpty: isValuesExist })}>
                    { isValuesExist && isDraggable
                        ? (
                            <ValuesContainer
                                values        = {processValue}
                                onOrderChange = {this.handleChangeOrder}
                                onValueDelete = {this.handleValueDelete}
                            />
                        ) : null
                    }

                    { isValuesExist && !isDraggable
                        ? this.renderValues(processValue)
                        : null
                    }

                    { !isValuesExist ? this.renderEmptyMessage() : null }
                </div>
            </div>
        );
    }
}


EntitiesControl.propTypes = {
    value         : PropTypes.array,
    onValueSelect : PropTypes.func.isRequired,
    onValueDelete : PropTypes.func.isRequired,
    onOrderChange : PropTypes.func,
    emptyMessages : PropTypes.array,
    options       : PropTypes.array,
    isInvalid     : PropTypes.bool,
    isDraggable   : PropTypes.bool,
    placeholder   : PropTypes.string
};

EntitiesControl.defaultProps = {
    value         : [],
    options       : [],
    emptyMessages : [],
    onOrderChange : void 0,
    isInvalid     : false,
    isDraggable   : true,
    placeholder   : ''
};

export default EntitiesControl;

