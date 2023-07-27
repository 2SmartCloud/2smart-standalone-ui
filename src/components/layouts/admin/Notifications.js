import React, {
    useEffect,
    useContext
}                                from 'react';
import PropTypes                 from 'prop-types';
import classnames                from 'classnames/bind';
import { connect }               from 'react-redux';

import * as NotificationsActions from '../../../actions/notifications';
import BellIcon                  from '../../base/icons/Bell';
import Theme                     from '../../../utils/theme';

import styles                   from './Notifications.less';

const cx = classnames.bind(styles);

function Notifications(props) {
    const { counter, getNotifications } = props;
    const { theme } = useContext(Theme);

    useEffect(() => {
        getNotifications();
    }, []);

    const notificationsCN = cx(styles.Notifications, {
        withCounter : counter > 0,
        [theme]     : theme
    });
    const indicatorCN = cx(styles.notificationsIndicator, {
        withBigPaddings : counter < 10
    });

    return (
        <div className = {notificationsCN}>
            <div className={styles.bellWrapper}>
                <div className={indicatorCN}>
                    {counter}
                </div>
                <BellIcon className={styles.bellIcon} />
            </div>
        </div>
    );
}

Notifications.propTypes = {
    counter          : PropTypes.number,
    getNotifications : PropTypes.func.isRequired
};

Notifications.defaultProps = {
    counter : 0
};

function mapStateToProps(state) {
    return {
        counter : (state?.notifications?.list || [])?.filter(entity => !entity?.isRead)?.length
    };
}

export default connect(mapStateToProps, { ...NotificationsActions })(Notifications);

