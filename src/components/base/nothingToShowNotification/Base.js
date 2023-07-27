import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Theme                    from '../../../utils/theme';

import styles                   from './Base.less';

const cn = classnames.bind(styles);

class NothingToShowNotification extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    render() {
        const { message, withArrow, className, withTitle, withIcon } = this.props;
        const { theme } = this.context;
        const NotificationCN = cn('NothingToShowNotification', { [className]: className });
        const iconCN = cn('icon', { dark: theme === 'DARK' });

        return (
            <div className={NotificationCN}>
                { withIcon
                    ? (
                        <div className={iconCN}>
                            { withArrow ? <div className={styles.arrow} /> : null }
                        </div>
                    ) : null
                }
                { withTitle
                    ? <h1 className={styles.title}>Welcome!</h1>
                    : null
                }
                <span className={styles.warningText}>{message}</span>
            </div>
        );
    }
}

NothingToShowNotification.propTypes = {
    message   : PropTypes.string.isRequired,
    withArrow : PropTypes.bool,
    withTitle : PropTypes.bool,
    withIcon  : PropTypes.bool,
    className : PropTypes.string
};

NothingToShowNotification.defaultProps = {
    withArrow : false,
    withTitle : true,
    withIcon  : true,
    className : ''
};

export default NothingToShowNotification;
