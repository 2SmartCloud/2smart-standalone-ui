import React, { PureComponent }         from 'react';
import PropTypes                        from 'prop-types';
import { connect }                      from 'react-redux';
import * as SessionActions              from '../../../actions/session';
import * as UserServicesActions         from '../../../actions/userServices';
import * as InterfaceActions            from '../../../actions/interface';
import * as SystemUpdatesActions        from '../../../actions/systemUpdates';
import * as MarketServicesActions       from '../../../actions/marketServices';
import * as ExtensionsActions           from '../../../actions/extensions';
import * as NotificationChannelsActions from '../../../actions/notificationChannels';
import * as HomieActions                from '../../../actions/homie';
import  * as AliasActions               from '../../../actions/alias';
import PopupContainer                   from '../../base/PopupContainer';
import Theme, { getTheme,
    setTheme,
    applyTheme
}                                       from '../../../utils/theme';
import Sidebar                          from './Sidebar.js';
import Header                           from './Header';

import styles                           from './Layout.less';

class AdminLayout extends PureComponent {
    static propTypes = {
        children                                  : PropTypes.element.isRequired,
        location                                  : PropTypes.object.isRequired,
        route                                     : PropTypes.string.isRequired,
        intervalCheckSession                      : PropTypes.func.isRequired,
        isUserAuthorized                          : PropTypes.bool.isRequired,
        getBridgeEntities                         : PropTypes.func.isRequired,
        getInstalledExtensions                    : PropTypes.func.isRequired,
        getNotificationChannels                   : PropTypes.func.isRequired,
        getUserNotificationChannels               : PropTypes.func.isRequired,
        handleToggleSidebar                       : PropTypes.func.isRequired,
        isSideBarOpen                             : PropTypes.bool.isRequired,
        getAliases                                : PropTypes.func.isRequired,
        getSystemUpdates                          : PropTypes.func.isRequired,
        getScenariosHomie                         : PropTypes.func.isRequired,
        subscribeWithIntervalAndGetMarketServices : PropTypes.func.isRequired
    }

    constructor() {
        super();
        const theme = getTheme('adminTheme');

        this.state = {
            theme
        };

        applyTheme(theme);
    }

    componentDidMount() {
        const { intervalCheckSession, route } = this.props;

        intervalCheckSession(route);

        this.fetchData();
        document.title = '2Smart admin';
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    handleToogleTheme = theme => {
        this.setState({ theme });
        applyTheme(theme);
        setTheme('adminTheme', theme);
    }

    fetchData() {
        const {
            getInstalledExtensions,
            getBridgeEntities,
            getScenariosHomie,
            getUserNotificationChannels,
            getSystemUpdates,
            getAliases,
            subscribeWithIntervalAndGetMarketServices,
            getNotificationChannels
        } = this.props;

        subscribeWithIntervalAndGetMarketServices();

        getInstalledExtensions();
        getNotificationChannels();
        getUserNotificationChannels();
        getScenariosHomie();
        getBridgeEntities();
        getSystemUpdates();
        getAliases();
    }

    render() {
        const { location : { pathname }, handleToggleSidebar, isSideBarOpen, isUserAuthorized } = this.props;

        return isUserAuthorized
            ? (<Theme.Provider
                value={{
                    theme         : this.state.theme,
                    onToogleTheme : this.handleToogleTheme
                }}
            >
                <div className={styles.AdminLayout}>
                    <Sidebar
                        currentPathname = {pathname}
                        isOpen          = {isSideBarOpen}
                        onToggle        = {handleToggleSidebar}
                    />
                    <div className={styles.content}>
                        <Header onIconClick={handleToggleSidebar} />
                        <div className={styles.pageContainer}>
                            {this.props.children}
                        </div>
                        <PopupContainer />
                    </div>
                </div>
            </Theme.Provider>
            ) : null;
    }
}

function mapStateToProps(state) {
    return {
        isUserAuthorized : state.session.isUserAuthorized,
        isSideBarOpen    : state.applicationInterface.isAdminSideBarOpen
    };
}

export default connect(
    mapStateToProps, {
        ...SessionActions,
        ...MarketServicesActions,
        ...ExtensionsActions,
        ...UserServicesActions,
        ...NotificationChannelsActions,
        ...InterfaceActions,
        ...AliasActions,
        ...SystemUpdatesActions,
        ...HomieActions
    })(AdminLayout);
