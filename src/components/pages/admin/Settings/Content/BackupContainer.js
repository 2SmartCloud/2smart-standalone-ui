import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import * as backupActions       from '../../../../../actions/backup';

import BackupTabContent               from './BackupTabContent/';

class BackupContainer extends PureComponent {
    static propTypes = {
        location      : PropTypes.object.isRequired,
        backup        : PropTypes.object.isRequired,
        getBackupList : PropTypes.func.isRequired,
        restoreBackup : PropTypes.func.isRequired,
        createBackup  : PropTypes.func.isRequired
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        const isLocationChanged = this.props.location !== prevProps.location;

        if (isLocationChanged) this.fetchData();
    }

    fetchData() {
        const { getBackupList } = this.props;

        getBackupList();
    }

    render() {
        const {
            backup,
            restoreBackup,
            createBackup
        } = this.props;

        return (
            <BackupTabContent
                backup        = {backup}
                restoreBackup = {restoreBackup}
                createBackup  = {createBackup}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        backup : state.backup
    };
}

export default connect(mapStateToProps, { ...backupActions })(BackupContainer);
