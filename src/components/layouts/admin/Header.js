import React, { PureComponent } from 'react';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import BurgerIcon               from '../../base/icons/Burger';
import LogoutIcon               from '../../base/icons/Logout';
import Theme                    from '../../../utils/theme';
import * as  SessionActions     from '../../../actions/session';
import * as InterfaceActions    from '../../../actions/interface';
import ConfirmModal             from '../../base/modals/ConfirmModal';
import WifiTowerIcon            from '../../base/icons/WifiTower';
import Notifications            from './Notifications';

import styles                   from './Header.less';

const cx = classnames.bind(styles);

class Header extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    state = {
        isModalOpen : false
    }

    handleClickLogoutModal = () => {
        this.setState({
            isModalOpen : !this.state.isModalOpen
        });
    };

    handleOpenNotificationsPopup = () => {
        const { openPopup } = this.props;

        openPopup({
            id : 'NOTIFICATIONS'
        });
    }

    handleDiscoverDivicesPopupClick = () => {
        this.props.openPopup({
            id          : 'DISCOVER_DEVICES',
            popupStyles : {
                position : {
                    top   : 100,
                    right : 10
                }
            }
        });
    }

    handleLogout = () => {
        this.props.closeModal();
        this.props.handleLogout();
    }

    render() {
        const { onIconClick, newDevices } = this.props;
        const { isModalOpen } = this.state;
        const { theme } = this.context;
        const headerCN = cx('Header', { dark: theme === 'DARK' });
        const isNewDeviceAvailable = !!Object.keys(newDevices).length;

        return (
            <div className={headerCN}>
                <BurgerIcon onClick={onIconClick} />
                <div className={styles.iconsContainer}>
                    <div
                        className = {styles.actionIcons}
                        onClick   = {this.handleOpenNotificationsPopup}
                    >
                        <Notifications />
                    </div>
                    <div
                        className={styles.actionIcons}
                        onClick={this.handleDiscoverDivicesPopupClick}
                    >
                        <WifiTowerIcon isShowIndicator={isNewDeviceAvailable} />
                    </div>
                    <div
                        className = {styles.actionIcons}
                        onClick   = {this.handleClickLogoutModal}
                    >
                        <LogoutIcon />
                    </div>
                </div>
                <ConfirmModal
                    isModalOpen  = {isModalOpen}
                    onSubmit     = {this.handleLogout}
                    onCancel     = {this.handleClickLogoutModal}
                    title        = 'Logout'
                    text         = ' Are you sure you want to log out?'
                    confirmLabel = 'Yes, log out'
                    cancelLabel  = 'Cancel'
                />
            </div>
        );
    }
}

Header.propTypes = {
    onIconClick  : PropTypes.func,
    handleLogout : PropTypes.func.isRequired,
    closeModal   : PropTypes.func.isRequired,
    openPopup    : PropTypes.func.isRequired,
    newDevices   : PropTypes.object.isRequired
};

Header.defaultProps = {
    onIconClick : () => {}
};

function mapStateToProps(state) {
    return {
        newDevices : state.discovery.discoveries
    };
}
export default connect(mapStateToProps, { ...SessionActions, ...InterfaceActions })(Header);

