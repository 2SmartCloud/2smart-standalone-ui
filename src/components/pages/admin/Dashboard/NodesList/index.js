import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { sortNodes }            from '../../../../../utils/sort';
import Node                     from '../../../../base/Node';

import styles                   from './NodesList.less';

class NodesList extends PureComponent {
    static propTypes = {
        nodes           : PropTypes.array.isRequired,
        deviceId        : PropTypes.string.isRequired,
        isDeviceDisable : PropTypes.bool.isRequired,
        sortOrder       : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired
    }

    render() {
        const { nodes, deviceId, isDeviceDisable, sortOrder } = this.props;
        const sorted = sortNodes(nodes, sortOrder);

        return (
            <div className={styles.NodesList}>
                { sorted.map(node => {
                    const {
                        name, sensors, options, telemetry,
                        id, state,
                        title, isTitleProcessing, titleError,
                        isHiddenProcessing, hidden,
                        lastActivity
                    } = node;

                    if (sensors?.length) {
                        return (
                            <Node
                                isDisable    = {isDeviceDisable}
                                deviceId     = {deviceId}
                                id           = {id}
                                key          = {id}
                                name         = {name}
                                title        = {title}
                                sensors      = {sensors}
                                options      = {options}
                                telemetry    = {telemetry}
                                state        = {state}
                                hidden       = {hidden}
                                lastActivity = {lastActivity}
                                sortOrder    = {sortOrder}
                                isHiddenProcessing={isHiddenProcessing}
                                isTitleProcessing={isTitleProcessing}
                                isTitleErrorExist= {titleError?.isExist}
                            />
                        );
                    }

                    return null;
                }) }
            </div>
        );
    }
}

export default NodesList;
