import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import LoadingNotification          from '../../../base/LoadingNotification';
import NothingToShowNotification    from '../../../base/nothingToShowNotification/Base';
import LogsHeader                   from './components/LogsHeader';
import LogsList                     from './components/LogsList';
import styles                       from './SystemLogsPage.less';

class SystemLogsPage extends PureComponent {
    static propTypes = {
        location   : PropTypes.object.isRequired,
        systemLogs : PropTypes.shape({
            list        : PropTypes.array.isRequired,
            total       : PropTypes.number,
            initFetched : PropTypes.bool,
            hasEntries  : PropTypes.bool,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.string,
            logLevel    : PropTypes.string,
            limit       : PropTypes.number
        }).isRequired,
        getSystemLogs      : PropTypes.func.isRequired,
        getMoreLogs        : PropTypes.func.isRequired,
        setLogsSearchQuery : PropTypes.func.isRequired,
        setLogsSortOrder   : PropTypes.func.isRequired,
        setLogsLevel       : PropTypes.func.isRequired,
        resetLogsLimit     : PropTypes.func.isRequired
    }

    componentDidMount() {
        this.handleFetchLogs();
    }

    componentDidUpdate(prevProps) {
        const { location } = this.props;

        const isLocationChange = location !== prevProps.location;

        if (isLocationChange) this.handleFetchLogs();
    }

    componentWillUnmount() {
        const { resetLogsLimit } = this.props;

        resetLogsLimit();
    }

    handleFetchLogs = () => {
        const { getSystemLogs } = this.props;

        getSystemLogs();
    }

    handleChangeSearchQuery = value => {
        const { setLogsSearchQuery } = this.props;

        setLogsSearchQuery(value);
        this.scrollListToTop();
    }

    handleChangeLogLevel = value => {
        const { setLogsLevel } = this.props;

        setLogsLevel(value);
        this.scrollListToTop();
    }

    handleChangeOrder = value => {
        const { setLogsSortOrder } = this.props;

        setLogsSortOrder(value);
        this.scrollListToTop();
    }

    scrollListToTop() {
        if (this.list) {
            setTimeout(() => this.list.scrollToTop(), 250);
        }
    }

    renderLoader() {
        return (<LoadingNotification text='Loading logs...' />);
    }

    renderContent() {
        const {
            systemLogs : { list, hasEntries, isFetching, searchQuery, sortOrder, logLevel, total },
            getMoreLogs
        } = this.props;

        const showLoadMore = list?.length < total;

        return (
            <>
                <LogsHeader
                    searchQuery         = {searchQuery}
                    logLevel            = {logLevel}
                    isLoading           = {isFetching}
                    onChangeSearchQuery = {this.handleChangeSearchQuery}
                    onChangeLogLevel    = {this.handleChangeLogLevel}
                    onRefresh           = {this.handleFetchLogs}
                />
                <div className={styles.tableWrapper}>
                    {
                        hasEntries
                            ? <LogsList
                                ref           = {el => this.list = el}
                                list          = {list}
                                isLoading     = {isFetching}
                                sortOrder     = {sortOrder}
                                showLoadMore  = {showLoadMore}
                                onChangeOrder = {this.handleChangeOrder}
                                onLoadMore    = {getMoreLogs}
                            />
                            : <NothingToShowNotification
                                message = 'No available log records...'
                                withArrow
                            />
                    }
                </div>
            </>
        );
    }

    render() {
        const { systemLogs: { initFetched, isFetching } } = this.props;

        return (
            <div className={styles.SystemLogsPage}>
                <div className={styles.container}>
                    {
                        !initFetched && isFetching
                            ? this.renderLoader()
                            : this.renderContent()
                    }
                </div>
            </div>
        );
    }
}

export default SystemLogsPage;
