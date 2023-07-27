import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { PropTypes } from 'prop-types';
import classnames from 'classnames/bind';
import CircularProgress from '@material-ui/core/CircularProgress';
import { throttle } from 'throttle-debounce';
import { convertColor, formatColor } from '../../../utils/color';
import globalEscHandler  from '../../../utils/globalEscHandler';

import ColorPickerPopup from './ColorPickerPopup.js';

import styles from './ColorPicker.less';


const cn = classnames.bind(styles);

const popupGap = 5;
const popupWidth = 240;
const popupHeight = 246;

const initialState = {
    isOpen : false,
    color  : {
        rgb : {},
        hsv : {},
        hex : ''
    },
    popupOffset : {}
};

class ColorPicker extends PureComponent {
    static propTypes = {
        type          : PropTypes.oneOf([ 'rgb', 'hsv' ]),
        value         : PropTypes.string,
        onChange      : PropTypes.func.isRequired,
        onPopupToggle : PropTypes.func,
        separator     : PropTypes.string,
        readOnly      : PropTypes.bool,
        floatRight    : PropTypes.bool,
        isProcessing  : PropTypes.bool
    }

    static defaultProps = {
        type          : 'rgb',
        value         : '',
        separator     : ',',
        readOnly      : false,
        floatRight    : false,
        isProcessing  : false,
        onPopupToggle : undefined
    }

    state = { ...initialState }

    componentWillUnmount() {
        window.removeEventListener('resize', this.throttledRecalculatePopupOffset);
        globalEscHandler.unregister(this.closePicker);
    }

    handleTogglePicker = e => {
        const { isOpen } = this.state;

        return isOpen
            ? this.handleClosePicker(e)
            : this.handleOpenPicker(e);
    }

    handleOpenPicker = e => {
        e.stopPropagation();

        const { target } = e;

        this.openPicker(target);
    }

    handleClosePicker = e => {
        e.stopPropagation();

        this.closePicker();
    }

    handleChange = color => {
        this.setState({
            color : {
                ...color,
                hex : color.hex.toUpperCase()
            }
        });
    }

    handleInputChange = value => {
        const hexPattern = /^#?[a-fA-F0-9]{0,6}$/g;

        if (hexPattern.test(value)) {
            this.mapColorToState('hex', value);
        }
    }

    handleKeyDown = (e) => {
        const { key } = e;

        if (key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();

            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        const { type, separator, onChange } = this.props;
        const { color } = this.state;

        const changes = formatColor(type, color, separator);

        onChange(changes);
    }

    getPopupOffset = target => {
        const popupOffset = {};

        if (target) {
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const targetPosition = target.getBoundingClientRect();
            const bottomSpace = viewportHeight - targetPosition.y - targetPosition.height;
            const rightSpace = viewportWidth - targetPosition.x - targetPosition.width;
            const targetTopOffset =  targetPosition.y + window.scrollY;
            const targetLeftOffset = targetPosition.x;

            if (viewportWidth > 500) {
                popupOffset.top = bottomSpace >= popupHeight - targetPosition.height + popupGap * 2
                    ? targetTopOffset
                    : targetTopOffset + targetPosition.height - popupHeight;
                popupOffset.left = rightSpace >= popupWidth + popupGap * 2
                    ? targetLeftOffset + targetPosition.width + popupGap
                    : targetLeftOffset - popupWidth - popupGap;

                if (popupOffset.top <= 0) {
                    popupOffset.top = popupGap;
                }
            } else if (viewportWidth < 500) {
                popupOffset.top = bottomSpace >= popupHeight + popupGap * 2
                    ? targetTopOffset + targetPosition.height + popupGap
                    : targetTopOffset - popupHeight - popupGap;
                //                                    | bypassing eslint bug
                popupOffset.left = viewportWidth / 2 + -popupWidth / 2;
            }
        }

        return popupOffset;
    }

    openPicker = target => {
        const { type, value, readOnly, onPopupToggle } = this.props;

        if (!readOnly) {
            const popupOffset = this.getPopupOffset(target);

            window.addEventListener('resize', this.throttledRecalculatePopupOffset, false);

            this.mapColorToState(type, value);
            this.setState(({
                isOpen : true,
                popupOffset
            }));

            globalEscHandler.register(this.closePicker);
            if (onPopupToggle) onPopupToggle(true);
        }
    }

    closePicker = () => {
        const { onPopupToggle } = this.props;

        window.removeEventListener('resize', this.throttledRecalculatePopupOffset);

        this.setState(initialState);

        globalEscHandler.unregister(this.closePicker);
        if (onPopupToggle) onPopupToggle(false);
    }

    recalculatePopupOffset = () => {
        if (this.pickerBtn) {
            const popupOffset = this.getPopupOffset(this.pickerBtn);

            this.setState({ popupOffset });
        }
    }

    throttledRecalculatePopupOffset = throttle(1000, this.recalculatePopupOffset)

    mapColorToState = (type, value) => {
        const mappedColor = convertColor(type, value, this.props.separator);

        this.setState({
            color : mappedColor
        });
    }

    propagationFix = e => {
        e.stopPropagation();
    }

    renderPicker() {
        const { isProcessing, floatRight, readOnly } = this.props;
        const { color, popupOffset } = this.state;

        const popoverClasses = cn('picker-popover', {
            right : floatRight
        });

        const popoverPosition = {
            top  : popupOffset.top,
            left : popupOffset.left
        };

        const popup = (
            <div
                className={popoverClasses}
                style={popoverPosition}
                onClick={this.propagationFix} // eslint-disable-line
                onKeyDown={this.handleKeyDown}
            >
                <div
                    className={cn('picker-cover')}
                    onClick={this.handleClosePicker}
                    tabIndex={-1}
                />
                <ColorPickerPopup
                    color={color}
                    readOnly={readOnly}
                    isProcessing={isProcessing}
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    onSubmit={this.handleSubmit}
                />
            </div>
        );

        return createPortal(popup, document.body);
    }

    render() {
        const { value, type, separator, readOnly, isProcessing } = this.props;
        const { isOpen } = this.state;

        const buttonClasses = cn('picker-btn', {
            readonly : readOnly,
            active   : isOpen
        });

        const valueColor = convertColor(type, value, separator);

        const btnStyles =  {
            backgroundColor : valueColor ? valueColor.hex : 'transparent'
        };

        return (
            <div className={cn('color-picker')}>
                <div
                    ref={el => this.pickerBtn = el}
                    className={buttonClasses}
                    onClick={this.handleTogglePicker}
                >
                    <span
                        className={cn('picker-btn_color')}
                        style={btnStyles}
                    />
                    {
                        isProcessing ?
                            <div className={cn('loader-wrapper')}>
                                <CircularProgress
                                    size={18} thickness={6} color='inherit'
                                    classes={{
                                        svg : styles.progressSvg
                                    }}
                                />
                            </div> :
                            null
                    }
                </div>
                {
                    isOpen
                        ? this.renderPicker()
                        : null
                }
            </div>
        );
    }
}

export default ColorPicker;
