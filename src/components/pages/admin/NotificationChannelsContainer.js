import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as notificationsChannelsActions from '../../../actions/notificationChannels';
import NotificationChannelsPage from './NotificationChannels/NotificationChannelsPage';

class NotificationChannels extends PureComponent {
    static propTypes = {
        channels : PropTypes.shape({
            list       : PropTypes.array,
            isFetching : PropTypes.bool
        }).isRequired,
        userChannels : PropTypes.shape({
            list        : PropTypes.array,
            isFetching  : PropTypes.bool,
            searchQuery : PropTypes.string,
            sortOrder   : PropTypes.oneOf([ 'ASC', 'DESC' ]),
            currentPage : PropTypes.number
        }).isRequired,
        setUserNotificationChannelsSearchQuery   : PropTypes.func.isRequired,
        setUserNotificationChannelsSortOrder     : PropTypes.func.isRequired,
        setUserNotificationChannelsCurrentPage   : PropTypes.func.isRequired,
        deleteUserNotificationChannel            : PropTypes.func.isRequired,
        activateUserNotificationChannel          : PropTypes.func.isRequired,
        deactivateUserNotificationChannel        : PropTypes.func.isRequired,
        sendTestMessageToUserNotificationChannel : PropTypes.func.isRequired
    };

    render() {
        const {
            channels,
            userChannels,
            setUserNotificationChannelsSearchQuery,
            setUserNotificationChannelsSortOrder,
            setUserNotificationChannelsCurrentPage,
            deleteUserNotificationChannel,
            activateUserNotificationChannel,
            deactivateUserNotificationChannel,
            sendTestMessageToUserNotificationChannel
        } = this.props;

        return (
            <NotificationChannelsPage
                channels={channels}
                userChannels={userChannels}
                setSearchQuery={setUserNotificationChannelsSearchQuery}
                setSortOrder={setUserNotificationChannelsSortOrder}
                setCurrentPage={setUserNotificationChannelsCurrentPage}
                deleteUserChannel={deleteUserNotificationChannel}
                activateUserChannel={activateUserNotificationChannel}
                deactivateUserChannel={deactivateUserNotificationChannel}
                sendTestMessage={sendTestMessageToUserNotificationChannel}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        channels     : state.notificationChannels.channels,
        userChannels : state.notificationChannels.userChannels
    };
}

export default connect(mapStateToProps, { ...notificationsChannelsActions })(NotificationChannels);
