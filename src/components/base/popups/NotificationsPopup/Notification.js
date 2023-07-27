/* eslint-disable react/no-multi-comp */
import React, {
    useRef,
    useEffect,
    useContext
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import {
    formatDate
}                               from '../../../../utils/date';
import Theme                    from '../../../../utils/theme';
import Checkbox                 from './Checkbox';

import styles                   from './Notification.less';

const cx = classnames.bind(styles);

function Notification(props) {
    const { theme } = useContext(Theme);
    const {
        id,
        isSelected,
        onToggleSelected,
        className,
        notification
    } = props;
    const { type, createdAt, senderName } = notification;

    const componentRef = useRef({});
    const notificationCN = cx(styles.Notification, {
        selected    : isSelected,
        [className] : className,
        [theme]     : theme
    });

    // function scrollToElement() {
    //     componentRef.current.scrollTimeout = setTimeout(() => {
    //         const elementToScroll = document.getElementById(`notification-${id}`);

    //         elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }, 100);    // eslint-disable-line no-magic-numbers
    // }

    useEffect(() => {
        return () => {
            if (!componentRef?.current?.scrollTimeout) return;

            clearTimeout(componentRef.current.scrollTimeout);
        };
    }, [ ]);

    function handleCheckboxClick({ name, value } = {}) {
        onToggleSelected({ name, value });

        // if (value) scrollToElement();
    }

    function renderTime() {
        return (
            <div className={cx(styles.time, styles.text)}>
                { formatDate({ date: new Date(+createdAt), format: 'DD.MM.YY HH:mm' }) || '-' }
            </div>
        );
    }

    function getNotificationMessage() {
        const { message } = notification;

        switch (type) {
            case 'text':
                return (
                    <div className={styles.messageWrapper}>
                        { message }
                    </div>
                );
            default:
                return '';
        }
    }

    const message        = getNotificationMessage();

    return (
        <div
            className = {notificationCN}
            ref       = {node => componentRef.current.node = node}
            id        = {`notification-${id}`}
        >
            <div className={styles.checkboxWrapper}>
                <Checkbox
                    onChange  = {handleCheckboxClick}
                    value     = {isSelected}
                    name      = {id}
                    tooltip   = {<div className={styles.tooltip}>{!isSelected ? 'Mark as not read' : 'Mark as read'}</div>}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.notificationBody}>
                    <div className={styles.title}>{senderName || 'System'}</div>
                    <div className={cx(styles.description, styles.text)}>
                        { message }
                    </div>

                    { renderTime() }
                </div>
            </div>
        </div>
    );
}

Notification.propTypes = {
    id           : PropTypes.string.isRequired,
    notification : PropTypes.shape({
        type : PropTypes.oneOf([
            'text'
        ]).isRequired,
        message    : PropTypes.string,
        senderName : PropTypes.string,
        createdAt  : PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }).isRequired,
    isSelected       : PropTypes.bool,
    onToggleSelected : PropTypes.func,
    className        : PropTypes.string
};

Notification.defaultProps = {
    isSelected       : false,
    onToggleSelected : void 0,
    className        : ''
};

export default React.memo(Notification);
