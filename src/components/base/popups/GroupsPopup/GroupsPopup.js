import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '../../../base/Tabs';
import globalEscHandler from '../../../../utils/globalEscHandler';
import AttachTab from './AttachTab/';
import ManageTab from './ManageTab/';

import styles from './GroupsPopup.less';

class GroupsPopup extends PureComponent {
    static propTypes = {
        onClose  : PropTypes.func.isRequired,
        groups   : PropTypes.array.isRequired,
        onCreate : PropTypes.func.isRequired,
        onDelete : PropTypes.func.isRequired
    }

    componentDidMount() {
        globalEscHandler.register(this.handleClose);
    }

    componentWillUnmount() {
        globalEscHandler.unregister(this.handleClose);
    }

    handleClose = () => {
        this.props.onClose();
    }

    getTabsContent=() => {
        const { groups, onDelete, onCreate } = this.props;
        const AttachTabComponent = <AttachTab />;
        const ManageTabComponent = (
            <ManageTab
                groups={groups}
                onDelete={onDelete}
                onCreate = {onCreate}
            />);

        const tabs = [
            {
                id      : 0,
                label   : 'Attach groups',
                content : AttachTabComponent
            }, {
                id      : 1,
                label   : 'Manage groups',
                content : ManageTabComponent
            }
        ];

        return tabs;
    }


    render() {
        const tabs = this.getTabsContent();

        return (
            <div className={styles.GroupsPopup}>
                <IconButton
                    className={styles.closeIcon}
                    disableFocusRipple
                    disableRipple
                    onClick={this.handleClose}
                >
                    <Close />
                </IconButton>
                <div className={styles.header}>
                    <span>Groups</span>
                </div>
                <Tabs
                    tabs ={tabs}
                    classes={{
                        content       : styles.tabsContent,
                        tabsWrapper   : styles.tabsWrapper,
                        tabsContainer : styles.tabsContainer,
                        tab           : styles.tab
                    }}
                    withDivider
                />

            </div>
        );
    }
}


export default GroupsPopup;
