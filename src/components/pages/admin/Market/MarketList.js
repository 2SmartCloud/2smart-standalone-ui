import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { sortMarketServices }   from '../../../../utils/sort';
import MarketListRow            from './MarketListRow';
import styles                   from './MarketList.less';

const PER_PAGE = 10;
const cx = classnames.bind(styles);

class MarketList extends PureComponent {
    static propTypes = {
        list             : PropTypes.array.isRequired,
        searchQuery      : PropTypes.string,
        sortOrder        : PropTypes.string.isRequired,
        currentPage      : PropTypes.number.isRequired,
        onInstallService : PropTypes.func.isRequired,
        onCheckUpdates   : PropTypes.func.isRequired,
        onUpdateService  : PropTypes.func.isRequired,
        onDeleteService  : PropTypes.func.isRequired,
        viewMode         : PropTypes.oneOf([ 'list', 'card' ]).isRequired
    }

    static defaultProps = {
        searchQuery : ''
    }

    getFilteredList = () => {
        const { searchQuery, sortOrder, list } = this.props;

        const filtered = list.filter(item => item.label?.toLowerCase().includes(searchQuery?.toLowerCase()));
        const sorted = sortMarketServices(filtered, sortOrder);

        return sorted;
    }

    getPaginatedList = list => {
        const { currentPage } = this.props;

        const offset = (currentPage - 1) * PER_PAGE;

        return list.slice(offset, offset + PER_PAGE);
    }

    renderList(filteredList) {
        const { viewMode } = this.props;

        const rowsWrapperCN = cx(styles.rowsWrapper, {
            [`viewMode-${viewMode}`] : viewMode
        });

        return (
            <div className={rowsWrapperCN}>
                {filteredList.map(service => this.renderService(service))}
            </div>
        );
    }

    renderService(service) {
        const {
            onInstallService, onCheckUpdates, onUpdateService, onDeleteService,
            viewMode
        } = this.props;

        return (
            <MarketListRow
                key            = {service.name}
                service        = {service}
                installService = {onInstallService}
                checkUpdates   = {onCheckUpdates}
                updateService  = {onUpdateService}
                deleteService  = {onDeleteService}
                viewMode       = {viewMode}
            />
        );
    }

    renderNoServiceMessage() {
        return (
            <div className={styles.noServicesMessage}>
                Sorry, we couldn&apos;t find any results for your search
            </div>
        );
    }

    render() {
        const filteredList = this.getFilteredList();

        return (
            <div className={styles.ServicesList}>
                { filteredList.length
                    ? this.renderList(filteredList)
                    : this.renderNoServiceMessage()
                }
            </div>
        );
    }
}

export default MarketList;
