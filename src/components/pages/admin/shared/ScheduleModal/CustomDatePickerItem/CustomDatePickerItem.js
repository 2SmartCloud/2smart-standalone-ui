import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';

import styles from './CustomDatePickerItem.less';

const cn = classnames.bind(styles);

class CustomDatePickerItem extends PureComponent {
    handleClick = () => {
        const { onClick, index } = this.props;

        if (onClick) onClick(index);
    }

    handleMouseEnter = () => {
        const { onMouseEnter, index } = this.props;

        if (onMouseEnter) onMouseEnter(index);
    }

    handleMouseLeave = () => {
        const { onMouseLeave, index } = this.props;

        if (onMouseLeave) onMouseLeave(index);
    }

    render() {
        const {
            label,
            isNotActive,
            isSingle,
            isStartRange,
            isRange,
            isEndRange } = this.props;

        const dateContainerCN = cn({
            CustomDatePickerItem,
            selectedStart : isStartRange,
            selectedEnd   : isEndRange,
            inRange       : isRange,
            notActive     : isNotActive
        });
        const dateItemCN = cn(styles.date, {
            notActive : isNotActive,
            active    : isSingle || isStartRange || isEndRange,
            inRange   : isRange
        });

        return (
            <div
                className={dateContainerCN}
            >
                <div
                    className={dateItemCN}
                    onClick={this.handleClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >{label}</div>
            </div>
        );
    }
}

export default CustomDatePickerItem;

CustomDatePickerItem.propTypes = {
    index        : PropTypes.number,
    label        : PropTypes.string,
    isNotActive  : PropTypes.bool,
    isSingle     : PropTypes.bool,
    isStartRange : PropTypes.bool,
    isRange      : PropTypes.bool,
    isEndRange   : PropTypes.bool,
    onClick      : PropTypes.func,
    onMouseEnter : PropTypes.func,
    onMouseLeave : PropTypes.func
};

CustomDatePickerItem.defaultProps = {
    index        : null,
    label        : '',
    isNotActive  : false,
    isSingle     : false,
    isStartRange : false,
    isRange      : false,
    isEndRange   : false,
    onClick      : undefined,
    onMouseEnter : undefined,
    onMouseLeave : undefined
};
