import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { sortBridges } from '../../../../utils/sort';
import ProcessingIndicator from '../../../base/ProcessingIndicator';
import Paginator from '../../../base/Paginator';
import ServicesListRow from './ServicesListRow';
import styles from './ServicesList.less';

const cx = classnames.bind(styles);
const PER_PAGE = 10;

class ServicesList extends PureComponent {
    static propTypes = {
        list              : PropTypes.array.isRequired,
        isUpdating        : PropTypes.bool,
        searchQuery       : PropTypes.string,
        sortOrder         : PropTypes.string.isRequired,
        currentPage       : PropTypes.number.isRequired,
        onChangePage      : PropTypes.func.isRequired,
        onDeleteService   : PropTypes.func.isRequired,
        activateService   : PropTypes.func.isRequired,
        deactivateService : PropTypes.func.isRequired
    }

    static defaultProps = {
        searchQuery : '',
        isUpdating  : false
    }

    componentDidUpdate(prevProps) {
        const { searchQuery } = this.props;

        if (searchQuery !== prevProps.searchQuery) {
            this.paginator?.setFirstPage();
        }
    }

    getFilteredList = () => {
        const { searchQuery, sortOrder, list } = this.props;

        const filtered = list.filter(item =>
            item.title?.toLowerCase().includes(searchQuery?.toLowerCase())
            || item.type?.toLowerCase().includes(searchQuery?.toLowerCase())
        );
        const sorted = sortBridges(filtered, sortOrder);

        return sorted;
    }

    getPaginatedList = list => {
        const { currentPage } = this.props;

        const offset = (currentPage - 1) * PER_PAGE;

        return list.slice(offset, offset + PER_PAGE);
    }

    renderList(filteredList) {
        const { currentPage, isUpdating, onChangePage } = this.props;

        const paginatedList = this.getPaginatedList(filteredList);

        return (
            <>
                {
                    isUpdating
                        ? <div className={styles.overflow}>
                            <ProcessingIndicator size={70} />
                        </div>
                        : null
                }
                <div className={styles.rowsWrapper}>
                    {paginatedList.map(service => this.renderService(service))}
                </div>
                <div className={styles.paginationControls}>
                    <Paginator
                        ref={el => this.paginator = el}
                        length={filteredList.length}
                        currentPage={currentPage}
                        perPage={PER_PAGE}
                        onPageChange={onChangePage}
                    />
                </div>
            </>
        );
    }

    renderService(service) {
        const { onDeleteService, activateService, deactivateService } = this.props;

        return (
            <ServicesListRow
                key={service.id}
                service={service}
                deleteService={onDeleteService}
                activateService={activateService}
                deactivateService={deactivateService}
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
        const { isUpdating } = this.props;

        const servicesListClasses = cx('ServicesList', { blur: isUpdating });
        const filteredList = this.getFilteredList();

        return (
            <div className={servicesListClasses}>
                {
                    filteredList.length
                        ? this.renderList(filteredList)
                        : this.renderNoServiceMessage()
                }
            </div>
        );
    }
}

export default ServicesList;
