import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import MultipleSelectItem from '../MultipleSelectItem';

import styles from './MultipleSelectList.less';

const cn = classnames.bind(styles);

class MultipleSelectList extends PureComponent {
    static propTypes = {
        className : PropTypes.string,
        options   : PropTypes.array,
        active    : PropTypes.array,
        onChange  : PropTypes.func
    }

    static defaultProps = {
        className : '',
        options   : [],
        active    : [],
        onChange  : undefined
    }

    handleClick = (value) => {
        if (!value) return;
        const { onChange } = this.props;

        if (onChange) onChange(value);
    }

    render() {
        const { options, active, className } = this.props;
        const MultipleSelectListCN = cn({
            MultipleSelectList,
            [className] : className
        });

        return (
            <div className={MultipleSelectListCN}>
                {
                    options.map(item => {
                        const { id, label, value } = item;
                        const isActive = active.includes(value);
                        const isWeekend = isActive && (label === 'Sunday' || label === 'Saturday');

                        return (
                            <MultipleSelectItem
                                key={id}
                                label={item.label}
                                value={item.value}
                                isActive={isActive}
                                isWeekend={isWeekend}
                                onClick={this.handleClick}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default MultipleSelectList;
