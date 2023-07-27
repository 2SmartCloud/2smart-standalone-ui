/* eslint-disable react/default-props-match-prop-types */
import React, {
    PureComponent,
    Fragment
}                                    from 'react';
import PropTypes                     from 'prop-types';
import { connect }                   from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import classnames                    from 'classnames/bind';
import {
    WIDGETS_GRID_BREAKPOINTS,
    WIDGETS_MAP,
    DEFAULT_WIDGET_SCALES,
    WIDGET_SCALES_MAP
}                                    from '../../assets/constants/widget';
import * as WidgetActions            from '../../actions/client/widget';
import * as HomieActions             from '../../actions/homie';
import { detectIOS }                 from '../../utils/detect';
import WidgetSettingsModal           from '../pages/client/Dashboard/WidgetSettingsModal';
import BaseWidget                    from './baseWidget/BaseWidget';
import BaseMultiWidget               from './baseMultiWidget';
import Modal                         from './Modal';
import DeleteWarning                 from './DeleteWarning';

import styles                        from './WidgetsGrid.less';

import './WidgetsGrid.customize.less';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';    // eslint-disable-line

const cn = classnames.bind(styles);
const ResponsiveGridLayout = WidthProvider(Responsive);

const isIOS = detectIOS();

function getContainerPaddings() {
    if (window.innerWidth > 650) {
        return [ 33, 33 ];
    }

    return [ 12, 12 ];
}

const CONTAINER_PADDING = getContainerPaddings();

const WIDGET_MARGIN = [ 10, 10 ];
const COLS = { lg: 8, md: 4, sm: 2 };

class WidgetsGrid extends PureComponent {
    static propTypes = {
        devices              : PropTypes.object.isRequired,
        scenariosHomie       : PropTypes.object.isRequired,
        deleteWidget         : PropTypes.func.isRequired,
        screen               : PropTypes.object.isRequired,
        isEditMode           : PropTypes.bool,
        updateWidget         : PropTypes.func.isRequired,
        clearValues          : PropTypes.func.isRequired,
        selectTopic          : PropTypes.func.isRequired,
        selectGroup          : PropTypes.func.isRequired,
        changeValueTab       : PropTypes.func.isRequired,
        getGroups            : PropTypes.func.isRequired,
        widgetStore          : PropTypes.object.isRequired,
        selectWidgetToEdit   : PropTypes.func.isRequired,
        selectWidgetToDelete : PropTypes.func.isRequired,
        isDeleting           : PropTypes.bool,
        innerRef             : PropTypes.any,
        isOverflowed         : PropTypes.bool,
        thresholds           : PropTypes.object.isRequired,
        isUpdating           : PropTypes.bool.isRequired,
        groups               : PropTypes.array.isRequired,
        removeWidgetError    : PropTypes.func.isRequired,
        removeAttributeError : PropTypes.func.isRequired,
        getIDsByTopic        : PropTypes.func.isRequired
    }

    static defaultProps = {
        innerRef     : null,
        isEditMode   : false,
        isDeleting   : false,
        isOverflowed : false
    }

    constructor(props) {
        super(props);

        this.state = {
            layouts              : this.fillLayout(props),
            isDeleteModalOpen    : false,
            isEditModalOpen      : false,
            enumWidgetSelectOpen : null
        };
    }

    componentDidUpdate(prevProps) {
        const { screen } = this.props;
        const { screen: prevScreen } = prevProps;

        if (
            prevScreen.uuid !== screen.uuid                // screen reloaded
            || prevScreen.isEditMode && !screen.isEditMode // resetting unsaved changes
        ) {
            this.resetLayout();
        }
    }

    handleDragStart = () => {
        if (isIOS) document.body.classList.add('stopBouncing');
    }

    handleDragStop = () => {
        if (isIOS) {
            setTimeout(() => document.body.classList.remove('stopBouncing'), 300);
        }
    }

    handleDeleteModalOpen = () => {
        this.setState({ isDeleteModalOpen: true });
    }

    handleDeleteModalClose = () => {
        if (!this.props.widgetStore.isFetching) this.setState({ isDeleteModalOpen: false });
    }

    handleEditModalOpen = () => {
        this.setState({ isEditModalOpen: true });
    }

    handleEditModalClose = () => {
        if (this.props.widgetStore.isFetching) return;

        this.setState({ isEditModalOpen: false });
        this.props.clearValues();
    }

    handleDeleteWidget = async () => {
        const { screen, widgetStore, deleteWidget } = this.props;

        if (this.props.widgetStore.isFetching) return;

        await deleteWidget({ id: widgetStore.widgetId, screen: screen.id });

        const errors = this.getErrors();

        if (!errors.length) this.handleDeleteModalClose();
    }

    handleEditWidget = async () => {
        if (this.props.widgetStore.isFetching) return;
        const { widgetStore:{ widgetId, params, ...widgetFields }, updateWidget, screen } = this.props;

        await updateWidget({
            id     : widgetId,
            params : { ...widgetFields, ...params, screen: screen.id }
        });

        const errors = this.getErrors();

        if (!errors.length) this.handleEditModalClose();
    }

    handleBreakpointChange = () => {}

    handleLayoutChange = (layout, layouts) => {
        this.setState({ layouts });
    }

    handleMenuSelect = widgetId => value => {
        const { screen:{ widgets }, selectWidgetToEdit, selectWidgetToDelete } = this.props;
        const widget = widgets.find(({ id }) => id === widgetId);

        switch (value) {
            case 'delete':
                selectWidgetToDelete(widget);
                this.handleDeleteModalOpen();

                break;
            case 'edit':
                selectWidgetToEdit(widget);
                this.handleEditModalOpen({ type: widget.type });

                break;
            default:
                break;
        }
    }

    getErrors = () => {
        const { error } = this.props.widgetStore;

        return Object.entries(error);
    }

    getTopicsProperties = (topics, orders) => topics.map((topic, index) => {
        const { getIDsByTopic } = this.props;

        const IDs = getIDsByTopic(topic);
        const property = this.getPropertyByIds(IDs);

        return ({ topic, ...IDs, ...property, order: orders[topic] || index });
    });

    getPropertyByIds(IDs) {
        const { devices, thresholds, groups, scenariosHomie } = this.props;
        const { deviceId, nodeId, propertyId, scenarioId, type } = IDs || {};
        const device = devices[deviceId];
        const node = device?.nodes?.find(({ id }) => id === nodeId) || null;

        const defaultValue = { value: '—' };

        let data = defaultValue;

        const scenario = scenariosHomie?.[scenarioId];

        switch (type) {
            case 'DEVICE':
                data = device[type].find(({ id }) => id === propertyId) || { value: '—' };
                break;
            case 'NODE':
                if (!node) data = { value: '—' };
                data = node?.[type]?.find(({ id }) => id === propertyId) || { value: '—' };
                break;
            case 'DEVICE_TELEMETRY':
                data = devices[deviceId]?.telemetry?.find(p => p.id === propertyId);
                break;
            case 'DEVICE_OPTION':
                data = devices[deviceId]?.options?.find(p => p.id === propertyId);
                break;
            case 'SENSOR':
                data = devices[deviceId]?.nodes?.find(n => n.id === nodeId)?.sensors?.find(p => p.id === propertyId);
                break;
            case 'NODE_TELEMETRY':
                data = devices[deviceId]?.nodes?.find(n => n.id === nodeId)?.telemetry?.find(p => p.id === propertyId);
                break;
            case 'NODE_OPTION':
                data = devices[deviceId]?.nodes?.find(n => n.id === nodeId)?.options?.find(p => p.id === propertyId);
                break;
            case 'THRESHOLD':
                data = thresholds?.[nodeId]?.find(thr => thr.id === propertyId) || { value: '—' };
                break;
            case 'GROUP_OF_PROPERTIES':
                data = groups?.find(({ id }) => id === deviceId) || { value: '—' };
                break;
            case 'SCENARIO':
                data = {
                    type              : 'scenario',
                    dataType          : 'boolean',
                    name              : scenario ? scenario?.name             : '—',
                    value             : scenario ? scenario?.state            : '—',
                    isValueProcessing : scenario ? scenario?.isStateProcessing : false,
                    rootTopic         : scenario ? scenario?.rootTopic : void 0,
                    settable          : 'true'
                };
                break;
            default:
                break;
        }

        return data || defaultValue;
    }

    getWidgetsMinScales = () => {
        const { screen } = this.props;
        const scales = {
            lg : [],
            md : [],
            sm : []
        };

        for (const { type } of screen.widgets) {
            const widgetScales = this.getWidgetMinScales(type);

            scales.lg.push(widgetScales.lg);
            scales.md.push(widgetScales.md);
            scales.sm.push(widgetScales.sm);
        }

        return scales;
    }

    getWidgetMinScales = (type) => {
        const widgetScales = WIDGET_SCALES_MAP[type] || {};

        return {
            lg : widgetScales.lg || DEFAULT_WIDGET_SCALES,
            md : widgetScales.md || DEFAULT_WIDGET_SCALES,
            sm : widgetScales.sm || DEFAULT_WIDGET_SCALES
        };
    }

    fillLayout = (props) => {
        const { layout } = props.screen;
        const widgets = props.screen.widgets || [];

        const newLayout = JSON.parse(JSON.stringify(layout || {}));

        Object.keys(COLS).forEach(key => {
            if (!newLayout[key]) newLayout[key] = [];
        });

        widgets.forEach(widget => {
            const { type } = widget;
            const scales = this.getWidgetMinScales(type);

            Object.keys(COLS).forEach(key => {
                if (!newLayout[key].find(item => item.i === widget.id)) {
                    const { w, h } = scales[key];


                    newLayout[key].push({ i: widget.id, x: 0, y: 0, w, h });
                }
            });
        });

        return newLayout;
    }

    resetLayout = () => {
        this.setState({
            layouts : this.fillLayout(this.props)
        });
    }

    renderWidgets = () => {
        const { screen, isEditMode, removeWidgetError, removeAttributeError, getIDsByTopic } = this.props;

        return screen.widgets.map(widget => {
            const { bgColor, name, type, id, isMulti, topics, orders, advanced } = widget;
            const { component, editable, processingDelay } = WIDGETS_MAP[type];

            if (isMulti) {
                const properties = this.getTopicsProperties(topics, orders);
                const isNoDataForWidget = properties
                    .reduce((isNoData, property) => isNoData && !property.rootTopic, true);
                const multiWidgetProps = {
                    bgColor,
                    name,
                    type,
                    id,
                    isEditMode,
                    properties,
                    advanced,
                    isNoDataForWidget,
                    screenId : screen.id,
                    widgetId : id
                };

                return (
                    <div key={id}>
                        <BaseMultiWidget
                            {...multiWidgetProps}
                            onErrorRemove = {removeAttributeError}
                            onMenuSelect  = {this.handleMenuSelect(id)}
                            widget        = {component}
                        />
                    </div>);
            }

            const { topic } = widget;
            const IDs = getIDsByTopic(topic);
            const property = this.getPropertyByIds(IDs);
            const { deviceId, nodeId,  propertyId, propertyType, hardwareType } = IDs || {};
            const { value, isValueProcessing, valueError, unit, format, settable, rootTopic, dataType } = property;

            const props = {
                name,
                bgColor,
                value,
                unit,
                format,
                settable,
                advanced,
                processingDelay,
                isEditMode,
                dataType,
                hardwareType,
                propertyType,
                deviceId,
                nodeId,
                propertyId,
                topic,
                isError          : valueError?.isExist,
                error            : valueError?.value,
                isProcessing     : isValueProcessing,
                propertyNotFound : !rootTopic,
                screenId         : screen.id,
                widgetId         : widget.id,
                isEditable       : editable,
                onErrorRemove    : removeWidgetError,
                onMenuSelect     : this.handleMenuSelect(id)
            };

            return (
                <div key={widget.id}>
                    <BaseWidget {...props} widget={component} />
                </div>
            );
        });
    }

    render() {
        const { layouts, isDeleteModalOpen, isEditModalOpen } = this.state;

        const {
            isEditMode,
            widgetStore: { isFetching, name : widgetName },
            innerRef,
            isOverflowed,
            screen,
            isUpdating
        } = this.props;
        const WidgetsGridCN = cn('WidgetsGrid', {
            empty : !screen.widgets.length,
            blur  : isUpdating
        });
        const boundedLayouts = layouts;
        const minScales = this.getWidgetsMinScales();

        for (const bpKey of [ 'lg', 'md', 'sm' ]) {
            if (minScales[bpKey].length) {
                if (layouts[bpKey]) {
                    boundedLayouts[bpKey] = layouts[bpKey].map((item, index) => {
                        const minW = minScales[bpKey][index] ? minScales[bpKey][index].w : item.w;
                        const minH = minScales[bpKey][index] ? minScales[bpKey][index].h : item.h;
                        const newWidth =  item.w < minW ? minW : item.w;
                        const newHeight = item.h < minH ? minH : item.h;

                        return {
                            ...item,
                            minW,
                            minH,
                            w : newWidth,
                            h : newHeight
                        };
                    });
                }
            }
        }

        return (
            <Fragment>
                <div
                    className={`${WidgetsGridCN}${isOverflowed ? ' overflowed' : ''}`} id='widgetsGrid'
                >
                    <ResponsiveGridLayout
                        className          = {styles.container}
                        layouts            = {boundedLayouts}
                        compactType        = 'vertical'
                        draggableCancel    = '.drag-cancel'
                        breakpoints        = {WIDGETS_GRID_BREAKPOINTS}
                        cols               = {COLS}
                        isDraggable        = {isEditMode}
                        isResizable        = {isEditMode}
                        rowHeight          = {100}
                        containerPadding   = {CONTAINER_PADDING}
                        margin             = {WIDGET_MARGIN}
                        onBreakpointChange = {this.handleBreakpointChange}
                        onLayoutChange     = {this.handleLayoutChange}
                        onDragStart        = {this.handleDragStart}
                        onDragStop         = {this.handleDragStop}
                        onResizeStart      = {this.handleDragStart}
                        onResizeStop       = {this.handleDragStop}
                        ref                = {innerRef}
                    >
                        {this.renderWidgets()}
                    </ResponsiveGridLayout>
                </div>
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={this.handleDeleteModalClose}
                >
                    <DeleteWarning
                        name={widgetName || 'widget'}
                        onClose={this.handleDeleteModalClose}
                        onAccept={this.handleDeleteWidget}
                        isFetching={isFetching}
                        confirmText={'Yes, delete widget'}
                        itemType='widget'
                    />
                </Modal>
                <WidgetSettingsModal
                    isOpen={isEditModalOpen}
                    onClose={this.handleEditModalClose}
                    onSave={this.handleEditWidget}
                />
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        devices        : state.homie.devices,
        scenariosHomie : state.homie.scenarios,
        groups         : state.groups.list,
        widgetStore    : state.client.widget,
        isDeleting     : state.client.dashboard.isDeleting,
        isOverflowed   : state.applicationInterface.modal.isOpen,
        thresholds     : state.homie.thresholds
    };
}

const mapDispatchToProps = {
    ...HomieActions,
    ...WidgetActions
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(WidgetsGrid);
