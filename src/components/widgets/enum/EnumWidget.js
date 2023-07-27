import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import EnumWidgetSelect from '../../base/select/EnumWidgetSelect';
import ProcessingIndicator from '../../base/ProcessingIndicator';
import getReadableUnit from '../../../utils/getPropertyUnit';
import CriticalValue from '../../base/CriticalValue';

import styles from './EnumWidget.less';

class EnumWidget extends PureComponent {
    state = {
        isOpen : false
    }

    handleSelectChange = ({ value }) => {
        const { onSetValue } = this.props;

        onSetValue(value, true);
    }

    handleMenuOpen = () => this.setState({ isOpen: true });

    handleMenuClose = () => this.setState({ isOpen: false });

    getOptions = () => {
        const { format } = this.props;

        return format.length ? format.split(',').map(item => ({ value: item, label: item })) : [];
    }

    renderEnumWidget = () => {
        const { value, unit, isSettable, isEditMode, name, isLocked } = this.props;
        const { isOpen } = this.state;
        const options = this.getOptions();

        return (
            <>
                { isSettable ?
                    <div className={styles.selectWrapper} style={{ zIndex: isOpen && 2 }}>
                        <EnumWidgetSelect
                            mobileTitle= {name || ' '}
                            darkThemeSupport
                            isDisabled={isEditMode || isLocked}
                            value={value}
                            maxSelectHeight={206}
                            onChange={this.handleSelectChange}
                            onMenuClose={this.handleMenuOpen}
                            onMenuOpen={this.handleMenuClose}
                            options={options}
                            noPortalTarget={false}
                        />

                    </div> :
                    <CriticalValue
                        value={value} maxWidth='65%' className={styles.value}
                        hideTooltip={isEditMode}
                    />
                }
                <CriticalValue
                    value={getReadableUnit(unit)} maxWidth='30%' className={styles.unit}
                    hideTooltip={isEditMode}
                />
            </>
        );
    }

    render() {
        const { isProcessing } = this.props;

        return (
            <Fragment>
                {
                    isProcessing ?
                        <ProcessingIndicator size={35} />
                        : this.renderEnumWidget()
                }
            </Fragment>
        );
    }
}

EnumWidget.propTypes = {
    value        : PropTypes.string,
    name         : PropTypes.string,
    format       : PropTypes.string,
    unit         : PropTypes.string,
    isLocked     : PropTypes.bool.isRequired,
    isSettable   : PropTypes.bool.isRequired,
    isEditMode   : PropTypes.bool.isRequired,
    isProcessing : PropTypes.bool.isRequired,
    onSetValue   : PropTypes.func.isRequired
};

EnumWidget.defaultProps = {
    name   : '',
    value  : '-',
    format : '',
    unit   : '-'
};

export default EnumWidget;
