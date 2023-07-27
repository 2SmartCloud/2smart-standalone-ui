import React, { PureComponent }  from 'react';
import PropTypes                 from 'prop-types';
import Image                     from '../../../../base/Image';
import LoadingNotification       from '../../../../base/LoadingNotification';
import NothingToShowNotification from '../../../../base/nothingToShowNotification/Base';
import ConfirmationModal         from '../../shared/ConfirmationModal';
import ExtensionsList            from './ExtensionsList';

import styles                    from './ExtensionsTab.less';

class ExtensionsTab extends PureComponent {
    static propTypes = {
        extensions               : PropTypes.array.isRequired,
        setExtensionsCurrentPage : PropTypes.func.isRequired,
        installExtension         : PropTypes.func.isRequired,
        checkExtensionUpdate     : PropTypes.func.isRequired,
        updateExtension          : PropTypes.func.isRequired,
        deleteExtension          : PropTypes.func.isRequired,
        getExtensions            : PropTypes.func.isRequired,
        location                 : PropTypes.object.isRequired,
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

    componentDidMount() {
        const { getExtensions } = this.props;

        getExtensions();
    }

    componentDidUpdate(prevProps) {
        const { location, getExtensions } = this.props;
        const isLocationChanged = location !== prevProps.location;

        if (isLocationChanged) getExtensions();
    }


    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true } });
    }

    handleModalClose = () => {
        this.setState({ modal: { isOpen: false } });
    }

    handleUpdateService = ({ entityId, name }) => {
        const { updateExtension } = this.props;

        this.modalSubmitHandler = () => this.runModalAction(() => updateExtension(entityId));

        const title = `Update ${name}`;
        const text = 'All instances of this extension will be restarted!';
        const labels = { submit: 'Yes, update extension', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    handleDeleteService = ({ entityId, name, title }) => {
        const { deleteExtension } = this.props;

        const modalTitle = `Delete ${title}`;
        const labels = { cancel: 'Cancel' };

        this.modalSubmitHandler = () => this.runModalAction(() => deleteExtension(entityId, name));
        const text = 'Are you sure you want to delete this extension?';

        labels.submit = 'Yes, delete extension';

        this.handleModalOpen({ title: modalTitle, text, labels });
    }


    fulfillServicesInfo(list) {
        return list.map(item => {
            const fallbackForIcon = item.title?.slice(0, 2).toUpperCase();

            const icon =  item.icon
                ? (<Image src={item.icon} renderFallback={() => fallbackForIcon} />)   // eslint-disable-line
                : fallbackForIcon;

            return { ...item, icon };
        });
    }

    runModalAction = action => {
        action();
        this.handleModalClose();
    }

    renderLoader() {
        return (<LoadingNotification text='Loading extensions...' />);
    }

    renderContent() {
        const {
            extensions : { list, isUpdating, searchQuery, sortOrder, currentPage },
            setExtensionsCurrentPage,
            installExtension,
            checkExtensionUpdate,
            viewMode
        } = this.props;

        const hasServices = list?.length;
        const fulfilledList = this.fulfillServicesInfo(list);

        return (
            hasServices
                ? <ExtensionsList
                    isUpdating         = {isUpdating}
                    list               = {fulfilledList}
                    searchQuery        = {searchQuery}
                    sortOrder          = {sortOrder}
                    currentPage        = {currentPage}
                    onChangePage       = {setExtensionsCurrentPage}
                    onInstallExtension = {installExtension}
                    onCheckUpdates     = {checkExtensionUpdate}
                    onUpdateService    = {this.handleUpdateService}
                    onDeleteService    = {this.handleDeleteService}
                    viewMode           = {viewMode}
                />
                : <NothingToShowNotification
                    message='No available services...'
                    withArrow
                />

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
        const { isFetching, isUpdating, installedEntities } = this.props.extensions;

        return (
            <div className={styles.ExtensionsTab}>
                { (isFetching || installedEntities?.isFetching) && !isUpdating
                    ? this.renderLoader()
                    : this.renderContent()
                }
                {this.renderModal()}
            </div>
        );
    }
}


export default ExtensionsTab;
