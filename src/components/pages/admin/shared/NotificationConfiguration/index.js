import { connect } from 'react-redux';

import NotificationConfiguration from './NotificationConfiguration';

function mapStateToProps(state) {
    return {
        userChannelsList : state.notificationChannels.userChannels.list
    };
}

export default connect(mapStateToProps)(NotificationConfiguration);
