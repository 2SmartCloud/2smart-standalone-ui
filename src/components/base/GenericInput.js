import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import getPropertyUnit          from '../../utils/getPropertyUnit';
import Form                     from './controls/Form';
import CriticalValue            from './CriticalValue';
import styles                   from './GenericInput.less';

const cn = classnames.bind(styles);

class GenericInput extends PureComponent {
    static propTypes = {
        type                 : PropTypes.oneOf([ 'float', 'string', 'integer' ]),
        value                : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        unit                 : PropTypes.string,
        maxLength            : PropTypes.number,
        isSettable           : PropTypes.bool,
        isTransparent        : PropTypes.bool,
        isHiddenSubmit       : PropTypes.bool,
        isSync               : PropTypes.bool,
        floatRight           : PropTypes.bool,
        darkThemeSupport     : PropTypes.bool,
        baseControlClassName : PropTypes.string,
        dataWrapperClassName : PropTypes.string,
        inputClassName       : PropTypes.string,
        onOpened             : PropTypes.func,
        onSubmit             : PropTypes.func.isRequired
    }

    static defaultProps = {
        type                 : 'string',
        value                : '',
        unit                 : '',
        maxLength            : 0,
        isSettable           : false,
        isTransparent        : false,
        isHiddenSubmit       : false,
        isSync               : false,
        floatRight           : false,
        darkThemeSupport     : false,
        baseControlClassName : undefined,
        dataWrapperClassName : undefined,
        inputClassName       : undefined,
        onOpened             : undefined
    }

    state = {
        isOpen       : false,
        inputValue   : '',
        isProcessing : false,
        isError      : false
    }

    componentWillUnmount() {
        this.removeOutOfFormClickListener();
    }

    handleInputChange = value => {
        const { maxLength } = this.props;
        const { isProcessing } = this.state;

        if (isProcessing || (maxLength && maxLength < value.length)) return;

        this.setState({
            inputValue : value,
            isError    : false
        });
    }

    handleSubmit = () => {
        const { isSync, onSubmit } = this.props;
        const { inputValue, isProcessing } = this.state;

        if (isProcessing) return;

        onSubmit({ value: inputValue });

        if (isSync) this.closeControl(true);
    }

    handleOnValueClick = e => {
        e.stopPropagation();

        const { isSettable } = this.props;

        if (isSettable) this.openControl();
    }

    handleOutOfFormClick = e => {
        const containsTarget = this.formWrapper && this.formWrapper.contains(e.target);

        if (!containsTarget) this.closeControl();
    }

    handleKeyDown = e => {
        e.stopPropagation();

        const { keyCode } = e;
        const ESCAPE_KEY_CODE = 27;

        if (keyCode === ESCAPE_KEY_CODE) this.closeControl();
    }

    handleStopPropagation = e => e.stopPropagation()

    onProcessing = () => {
        this.setState({
            isProcessing : true,
            isError      : false
        });
    }

    onError = error => {
        if (error === 'TIMEOUT') {
            return this.closeControl(true);
        }

        this.setState(prevState => ({
            isProcessing : false,
            isError      : prevState.isOpen // do not set isError if input is closed
        }));
    }

    onSuccess = () => {
        this.closeControl(true);
    }

    openControl = () => {
        const { value, onOpened } = this.props;

        if (onOpened) onOpened();

        this.setState({
            isOpen     : true,
            inputValue : value && value !== '—' ? value : ''
        });
        this.attachOutOfFormClickListener();
    }

    closeControl = (resetSuccess = false) => {
        this.setState(prevState => ({
            isOpen       : false,
            isProcessing : !resetSuccess && prevState.isProcessing,
            isError      : false
        }));
        this.removeOutOfFormClickListener();
    }

    attachOutOfFormClickListener = () => {
        document.addEventListener('click', this.handleOutOfFormClick);
        document.addEventListener('touchend', this.handleOutOfFormClick);
    }

    removeOutOfFormClickListener = () => {
        document.removeEventListener('click', this.handleOutOfFormClick);
        document.removeEventListener('touchend', this.handleOutOfFormClick);
    }

    render() {
        const {
            type,
            value,
            unit,
            isSettable,
            isTransparent,
            isHiddenSubmit,
            floatRight,
            darkThemeSupport,
            baseControlClassName,
            dataWrapperClassName,
            inputClassName
        } = this.props;
        const {
            isProcessing,
            isError
        } = this.state;
        const { inputValue, isOpen } = this.state;

        const GenericInputCN = cn('GenericInput', {
            'settable'             : isSettable,
            [baseControlClassName] : baseControlClassName
        });
        const dataWrapperCN = cn('dataWrapper', {
            floatRight,
            [dataWrapperClassName] : dataWrapperClassName
        });
        const valueWrapperCN = cn('valueWrapper', {
            'error' : isError
        });

        return (
            <div className={GenericInputCN}>
                {
                    isOpen ?
                        <div
                            className={styles.formWrapper}
                            ref={node => this.formWrapper = node}
                            onClick={this.handleStopPropagation}
                            onKeyDown={this.handleKeyDown}
                        >
                            <Form
                                darkThemeSupport={darkThemeSupport}
                                onSubmit={this.handleSubmit}
                                unit={unit}
                                type={type}
                                isError={isError}
                                inputValue={inputValue}
                                hideSubmitButton={isHiddenSubmit}
                                isProcessing={isProcessing}
                                onInputChange={this.handleInputChange}
                                isTransparent={isTransparent}
                                inputClassName={inputClassName}
                            />
                        </div> :
                        <div className={dataWrapperCN} onClick={this.handleOnValueClick}>
                            <div className={valueWrapperCN}>
                                <CriticalValue value={value} maxWidth='100%' />
                            </div>
                            <div className={styles.unitWrapper}>
                                <CriticalValue value={getPropertyUnit(unit)} maxWidth='100%' />
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default GenericInput;
