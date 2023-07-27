import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Tooltip from '@material-ui/core/Tooltip';

import styles from './MultipleSelectItem.less';

const cn = classnames.bind(styles);

class MultipleSelectItem extends PureComponent {
    static propTypes = {
        label     : PropTypes.string,
        value     : PropTypes.string,
        isActive  : PropTypes.bool,
        isWeekend : PropTypes.bool,
        onClick   : PropTypes.func
    }

    static defaultProps = {
        label     : '',
        value     : '',
        isActive  : false,
        isWeekend : false,
        onClick   : undefined
    }

    handleClick = () => {
        const { onClick, value } = this.props;

        if (onClick) onClick(value);
    }

    render() {
        const { label, isActive, isWeekend } = this.props;
        const MultipleSelectItemCN = cn({
            MultipleSelectItem,
            active  : isActive,
            weekend : isWeekend
        });
        const labelToSet = label.slice(0, 1);

        return (
            <Tooltip title={label}>
                <div
                    className={MultipleSelectItemCN}
                    onClick={this.handleClick}
                >{labelToSet}
                </div>
            </Tooltip>
        );
    }
}

export default MultipleSelectItem;
