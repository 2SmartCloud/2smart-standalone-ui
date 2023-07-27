
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CriticalValue from '../CriticalValue';
import Menu from '../Menu';
import { WIDGET_PROCESSING_DELAY } from '../../../assets/constants/widget';
import { GET_ATTRIBUTE_TYPE_BY_HARDWARE } from '../../../assets/constants/homie';

import Theme from '../../../utils/theme';
import { getWidgetBackgroundColor } from '../../../utils/theme/widget/getColors';
import * as HomieActions from '../../../actions/homie';
import NoDataMessage from '../../widgets/etc/NoDataMessage';
import styles from './BaseWidget.less';

const cn = classnames.bind(styles);

class BaseWidget extends PureComponent {
    static contextType = Theme                          // eslint-disable-line

    static propTypes = {
        widget                      : PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]).isRequired,
        name                        : PropTypes.string,
        bgColor                     : PropTypes.string.isRequired,
        value                       : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        unit                        : PropTypes.string,
        format                      : PropTypes.string,
        settable                    : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        advanced                    : PropTypes.object,
        processingDelay             : PropTypes.number,
        isEditMode                  : PropTypes.bool.isRequired,
        dataType                    : PropTypes.string,
        hardwareType                : PropTypes.oneOf([ 'node', 'device', 'threshold', 'group'  ]).isRequired,
        propertyType                : PropTypes.oneOf([ 'options', 'telemetry', 'sensors', 'threshold', 'group', 'scenario' ]).isRequired,
        deviceId                    : PropTypes.string,
        nodeId                      : PropTypes.string,
        propertyId                  : PropTypes.string,
        topic                       : PropTypes.string.isRequired,
        propertyNotFound            : PropTypes.bool.isRequired,
        screenId                    : PropTypes.string.isRequired,
        widgetId                    : PropTypes.string.isRequired,
        isEditable                  : PropTypes.bool,
        onMenuSelect                : PropTypes.func.isRequired,
        updateAttributeDispatcher   : PropTypes.func.isRequired,
        updateScenarioState         : PropTypes.func.isRequired,
        setAsyncAttributeDispatcher : PropTypes.func.isRequired,
        isProcessing                : PropTypes.bool,
        isError                     : PropTypes.bool,
        error                       : PropTypes.object,
        onErrorRemove               : PropTypes.func.isRequired
    }

    static defaultProps = {
        name            : '',
        value           : '',
        unit            : '',
        format          : '',
        settable        : false,
        isEditable      : false,
        advanced        : {},
        processingDelay : WIDGET_PROCESSING_DELAY,
        dataType        : '',
        deviceId        : '',
        nodeId          : '',
        propertyId      : '',
        isProcessing    : false,
        isError         : false,
        error           : {}
    }

    state = {
        isLocked     : false,
        isProcessing : false
    }

    attributeTopic = undefined;
    processingTimeout = null;
    currentValue = undefined;
    optimistic   = false;

    componentDidMount() {
        const { isEditable, value } = this.props;

        if (isEditable) {
            this.currentValue = value;
        }
    }

    componentDidUpdate(prevProps) {
        const { isEditable } = this.props;

        if (isEditable) {
            this.handleProcessing(prevProps);
        }
    }


    componentWillUnmount() {
        this.clearTimeout();
    }


    handleProcessing = (prevProps) => {
        const { isProcessing, isError, error } = this.props;
        const prevIsProcessing = prevProps.isProcessing;

        const processing = isProcessing && !prevIsProcessing;
        const processed = prevIsProcessing && !isProcessing;

        if (processing) {
            this.handleStartProcessing();
        }

        if (processed && !isError) {
            this.handleSuccess();
        }

        if (processed && isError) {
            this.handleError(error);
        }
    }

    handleMenuSelect = value => {
        this.props.onMenuSelect(value);
    }

    handleSetValue = (value, optimistic) => {
        const { value: currentValue } = this.props;
        const { isLocked } = this.state;

        if (isLocked) return;

        this.clearTimeout();

        if (this.widget.onValueChanged) this.widget.onValueChanged();

        this.currentValue = currentValue;
        this.optimistic   = optimistic;

        this.dispatchAttribute(value, optimistic);
    }

    handleStartProcessing = () => {
        const { processingDelay } = this.props;

        const processingTimeout = setTimeout(() => {
            this.setState({ isProcessing: true });
            if (this.widget.onProcessing) this.widget.onProcessing();
        }, processingDelay);

        this.processingTimeout = processingTimeout;
        this.handleErrorRemove();
        this.setState({ isLocked: true });
    }

    handleSuccess = () => {
        this.flushProcessing();
        if (this.widget.onSuccess) this.widget.onSuccess();
    }

    handleError = error => {
        this.clearTimeout();
        this.setState({
            isLocked     : false,
            isProcessing : false
        });
        if (this.widget.onError) this.widget.onError(error);

        if (this.optimistic) this.revertAttribute();
        if (this.widget.setValue) this.widget.setValue(this.props.value);
    }

    getBackgroundColor = () => {
        const { bgColor } = this.props;
        const { theme } = this.context;

        return getWidgetBackgroundColor(bgColor || 'white', theme);
    }

    dispatchAttribute = (value, optimistic = false) => {
        const {
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId,
            topic,
            updateScenarioState,
            updateAttributeDispatcher,
            setAsyncAttributeDispatcher
        } = this.props;

        if (propertyType === 'scenario') {
            return updateScenarioState(topic, value);
        }

        const type = GET_ATTRIBUTE_TYPE_BY_HARDWARE[hardwareType][propertyType].value;
        const payload = {
            hardwareType,
            propertyType,
            deviceId,
            nodeId : hardwareType === 'device' ? undefined : nodeId,
            propertyId,
            value
        };

        if (optimistic) {
            updateAttributeDispatcher({ type, params: { ...payload, field: 'value' } });
        }
        setAsyncAttributeDispatcher({ type, ...payload });
    }

    revertAttribute = () => {
        const {
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId,
            updateAttributeDispatcher
        } = this.props;

        if (hardwareType === 'threshold') return;

        const type = GET_ATTRIBUTE_TYPE_BY_HARDWARE[hardwareType][propertyType].value;
        const payload = {
            deviceId,
            nodeId : hardwareType === 'node' ? nodeId : undefined,
            propertyId,
            value  : this.currentValue,
            field  : 'value'
        };

        updateAttributeDispatcher({ type, params: payload });
    }

    handleErrorRemove = () => {
        const {   hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId,
            onErrorRemove
        } = this.props;

        onErrorRemove({
            hardwareType,
            propertyType,
            deviceId,
            nodeId,
            propertyId
        });
    }


    flushProcessing = () => {
        this.clearTimeout();
        this.handleErrorRemove();
        this.setState({
            isLocked     : false,
            isProcessing : false
        });
    }

    clearTimeout = () => {
        clearTimeout(this.processingTimeout);
        this.processingTimeout = null;
    }

    processingObserver = ({ type }) => {
        const handler = this.getProcessingHandler(type);

        if (handler) handler();
    }

    render() {
        const {
            name,
            value,
            unit,
            format,
            settable,
            advanced,
            dataType,
            topic,
            propertyNotFound,
            screenId,
            widgetId,
            isEditMode,
            isEditable,
            widget: WidgetComponent,
            isError
        } = this.props;
        const { isLocked, isProcessing } = this.state;
        const BaseWidgetCN = cn('BaseWidget', { editMode: isEditMode, noData: propertyNotFound });
        const headerCN = cn('header', { hide: !isEditMode && !name });
        const backgroundColor = this.getBackgroundColor();
        const contentCN = cn('contentWrapper', { noTitle: !name });

        /**
         * Widget props type
         * @type {{
         *     value: string,
         *     unit: string,
         *     dataType: string,
         *     format: string,
         *     settable: boolean,
         *     advanced: object,
         *     topic: string,
         *     screenId: number,
         *     widgetId: number,
         *     bgColor: string,
         *     isError: boolean,
         *     isLocked: boolean,
         *     isProcessing: boolean,
         *     isEditMode: boolean,
         *     isSettable: boolean,
         *     onSetValue: function(value: string): void
         * }}
         */
        const widgetProps = {
            value,
            name,
            unit,
            dataType,
            format,
            advanced,
            topic,
            screenId,
            widgetId,
            isEditMode,
            isError,
            isLocked,
            isProcessing,
            isSettable : typeof settable === 'boolean' ? settable : settable === 'true',
            bgColor    : backgroundColor,
            onSetValue : isEditable ? this.handleSetValue : undefined
        };

        return (
            <div
                style={{ backgroundColor }}
                className={BaseWidgetCN}
            >
                <div className={headerCN}>
                    <div className={styles.label}>
                        <CriticalValue value={name} hideTooltip={isEditMode} />
                    </div>
                    {
                        isEditMode &&
                        <div>
                            <Menu
                                onClick={this.handleMenuSelect}
                                options={[
                                    {
                                        value : 'edit',
                                        label : 'Edit'
                                    },
                                    {
                                        value : 'delete',
                                        label : 'Delete'
                                    }
                                ]}
                            />
                        </div>
                    }
                </div>
                <div className={contentCN}>
                    { propertyNotFound
                        ? <NoDataMessage />
                        : <WidgetComponent ref={el => this.widget = el} {...widgetProps} />
                    }
                </div>
            </div>
        );
    }
}

export default connect(null, { ...HomieActions })(BaseWidget);
