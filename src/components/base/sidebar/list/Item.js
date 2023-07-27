import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import Icon from '../../Icon';
import styles from './Item.less';

const cn = classnames.bind(styles);

class SidebarListItem extends PureComponent {
    render() {
        const { onClick, title, isActive } = this.props;
        const SidebarListItemCN = cn('SidebarListItem', {
            active : isActive
        });

        const iconType = title.trim().replace(' ', '-');

        return (
            <div onClick={onClick} className={SidebarListItemCN}>
                { isActive && <div className={styles.activeBorder} /> }
                <Icon type={iconType} className={styles.icon} />
                <p>{title}</p>
            </div>
        );
    }
}

SidebarListItem.propTypes = {
    onClick  : PropTypes.func,
    title    : PropTypes.string.isRequired,
    isActive : PropTypes.bool
};

SidebarListItem.defaultProps = {
    onClick  : () => {},
    isActive : false
};

export default SidebarListItem;
