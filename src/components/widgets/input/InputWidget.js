import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import getPropertyUnit from '../../../utils/getPropertyUnit';
import GenericInput from '../../base/GenericInput';
import styles from './InputWidget.less';

class InputWidget extends PureComponent {
    static propTypes = {
        value      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        unit       : PropTypes.string,
        isSettable : PropTypes.bool.isRequired,
        isEditMode : PropTypes.bool.isRequired,
        onSetValue : PropTypes.func.isRequired
    }

    static defaultProps = {
        value : '—',
        unit  : ''
    }

    handleSetValue = ({ value }) => {
        const { onSetValue } = this.props;

        onSetValue(value);
    }

    onProcessing = () => this.input.onProcessing()

    onError = error => this.input.onError(error)

    onSuccess = () => this.input.onSuccess()

    render() {
        const {
            value,
            unit,
            isSettable,
            isEditMode
        } = this.props;

        return (
            <div className={styles.controlWrapper}>
                <GenericInput
                    ref={el => this.input = el}
                    type='string'
                    value={value || '—'}
                    unit={getPropertyUnit(unit)}
                    isSettable={isSettable && !isEditMode}
                    isTransparent
                    darkThemeSupport
                    baseControlClassName='InputWidget'
                    dataWrapperClassName={styles.dataWrapper}
                    inputClassName={styles.inputControl}
                    onSubmit={this.handleSetValue}
                />
            </div>
        );
    }
}

export default InputWidget;
