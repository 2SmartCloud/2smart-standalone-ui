import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import * as systemLogsActions   from '../../../actions/systemLogs';
import SystemLogsPage           from './SystemLogs/SystemLogsPage';

class SystemLogsContainer extends PureComponent {
    static propTypes = {
        location           : PropTypes.object.isRequired,
        systemLogs         : PropTypes.object.isRequired,
        getSystemLogs      : PropTypes.func.isRequired,
        getMoreLogs        : PropTypes.func.isRequired,
        setLogsSearchQuery : PropTypes.func.isRequired,
        setLogsSortOrder   : PropTypes.func.isRequired,
        setLogsLevel       : PropTypes.func.isRequired,
        resetLogsLimit     : PropTypes.func.isRequired
    }

    render() {
        const {
            location,
            systemLogs,
            getSystemLogs,
            getMoreLogs,
            setLogsSearchQuery,
            setLogsSortOrder,
            setLogsLevel,
            resetLogsLimit
        } = this.props;

        return (
            <SystemLogsPage
                location           = {location}
                systemLogs         = {systemLogs}
                getSystemLogs      = {getSystemLogs}
                getMoreLogs        = {getMoreLogs}
                setLogsSearchQuery = {setLogsSearchQuery}
                setLogsLevel       = {setLogsLevel}
                setLogsSortOrder   = {setLogsSortOrder}
                resetLogsLimit     = {resetLogsLimit}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        systemLogs : state.systemLogs
    };
}

export default connect(mapStateToProps, { ...systemLogsActions })(SystemLogsContainer);
