import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import classnames               from 'classnames/bind';
import { MoreHoriz }            from '@material-ui/icons';
import IconButton               from '@material-ui/core/IconButton';
import * as HomieActions        from '../../../../../actions/homie';
import Theme                    from '../../../../../utils/theme';
import { detectIOS }            from '../../../../../utils/detect';
import StringControl            from '../../../../base/controls/String';
import GeneralStatus            from '../../../../base/GeneralStatus';
import BatteryLevel             from '../../../../base/BatteryLevel';
import NetworkSignal            from '../../../../base/NetworkSignal';
import PropertiesModal          from '../../../../base/modals/Properties';
import EyeFilledIcon            from '../../../../base/icons/EyeFilled';
import NodesList                from '../NodesList';

import styles                   from './Device.less';

const cn = classnames.bind(styles);
const isIOS = detectIOS();

class Device extends PureComponent {
    static propTypes = {
        name          : PropTypes.string.isRequired,
        nodes         : PropTypes.array.isRequired,
        options       : PropTypes.array,
        telemetry     : PropTypes.array,
        state         : PropTypes.oneOf([ 'init', 'ready', 'disconnected', 'sleeping', 'lost', 'alert' ]).isRequired,
        id            : PropTypes.string.isRequired,
        isOverflowed  : PropTypes.bool,
        setDeviceName : PropTypes.func.isRequired,
        sortOrder     : PropTypes.oneOf([ 'ASC',  'DESC' ]).isRequired,

        title             : PropTypes.string,
        titleError        : PropTypes.object,
        isTitleProcessing : PropTypes.bool,

        removeAttributeErrorAndHideToast : PropTypes.func.isRequired

    }

    static defaultProps = {
        title             : '',
        options           : [],
        telemetry         : [],
        isOverflowed      : false,
        isTitleProcessing : false,
        titleError        : {
            isExis : false
        }
    }

    static contextType = Theme; //eslint-disable-line

    state = {
        isModalOpen     : false,
        showHiddenNodes : false
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.showHiddenNodes) return null;

        if (!props.nodes.find(node => node.hidden === 'true')) {
            return {
                showHiddenNodes : false
            };
        }

        return null;
    }

    handleClickOpenModalButton = () => {
        this.setState({
            isModalOpen : true
        });
    }

    handleModalClose = () => {
        this.setState({
            isModalOpen : false
        });
    }

    handleToggleHiddenNodes = () => {
        this.setState({
            showHiddenNodes : !this.state.showHiddenNodes
        }, () => this.state.showHiddenNodes &&  this.hiddenNodesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
    }

    getDeviceProperties() {
        const { options, telemetry } = this.props;

        return ({
            options,
            telemetry
        });
    }

    getBatteryLevel() {
        const { telemetry } = this.props;
        const batteryLevel = telemetry.find(({ id }) => id === 'battery') || {};

        return batteryLevel;
    }

    getNetworkSignal() {
        const { telemetry } = this.props;
        const networkSignal = telemetry.find(({ id }) => id === 'signal') || {};

        return networkSignal;
    }

    checkIsHiddenNodesExist = () => {
        const { nodes } = this.props;

        return !!nodes.find(node => node.hidden === 'true');
    }

    setName = ({ value }) => {
        const { setDeviceName, id } = this.props;

        setDeviceName(id, value);
    }

    isNodesEmpty() {
        let isEmpty = 0;
        const { nodes } = this.props;

        nodes.forEach(node => {
            if (node.sensors?.length) {
                isEmpty++;
            }
        });

        return !isEmpty;
    }


    handleRemoveError=() => {
        const { id, removeAttributeErrorAndHideToast } = this.props;

        removeAttributeErrorAndHideToast({
            hardwareType : 'device',
            propertyType : 'settings',
            field        : 'title',
            deviceId     : id
        });
    }


    render() {
        const { title, name, nodes, state, id, isOverflowed, sortOrder, isTitleProcessing, titleError } = this.props;
        const { isModalOpen, showHiddenNodes } = this.state;
        const { theme } = this.context;

        const isListEmpty     = !nodes.length || this.isNodesEmpty();
        const withHiddenNodes = this.checkIsHiddenNodesExist();

        const nodesListWrapperCN = cn('nodesListWrapper', {
            empty      : isListEmpty,
            overflowed : isOverflowed && isIOS,
            withHiddenNodes
        });
        const isDeviceDisable = [ 'disconnected', 'lost' ].includes(state);
        const deviceCN = cn('Device', {
            isDisable : isDeviceDisable,
            [theme]   : theme
        });
        const batteryLevel = this.getBatteryLevel();
        const networkSignal = this.getNetworkSignal();
        const { value: networkSignalValue, unit: networkUnit } = networkSignal;
        const { value: batteryLevelValue, unit: batteryUnit } = batteryLevel;
        const deviceName = title || name;

        const hiddenNodes    = withHiddenNodes ? nodes?.filter(node => node.hidden === 'true') || [] : [];
        const notHiddenNodes = nodes?.filter(node => node.hidden !== 'true') || [];
        const isTitleErrorExist = titleError?.isExist;

        return (
            <div className={deviceCN}>
                <div className={styles.header}>
                    <div className={styles.name}>
                        <StringControl
                            baseControlClassName = 'setName'
                            deviceId = {id}
                            value  = {deviceName}
                            propertyId = {null}
                            setValue = {this.setName}
                            isProcessing = {isTitleProcessing}
                            isError  = {isTitleErrorExist}
                            onErrorRemove={this.handleRemoveError}
                            darkThemeSupport
                            isSettable

                        />
                    </div>
                    <div className={styles.networkSignalWrapper}>
                        <NetworkSignal
                            value     = {networkSignalValue}
                            unit      = {networkUnit}
                            isDisable = {isDeviceDisable}
                        />
                    </div>
                    <div className={styles.batteryLevelWrapper}>
                        <BatteryLevel
                            value     = {batteryLevelValue}
                            unit      = {batteryUnit}
                            isDisable = {isDeviceDisable}
                        />
                    </div>
                    <div className={styles.statusWrapper}>
                        <GeneralStatus state={state} />
                    </div>
                    <IconButton
                        className = {styles.openModalButton}
                        disableRipple
                        onClick   = {this.handleClickOpenModalButton}
                    >
                        <MoreHoriz  />
                    </IconButton>
                    <PropertiesModal
                        hardwareType = 'device'
                        deviceId     = {id}
                        title        = {deviceName}
                        isOpen       = {isModalOpen}
                        isDisable    = {isDeviceDisable}
                        onClose      = {this.handleModalClose}
                        properties   = {this.getDeviceProperties()}
                        isTitleProcessing={isTitleProcessing}
                        isTitleError={isTitleErrorExist}
                    />
                </div>
                <div className={`${nodesListWrapperCN}`} ref={node => this.nodeList = node}>
                    <NodesList
                        isDeviceDisable = {isDeviceDisable}
                        nodes           = {notHiddenNodes}
                        deviceId        = {id}
                        sortOrder       = {sortOrder}
                    />
                    <div ref={node => this.hiddenNodesContainer = node}>
                        { showHiddenNodes && hiddenNodes && hiddenNodes.length
                            ? (
                                <>
                                    <div className={styles.divider} />
                                    <NodesList
                                        isDeviceDisable = {isDeviceDisable}
                                        nodes           = {hiddenNodes}
                                        deviceId        = {id}
                                        sortOrder       = {sortOrder}
                                    />
                                </>
                            ) : null
                        }
                    </div>
                </div>
                { withHiddenNodes
                    ? (
                        <div className={styles.controls}>
                            <div
                                className = {styles.toggleHiddenNodesButton}
                                onClick   = {this.handleToggleHiddenNodes}
                            >
                                <EyeFilledIcon
                                    className = {styles.toggleIcon}
                                    isHidden  = {showHiddenNodes}
                                />
                                <div>
                                    { showHiddenNodes ? 'Close hidden' : 'Show hidden' }
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isOverflowed : state.applicationInterface.modal.isOpen
    };
}

export default connect(mapStateToProps, { ...HomieActions })(Device);

