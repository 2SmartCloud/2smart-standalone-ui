import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import LoadingNotification       from '../../../../base/LoadingNotification';
import NothingToShowNotification from '../../../../base/nothingToShowNotification/Base';
import Image                     from '../../../../base/Image';
import ConfirmationModal         from '../../shared/ConfirmationModal';
import MarketList                from '../MarketList';
import styles                    from './AddonsTab.less';

class AddonsTab extends PureComponent {
    static propTypes = {
        marketServices : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        userServices : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        setCurrentPage           : PropTypes.func.isRequired,
        installMarketService     : PropTypes.func.isRequired,
        checkMarketServiceUpdate : PropTypes.func.isRequired,
        updateMarketService      : PropTypes.func.isRequired,
        deleteMarketService      : PropTypes.func.isRequired,
        viewMode                 : PropTypes.oneOf([ 'list', 'card' ])
    }

    static defaultProps = {
        viewMode : 'list'
    }

    state = {
        modal : {
            isOpen : false
        }
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true } });
    }

    handleModalClose = () => {
        this.setState({ modal: { isOpen: false } });
    }

    handleInstallService = ({ name }) => {
        const { installMarketService } = this.props;

        installMarketService(name);
    }

    handleCheckUpdates = ({ name }) => {
        const { checkMarketServiceUpdate } = this.props;


        checkMarketServiceUpdate(name);
    }

    handleUpdateService = ({ name, label }) => {
        const { updateMarketService } = this.props;

        this.modalSubmitHandler = () => this.runModalAction(() => updateMarketService(name));

        const title = `Update ${label}`;
        const text = 'All instances of this service will be restarted!';
        const labels = { submit: 'Yes, update service', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    handleDeleteService = ({ name, label, hasRunningInstances }) => {
        const { deleteMarketService } = this.props;

        const title = `Delete ${label}`;
        const labels = { cancel: 'Cancel' };
        let text;

        if (hasRunningInstances) {
            this.modalSubmitHandler = null;
            text = 'You have to stop all running instances of this addon\nbefore you are able to delete it!';
        } else {
            this.modalSubmitHandler = () => this.runModalAction(() => deleteMarketService(name));
            text = 'Are you sure you want to delete this addon?';
            labels.submit = 'Yes, delete addon';
        }

        this.handleModalOpen({ title, text, labels });
    }

    getRunningInstances(type) {
        const { userServices: { list } } = this.props;

        const runningServices = list.filter(item => item.type === type && [ 'starting', 'started' ].includes(item.state));

        return runningServices.length;
    }

    fulfillServicesInfo(list) {
        return list.map(item => {
            const fallbackForIcon = item.label?.slice(0, 1).toUpperCase();
            const icon = item.icon
                ? (<Image src={item.icon} renderFallback={() => fallbackForIcon} />)   // eslint-disable-line
                : fallbackForIcon;
            const hasRunningInstances = this.getRunningInstances(item.name);

            return { ...item, icon, hasRunningInstances };
        });
    }

    runModalAction = action => {
        action();
        this.handleModalClose();
    }

    renderLoader() {
        return (<LoadingNotification text='Loading addons...' />);
    }

    renderContent() {
        const {
            marketServices : { list, searchQuery, sortOrder, currentPage },
            setCurrentPage, viewMode
        } = this.props;

        const hasServices = list?.length;
        const fulfilledList = this.fulfillServicesInfo(list);

        return (
            <>
                <div className={styles.tableWrapper}>
                    {
                        hasServices
                            ? <MarketList
                                list             = {fulfilledList}
                                searchQuery      = {searchQuery}
                                sortOrder        = {sortOrder}
                                currentPage      = {currentPage}
                                onChangePage     = {setCurrentPage}
                                onInstallService = {this.handleInstallService}
                                onCheckUpdates   = {this.handleCheckUpdates}
                                onUpdateService  = {this.handleUpdateService}
                                onDeleteService  = {this.handleDeleteService}
                                viewMode         = {viewMode}
                            />
                            : <NothingToShowNotification
                                message='No available services...'
                                withArrow
                            />
                    }
                </div>
            </>
        );
    }

    renderModal() {
        const { modal: { title, text, labels, isOpen } } = this.state;

        return (
            <ConfirmationModal
                title    = {title}
                text     = {text}
                labels   = {labels}
                isOpen   = {isOpen}
                onSubmit = {this.modalSubmitHandler} // eslint-disable-line react/jsx-handler-names
                onClose  = {this.handleModalClose}
            />
        );
    }

    render() {
        const { isFetching } = this.props.marketServices;

        return (
            <div className={styles.AddonsTab}>
                <div className={styles.container}>
                    { isFetching
                        ? this.renderLoader()
                        : this.renderContent()
                    }
                </div>
                {this.renderModal()}
            </div>
        );
    }
}

export default AddonsTab;
