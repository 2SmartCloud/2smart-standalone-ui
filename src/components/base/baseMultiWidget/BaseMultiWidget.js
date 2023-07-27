import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import CriticalValue from '../CriticalValue';
import Menu from '../Menu';
import Theme from '../../../utils/theme';
import * as HomieActions from '../../../actions/homie';

import { getWidgetBackgroundColor } from '../../../utils/theme/widget/getColors';
import NoDataMessage from '../../widgets/etc/NoDataMessage';
import styles from './styles.less';

const cn = classnames.bind(styles);

class BaseMultiWidget extends PureComponent {
    static contextType = Theme                          // eslint-disable-line

    static propTypes = {
        widget                      : PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]).isRequired,
        name                        : PropTypes.string,
        bgColor                     : PropTypes.string.isRequired,
        properties                  : PropTypes.array.isRequired,
        devices                     : PropTypes.object.isRequired,
        isEditMode                  : PropTypes.bool.isRequired,
        screenId                    : PropTypes.string.isRequired,
        widgetId                    : PropTypes.string.isRequired,
        onMenuSelect                : PropTypes.func.isRequired,
        isNoDataForWidget           : PropTypes.bool.isRequired,
        setAsyncAttributeDispatcher : PropTypes.func.isRequired,
        updateScenarioState         : PropTypes.func.isRequired,
        advanced                    : PropTypes.object
    }

    static defaultProps = {
        name     : '',
        advanced : {}
    }

    state = {
        isProcessing : false
    }


    handleMenuSelect = value => {
        this.props.onMenuSelect(value);
    }


    getBackgroundColor = () => {
        const { bgColor } = this.props;
        const { theme } = this.context;

        return getWidgetBackgroundColor(bgColor || 'white', theme);
    }


    render() {
        const {
            name,
            screenId,
            widgetId,
            isEditMode,
            properties,
            advanced,
            isNoDataForWidget,
            setAsyncAttributeDispatcher,
            widget: WidgetComponent
        } = this.props;
        const { isProcessing } = this.state;

        const BaseMultiWidgetCN = cn('BaseMultiWidget', { editMode: isEditMode });
        const headerCN = cn('header', { hide: !isEditMode && !name });
        const backgroundColor = this.getBackgroundColor();
        const contentCN = cn('contentWrapper', { noTitle: !name });

        const widgetProps = {
            name,
            screenId,
            widgetId,
            isEditMode,
            isProcessing,
            properties,
            advanced,
            bgColor  : backgroundColor,
            setValue : setAsyncAttributeDispatcher
        };

        return (
            <div
                style={{ backgroundColor }}
                className={BaseMultiWidgetCN}
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
                    {
                        isNoDataForWidget
                            ? <NoDataMessage />
                            : <WidgetComponent ref={el => this.widget = el} {...widgetProps} />
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        devices : state.homie.devices
    };
}


export default connect(mapStateToProps, { ...HomieActions })(BaseMultiWidget);
