import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { debounce } from 'throttle-debounce';

import * as HomieActions from '../../../actions/homie';
import * as InterfaceActions from '../../../actions/interface';
import ColorPicker from '../colorPicker/ColorPicker.js';

import styles from './Color.less';


const cn = classnames.bind(styles);

class ColorControl extends PureComponent {
    static propTypes = {
        floatRight    : PropTypes.bool,
        isSettable    : PropTypes.bool,
        setValue      : PropTypes.func.isRequired,
        options       : PropTypes.oneOf([ 'rgb', 'hsv' ]).isRequired,
        value         : PropTypes.string.isRequired,
        isProcessing  : PropTypes.bool,
        isError       : PropTypes.bool,
        onErrorRemove : PropTypes.func.isRequired
    }

    static defaultProps = {
        floatRight   : false,
        isSettable   : false,
        isProcessing : false,
        isError      : false
    }

    state = {
        processingTimeout : null,
        isOpen            : false,
        isProcessing      : false,
        isChanged         : false
    }

    componentDidUpdate(prevProps) {
        this.handleProcessing(prevProps);
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

    handleChange = value => {
        this.setState({ isChanged: true });

        this.debouncedOnChange(value);
    }

    handleProcessing = (prevProps) => {
        const { isProcessing, isError } = this.props;
        const prevIsProcessing = prevProps.isProcessing;

        const processing = isProcessing && !prevIsProcessing;
        const processed = prevIsProcessing && !isProcessing;

        if (processing) {
            const timeout = setTimeout(() => this.setState({ isProcessing: true }), 1000);

            this.setState({ processingTimeout: timeout });
        }

        if (processed || isError) {
            this.clearTimeout();
            this.setState({
                isProcessing      : false,
                isChanged         : false,
                processingTimeout : null
            });
        }

        if (processed && !isError) {
            this.closePicker();
        }
    }

    handlePopupToggle = isOpen => {
        if (!isOpen) {
            this.clearTimeout();
        }

        this.setState({ isOpen });
    }

    onChange = value => {
        const { setValue, onErrorRemove } = this.props;

        this.clearTimeout();

        onErrorRemove();

        setValue({ value });
    }

    debouncedOnChange = debounce(300, value => this.onChange(value))

    clearTimeout = () => {
        const {  processingTimeout } = this.state;

        clearTimeout(processingTimeout);
    }

    closePicker = () => {
        if (this.colorPicker) {
            this.colorPicker.closePicker();
        }
    }

    render() {
        const { value, options, isSettable, floatRight, isProcessing: propIsProcessing } = this.props;
        const { isOpen, isProcessing, isChanged } = this.state;

        const controlClasses = cn('ColorControl', {
            right : floatRight
        });

        return (
            <div className={controlClasses}>
                <ColorPicker
                    ref={el => this.colorPicker = el}
                    type={options}
                    value={value}
                    readOnly={!isSettable || propIsProcessing || isChanged}
                    onChange={this.handleChange}
                    onPopupToggle={this.handlePopupToggle}
                    floatRight={floatRight}
                    isProcessing={isProcessing && isOpen}
                />
            </div>
        );
    }
}

export default connect(null, { ...HomieActions, ...InterfaceActions })(ColorControl);
