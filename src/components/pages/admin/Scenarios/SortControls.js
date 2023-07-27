import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';

import { saveData }             from '../../../../utils/localStorage';
import { SCENARIOS_SORT_ORDER }  from '../../../../assets/constants/localStorage';
import SortButton                from '../../../base/SortButton';

import styles                    from './SortControls.less';

class SortControls extends PureComponent {
    static propTypes = {
        sortData     : PropTypes.oneOf([ 'NAME_ASC', 'NAME_DESC', 'DATE_ASC', 'DATE_DESC' ]).isRequired,
        setSortOrder : PropTypes.func.isRequired
    }

    handleChangeSortOrder = (name) => {
        return () => {
            const { sortData, setSortOrder } = this.props;
            const [ sortedBy, sortedOrder ] = sortData?.split('_') || [];
            const isToggle = sortedBy === name;
            const valueToSet = isToggle
                ? `${name}_${sortedOrder === 'ASC' ? 'DESC' : 'ASC'}`
                : `${name}_ASC`;

            setSortOrder(valueToSet);
            saveData(SCENARIOS_SORT_ORDER, valueToSet);
        };
    }

    render = () => {
        const {
            sortData
        } = this.props;

        const [ sortBy, sortOrder ] = sortData?.split('_') || [];

        return (
            <div className={styles.SortControls}>
                <div className={styles.sortButtonWrapper}>
                    <SortButton
                        searchOrder = {sortBy === 'NAME' ? sortOrder : 'ASC'}
                        onChange    = {this.handleChangeSortOrder('NAME')}
                        isActive    = {sortBy === 'NAME'}
                    />
                </div>

                <div className={styles.sortButtonWrapper}>
                    <SortButton
                        searchOrder = {sortBy === 'DATE' ? sortOrder : 'ASC'}
                        onChange    = {this.handleChangeSortOrder('DATE')}
                        type        = 'date'
                        isActive    = {sortBy === 'DATE'}
                    />
                </div>
            </div>
        );
    }
}

export default SortControls;
