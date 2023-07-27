import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

import * as HomieActions from '../../actions/homie';
import { sortSensors } from '../../utils/sort';
import BatteryLevel from './BatteryLevel';
import NetworkSignal from './NetworkSignal';
import GeneralStatus from './GeneralStatus';
import LastActivity from './LastActivity';

import PropertiesModal from './modals/Properties';
import EyeFilledIcon from './icons/EyeFilled';

import styles from './Node.less';
import SensorsList from './SensorsList.js';
import StringControl from './controls/String';

const cx = classnames.bind(styles);

const hardwareType = 'node';
const propertyType = 'settings';

class Node extends PureComponent {
    static propTypes = {
        id           : PropTypes.string.isRequired,
        deviceId     : PropTypes.string.isRequired,
        name         : PropTypes.string.isRequired,
        isDisable    : PropTypes.bool,
        sensors      : PropTypes.array,
        options      : PropTypes.array,
        telemetry    : PropTypes.array,
        state        : PropTypes.oneOf([ 'init', 'ready', 'disconnected', 'sleeping', 'lost', 'alert' ]).isRequired,
        setNodeName  : PropTypes.func.isRequired,
        lastActivity : PropTypes.string,
        sortOrder    : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,

        hidden             : PropTypes.oneOf([ 'true', 'false' ]).isRequired,
        isHiddenProcessing : PropTypes.bool.isRequired,

        title             : PropTypes.string,
        isTitleProcessing : PropTypes.bool,
        isTitleErrorExist : PropTypes.bool,

        removeAttributeErrorAndHideToast : PropTypes.func.isRequired,
        setAsyncAttributeDispatcher      : PropTypes.func.isRequired
    }

    static defaultProps = {
        sensors           : [],
        options           : [],
        telemetry         : [],
        isDisable         : false,
        title             : '',
        lastActivity      : '',
        isTitleProcessing : false,
        isTitleErrorExist : false
    }

    state = {
        isModalOpen : false
    }

    handleModalClose = () => {
        this.setState({
            isModalOpen : false
        });
    }

    handleNodeClick = () => {
        this.setState({
            isModalOpen : true
        });
    }

    handleToggleHidden = (e) => {
        if (this.props.isHiddenProcessing) return;

        if (e) e.stopPropagation();
        const { setAsyncAttributeDispatcher, deviceId, hidden, id } = this.props;

        setAsyncAttributeDispatcher({
            hardwareType,
            propertyType,
            nodeId     : id,
            value      : hidden === 'true' ? 'false' : 'true',
            field      : 'hidden',
            propertyId : 'hide',
            deviceId
        });
    }


    handleRemoveError = () => {
        const { deviceId,  id, removeAttributeErrorAndHideToast } = this.props;

        removeAttributeErrorAndHideToast({
            hardwareType,
            propertyType,
            field  : 'title',
            deviceId,
            nodeId : id
        });
    }

    setName = ({ value }) => {
        const { id, deviceId, setNodeName } = this.props;

        setNodeName(deviceId, id, value);
    }

    getProperties() {
        const { sensors, options, telemetry } = this.props;

        return ({
            sensors,
            options,
            telemetry
        });
    }

    getSignalTelemetry() {
        const { telemetry } = this.props;
        const signalTelemetry = telemetry.find(({ id }) => id === 'signal')  || {};

        return signalTelemetry;
    }

    getBatteryTelemetry() {
        const { telemetry } = this.props;
        const batteryTelemetry = telemetry.find(({ id }) => id === 'battery') || {};

        return batteryTelemetry;
    }

    getDisplayedSensors() {
        const { sensors, sortOrder } = this.props;
        const displayed = sensors.filter(sensor => sensor.displayed === 'true');

        return sortSensors(displayed, sortOrder);
    }


    render() {
        const {
            name,
            state,
            id,
            deviceId,
            isDisable: isDeviceDisable,
            title,
            hidden,
            lastActivity,
            sortOrder,
            isTitleProcessing,
            isTitleErrorExist,
            isHiddenProcessing
        } = this.props;
        const { isModalOpen } = this.state;
        const batteryTelemetry = this.getBatteryTelemetry();
        const signalTelemetry = this.getSignalTelemetry();
        const { value: batteryTelemetryValue, unit: batteryUnit } = batteryTelemetry;
        const { value: signalTelemetryValue, unit: signalUnit } = signalTelemetry;
        const currentSensors = this.getDisplayedSensors();
        const isNodeDisable = isDeviceDisable ||  [ 'disconnected', 'lost' ].includes(state);
        const nodeCN = cx('Node', {
            idDisable : isNodeDisable
        });
        const nodeTitle = title || name;
        const isNodeHidden = hidden === 'true';
        const hideNodeTooltip = isNodeHidden ? 'Remove from hidden' : 'Hide';

        return (
            <Fragment>
                <div className={nodeCN} onClick={this.handleNodeClick}>
                    <div className={styles.header}>
                        <div className={styles.name}>
                            <StringControl
                                value={nodeTitle}
                                isSettable
                                setValue={this.setName}
                                onErrorRemove={this.handleRemoveError}
                                isProcessing={isTitleProcessing}
                                isError={isTitleErrorExist}
                                darkThemeSupport
                                propertyId={null}
                                deviceId={deviceId}
                                nodeId={id}
                                baseControlClassName='setName'
                            />
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <NetworkSignal
                                value={signalTelemetryValue}
                                unit={signalUnit}
                                isDisable = {isNodeDisable}
                            />
                        </div>
                        <div>
                            <BatteryLevel
                                value={batteryTelemetryValue}
                                unit={batteryUnit}
                                isDisable = {isNodeDisable}
                            />
                        </div>
                    </div>
                    <div className={styles.statusContainer}>
                        <div className={styles.statusWrapper} >
                            <div className={styles.statucIndicatorWrapper}>
                                <GeneralStatus
                                    isNodeDisable = {isNodeDisable}
                                    state={state}
                                    isTooltip={false}
                                />

                            </div>
                            <span className={styles.statusText}>{state}</span>
                            <LastActivity
                                lastActivity={lastActivity}
                            />
                        </div>

                    </div>

                    <div className={styles.sensors}>
                        <SensorsList
                            deviceId={deviceId}
                            nodeId={id}
                            sensors={currentSensors}
                            isDisable = {isNodeDisable}
                            sortOrder={sortOrder}
                        />
                    </div>
                    <div className={styles.settings}>
                        <div className={styles.settingsControls}>
                            <div className={styles.toggleHiddenAttrIconWrapper} onClick={this.handleToggleHidden}>
                                { isHiddenProcessing
                                    ? (
                                        <CircularProgress size={16} thickness={6} color='inherit' />
                                    ) : (
                                        <Tooltip
                                            classes={{ tooltip: styles.tooltip }}
                                            title ={hideNodeTooltip}
                                        >
                                            <div>
                                                <EyeFilledIcon
                                                    isHidden={isNodeHidden}
                                                    className={cx(styles.toggleHiddenAttrIcon,
                                                        { hidden: isNodeHidden }
                                                    )}
                                                />
                                            </div>
                                        </Tooltip>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <PropertiesModal
                    deviceId={deviceId}
                    isDisable={isNodeDisable}
                    nodeId={id}
                    propertyId={null}
                    title={nodeTitle}
                    isTitleError={isTitleErrorExist}
                    isTitleProcessing={isTitleProcessing}
                    isOpen={isModalOpen}
                    onClose={this.handleModalClose}
                    properties={this.getProperties()}
                    hardwareType='node'
                />
            </Fragment>
        );
    }
}

export default connect(null, { ...HomieActions })(Node);
