import React, { PureComponent }    from 'react';
import { connect }                 from 'react-redux';
import PropTypes                   from 'prop-types';
import { animateScroll }           from 'react-scroll';
import { isMobileDevice }                from '../../../utils/detect';
import Theme                       from '../../../utils/theme';
import ScreenList                  from '../../base/sidebar/ScreenList';
import Button                      from '../../base/Button';
import Switch                      from '../../base/Switch';
import BaseSidebar              from '../../base/sidebar/Sidebar';

import LockIcon                    from '../../base/icons/Lock';
import * as ScreenActions          from '../../../actions/client/screens';
import * as UserActions            from '../../../actions/user';
import * as ClientDashboardActions from  '../../../actions/client/dashboard.js';
import * as InterfaceActions       from '../../../actions/interface';
import styles                      from './Sidebar.less';


class Sidebar extends PureComponent {
    static contextType = Theme                  // eslint-disable-line

    state = {
        addScreenButton : {
            isLoading : false
        },
        lockScreenButton : {
            isLoading : false
        }
    }

    handleCreateNewScreen = () => {
        this.createNewScreen();
    }

    handleSidebarItemClick = () => {
        const { closeSidebar } = this.props;

        if (isMobileDevice()) closeSidebar();
    }

    createNewScreen = async () => {
        const { createNewScreen } = this.props;

        this.handleSidebarItemClick();
        this.setState({ addScreenButton: { isLoading: true } });
        setTimeout(() => {
            this.setState({ addScreenButton: { isLoading: false } });
        }, 500);

        await createNewScreen();

        this.scrollToBottom();
    }

    getSelectedScreen = () => {
        const { screens } = this.props;
        const screen = screens.find(item => item.isActive);

        return screen;
    }

    handleSelectScreen = id => {
        const { selectScreen } = this.props;

        this.handleSidebarItemClick();


        selectScreen({ id });
    }

    handleChangeTheme = e => {
        const { onToogleTheme } = this.context;

        onToogleTheme(e.target.checked ? 'DARK' : 'LIGHT');
    }

    scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId : 'screens-list-container'
        });
    }

    handleExitSession = () => {
        const { removeClientPanelAccess } = this.props;

        this.handleSidebarItemClick();

        this.setState({ lockScreenButton: { isLoading: true } });
        setTimeout(() => {
            this.setState({ lockScreenButton: { isLoading: false } });
        }, 500);

        removeClientPanelAccess();
    }

    render() {
        const { screens,
            isCreating,
            isOpen,
            closeSidebar,
            isSecureModeEnabled,
            isClientPanelAccessGranted } = this.props;
        const { lockScreenButton, addScreenButton } = this.state;

        return (
            <BaseSidebar
                isOpen={isOpen}
                onToggle={closeSidebar}

            >
                <div className={styles.Sidebar}>
                    <div className={styles.screenListWrapper}>
                        <ScreenList screens={screens} onScreenSelect={this.handleSelectScreen} />
                    </div>
                    <div className={styles.addScreenButtonWrapper}>
                        <Button
                            text='Add screen'
                            onClick={this.handleCreateNewScreen}
                            isFetching={addScreenButton.isLoading}
                            isDisabled={isCreating}
                            className={styles.addScreenButton}
                        >
                            <div className={styles.buttonContentContainer}>
                                <div className={styles.buttonLabel}>Add screen</div>
                                { isSecureModeEnabled ?
                                    <div className={styles.lockIconWrapper}>
                                        <LockIcon className={styles.lockIcon} isClosed={!isClientPanelAccessGranted} />
                                    </div> : null }
                            </div>
                        </Button>
                    </div>
                    <div className={styles.controls}>
                        <div className={styles.control}>
                            Night mode
                            <Switch
                                checked={this.context.theme === 'DARK'}
                                onChange={this.handleChangeTheme}
                                disabled={false}
                            />
                        </div>
                        {
                            isClientPanelAccessGranted && isSecureModeEnabled || lockScreenButton.isLoading ?
                                <div className={styles.control}>
                                    <Button
                                        onClick={this.handleExitSession}
                                        text='Lock session'
                                        isFetching={lockScreenButton.isLoading}
                                    />
                                </div>
                                : null
                        }
                    </div>
                </div>
            </BaseSidebar>
        );
    }
}


Sidebar.propTypes = {
    isOpen                     : PropTypes.bool.isRequired,
    screens                    : PropTypes.array.isRequired,
    createNewScreen            : PropTypes.func.isRequired,
    selectScreen               : PropTypes.func.isRequired,
    isCreating                 : PropTypes.bool,
    isSecureModeEnabled        : PropTypes.bool.isRequired,
    isClientPanelAccessGranted : PropTypes.bool.isRequired,
    removeClientPanelAccess    : PropTypes.func.isRequired,
    closeSidebar               : PropTypes.func.isRequired
};

Sidebar.defaultProps = {
    isCreating : false
};

function mapStateToProps(state) {
    return {
        screens                    : state.client.dashboard.screens,
        isCreating                 : state.client.dashboard.isCreating,
        isSecureModeEnabled        : state.user.settings.isSecureModeEnabled.value,
        isClientPanelAccessGranted : state.user.isClientPanelAccessGranted
    };
}

export default connect(mapStateToProps, {
    createNewScreen : ScreenActions.createNewScreen,
    selectScreen    : ClientDashboardActions.selectScreen,
    ...InterfaceActions,
    ...UserActions
})(Sidebar);
