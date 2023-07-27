import React, { PureComponent } from 'react';
import { connect }              from 'react-redux';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import * as InterfaceActions    from '../../../actions/interface';
import * as HomieActions        from '../../../actions/homie';
import CriticalValue            from '../../base/CriticalValue';
import getPropertyUnit          from '../../../utils/getPropertyUnit';
import globalEscHandler         from '../../../utils/globalEscHandler';
import globalEnterHandler       from '../../../utils/globalEnterHandler';
import Form                     from './Form';
import styles                   from './Base.less';

const cn = classnames.bind(styles);

class BaseControl extends PureComponent {
    state = {
        isActive   : false,
        inputValue : ''
    }

    componentDidMount() {
        const { value, activateOnMount } = this.props;

        this.setState({
            inputValue : value
        });

        activateOnMount && this.activateControl();
    }

    componentWillReceiveProps(nextProps) {
        this.handleProcessing(nextProps);
    }

    componentWillUnmount() {
        this.removeOutOfFormClickListener();

        globalEscHandler.unregister(this.closeControl);
    }

    handleProcessing = (nextProps) => {
        const { isProcessing,  onErrorRemove } = this.props;

        if (!nextProps.isProcessing && isProcessing) {
            if (!nextProps.isError) {
                this.closeControl();
                if (onErrorRemove) onErrorRemove();
            }
        }
    }


    handleOnValueClick = (e) => {
        const { isSettable } = this.props;

        if (isSettable) {
            e.stopPropagation();
            this.activateControl();
        }
    }

    handleFormSubmit = () => {
        const { isProcessing } = this.props;

        if (isProcessing) return;

        this.deactivateControl();
    }

    handleFormWrapperClick = (e) => {
        e.stopPropagation();
    }

    handleEnterPress = () => {
        // pass
    }

    handleInputChange = (value) => {
        const { maxLength, isProcessing } = this.props;

        if (isProcessing || (maxLength && maxLength < value.length)) return;

        this.setState({
            inputValue : value
        });
    }

    handleOutOfFormClick = (e) => {
        if (!this.formWrapper || !this.formWrapper.contains(e.target)) {
            this.closeControl();
        }
    }

    setValue(value) {
        this.props.setValue({ value });
    }

    activateControl = () => {
        const { value, onActive, onErrorRemove } = this.props;

        if (onActive) onActive();
        if (onErrorRemove) onErrorRemove();

        this.setState({
            isActive   : true,
            inputValue : value !== '—' ? value : ''
        });
        this.addOutOfFormClickListener();

        globalEscHandler.register(this.closeControl);
        globalEnterHandler.register(this.handleEnterPress);
    }

    deactivateControl = () => {
        const { inputValue, isActive } = this.state;
        const { isSync, onErrorRemove } = this.props;

        if (onErrorRemove) onErrorRemove();

        if (isSync) {
            try {
                this.setValue(inputValue);
                this.closeControl();
            } catch (error) {
                console.error({ error });
            }
        } else if (isActive) {
            this.setValue(inputValue);
        } else {
            return;
        }
    }

    closeControl = () => {
        const { onCloseControl, onErrorRemove  } = this.props;

        this.removeOutOfFormClickListener();
        if (onErrorRemove) onErrorRemove();

        this.setState({
            isActive : false
        });
        globalEscHandler.unregister(this.closeControl);
        globalEnterHandler.unregister(this.handleEnterPress);

        if (onCloseControl) onCloseControl();
    }


    addOutOfFormClickListener = () => {
        document.addEventListener('mousedown', this.handleOutOfFormClick);
        document.addEventListener('touchstart', this.handleOutOfFormClick);
    }

    removeOutOfFormClickListener = () => {
        document.removeEventListener('mousedown', this.handleOutOfFormClick);
        document.removeEventListener('touchstart', this.handleOutOfFormClick);
    }

    render() {
        const { isSettable,
            unit,
            value,
            floatRight,
            isFetching,
            hideSubmitButton,
            isError,
            dataWrapperClassName,
            baseControlClassName,
            isProcessing,
            type,
            isTransparent,
            inputClassName,
            formClassName,
            spinnerSize,
            darkThemeSupport
        } = this.props;
        const { isActive, inputValue } = this.state;
        const BaseControlCN = cn('BaseControl', {
            'settable'             : isSettable,
            [baseControlClassName] : baseControlClassName
        });
        const dataWrapperCN = cn('dataWrapper', {
            floatRight,
            'disabled'             : !isSettable,
            [dataWrapperClassName] : dataWrapperClassName
        });
        const valueWrapperCN = cn('valueWrapper', {
            'error'  : isError,
            withUnit : !!unit
        });


        return (
            <div className={BaseControlCN}>
                {
                    (isActive && isSettable) || isFetching ?
                        <div
                            className = {`${styles.formWrapper} drag-cancel`}
                            ref       = {node => this.formWrapper = node}
                            onClick   = {this.handleFormWrapperClick}
                        >
                            <Form
                                spinnerSize      = {spinnerSize}
                                darkThemeSupport = {darkThemeSupport}
                                onSubmit         = {this.handleFormSubmit}
                                unit             = {unit}
                                type             = {type}
                                isError          = {isError}
                                inputValue       = {inputValue}
                                hideSubmitButton = {hideSubmitButton}
                                isProcessing     = {isProcessing}
                                onInputChange    = {this.handleInputChange}
                                isTransparent    = {isTransparent}
                                inputClassName   = {inputClassName}
                                formClassName    = {formClassName}
                            />
                        </div> :
                        <div className={dataWrapperCN} >
                            <div className={valueWrapperCN} onClick={this.handleOnValueClick}>
                                <CriticalValue value={value} maxWidth='100%' />
                            </div>
                            <div className={styles.unitWrapper} onClick={this.handleOnValueClick}>
                                <CriticalValue value={getPropertyUnit(unit)} maxWidth='100%' />
                            </div>
                        </div>
                }
            </div>
        );
    }
}

BaseControl.propTypes = {
    value                : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit                 : PropTypes.string,
    isSettable           : PropTypes.bool,
    setValue             : PropTypes.func,
    type                 : PropTypes.oneOf([ 'float', 'string', 'integer' ]).isRequired,
    floatRight           : PropTypes.bool,
    isFetching           : PropTypes.bool,
    maxLength            : PropTypes.number,
    isError              : PropTypes.bool,
    onActive             : PropTypes.func,
    onCloseControl       : PropTypes.func,
    hideSubmitButton     : PropTypes.bool,
    isProcessing         : PropTypes.bool,
    dataWrapperClassName : PropTypes.string,
    baseControlClassName : PropTypes.string,
    isSync               : PropTypes.bool,
    isTransparent        : PropTypes.bool,
    inputClassName       : PropTypes.string,
    formClassName        : PropTypes.string,
    darkThemeSupport     : PropTypes.bool,
    activateOnMount      : PropTypes.bool,
    spinnerSize          : PropTypes.number,
    onErrorRemove        : PropTypes.func
};

BaseControl.defaultProps = {
    value                : '',
    unit                 : '',
    isSettable           : false,
    setValue             : () => {},
    floatRight           : false,
    isFetching           : false,
    maxLength            : 0,
    isError              : false,
    onActive             : () => {},
    onCloseControl       : () => {},
    onErrorRemove        : () => {},
    hideSubmitButton     : false,
    isProcessing         : false,
    dataWrapperClassName : '',
    baseControlClassName : '',
    isSync               : false,
    isTransparent        : false,
    inputClassName       : '',
    formClassName        : '',
    darkThemeSupport     : false,
    activateOnMount      : false,
    spinnerSize          : 20
};


export default connect(null, { ...InterfaceActions, ...HomieActions })(BaseControl);
