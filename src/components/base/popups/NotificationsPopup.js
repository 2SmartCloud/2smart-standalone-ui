/* eslint-disable react/no-multi-comp */

import React, {
    useState,
    useEffect
}                                from 'react';
import PropTypes                 from 'prop-types';
import { connect }               from 'react-redux';
import classnames                from 'classnames/bind';
import InfiniteScroll            from 'react-infinite-scroller';

import { Close }                 from '@material-ui/icons';
import IconButton                from '@material-ui/core/IconButton';

import { sortNotifications }     from '../../../utils/sort';
import * as localStorageUtils    from '../../../utils/localStorage';
import * as NotificationsActions from '../../../actions/notifications';
import {
    closeLastPopup
}                                from '../../../actions/interface';
import globalEscHandler          from '../../../utils/globalEscHandler';
import ProcessingIndicator       from '../ProcessingIndicator';
import Notification              from './NotificationsPopup/Notification';

import styles                    from './NotificationsPopup.less';

const cx = classnames.bind(styles);

const AMOUNT_TO_RENDER = 20;
const NOTIFICATIONS_READ_FILTER = 'NOTIFICATIONS_READ_FILTER';

let timeout = null;

function NotificationsPopup(props) {
    const {
        amount, list, isFetching, onClose,
        updateNotificationsIsRead
    } = props;

    const [ isSync, setIsSync ] = useState(false);

    useEffect(() => {
        function handleClosePopup() {
            props.closeLastPopup();
        }

        globalEscHandler.register(handleClosePopup);

        return () => {
            globalEscHandler.unregister(handleClosePopup);
            if (timeout) clearTimeout(timeout);
        };
    }, [ ]);

    const [ amountToRender, setAmountToRender ]     = useState(AMOUNT_TO_RENDER);
    const [ isFilterByUnread, setIsFilterByUnread ] = useState(() => {
        return !!localStorageUtils.getData(NOTIFICATIONS_READ_FILTER);
    });

    useEffect(() => {
        localStorageUtils.saveData(NOTIFICATIONS_READ_FILTER, isFilterByUnread);
    }, [ isFilterByUnread ]);


    async function handleCheckAllAsRead(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();
        if (!list?.length) return;

        const idsList = list
            ?.filter(item => !item.isRead)
            ?.map(item => item.id);

        if (isSync) return;

        setIsSync(true);

        await updateNotificationsIsRead({ list: idsList, isRead: true });

        timeout = setTimeout(() => {
            setIsSync(false);
        }, 100);
    }

    function handleChangeSelectedNotifications({ name, value }) {
        if (!name) return;

        updateNotificationsIsRead({ list: [ name ], isRead: !value });
    }

    function handleFilterList(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        setIsFilterByUnread(value => !value);
    }

    function handleRenderMore() {
        setAmountToRender(prev => prev + AMOUNT_TO_RENDER);
    }

    function renderNotification(item) {
        return (
            <Notification
                key              = {item?.id}
                id               = {item?.id}
                notification     = {item}
                className        = {styles.notification}
                onToggleSelected = {handleChangeSelectedNotifications}
                isSelected       = {!item.isRead}
                closePopup       = {props.closeLastPopup}
            />
        );
    }

    function renderNotifications(notifications) {
        const listToRender = notifications?.slice(0, amountToRender) || [];

        return (
            <InfiniteScroll
                pageStart   = {0}
                loadMore    = {handleRenderMore}
                hasMore     = {list?.length > amountToRender}
                useWindow   = {false}
                loader      = {null}
                initialLoad = {false}
            >
                {listToRender.map(renderNotification)}
            </InfiniteScroll>
        );
    }

    function getListToRender() {
        const filtered = isFilterByUnread
            ? list.filter(item => !item?.isRead)
            : list;

        return sortNotifications(filtered || []);
    }

    const listToRender = getListToRender();

    const isLoading = isFetching && !list?.length;

    const notificationsCN = cx(styles.NotificationsPopup, {
        withNotifications : amount > 0,
        loading           : isLoading && !listToRender.length,
        blurred           : isSync
    });

    const isNotReadExist = !!list?.filter(item => !item.isRead).length;

    return (
        <div className={notificationsCN}>
            <div className={styles.heading}>
                <div className={styles.popupTitle}>
                    Notifications
                </div>
                <IconButton
                    className = {styles.closeIcon}
                    onClick   = {onClose}
                    disableFocusRipple
                    disableRipple
                >
                    <Close />
                </IconButton>
                <div className={styles.controlsWrapper}>
                    <button
                        onClick   = {handleCheckAllAsRead}
                        className = {cx(styles.control, {
                            invisible : !isNotReadExist || isSync
                        })}
                    >
                        Mark all as read
                    </button>
                    <button
                        onClick   = {handleFilterList}
                        className = {cx(styles.control, {
                            invisible : !list?.length
                        })}
                    >
                        { !isFilterByUnread
                            ? 'Filter by unread'
                            : 'Show all'
                        }
                    </button>
                </div>
            </div>
            <div className={styles.notificationsWrapper}>
                { renderNotifications(listToRender) }
                { !isLoading && !listToRender.length
                    ? (
                        <div className={styles.emptyListWrapper}>
                            <div className={styles.emptyListMessage}>
                                No new notifications
                            </div>
                        </div>
                    )
                    : null
                }
            </div>

            { isLoading || isSync
                ? (
                    <div className={styles.loaderWrapper}>
                        <ProcessingIndicator size='20px' />
                    </div>
                ) : null
            }
        </div>
    );
}

NotificationsPopup.propTypes = {
    updateNotificationsIsRead : PropTypes.func.isRequired,
    closeLastPopup            : PropTypes.func.isRequired,
    onClose                   : PropTypes.func,
    list                      : PropTypes.arrayOf(PropTypes.shape({
        id        : PropTypes.string.isRequired,
        type      : PropTypes.string.isRequired,
        message   : PropTypes.string.isRequired,
        createdAt : PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        isRead : PropTypes.bool.isRequired
    })),
    isFetching : PropTypes.bool,
    amount     : PropTypes.number
};

NotificationsPopup.defaultProps = {
    onClose    : void 0,
    isFetching : false,
    list       : [],
    amount     : 0
};

function mapStateToProps(state)  {
    return {
        list       : state?.notifications?.list || [],
        amount     : state?.notifications?.list?.length || 0,
        isFetching : state?.notifications?.isFetching
    };
}

const mapDispatchToProps = {
    ...NotificationsActions,
    closeLastPopup
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsPopup);
