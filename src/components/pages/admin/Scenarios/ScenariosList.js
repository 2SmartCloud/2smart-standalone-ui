import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { sortScenarios }        from '../../../../utils/sort';
import ProcessingIndicator      from '../../../base/ProcessingIndicator';
import Paginator                from '../../../base/Paginator';
import ScenariosListRow         from './ScenariosListRow';
import styles                   from './ScenariosList.less';

const cn = classnames.bind(styles);
const PER_PAGE = 10;

class ScenariosList extends PureComponent {
    static propTypes = {
        list                              : PropTypes.array.isRequired,
        isUpdating                        : PropTypes.bool,
        searchQuery                       : PropTypes.string,
        sortOrder                         : PropTypes.string.isRequired,
        currentPage                       : PropTypes.number.isRequired,
        onChangePage                      : PropTypes.func.isRequired,
        onDeleteScenario                  : PropTypes.func.isRequired,
        updateScenario                    : PropTypes.func.isRequired,
        updateScenarioState               : PropTypes.func.isRequired,
        onSetpointsOpen                   : PropTypes.func.isRequired,
        isSetpointsLoading                : PropTypes.bool,
        callExtensionNotExistNotification : PropTypes.func.isRequired

    }

    static defaultProps = {
        searchQuery        : '',
        isUpdating         : false,
        isSetpointsLoading : false
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
            || item.name?.toLowerCase().includes(searchQuery?.toLowerCase())
        );
        const sorted = sortScenarios(filtered, sortOrder);

        return sorted;
    }

    getPaginatedList = list => {
        const { currentPage } = this.props;

        const offset = (currentPage - 1) * PER_PAGE;

        return list.slice(offset, offset + PER_PAGE);
    }

    onSetpointModalOpen=(scenario) => () => {
        this.props.onSetpointsOpen(scenario);
    }

    renderScenario(scenario) {
        const {
            onDeleteScenario, updateScenario, updateScenarioState,
            isSetpointsLoading, callExtensionNotExistNotification
        } = this.props;

        return (
            <ScenariosListRow
                key={scenario.id}
                isSetpointsLoading={isSetpointsLoading}
                scenario={scenario}
                deleteScenario={onDeleteScenario}
                openSetpointsModal={this.onSetpointModalOpen(scenario)}
                updateScenario={updateScenario}
                updateScenarioState={updateScenarioState}
                callExtensionNotExistNotification={callExtensionNotExistNotification}
            />
        );
    }
    renderList(filteredList) {
        const { currentPage, isUpdating, onChangePage } = this.props;

        const paginatedList = this.getPaginatedList(filteredList);

        return (
            <>
                { isUpdating
                    ? (
                        <div className={styles.overflow}>
                            <ProcessingIndicator size={70} />
                        </div>
                    ) : null
                }
                <div className={styles.rowsWrapper}>
                    { paginatedList.map(scenario => this.renderScenario(scenario)) }
                </div>
                <div className={styles.paginationControls}>
                    <Paginator
                        ref          = {el => this.paginator = el}
                        length       = {filteredList.length}
                        currentPage  = {currentPage}
                        perPage      = {PER_PAGE}
                        onPageChange = {onChangePage}
                    />
                </div>
            </>
        );
    }

    renderNoServiceMessage() {
        return (
            <div className={styles.noScenariosMessage}>
                Sorry, we couldn&apos;t find any results for your search
            </div>
        );
    }

    render() {
        const { isUpdating } = this.props;

        const scenariosListClasses = cn('List', { blur: isUpdating });
        const filteredList = this.getFilteredList();

        return (
            <div className={scenariosListClasses}>
                { filteredList.length
                    ? this.renderList(filteredList)
                    : this.renderNoServiceMessage()
                }
            </div>
        );
    }
}

export default ScenariosList;
