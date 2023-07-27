import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';
import { removeSpinner } from '../../../utils/removeSpinner';
import Theme, { getTheme,
    setTheme,
    applyTheme
}                         from '../../../utils/theme';

import { CLIENT_PANEL_IDLE_TIMEOUT } from '../../../assets/constants';
import * as UserActions from '../../../actions/user';
import * as SessionActions from '../../../actions/session';
import * as ClientDashboardActions from '../../../actions/client/dashboard';
import * as InterfaceActions from '../../../actions/interface';


import styles from './Layout.less';

class Layout extends PureComponent {
    constructor() {
        super();
        const theme = getTheme('clientTheme');

        this.state = {
            theme
        };

        applyTheme(theme);
    }

    componentDidMount() {
        this.props.getClientDataByInterval();
    }

    componentDidUpdate(prevProps) {
        const { isClientDataFetched, hideValErrToastNotification } = this.props;

        if (prevProps.isClientDataFetched === null && isClientDataFetched !== null) {
            removeSpinner();
            hideValErrToastNotification({ meta: 'NETWORK_ERROR' });
        }
    }

    handleIdle = () => {
        const { removeClientPanelAccess } = this.props;

        removeClientPanelAccess();
    }

    handleTimerAction = () => {
        const { prolongClientPanelAccess } = this.props;

        prolongClientPanelAccess();
    }

    handleToogleTheme = theme => {
        this.setState({ theme });
        applyTheme(theme);
        setTheme('clientTheme', theme);
    }

    getActiveScreen = () => {
        const { screens } = this.props;
        const activeScreen = screens.find(({ isActive }) => isActive);

        return activeScreen || {};
    }

    render() {
        const { isClientPanelAccessGranted, isSecureModeEnabled,
            isAutoBlockingEnabled, isClientDataFetched } = this.props;

        return (
            <Theme.Provider
                value={{
                    theme         : this.state.theme,
                    onToogleTheme : this.handleToogleTheme
                }}
            >
                <div className={styles.Layout}>
                    {
                        isClientPanelAccessGranted &&
                        isSecureModeEnabled &&
                        isAutoBlockingEnabled ?
                            <IdleTimer
                                onAction={this.handleTimerAction}
                                onIdle={this.handleIdle}
                                throttle={CLIENT_PANEL_IDLE_TIMEOUT / 2}
                                timeout={CLIENT_PANEL_IDLE_TIMEOUT}
                            /> :
                            null
                    }
                    {
                        isClientDataFetched !== null
                            ? this.props.children
                            : null
                    }
                </div>
            </Theme.Provider>
        );
    }
}

Layout.propTypes = {
    isClientPanelAccessGranted  : PropTypes.bool.isRequired,
    screens                     : PropTypes.array.isRequired,
    isSecureModeEnabled         : PropTypes.bool.isRequired,
    removeClientPanelAccess     : PropTypes.func.isRequired,
    prolongClientPanelAccess    : PropTypes.func.isRequired,
    children                    : PropTypes.element.isRequired,
    isAutoBlockingEnabled       : PropTypes.bool.isRequired,
    isClientDataFetched         : PropTypes.bool.isRequired,
    hideValErrToastNotification : PropTypes.func.isRequired,
    getClientDataByInterval     : PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        isClientPanelAccessGranted : state.user.isClientPanelAccessGranted,
        isSecureModeEnabled        : state.user.settings.isSecureModeEnabled.value,
        isAutoBlockingEnabled      : state.user.settings.isAutoBlockingEnabled.value,
        screens                    : state.client.dashboard.screens,
        isClientDataFetched        : state.client.dashboard.isClientDataFetched
    };
}

export default connect(mapStateToProps, {
    ...InterfaceActions,
    ...UserActions,
    ...SessionActions,
    ...ClientDashboardActions
})(Layout);
