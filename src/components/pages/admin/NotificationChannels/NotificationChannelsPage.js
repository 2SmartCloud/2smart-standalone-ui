import React, { PureComponent }          from 'react';
import PropTypes                         from 'prop-types';
import history                           from '../../../../history';
import { NOTIFICATIONS_SORT_ORDER }      from '../../../../assets/constants/localStorage';
import { NOTIFICATION_CHANNEL_CREATE }   from '../../../../assets/constants/routes';
import LoadingNotification               from '../../../base/LoadingNotification';
import NothingToShowNotification         from '../../../base/nothingToShowNotification/Base';
import Image                             from '../../../base/Image';
import ListedPageHeader                  from '../shared/ListedPageHeader';
import ConfirmationModal                 from '../shared/ConfirmationModal';
import ChannelsList                      from './ChannelsList';
import SetupChannelSelect                from './SetupChannelSelect';
import styles                            from './NotificationChannelsPage.less';

class NotificationChannelsPage extends PureComponent {
    static propTypes = {
        channels : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool,
            isUpdating : PropTypes.bool
        }).isRequired,
        userChannels : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        setSearchQuery        : PropTypes.func.isRequired,
        setSortOrder          : PropTypes.func.isRequired,
        setCurrentPage        : PropTypes.func.isRequired,
        deleteUserChannel     : PropTypes.func.isRequired,
        activateUserChannel   : PropTypes.func.isRequired,
        deactivateUserChannel : PropTypes.func.isRequired,
        sendTestMessage       : PropTypes.func.isRequired
    }

    state = {
        modal : {
            isOpen : false
        }
    }

    handleCreateChannel = type => {
        const createChannelPath = `${NOTIFICATION_CHANNEL_CREATE}?type=${type}`;

        history.push(createChannelPath);
    }

    handleDeleteChannelClick = channel => {
        return this.handleDeleteModalOpen(channel);
    }

    handleModalOpen = ({ title, text, labels }) => {
        this.setState({ modal: { title, text, labels, isOpen: true, isProcessing: false } });
    }

    handleModalClose = () => {
        this.setState({
            modal : { isOpen: false }
        });
    }

    handleDeleteModalOpen = channel => {
        this.modalContext = channel.id;
        this.modalSubmitHandler = this.deleteUserChannel;

        const channelTitle = this.getChannelName(channel);
        const title = `Delete ${channelTitle}`;
        const text = 'You will not be able to recover this channel!';
        const labels = { submit: 'Yes, delete channel', cancel: 'Cancel' };

        this.handleModalOpen({ title, text, labels });
    }

    getChannelIconUrl = ({ type }) => {
        const { list } = this.props.channels;
        const channel = list.find(item => item.type === type);

        return channel?.icon;
    }

    getChannelName = ({ type }) => {
        const { list } = this.props.channels;

        const channel = list.find(item => item.type === type);

        return channel?.name || '';
    }

    getChannelsOptions = () => {
        const { list } = this.props.channels;

        return list
            .map(item => ({
                value : item.type,
                label : item.name,
                icon  : item.icon
            }));
    }

    getFulfillChannelsInfo(list) {
        return list.map(item => {
            const title = this.getChannelName(item);
            const iconUrl = this.getChannelIconUrl(item);
            const fallbackForIcon = title?.slice(0, 1).toUpperCase();

            const icon = iconUrl
                ? (<Image src={iconUrl} renderFallback={() => fallbackForIcon} />)   // eslint-disable-line
                : fallbackForIcon;

            return { ...item, icon, title };
        });
    }

    deleteUserChannel = async () => {
        if (!this.modalContext) return;

        const { deleteUserChannel } = this.props;

        this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: true } }));

        try {
            await deleteUserChannel(this.modalContext);
            this.handleModalClose();
        } catch {
            this.setState(prevState => ({ modal: { ...prevState.modal, isProcessing: false } }));
        }
    }

    renderLoader() {
        return (<LoadingNotification text='Loading channels...' />);
    }

    renderContent() {
        const {
            channels,
            userChannels : { list, searchQuery, sortOrder, currentPage },
            setSearchQuery,
            setSortOrder,
            setCurrentPage,
            activateUserChannel,
            deactivateUserChannel,
            sendTestMessage
        } = this.props;

        const hasChannels = list?.length;
        const fulfilledList = this.getFulfillChannelsInfo(list);

        return (
            <>
                <ListedPageHeader
                    placeholder         = 'Search for a channel'
                    searchQuery         = {searchQuery}
                    sortOrder           = {sortOrder}
                    isSearchRender      = {!!hasChannels}
                    isListFetching      = {channels.isFetching}
                    setSearchQuery      = {setSearchQuery}
                    setSortOrder        = {setSortOrder}
                    sortLocalStorageKey = {NOTIFICATIONS_SORT_ORDER}
                >
                    <SetupChannelSelect
                        placeholder = 'Setup channel'
                        options     = {this.getChannelsOptions()}
                        onCreate    = {this.handleCreateChannel}
                    />
                </ListedPageHeader>

                <div className={styles.tableWrapper}>
                    {
                        hasChannels
                            ? <ChannelsList
                                list              = {fulfilledList}
                                searchQuery       = {searchQuery}
                                sortOrder         = {sortOrder}
                                currentPage       = {currentPage}
                                onChangePage      = {setCurrentPage}
                                onDeleteChannel   = {this.handleDeleteChannelClick}
                                activateChannel   = {activateUserChannel}
                                deactivateChannel = {deactivateUserChannel}
                                sendTestMessage   = {sendTestMessage}
                            />
                            : <NothingToShowNotification
                                message='Let’s create your first channel...'
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
        const { userChannels, channels } = this.props;
        const isFetching = userChannels.isFetching || channels.isFetching;

        return (
            <div className={styles.NotificationChannelsPage}>
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

export default NotificationChannelsPage;
