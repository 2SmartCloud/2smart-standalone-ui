import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import queryString               from 'query-string';
import { SCENARIO_CREATE }       from '../../../../assets/constants/routes';
import history                   from '../../../../history';
import LoadingNotification       from '../../../base/LoadingNotification';
import NothingToShowNotification from '../../../base/nothingToShowNotification/Base';
import ListedPageHeader          from '../shared/ListedPageHeader';
import ConfirmationModal         from '../shared/ConfirmationModal';
import SetpointsModal            from './SetpointsModal';
import ScenariosList             from './ScenariosList';
import SortControls              from './SortControls';
import styles                    from './ScenariosPage.less';
import SetupScenarioSelect       from './SetupScenarioSelect';

const PAGE_HEADER_CLASSES = {
    pageHeader    : styles.pageHeader,
    filters       : styles.filters,
    searchWrapper : styles.searchWrapper
};

class ScenariosPage extends PureComponent {
    static propTypes = {
        installedExtensions : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        scenarios : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            isUpdating  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'NAME_ASC', 'NAME_DESC', 'DATE_ASC', 'DATE_DESC' ]),
            currentPage : PropTypes.number,
            homieState  : PropTypes.string
        }).isRequired,
        setSearchQuery                    : PropTypes.func.isRequired,
        setSortOrder                      : PropTypes.func.isRequired,
        setCurrentPage                    : PropTypes.func.isRequired,
        updateScenario                    : PropTypes.func.isRequired,
        updateScenarioState               : PropTypes.func.isRequired,
        deleteScenario                    : PropTypes.func.isRequired,
        isTresholdFetching                : PropTypes.bool.isRequired,
        callExtensionNotExistNotification : PropTypes.func.isRequired
    }

    state = {
        modal : {
            isOpen : false
        },
        setpointModal : {
            isOpen : false
        }
    }

    handleCreateScenario = params => {
        const queryParams = queryString.stringify(params);
        const createScenarioPath = `${SCENARIO_CREATE}?${queryParams}`;

        history.push(createScenarioPath);
    }

    handleDeleteScenarioClick = scenario => {
        this.modalContext = scenario.id;
        this.modalSubmitHandler = this.deleteScenario;

        const title = `Delete ${scenario.title}`;
        const text = 'You will not be able to recover this scenario!';
        const labels = { submit: 'Yes, delete scenario', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true, isProcessing: false } });
    }

    handleOpenSetpointsModal=({ title, id }) => {
        const modalTitle = `Setpoint list of scenario ${title}`;

        this.setState({ setpointModal: { title: modalTitle, isOpen: true, scenarioId: id } });
    }

    handleCloseSetpointsModal = () => {
        this.setState({ setpointModal: { isOpen: false } });
    }

    handleModalClose = () => {
        return new Promise(resolve => {
            this.setState({ modal: { isOpen: false } }, resolve);
        });
    }

    getSimpleScenarioTypeOptions() {
        const { list } = this.props.installedExtensions;

        return list
            .filter(extension => [ 'installed', 'up-to-date', 'update-available' ]?.includes(extension.state))
            .map(item => ({
                value : item.id,
                label : item.title,
                icon  : item.icon
            }));
    }

    getScenariosList = () => {
        const { scenarios, installedExtensions } = this.props;

        return scenarios?.list?.map(listItem => {
            const extensionData = installedExtensions
                ?.list?.find(extension => extension?.name === listItem?.type) || {};

            return ({
                ...listItem,
                icon : extensionData?.icon || void 0
            });
        }) || [];
    }

    deleteScenario = async () => {
        if (!this.modalContext) return;

        const { deleteScenario } = this.props;

        this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: true } }));

        try {
            await deleteScenario(this.modalContext);
            this.handleModalClose();
        } catch {
            this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: false } }));
        }
    }

    renderLoader() {
        return (<LoadingNotification text='Loading scenarios...' />);
    }

    renderCustomSort = () => {
        const {
            setSortOrder,
            scenarios : { sortOrder }
        } = this.props;

        return (
            <SortControls
                sortData     = {sortOrder}
                setSortOrder = {setSortOrder}
            />
        );
    }

    renderContent() {
        const {
            installedExtensions,
            scenarios: { list, isUpdating, searchQuery, sortOrder, currentPage },
            setSearchQuery,
            setCurrentPage,
            updateScenario,
            updateScenarioState,
            callExtensionNotExistNotification,
            isTresholdFetching
        } = this.props;

        const hasScenarios = list?.length;

        const scenariosList = this.getScenariosList();

        return (
            <>
                <ListedPageHeader
                    placeholder         = 'Search for a scenario'
                    searchQuery         = {searchQuery}
                    sortOrder           = {sortOrder}
                    isSearchRender      = {!!hasScenarios}
                    isListFetching      = {installedExtensions.isFetching}
                    setSearchQuery      = {setSearchQuery}
                    renderCustomSort    = {this.renderCustomSort}
                    classes             = {PAGE_HEADER_CLASSES}
                >
                    <SetupScenarioSelect
                        placeholder = 'Create scenario'
                        options     = {this.getSimpleScenarioTypeOptions()}
                        onCreate    = {this.handleCreateScenario}
                    />
                </ListedPageHeader>
                <div className={styles.tableWrapper}>
                    { hasScenarios
                        ? (
                            <ScenariosList
                                list                              = {scenariosList}
                                isSetpointsLoading                = {isTresholdFetching}
                                isUpdating                        = {isUpdating}
                                searchQuery                       = {searchQuery}
                                sortOrder                         = {sortOrder}
                                currentPage                       = {currentPage}
                                onChangePage                      = {setCurrentPage}
                                onDeleteScenario                  = {this.handleDeleteScenarioClick}
                                onSetpointsOpen                   = {this.handleOpenSetpointsModal}
                                updateScenario                    = {updateScenario}
                                updateScenarioState               = {updateScenarioState}
                                callExtensionNotExistNotification = {callExtensionNotExistNotification}
                            />
                        ) : (
                            <NothingToShowNotification
                                message = 'Let’s create your first scenario...'
                                withArrow
                            />
                        )
                    }
                </div>
            </>
        );
    }

    renderConfirmModal() {
        const { modal: { title, text, labels, isOpen, isProcessing } } = this.state;

        return (
            <ConfirmationModal
                title     = {title}
                text      = {text}
                labels    = {labels}
                isOpen    = {isOpen}
                isLoading = {isProcessing}
                onSubmit  = {this.modalSubmitHandler} // eslint-disable-line react/jsx-handler-names
                onClose   = {this.handleModalClose}
            />
        );
    }


    renderSetpointsModal() {
        const { setpointModal: { title, isOpen, scenarioId } } = this.state;
        const { list  } = this.props.scenarios;
        const selectedScenario = list.find(scenario => scenario.id === scenarioId);

        return (
            <SetpointsModal
                title     = {title}
                setpoints = {selectedScenario?.setpoints}
                isOpen    = {isOpen}
                onClose   = {this.handleCloseSetpointsModal}
            />
        );
    }

    render() {
        const { scenarios: { isFetching }, installedExtensions } = this.props;
        const isPageFetching = installedExtensions.isFetching || isFetching;

        return (
            <div className={styles.ScenariosPage}>
                <div className={styles.container}>
                    { isPageFetching
                        ? this.renderLoader()
                        : this.renderContent()
                    }
                </div>
                {this.renderConfirmModal()}
                {this.renderSetpointsModal()}
            </div>
        );
    }
}

export default ScenariosPage;
