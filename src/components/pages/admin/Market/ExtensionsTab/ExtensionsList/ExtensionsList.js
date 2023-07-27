import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { sortByField }          from '../../../../../../utils/sort';
// import Paginator             from '../../../../../base/Paginator';
import ProcessingIndicator      from '../../../../../base/ProcessingIndicator';

import ExtensionCard            from '../ExtensionCard';

import styles                   from './ExtensionsList.less';

const PER_PAGE = 10;
const cx = classnames.bind(styles);

class ExtensionsList extends PureComponent {
    static propTypes = {
        list               : PropTypes.array.isRequired,
        isUpdating         : PropTypes.bool.isRequired,
        searchQuery        : PropTypes.string,
        sortOrder          : PropTypes.string.isRequired,
        currentPage        : PropTypes.number.isRequired,
        // onChangePage       : PropTypes.func.isRequired,
        onInstallExtension : PropTypes.func.isRequired,
        onCheckUpdates     : PropTypes.func.isRequired,
        onUpdateService    : PropTypes.func.isRequired,
        onDeleteService    : PropTypes.func.isRequired,
        viewMode           : PropTypes.oneOf([ 'list', 'card' ]).isRequired
    }

    static defaultProps = {
        searchQuery : ''
    }

    getFilteredList = () => {
        const { searchQuery, sortOrder, list } = this.props;

        const filtered = list.filter(item => item.name?.toLowerCase().includes(searchQuery?.toLowerCase()));
        const sorted = sortByField(filtered, 'name', sortOrder);


        return sorted;
    }

    getPaginatedList = list => {
        const { currentPage } = this.props;

        const offset = (currentPage - 1) * PER_PAGE;

        return list.slice(offset, offset + PER_PAGE);
    }

    renderList(filteredList) {
        const {
            onInstallExtension, onCheckUpdates, onUpdateService, onDeleteService, isUpdating,
            viewMode
        } = this.props;

        // const paginatedList = this.getPaginatedList(filteredList);
        const containerCN = cx('extensionsContainer', {
            isBlur                   : isUpdating,
            [`viewMode-${viewMode}`] : viewMode
        });

        return (
            <>
                <div className={containerCN}>
                    { isUpdating
                        ? <div className={styles.overflow}>
                            <ProcessingIndicator size={70} />
                        </div>
                        : null
                    }
                    { filteredList.map(extension => (
                        <ExtensionCard
                            key              = {extension.name}
                            extension        = {extension}
                            installExtension = {onInstallExtension}
                            checkUpdates     = {onCheckUpdates}
                            updateService    = {onUpdateService}
                            deleteService    = {onDeleteService}
                            viewMode         = {viewMode}
                        />))}
                </div>
                {/*    <Paginator
                    ref={el => this.paginator = el}
                    length={filteredList.length}
                    currentPage={currentPage}
                    perPage={PER_PAGE}
                    onPageChange={onChangePage}
                /> */}
            </>
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
            <div className={styles.ExtensionsList}>
                {
                    filteredList.length
                        ? this.renderList(filteredList)
                        : this.renderNoServiceMessage()
                }
            </div>
        );
    }
}

export default ExtensionsList;
