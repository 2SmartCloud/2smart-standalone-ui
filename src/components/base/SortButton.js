import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import ArrowRightAltIcon        from '@material-ui/icons/ArrowRightAlt';

import { saveData }             from '../../utils/localStorage';

import styles                   from './SortButton.less';

const cx = classnames.bind(styles);

class SortButton extends PureComponent {
    static propTypes = {
        searchOrder     : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,
        onChange        : PropTypes.func.isRequired,
        type            : PropTypes.oneOf([ 'name', 'date' ]),
        localStorageKey : PropTypes.string,
        isActive        : PropTypes.bool
    }

    static defaultProps = {
        type            : 'name',
        localStorageKey : '',
        isActive        : false
    }

    handleChangeOrder = () => {
        const { searchOrder, onChange, localStorageKey } = this.props;
        const value = searchOrder === 'ASC' ? 'DESC' : 'ASC';

        onChange(value);
        if (localStorageKey) saveData(localStorageKey, value);
    }

    render() {
        const { searchOrder, type, isActive } = this.props;
        const isStraightOrder = searchOrder === 'ASC';
        const sortButtonCN = cx(styles.SortButton, {
            active : isActive,
            [type] : type,
            isStraightOrder
        });

        if (type === 'date') {
            return (
                <div
                    className = {sortButtonCN}
                    onClick   = {this.handleChangeOrder}
                >
                    <span className={styles.notMobileLabel}>Sort by date</span>
                    <span className={styles.mobileLabel}>Date</span>
                    <ArrowRightAltIcon fontSize='small' />
                </div>
            );
        }

        const labelFrom = isStraightOrder ? 'A' : 'Z';
        const labelTo = isStraightOrder ? 'Z' : 'A';

        return (
            <div
                className = {sortButtonCN}
                onClick   = {this.handleChangeOrder}
            >
                <span>{labelFrom}</span>
                <ArrowRightAltIcon fontSize='small' />
                <span>{labelTo}</span>
            </div>
        );
    }
}

export default SortButton;
