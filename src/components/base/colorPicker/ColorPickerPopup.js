import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { CustomPicker } from 'react-color';
import { Hue, Saturation } from 'react-color/lib/components/common';
import tinycolor from 'tinycolor2';
import classnames from 'classnames/bind';
import { Done } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import globalEscHandler from '../../../utils/globalEscHandler';
import StringInput from '../inputs/String.js';

import styles from './ColorPickerPopup.less';


const cn = classnames.bind(styles);

class ColorPickerPopup extends PureComponent {
    static propTypes = {
        color : PropTypes.shape({
            rgb : PropTypes.object,
            hsv : PropTypes.object,
            hex : PropTypes.string
        }),
        readOnly      : PropTypes.bool,
        isProcessing  : PropTypes.bool,
        onInputChange : PropTypes.func.isRequired,
        onSubmit      : PropTypes.func.isRequired
    }

    static defaultProps = {
        color : {
            rgb : {},
            hsv : {},
            hex : ''
        },
        readOnly     : false,
        isProcessing : false
    }

    state = {
        showEditField : false
    }

    componentDidMount() {
        // focusing on popup to prevent keyboard scroll
        this.popup.focus();

        disableBodyScroll(this.popup);
    }

    componentWillUnmount() {
        enableBodyScroll(this.popup);
        clearAllBodyScrollLocks();
        globalEscHandler.unregister(this.handleCloseEdit);
    }

    handleShowEdit = () => {
        this.setState({ showEditField: true });
        globalEscHandler.register(this.handleCloseEdit);
    }

    handleCloseEdit = () => {
        this.setState({ showEditField: false });
        globalEscHandler.unregister(this.handleCloseEdit);
    }

    renderSaturationPointer = () => {
        const { color } = this.props;

        const isLight = tinycolor(color.rgb).isLight();

        const pointerStyles = {
            borderColor : isLight ? '#000' : '#FFF'
        };

        return (
            <div className={cn('picker-pointer-saturation')} style={pointerStyles} />
        );
    }

    renderHuePointer() {
        return (
            <div className={cn('picker-pointer-hue')} />
        );
    }

    renderEdit = () => {
        const { onInputChange, color } = this.props;
        const { showEditField } = this.state;

        return (
            showEditField ?
                <StringInput
                    darkThemeSupport
                    inputClassName={cn('picker-value-input')}
                    value={color.hex || ''}
                    type='text'
                    onChange={onInputChange}
                    onBlur={this.handleCloseEdit}
                    autoFocus
                /> :
                <button className={cn('show-edit-btn')} onClick={this.handleShowEdit}>
                    <span>{color.hex}</span>
                </button>
        );
    }

    renderButton = () => {
        const { isProcessing, readOnly, onSubmit } = this.props;

        return (
            isProcessing ?
                <div className={cn('progress-wrapper')}>
                    <CircularProgress size={20} thickness={6} color='inherit' />
                </div> :
                <button
                    type='submit'
                    className={cn('submit-btn')}
                    disabled={readOnly}
                    onClick={onSubmit}
                >
                    <Done />
                </button>
        );
    }

    render() {
        const { color, readOnly } = this.props;
        const { rgb } = color;

        const previewStyles = {
            backgroundColor : rgb ? `rgb(${rgb.r},${rgb.g},${rgb.b})` : '#000'
        };

        return (
            <div
                className={cn('picker-popup')}
                ref={el => this.popup = el}
                tabIndex={-1}
            >
                <div className={cn('picker-popup_saturation')}>
                    <Saturation
                        {...this.props}
                        pointer={this.renderSaturationPointer}
                    />
                </div>
                <div className={cn('picker-popup_hue')}>
                    <Hue
                        {...this.props}
                        direction='vertical'
                        pointer={this.renderHuePointer}
                    />
                </div>
                <div className={cn('picker-popup_value')}>
                    <div className={cn('picker-color-preview')} style={previewStyles} />
                    {this.renderEdit()}
                    {this.renderButton()}
                </div>
                {
                    readOnly
                        ? <div className={cn('picker-overlay')} />
                        : null
                }
            </div>
        );
    }
}

export default CustomPicker(ColorPickerPopup);
