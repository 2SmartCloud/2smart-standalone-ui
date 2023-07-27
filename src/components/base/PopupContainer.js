import React, { PureComponent, Fragment } from 'react';
import { connect }                        from 'react-redux';
import PropTypes                          from 'prop-types';
import Dialog                             from '@material-ui/core/Dialog';

import * as InterfaceActions              from '../../actions/interface';
import * as GroupsActions                 from '../../actions/groups';
import * as HomieActions                  from '../../actions/homie';
import * as DiscoveriesActions            from '../../actions/discovery';
import GroupsPopup                        from './popups/GroupsPopup/';
import DiscoverDevicesPopup               from './popups/DiscoverDevicesPopup';
import NotificationsPopup                 from './popups/NotificationsPopup';

import styles                             from './PopupContainer.less';

class PopupContainer extends PureComponent {
    static propTypes = {
        openedPopups      : PropTypes.array.isRequired,
        groupsList        : PropTypes.array.isRequired,
        deleteGroupEntity : PropTypes.func.isRequired,
        createGroupEntity : PropTypes.func.isRequired,
        getGroupsEntities : PropTypes.func.isRequired,
        closeLastPopup    : PropTypes.func.isRequired,
        closeAllPopups    : PropTypes.func.isRequired,
        getDiscoveries    : PropTypes.func.isRequired
    }

    state= {
        sensorGroups : []
    }

    componentDidMount() {
        this.fetchData();
    }


    handleClose = () => {
        this.props.closeLastPopup();
    }

    handleCloseAllPopups = () => {
        this.props.closeAllPopups();
    }


    handleDeleteGroup=async (groupId) => {
        await this.props.deleteGroupEntity(groupId);
    }

    handleCreateGroup = async (group) => {
        await this.props.createGroupEntity(group);
    }


    getPopup=(type) => {
        const { groupsList } = this.props;

        switch (type) {
            case 'GROUPS':
                return (
                    <GroupsPopup
                        onClose  = {this.handleClose}
                        groups   = {groupsList}
                        onDelete = {this.handleDeleteGroup}
                        onCreate = {this.handleCreateGroup}
                    />
                );
            case 'DISCOVER_DEVICES':
                return (
                    <DiscoverDevicesPopup
                        onClose = {this.handleClose}
                    />
                );
            case 'NOTIFICATIONS':
                return (
                    <NotificationsPopup
                        onClose = {this.handleClose}
                    />
                );
            default:
                break;
        }
    }

    getCustomPopupStyles=(type) => {
        switch (type) {
            case 'DISCOVER_DEVICES':
                return ({
                    root  : styles.root_discovery_devices,
                    paper : styles.paper_discovery_devices
                });
            case 'NOTIFICATIONS':
                return ({
                    root  : styles.root_notifications,
                    paper : styles.paper_notifications
                });
            default:
                break;
        }
    }

    getBackdropStyles=(type) => {
        switch (type) {
            case 'DISCOVER_DEVICES':
                return ({
                    root : styles.backdrop_discovery_devices
                });
            case 'NOTIFICATIONS':
                return ({
                    root : styles.backdrop_notifications
                });
            default:
                break;
        }
    }

    fetchData() {
        const { getGroupsEntities, getDiscoveries } = this.props;

        getDiscoveries();
        getGroupsEntities();
    }


    render() {
        const { openedPopups } = this.props;
        const lastPopup    = openedPopups[openedPopups.length - 1];
        const popupClasses = this.getCustomPopupStyles(lastPopup);

        return (
            openedPopups.length ?
                <Dialog
                    classes = {{
                        paper : styles.paper,
                        ...popupClasses
                    }}
                    BackdropProps= {{
                        classes : this.getBackdropStyles(lastPopup)
                    }}
                    onBackdropClick={this.handleClose}
                    open
                >
                    <Fragment >
                        {this.getPopup(lastPopup)}
                    </Fragment>
                </Dialog>
                : null
        );
    }
}

function mapStateToProps(state)  {
    return {
        idDiscoveriesFetching : state.discovery.isFetching,
        discoveries           : state.discovery.discoveries,
        groupsList            : state.groups.list,
        openedPopups          : state.applicationInterface.openedPopups
    };
}

export default connect(mapStateToProps, {
    ...DiscoveriesActions,
    ...InterfaceActions,
    ...GroupsActions,
    ...HomieActions })(PopupContainer);
