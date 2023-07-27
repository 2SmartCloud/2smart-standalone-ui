import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import history                      from '../../../../history';
import { USER_SERVICES_SORT_ORDER } from '../../../../assets/constants/localStorage';
import { SERVICE_CREATE }           from '../../../../assets/constants/routes';
import LoadingNotification          from '../../../base/LoadingNotification';
import NothingToShowNotification    from '../../../base/nothingToShowNotification/Base';
import Image                        from '../../../base/Image';
import ListedPageHeader             from '../shared/ListedPageHeader';
import ConfirmationModal            from '../shared/ConfirmationModal';
import ServicesList                 from './ServicesList';
import SetupServiceSelect           from './SetupServiceSelect';
import styles                       from './ServicesPage.less';

class ServicesPage extends PureComponent {
    static propTypes = {
        marketServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        userServices : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        setSearchQuery        : PropTypes.func.isRequired,
        setSortOrder          : PropTypes.func.isRequired,
        setCurrentPage        : PropTypes.func.isRequired,
        deleteUserService     : PropTypes.func.isRequired,
        activateUserService   : PropTypes.func.isRequired,
        deactivateUserService : PropTypes.func.isRequired
    }

    state = {
        modal : {
            isOpen : false
        }
    }

    handleCreateService = type => {
        const createServicePath = `${SERVICE_CREATE}?type=${type}`;

        history.push(createServicePath);
    }

    handleDeleteServiceClick = service => {
        return [ 'starting', 'started' ].includes(service.state)
            ? this.handleStopModalOpen(service)
            : this.handleDeleteModalOpen(service);
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true, isProcessing: false } });
    }

    handleModalClose = () => {
        return new Promise(resolve => {
            this.setState({ modal: { isOpen: false } }, resolve);
        });
    }

    handleStopModalOpen = service => {
        this.modalContext = service.id;
        this.modalSubmitHandler = () => this.stopService(service);

        const serviceTitle = this.getServiceName(service);
        const title = `Stop ${serviceTitle}`;
        const text = 'Your service is running. To delete it you have to stop it.';
        const labels = { submit: 'Yes, stop', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    handleDeleteModalOpen = service => {
        this.modalContext = service.id;
        this.modalSubmitHandler = this.deleteService;

        const serviceTitle = this.getServiceName(service);
        const title = `Delete ${serviceTitle}`;
        const text = 'Are you sure you want to delete this service?';
        const labels = { submit: 'Yes, delete service', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    getServiceIconUrl = ({ type }) => {
        const { list } = this.props.marketServices;

        const service = list.find(item => item.name === type);

        return service?.icon;
    }

    getServiceName = ({ type, params }) => {
        const { list } = this.props.marketServices;

        if (params?.['DEVICE_NAME']) return params?.['DEVICE_NAME'];

        const serviceType = list.find(item => item.name === type);

        return serviceType?.label || '';
    }

    getServiceWebInterfaceLink = ({ type, id }) => {
        const { list } = this.props.marketServices;

        const serviceType = list.find(item => item.name === type);

        return serviceType?.exposePort ? `/service/${id}` : '';
    }

    getServiceTypeOptions = () => {
        const { list } = this.props.marketServices;

        return list
            .filter(item => [ 'pulled' ].includes(item.state))
            .map(item => ({
                value : item.name,
                label : item.label,
                icon  : item.icon
            }));
    }

    fulfillServicesInfo(list) {
        return list.map(item => {
            const title = this.getServiceName(item);
            const iconUrl = this.getServiceIconUrl(item);
            const interfaceLink = this.getServiceWebInterfaceLink(item);
            const fallbackForIcon = title?.slice(0, 1).toUpperCase();

            const icon = iconUrl
                ? (<Image src={iconUrl} renderFallback={() => fallbackForIcon} />)   // eslint-disable-line
                : fallbackForIcon;

            return { ...item, icon, title, interfaceLink };
        });
    }

    stopService = async service => {
        if (!this.modalContext) return;

        const { deactivateUserService } = this.props;

        this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: true } }));

        try {
            await deactivateUserService(this.modalContext);
            await this.handleModalClose();
            this.handleDeleteModalOpen(service);
        } catch {
            this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: false } }));
        }
    }

    deleteService = async () => {
        if (!this.modalContext) return;

        const { deleteUserService } = this.props;

        this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: true } }));

        try {
            await deleteUserService(this.modalContext);
            this.handleModalClose();
        } catch {
            this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: false } }));
        }
    }

    renderLoader() {
        return (<LoadingNotification text='Loading services...' />);
    }

    renderContent() {
        const {
            marketServices,
            userServices : { list, searchQuery, sortOrder, currentPage },
            setSearchQuery,
            setSortOrder,
            setCurrentPage,
            activateUserService,
            deactivateUserService
        } = this.props;

        const hasServices = list?.length;
        const fulfilledList = this.fulfillServicesInfo(list);

        return (
            <>
                <ListedPageHeader
                    placeholder         = 'Search for a service'
                    searchQuery         = {searchQuery}
                    sortOrder           = {sortOrder}
                    isSearchRender      = {!!hasServices}
                    isListFetching      = {marketServices.isFetching}
                    setSearchQuery      = {setSearchQuery}
                    setSortOrder        = {setSortOrder}
                    sortLocalStorageKey = {USER_SERVICES_SORT_ORDER}
                >
                    <SetupServiceSelect
                        placeholder = 'Setup service'
                        options     = {this.getServiceTypeOptions()}
                        onCreate    = {this.handleCreateService}
                    />
                </ListedPageHeader>

                <div className={styles.tableWrapper}>
                    {
                        hasServices
                            ? <ServicesList
                                list              = {fulfilledList}
                                searchQuery       = {searchQuery}
                                sortOrder         = {sortOrder}
                                currentPage       = {currentPage}
                                onChangePage      = {setCurrentPage}
                                onDeleteService   = {this.handleDeleteServiceClick}
                                activateService   = {activateUserService}
                                deactivateService = {deactivateUserService}
                            />
                            : <NothingToShowNotification
                                message='Let’s create your first service...'
                                withArrow
                            />
                    }
                </div>
            </>
        );
    }

    renderModal() {
        const { modal: { title, text, labels, isOpen, isProcessing } } = this.state;

        return (
            <ConfirmationModal
                title={title}
                text={text}
                labels={labels}
                isOpen={isOpen}
                isLoading={isProcessing}
                onSubmit={this.modalSubmitHandler} // eslint-disable-line react/jsx-handler-names
                onClose={this.handleModalClose}
            />
        );
    }

    render() {
        const { isFetching } = this.props.userServices;

        return (
            <div className={styles.ServicesPage}>
                <div className={styles.container}>
                    {
                        isFetching
                            ? this.renderLoader()
                            : this.renderContent()
                    }
                </div>
                {this.renderModal()}
            </div>
        );
    }
}

export default ServicesPage;
