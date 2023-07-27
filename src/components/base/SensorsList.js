import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import getPropertyUnit from '../../utils/getPropertyUnit';
import { sortNodes } from '../../utils/sort';
import Sensor from './Sensor';

import styles from './SensorsList.less';

class SensorsList extends PureComponent {
    static propTypes = {
        sensors   : PropTypes.array.isRequired,
        nodeId    : PropTypes.string.isRequired,
        deviceId  : PropTypes.string.isRequired,
        isDisable : PropTypes.bool,
        sortOrder : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired
    }

    static defaultProps = {
        isDisable : false
    }

    render() {
        const { sensors, nodeId, deviceId, isDisable, sortOrder } = this.props;

        const sensorsSorted = sortNodes(sensors, sortOrder);

        return (
            <div className={styles.SensorsList}>
                {
                    sensorsSorted.map(sensor => {
                        const {
                            id, name, title, value, unit, settable, dataType, format, retained,
                            isValueProcessing, valueError
                        } = sensor;
                        const isSettable = settable === 'true';
                        const isRetained = retained === 'true';
                        const urUnit = getPropertyUnit(unit);
                        const isError = valueError?.isExist;


                        return (
                            <Sensor
                                key={id}
                                id={id}
                                isDisable = {isDisable}
                                nodeId={nodeId}
                                deviceId={deviceId}
                                name={title || name}
                                value={value}
                                isError={isError}
                                unit={urUnit}
                                isRetained={isRetained}
                                isSettable={isSettable}
                                dataType={dataType}
                                format={format}
                                isValueProcessing={isValueProcessing}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

export default SensorsList;
