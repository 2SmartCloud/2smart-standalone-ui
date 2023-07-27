import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import history from '../../../history';
import * as UserActions from '../../../actions/user';
import LoadingNotification from '../../base/LoadingNotification';
import Navigation from './Settings/Navigation';
import SecurityTab from './Settings/Content/Security';
import PreferencesTab from './Settings/Content/Preferences';
import SystemTab from './Settings/Content/SystemTab';
import Backup from './Settings/Content/BackupContainer.js';

import * as ROUTES              from './../../../assets/constants/routes';
import { NAVIGATION_OPTIONS }   from './../../../assets/constants/settings';

import styles from './Settings.less';

class SettingsPage extends PureComponent {
    constructor(props) {
        super(props);

        const { hash } = history.location || {};
        const activeTabIndex = NAVIGATION_OPTIONS.findIndex(option => option.hash === hash);

        this.state = {
            activeTab : activeTabIndex > -1 ? activeTabIndex : 0
        };
    }

    componentDidMount() {
        const { getSettings, getInfo } = this.props;

        getSettings();
        getInfo();
    }

    handleTabChange = tabIndex => {
        this.settings?.scrollTo(0, 0);
        this.setState({
            activeTab : tabIndex
        });

        const { hash } = NAVIGATION_OPTIONS[tabIndex];

        if (hash) history.push(`${ROUTES.SETTINGS}${hash}`);
    }


    renderContent = () => {
        const { activeTab } = this.state;
        const { location } = this.props;

        switch (activeTab) {
            case 0:
                return <PreferencesTab />;
            case 1:
                return <SecurityTab />;
            case 2:
                return <SystemTab />;
            case 3:
                return <Backup location={location} />;
            default:
                return null;
        }
    }

    render() {
        const { activeTab } = this.state;
        const { isFetching, isOverflowed, isInfoFetching, isSideBarOpen } = this.props;

        return (
            <div className={styles.SettingsPage}>
                {
                    isFetching || isInfoFetching ?
                        <LoadingNotification text='Loading settings...' /> :
                        <div className={styles.container}>
                            <div className={styles.tabsWrapper}>
                                <Navigation
                                    isSideBarOpen={isSideBarOpen}
                                    onTabChange={this.handleTabChange}
                                    activeTab={activeTab} />
                            </div>
                            <div
                                ref={(el) => this.settings = el}
                                className={`${styles.contentWrapper}${isOverflowed ? ' overflowed' : '' }`}
                            >{this.renderContent()}</div>
                        </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        settings       : state.user.settings,
        isFetching     : state.user.settings.isFetching,
        isOverflowed   : state.applicationInterface.modal.isOpen,
        isInfoFetching : state.user.settings.info.isFetching,
        isSideBarOpen  : state.applicationInterface.isAdminSideBarOpen

    };
}

SettingsPage.propTypes = {
    getSettings    : PropTypes.func.isRequired,
    getInfo        : PropTypes.func.isRequired,
    isFetching     : PropTypes.bool.isRequired,
    isOverflowed   : PropTypes.bool.isRequired,
    isInfoFetching : PropTypes.bool.isRequired,
    location       : PropTypes.object.isRequired,
    isSideBarOpen  : PropTypes.bool.isRequired
};

export default connect(mapStateToProps, { ...UserActions })(SettingsPage);
