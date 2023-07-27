import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Tooltip }              from '@material-ui/core';
import Search                   from '../../../../base/inputs/Search';
import Icon                     from '../../../../base/Icon';
import styles                   from './LogsHeader.less';
import LogLevels                from './LogLevels';

const cx = classnames.bind(styles);

class LogsHeader extends PureComponent {
    static propTypes = {
        searchQuery         : PropTypes.string,
        logLevel            : PropTypes.string,
        isLoading           : PropTypes.bool,
        onChangeSearchQuery : PropTypes.func.isRequired,
        onChangeLogLevel    : PropTypes.func.isRequired,
        onRefresh           : PropTypes.func.isRequired
    }

    static defaultProps = {
        searchQuery : '',
        logLevel    : undefined,
        isLoading   : false
    }

    handleChangeSearch = value => {
        const { onChangeSearchQuery } = this.props;

        onChangeSearchQuery(value);
    }

    handleRefreshClick = () => {
        const { onRefresh } = this.props;

        onRefresh();
    }

    render() {
        const { searchQuery, logLevel, isLoading, onChangeLogLevel } = this.props;

        return (
            <div className={styles.LogsHeader}>
                <div className={styles.searchWrapper}>
                    <Search
                        placeholder = 'Search for logs'
                        value       = {searchQuery}
                        // isDisabled  = {isLoading}
                        onChange    = {this.handleChangeSearch}
                    />
                </div>
                <div className={styles.levelsWrapper}>
                    <LogLevels
                        logLevel         = {logLevel}
                        // disabled         = {isLoading}
                        onChangeLogLevel = {onChangeLogLevel}
                    />
                </div>
                <div
                    className = {cx('refreshWrapper', { 'disabled': isLoading })}
                    onClick   = {this.handleRefreshClick}
                >
                    <Tooltip title='Refresh'>
                        <div>
                            <Icon type='refresh' />
                        </div>
                    </Tooltip>
                </div>
            </div>
        );
    }
}

export default LogsHeader;
