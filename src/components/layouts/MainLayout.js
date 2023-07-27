import React, { PureComponent } from 'react';
import { connect }              from 'react-redux';
import { Detector }             from 'react-detect-offline';
import PropTypes                from 'prop-types';

import * as HomieActions        from '../../actions/homie';
import * as InterfaceActions    from '../../actions/interface';
import * as SessionActions      from '../../actions/session';
import * as UserActions         from '../../actions/user';
import checkCookies             from '../../utils/checkCookies';
import {  ADMIN_LOGIN }         from '../../assets/constants/routes';
import { removeSpinner }        from '../../utils/removeSpinner';

import meta from '../base/toast/meta';
import styles from './MainLayout.less';

class MainLayout extends PureComponent {
    componentDidMount() {
        const isCookiesEnabled = checkCookies();

        if (!isCookiesEnabled) {
            this.props.callToastNotification({
                meta    : meta.COOKIES_DISABLED,
                title   : 'Something went wrong',
                message : 'Seems that cookies are disabled.'
            });
        }
        const path = this.props.location.pathname;

        if (ADMIN_LOGIN === path) removeSpinner();
    }

    componentDidUpdate(prevProps) {
        const { isUserAuthorized, hideValErrToastNotification } = this.props;

        if (prevProps.isUserAuthorized === null && isUserAuthorized !== null && isUserAuthorized) {
            removeSpinner();
            hideValErrToastNotification({ meta: 'NETWORK_ERROR' });
        }
    }


    onHandleOffline = ({ online }) => {
        if (!online) {
            this.props.callToastNotification({
                meta    : meta.GO_OFFLINE,
                title   : 'Something went wrong',
                message : 'Seems that connection with your network is lost. Please, try to establish connection.'
            });
        } else {
            this.props.hideToastNotification('GO_OFFLINE');
        }

        return null;
    }


    render() {
        return (
            <div className={styles.MainLayout}>
                <Detector render={this.onHandleOffline} polling={{ enabled: false }} />
                {this.props.children}
            </div>
        );
    }
}

MainLayout.propTypes = {
    children              : PropTypes.node.isRequired,
    callToastNotification : PropTypes.func.isRequired,
    hideToastNotification : PropTypes.func.isRequired,
    location              : PropTypes.object.isRequired,
    isUserAuthorized      : PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.instanceOf(null)
    ]).isRequired,
    hideValErrToastNotification : PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        isModalOpen      : state.applicationInterface.modal.isOpen,
        isUserAuthorized : state.session.isUserAuthorized
    };
}

const mapDispatchToProps = {
    ...HomieActions,
    ...InterfaceActions,
    ...UserActions,
    ...SessionActions
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
