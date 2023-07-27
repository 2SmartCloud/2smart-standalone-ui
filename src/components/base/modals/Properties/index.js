import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import * as HomieActions from '../../../../actions/homie';
import { setGroupsVisibility } from '../../../../actions/interface';
import StringControl from '../../controls/String';
import PopupContainer from '../../PopupContainer';
import PropertiesList from '../../../pages/admin/Dashboard/PropertiesList';
import Modal from '../../Modal';
import Tabs from '../../Tabs';
import Footer from './Footer.js';
import styles from './Properties.less';

class PropertiesModal extends PureComponent {
    static propTypes = {
        deviceId            : PropTypes.string.isRequired,
        isOpen              : PropTypes.bool.isRequired,
        properties          : PropTypes.objectOf(PropTypes.array).isRequired,
        hardwareType        : PropTypes.oneOf([ 'device', 'node' ]).isRequired,
        nodeId              : PropTypes.string,
        isDisable           : PropTypes.bool.isRequired,
        isGroupsVisible     : PropTypes.bool.isRequired,
        sortOrder           : PropTypes.oneOf([ 'ASC', 'DESC' ]).isRequired,
        onClose             : PropTypes.func.isRequired,
        setDeviceName       : PropTypes.func.isRequired,
        setNodeName         : PropTypes.func.isRequired,
        setGroupsVisibility : PropTypes.func.isRequired,

        title                            : PropTypes.string.isRequired,
        isTitleError                     : PropTypes.object,
        isTitleProcessing                : PropTypes.bool.isRequired,
        removeAttributeErrorAndHideToast : PropTypes.func.isRequired
    }

    static defaultProps = {
        nodeId       : null,
        isTitleError : {
            isExist : false
        }
    }

    handleToggleGroupsVisibility = () => {
        const { setGroupsVisibility, isGroupsVisible } = this.props;    // eslint-disable-line

        setGroupsVisibility(!isGroupsVisible);
    }

    handleRemoveError=() => {
        const { deviceId, nodeId, hardwareType, removeAttributeErrorAndHideToast } = this.props;

        removeAttributeErrorAndHideToast({
            hardwareType,
            propertyType : 'settings',
            field        : 'title',
            deviceId,
            nodeId
        });
    }

    getPropertiesTabs = () => {
        const { properties, deviceId, nodeId, hardwareType, isDisable, isGroupsVisible, sortOrder } = this.props;
        const tabs = [];
        let id = 0;

        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const property = properties[key];

                if (property.length) {
                    tabs.push({
                        label   : key,
                        id,
                        content : (
                            <PropertiesList
                                isDisable={isDisable}
                                deviceId={deviceId}
                                nodeId={nodeId}
                                properties={property}
                                propertyType={key}
                                hardwareType={hardwareType}
                                showGroups={isGroupsVisible}
                                sortOrder={sortOrder}
                            />
                        )
                    });
                }
                id++;
            }
        }

        return (
            <Tabs
                withDivider
                tabs            = {tabs}
                classes         = {{
                    tabsWrapper : styles.tabsWrapper
                }}
                noDataMessage   = 'There are no properties to display'
                renderControls  = {this.renderPropertiesControls}
                centered        = {false}
            />
        );
    }

    setName = ({ value }) => {
        const { hardwareType, deviceId } = this.props;

        if (hardwareType === 'device') {
            const { setDeviceName } = this.props;

            setDeviceName(deviceId, value);
        } else if (hardwareType === 'node') {
            const { setNodeName, nodeId } = this.props;

            setNodeName(deviceId, nodeId, value);
        }

        return;
    }

    renderPropertiesControls = () => {
        const { isGroupsVisible } = this.props;

        return (
            <div className={styles.controls}>
                <div
                    className={styles.groupsVisibilityButton}
                    onClick={this.handleToggleGroupsVisibility}
                >
                    { isGroupsVisible ? 'Hide details' : 'Show details' }
                </div>
            </div>
        );
    }


    render() {
        const { title, isOpen, onClose, hardwareType, deviceId, nodeId, isTitleProcessing, isTitleError } = this.props;

        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <Fragment>
                    <div className={styles.container}>
                        <IconButton
                            className={styles.closeButton}
                            disableFocusRipple
                            disableRipple
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <div className={styles.header}>
                            <StringControl
                                value={title}
                                isSettable
                                darkThemeSupport
                                setValue={this.setName}
                                isProcessing={isTitleProcessing}
                                isError={isTitleError}
                                onErrorRemove={this.handleRemoveError}
                                baseControlClassName='setName'
                            />

                        </div>
                        <div className={styles.content}>
                            {this.getPropertiesTabs()}
                        </div>
                        <Footer
                            onClose={onClose}
                            hardwareType={hardwareType}
                            name={title}
                            deviceId={deviceId}
                            nodeId={nodeId}
                        />
                    </div>

                    <PopupContainer />
                </Fragment>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        isGroupsVisible : state.applicationInterface.isGroupsVisible,
        sortOrder       : state.applicationInterface.devicesSortOrder
    };
}

export default connect(mapStateToProps, { ...HomieActions, setGroupsVisibility })(PropertiesModal);
