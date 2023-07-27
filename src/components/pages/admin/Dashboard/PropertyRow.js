import React, { PureComponent /* Fragment */ } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Tooltip } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as HomieActions from '../../../../actions/homie';
import * as InterfaceActions from '../../../../actions/interface';
import * as AliasActions from '../../../../actions/alias';
import CriticalValue from '../../../base/CriticalValue';
import IntegerControl from '../../../base/controls/Integer';
import BooleanControl from '../../../base/controls/Boolean';
import FloatControl from '../../../base/controls/Float';
import StringControl from '../../../base/controls/String';
import EnumControl from '../../../base/controls/Enum';
import ColorControl from '../../../base/controls/Color';
import CopyIcon from '../../../base/icons/Copy';
import EyeFilled from '../../../base/icons/EyeFilled';
import Chip from '../../../base/Chip.js';
import Alias from '../../../base/Alias';
import getPropertyUnit from '../../../../utils/getPropertyUnit';
import globalEscHandler from '../../../../utils/globalEscHandler';
import TopicRow from '../../../base/TopicRow';

import styles from './PropertyRow.less';

const cn = classnames.bind(styles);

export const GROUPS_MAX_LENGTH = 5;
class PropertyRow extends PureComponent {
    static propTypes = {
        className         : PropTypes.string,
        hardwareType      : PropTypes.oneOf([ 'device', 'node' ]).isRequired,
        propertyType      : PropTypes.oneOf([ 'options', 'telemetry', 'sensors', 'threshold', 'scenario' ]).isRequired,
        deviceId          : PropTypes.string.isRequired,
        nodeId            : PropTypes.string,
        unit              : PropTypes.string,
        name              : PropTypes.string,
        settable          : PropTypes.string,
        retained          : PropTypes.string,
        dataType          : PropTypes.string,
        format            : PropTypes.string,
        rootTopic         : PropTypes.string,
        id                : PropTypes.string.isRequired,
        openPopup         : PropTypes.func.isRequired,
        isDisable         : PropTypes.bool,
        createAliasEntity : PropTypes.func.isRequired,
        changeAliasName   : PropTypes.func.isRequired,
        deleteAliasEntity : PropTypes.func.isRequired,
        floatRight        : PropTypes.bool,
        aliasHide         : PropTypes.bool,
        showGroups        : PropTypes.bool.isRequired,
        onAliasError      : PropTypes.func,
        groups            : PropTypes.arrayOf(PropTypes.shape({
            id    : PropTypes.string.isRequired,
            label : PropTypes.string.isRequired
        })).isRequired,
        showDisplayedButton : PropTypes.bool,
        classNames          : PropTypes.shape({
            root     : PropTypes.string,
            mainData : PropTypes.string,
            value    : PropTypes.string
        }),
        selectStyles : PropTypes.shape({
            option : PropTypes.string
        }),
        alias : PropTypes.arrayOf(PropTypes.shape({
            id        : PropTypes.string,
            name      : PropTypes.string,
            rootTopic : PropTypes.string
        })),

        setAsyncAttributeDispatcher      : PropTypes.func.isRequired,
        removeAttributeErrorAndHideToast : PropTypes.func.isRequired,
        updateScenarioState              : PropTypes.func.isRequired,

        value             : PropTypes.string,
        valueError        : PropTypes.object,
        isValueProcessing : PropTypes.bool,

        title             : PropTypes.string,
        titleError        : PropTypes.object,
        isTitleProcessing : PropTypes.bool,

        displayed           : PropTypes.oneOf([ 'true', 'false' ]),
        isDisplayProcessing : PropTypes.bool,
        isTitleDisabled     : PropTypes.bool,
        isCopyHidden        : PropTypes.bool
    }

    static defaultProps = {
        className           : '',
        nodeId              : null,
        value               : '—',
        unit                : '#',
        name                : '—',
        settable            : 'false',
        retained            : 'true',
        dataType            : 'string',
        format              : '',
        rootTopic           : '',
        aliasHide           : false,
        isDisable           : false,
        title               : '',
        displayed           : 'false',
        floatRight          : false,
        isValueProcessing   : false,
        isTitleProcessing   : false,
        onAliasError        : () => {},
        showDisplayedButton : false,
        isDisplayProcessing : false,
        isCopyHidden        : false,
        classNames          : {
            root     : '',
            mainData : '',
            value    : ''
        },
        selectStyles : {
            option : {}
        },
        alias : {
            id        : '',
            name      : '',
            rootTopic : ''
        },
        valueError : {
            isExist : false
        },
        titleError : {
            isExist : false
        },
        isTitleDisabled : false
    }

    state = {
        isGroupOpened : false,
        isCopyOpened  : false
    }

    componentWillUnmount() {
        globalEscHandler.unregister(this.handleCloseCopy);
    }

    handleOpenGroups = () => {
        const { deviceId, id, nodeId, propertyType, hardwareType } = this.props;

        this.setState({ isGroupOpened: true });

        this.props.openPopup({
            id          : 'GROUPS',
            popupParams : {
                propertyType,
                hardwareType,
                propertyId : id,
                deviceId,
                nodeId
            }
        });
    }

    handleCloseGroups = () => {
        const selection = window.getSelection();

        selection.removeAllRanges();
        this.setState({ isGroupOpened: false });
    }

    handleOpenCopy = () => {
        this.setState({ isCopyOpened: true });
        globalEscHandler.register(this.handleCloseCopy);
    }

    handleCloseCopy = () => {
        const selection = window.getSelection();

        selection.removeAllRanges();
        this.setState({ isCopyOpened: false });
        globalEscHandler.unregister(this.handleCloseCopy);
    }

    handleToggleDisplayed = e => {
        // if (this.state.isProcessing) return;
        if (e) e.stopPropagation();

        const {
            setAsyncAttributeDispatcher, deviceId, nodeId, id, displayed,
            retained
        } = this.props;

        const value  = displayed === 'true' ? 'false' : 'true';

        setAsyncAttributeDispatcher({
            hardwareType : 'node',
            propertyType : 'sensors',
            deviceId,
            nodeId,
            propertyId   : id,
            field        : 'displayed',
            value,
            isRetained   : retained === 'true'
        });
    }


    handleRemoveError = () => {
        const { deviceId, hardwareType, propertyType, nodeId, id: propertyId,
            removeAttributeErrorAndHideToast } = this.props;

        if (propertyType === 'scenario') return;

        removeAttributeErrorAndHideToast({
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId
        });
    }

    handleRemoveNameError = () => {
        const { deviceId, hardwareType, propertyType, nodeId, id: propertyId,
            removeAttributeErrorAndHideToast } = this.props;

        removeAttributeErrorAndHideToast({
            hardwareType,
            propertyType,
            field : 'title',
            deviceId,
            nodeId,
            propertyId
        });
    }

    setPropertyName = ({ value }) => {
        const { nodeId, deviceId, id, propertyType, hardwareType, setAsyncAttributeDispatcher } = this.props;

        setAsyncAttributeDispatcher({
            propertyType,
            hardwareType,
            value,
            deviceId,
            nodeId,
            propertyId : id,
            field      : 'title'
        });
    }

    setValue = ({ value }) => {
        const {
            deviceId, hardwareType, propertyType, rootTopic,
            nodeId, id: propertyId, setAsyncAttributeDispatcher,
            updateScenarioState
        } = this.props;

        if (propertyType === 'scenario') {
            return updateScenarioState(rootTopic, value);
        }

        setAsyncAttributeDispatcher({
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId,
            value
        });
    }

    renderControls = (dataType, props) => {
        const { deviceId, nodeId, id: propertyId,
            valueError, isValueProcessing, isDisable,
            name, title, floatRight, selectStyles } = this.props;

        const isError = valueError?.isExist;

        switch (dataType) {
            case 'integer':
                return (
                    <IntegerControl
                        {...props}
                        floatRight={floatRight}
                        propertyId={propertyId}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        setValue={this.setValue}
                        isError={isError}
                        isProcessing={isValueProcessing}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}

                    />
                );
            case 'float':
                return (
                    <FloatControl
                        {...props}
                        floatRight={floatRight}
                        propertyId={propertyId}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        setValue={this.setValue}
                        isError={isError}
                        isProcessing={isValueProcessing}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}

                    />
                );
            case 'boolean':
                return (
                    <BooleanControl
                        {...props}
                        floatRight={floatRight}
                        isDisable={isDisable}
                        setValue={this.setValue}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        propertyId={propertyId}
                        isProcessing={isValueProcessing}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}
                    />
                );
            case 'string':
                return (
                    <StringControl
                        {...props}
                        floatRight={floatRight}
                        propertyId={propertyId}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        setValue={this.setValue}
                        isError={isError}
                        isProcessing={isValueProcessing}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}

                    />
                );
            case 'enum':
                return (
                    <EnumControl
                        {...props}
                        selectStyles={selectStyles}
                        floatRight={floatRight}
                        propertyId={propertyId}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        name={title || name}
                        setValue={this.setValue}
                        isProcessing={isValueProcessing}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}
                    />
                );
            case 'color':
                return (
                    <ColorControl
                        {...props}
                        floatRight={floatRight}
                        setValue={this.setValue}
                        deviceId={deviceId}
                        nodeId={nodeId}
                        propertyId={propertyId}
                        isProcessing={isValueProcessing}
                        isError={isError}
                        darkThemeSupport
                        onErrorRemove={this.handleRemoveError}

                    />
                );
            default:
                return <CriticalValue value={props.value} maxWidth='100%' />;
        }
    }

    renderContent() {
        const {
            id,
            name,
            unit,
            format,
            dataType,
            value,
            settable,
            retained,
            deviceId,
            nodeId,
            title,
            titleError,
            isDisable,
            isTitleProcessing,
            showDisplayedButton,
            classNames,
            isTitleDisabled,
            isCopyHidden,
            propertyType
        } = this.props;
        const { value: valueStyles } = classNames;
        const propertyTitle = title || name || '—';
        const isThreshold = deviceId === 'threshold';
        const isScenario = propertyType === 'scenario';
        const isTitleError = titleError?.isExist;
        const isTitleSettable = !(isDisable || isThreshold || isTitleDisabled || isScenario);

        return (
            <>
                <div className={cn('cell', 'name')}>
                    <div className={styles.propertyName}>

                        <StringControl
                            value={propertyTitle}
                            isSettable={isTitleSettable}
                            setValue={this.setPropertyName}
                            isProcessing={isTitleProcessing}
                            isError={isTitleError}
                            darkThemeSupport
                            propertyId={id}
                            deviceId={deviceId}
                            nodeId={nodeId}
                            baseControlClassName='setName'
                            maxWidth='100%'
                            onErrorRemove={this.handleRemoveNameError}

                        />
                    </div>
                    {!isTitleDisabled ?
                        <div className={styles.controlsIcons}>
                            { !isCopyHidden
                                ? (
                                    <Tooltip title='Copy topic'>
                                        <div className={styles.actionBtn} onClick={this.handleOpenCopy}>
                                            <CopyIcon />
                                        </div>
                                    </Tooltip>
                                ) : null
                            }
                            {
                                showDisplayedButton
                                    ? this.renderDisplayedButton()
                                    : null
                            }
                        </div>
                        : null
                    }
                </div>
                <div className={cn('cell', 'value', { [valueStyles]: valueStyles })}>
                    {this.renderControls(
                        dataType,
                        {
                            value      : value || '—',
                            unit       : getPropertyUnit(unit),
                            isSettable : settable === 'true',
                            isRetained : retained === 'true',
                            options    : format
                        }
                    )}
                </div>
            </>
        );
    }

    renderDisplayedButton() {
        const { displayed, isDisplayProcessing } = this.props;
        const isDisplayed = displayed === 'true';


        if (isDisplayProcessing) {
            return (
                <div className={styles.progressWrapper}>
                    <CircularProgress size={16} thickness={6} color='inherit' />
                </div>
            );
        }


        return (
            <Tooltip
                PopperProps={{ disablePortal: true }}
                disableFocusListener
                title={isDisplayed ? 'Hide sensor' : 'Show sensor'}>
                <div className={styles.actionBtn} onClick={this.handleToggleDisplayed}>
                    <EyeFilled isHidden={!isDisplayed} />
                </div>
            </Tooltip>
        );
    }

    renderGroups() {
        const {
            groups,
            isDisable,
            rootTopic,
            alias,
            createAliasEntity,
            changeAliasName,
            deleteAliasEntity,
            aliasHide,
            onAliasError
        } = this.props;
        const { rootTopic: aliasTopic, id: aliasId, name: aliasName } = alias;

        return (
            <>
                <div className={styles.groupsList}>
                    { groups
                        .slice(0, GROUPS_MAX_LENGTH)    // eslint-disable-line
                        .map(group => (
                            <Chip
                                key={group.id}
                                data={{
                                    id    : group.id,
                                    label : group.label
                                }}
                                withTooltip={false}
                                size='S'
                                classes={{
                                    chipRoot : styles.groupChip
                                }}
                            />
                        ))
                    }
                    { groups.length > GROUPS_MAX_LENGTH
                        ? (
                            <Chip
                                key='more-button'
                                color='secondary'
                                data={{
                                    id    : 'more-button',
                                    label : 'More'
                                }}
                                disabled={false}
                                withTooltip={false}
                                size='S'
                                classes={{
                                    chipRoot : styles.moreButton
                                }}
                                onClick={this.handleOpenGroups}
                            />
                        ) : (
                            <Chip
                                key='add-button'
                                data={{
                                    id    : 'add-button',
                                    label : '+ Add groups'
                                }}
                                size='S'
                                color='secondary'
                                disabled={isDisable}
                                withTooltip={false}
                                classes={{
                                    chipRoot : styles.addButton
                                }}
                                onClick={this.handleOpenGroups}
                            />
                        )
                    }
                </div>
                {!aliasHide ? <Alias
                    id={aliasId}
                    name={aliasName}
                    disabled={isDisable}
                    isNew={!aliasName}
                    topic={rootTopic}
                    aliasTopic={aliasTopic}
                    createAlias={createAliasEntity}
                    onChangeAlias={changeAliasName}
                    onDeleteAlias={deleteAliasEntity}
                    onAliasError={onAliasError}
                /> : null}
            </>
        );
    }

    render() {
        const { rootTopic, showGroups, classNames } = this.props;
        const { isCopyOpened } = this.state;
        const { mainData: mainDataStyles, root: rootStyles } = classNames;
        const PropertyRowCN = cn(styles.PropertyRow,
            { copyMode: isCopyOpened },
            { [rootStyles]: rootStyles });

        return (
            <div className={PropertyRowCN}>
                <div className={cn(styles.mainData, { [mainDataStyles]: mainDataStyles })}>
                    { isCopyOpened
                        ? <TopicRow value={rootTopic} onClose={this.handleCloseCopy} />
                        : this.renderContent()
                    }
                </div>
                {
                    showGroups
                        ? this.renderGroups()
                        : null
                }
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { list }  = state.groups;

    const processGroups = ownProps.groups && list
        ? ownProps.groups
            .map(groupId => list ? list.find(groupData => groupData.id === groupId) : null)
            .filter(data => !!data)
        : [];

    return {
        groups : processGroups
    };
}


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            ...HomieActions,
            ...InterfaceActions,
            ...AliasActions
        }, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PropertyRow);
