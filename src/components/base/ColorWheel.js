/* eslint-disable more/no-duplicated-chains */

import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames/bind';
import fillColorWheel from '@radial-color-picker/color-wheel';
import Rotator from '@radial-color-picker/rotator';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import { convertColor, formatColor } from '../../utils/color';

import styles from './ColorWheel.less';

const cn = classnames.bind(styles);
const MAX_SIZE = 360;

const initialState = {
    isDragging : false,
    color      : {
        rgb : {},
        hsv : { h: 0, s: 1, v: 100 },
        hex : ''
    }
};

const SaturationSlider = withStyles({
    root : {
        display      : 'block',
        height       : 6,
        padding      : 0,
        borderRadius : 4
    },
    rail : {
        height       : 6,
        background   : props => `linear-gradient(to right, #FFF, hsl(${props.hue},100%,50%))`,
        opacity      : 1,
        borderRadius : 4
    },
    track : {
        height          : 6,
        backgroundColor : 'transparent'
    },
    thumb : {
        margin          : ' 0 0 0 -7% !important',
        width           : '14% !important',
        paddingTop      : '14%  !important',
        boxSizing       : 'content-box',
        transform       : 'translateY(calc(-50% + 3px))',
        height          : '0 !important',
        backgroundColor : '#FFF',
        border          : '1px solid var(--color_picker_knob_border)',
        '&:hover'       : {
            boxShadow : 'none'
        }
    },
    focusVisible : {
        boxShadow : 'none !important'
    },
    active : {
        boxShadow : '0 0 0 4px var(--color_picker_knob_shadow) !important'
    }
})(Slider);

class ColorWheel extends PureComponent {
    static propTypes = {
        wheelValue      : PropTypes.number,
        value           : PropTypes.string,
        type            : PropTypes.oneOf([ 'rgb', 'hsv', 'hex' ]),
        step            : PropTypes.number,
        mouseScroll     : PropTypes.bool,
        disabled        : PropTypes.bool,
        isProcessing    : PropTypes.bool,
        onChange        : PropTypes.func,
        separator       : PropTypes.string,
        width           : PropTypes.number,
        height          : PropTypes.number,
        backgroundColor : PropTypes.string,
        borderColor     : PropTypes.string,
        isNotClickable  : PropTypes.bool
    }

    static defaultProps = {
        wheelValue      : 100,
        value           : '',
        type            : 'rgb',
        step            : 2,
        mouseScroll     : false,
        disabled        : false,
        isProcessing    : false,
        onChange        : undefined,
        separator       : ',',
        width           : 0,
        height          : 0,
        backgroundColor : '#FFF',
        borderColor     : '#FFF',
        isNotClickable  : false
    }

    constructor(props) {
        super(props);

        this.paletteRef = React.createRef();
        this.rotatorRef = React.createRef();
        this.elRef = React.createRef();

        this.rotator = null;

        this.state = JSON.parse(JSON.stringify(initialState));
    }

    componentDidMount() {
        const { value, type, mouseScroll } = this.props;

        const mappedColor = this.mapColorToState(type, value);

        if (mouseScroll) {
            this.rotatorRef.current.addEventListener('wheel', this.onScroll);
        }

        const isConicGradientSupported = getComputedStyle(this.paletteRef.current)
            .backgroundImage
            .includes('conic');

        if (!isConicGradientSupported) {
            fillColorWheel(
                this.paletteRef.current.firstElementChild,
                this.getWheelDiameter()
            );
        }

        this.rotator = new Rotator(this.rotatorRef.current, {
            angle       : mappedColor.hsv.h,
            onRotate    : this.updateHue,
            onDragStart : () => {
                this.setState({ isDragging: true });
            },
            onDragStop : () => {
                this.setState({ isDragging: false });
            }
        });
    }

    componentDidUpdate(prevProps) {
        const { width, height, value, type } = this.props;

        if (prevProps.width !== width || prevProps.height !== height) {
            const isConicGradientSupported = getComputedStyle(this.paletteRef.current)
                .backgroundImage
                .includes('conic');

            if (!isConicGradientSupported) {
                fillColorWheel(
                    this.paletteRef.current.firstElementChild,
                    this.getWheelDiameter()
                );
            }
        }

        if (prevProps.value !== value || prevProps.type !== type) {
            this.setValue(type, value);
        }
    }

    componentWillUnmount() {
        if (this.rotator) {
            this.rotator.destroy();
            this.rotator = null;
        }

        if (this.props.mouseScroll) {
            this.rotatorRef.current.removeEventListener('wheel', this.onScroll);
        }
    }

    handleKeyDown = e => {
        const { isNotClickable, step } = this.props;

        const isIncrementing = e.key === 'ArrowUp' || e.key === 'ArrowRight';
        const isDecrementing = e.key === 'ArrowDown' || e.key === 'ArrowLeft';

        if (isIncrementing || isDecrementing) {
            let multiplier = isIncrementing ? 1 : -1;

            e.preventDefault();

            if (isNotClickable) return;
            if (e.ctrlKey) {
                multiplier *= 6;
            } else if (e.shiftKey) {
                multiplier *= 3;
            }

            this.rotator.angle += step * multiplier;
            this.updateHue(this.rotator.angle);
        }
    };

    handleRotateToMouse = e => {
        if (e.target !== this.rotatorRef.current) return;

        this.rotator.setAngleFromEvent(e);
    };

    handleSaturationChange = (e, saturation) => {
        this.updateSaturation(saturation);
    }

    handleSaturationCommit = (e, saturation) => {
        this.commitSaturation(saturation);
    }

    getWheelDiameter = () => {
        const { width, height } = this.props;

        // if (width / height <= 1.15) {
        //     return height;
        // }

        const result = height / width <= 1.15
            ? height / 1.15
            : width;

        return Math.min(result, MAX_SIZE);
    }

    setValue = (type, value) => {
        const mappedColor = this.mapColorToState(type, value);

        this.rotator.angle = mappedColor.hsv.h;
    }

    onScroll = e => {
        const { step } = this.props;

        e.preventDefault();

        if (e.deltaY > 0) {
            this.rotator.angle += step;
        } else {
            this.rotator.angle -= step;
        }

        this.updateHue(this.rotator.angle);
    };

    mapColorToState = (type, value) => {
        let mappedColor = convertColor(type, value, this.props.separator);

        if (!mappedColor) {
            mappedColor = JSON.parse(JSON.stringify(initialState.color));
        }

        this.setState({
            color : mappedColor
        });

        return mappedColor;
    }

    updateHue = hue => {
        const { wheelValue } = this.props;
        const { hsv } = this.state.color;

        const mappedColor = this.mapColorToState('hsv', [ hue, hsv.s * 100, wheelValue ]);

        this.submitColor(mappedColor);
    };

    updateSaturation = saturation => {
        const { wheelValue } = this.props;
        const { hsv } = this.state.color;

        return this.mapColorToState('hsv', [ hsv.h, saturation, wheelValue ]);
    }

    commitSaturation = saturation => {
        const mappedColor = this.updateSaturation(saturation);

        this.submitColor(mappedColor);
    }

    submitColor = (color = this.state.color) => {
        const { type, separator, onChange } = this.props;

        const changes = formatColor(type, color, separator);

        if (onChange && changes !== this.props.value) onChange(changes);
    }

    render() {
        const { disabled, isNotClickable, isProcessing, backgroundColor, borderColor } = this.props;
        const { color, isDragging } = this.state;

        const rcpClasses = cn('rcp', { dragging: isDragging, disabled });
        const paletteBgStyles = {
            backgroundColor
        };
        const saturationCoverStyles = {
            backgroundColor : color.hsv ? `rgba(255,255,255,${1 - color.hsv.s})` : 'none'
        };
        const wellColor = color.hex ? color.hex : backgroundColor;
        const wellStyles = {
            backgroundColor : disabled ? '#bdbdbd' : wellColor,
            borderColor
        };

        const diameter = this.getWheelDiameter();

        return (
            <div className={cn('Wheel')} style={{ width: diameter }}>
                <div className={cn('wheel-wrapper')} style={{ width: diameter, height: diameter }}>
                    <div
                        ref={this.elRef}
                        className={rcpClasses}
                        tabIndex={isNotClickable ? -1 : 0}
                        onKeyDown={this.handleKeyDown}
                    >
                        <div ref={this.paletteRef} className={cn('rcp__palette', { disabled })}>
                            <canvas />
                            <div className={cn('rcp__palette__saturation-cover')} style={saturationCoverStyles} />
                            <div className={cn('rcp__palette__bg')} style={paletteBgStyles} />
                        </div>
                        <div
                            ref={this.rotatorRef}
                            className={cn('rcp__rotator')}
                            style={{ pointerEvents: isNotClickable ? 'none' : null }}
                            onMouseDown={this.handleRotateToMouse}
                        >
                            <div className={cn('rcp__knob')} />
                        </div>
                        <button
                            type='button'
                            className={cn('rcp__well')}
                            style={wellStyles}
                        />
                        {
                            isProcessing ?
                                <div className={cn('progress-wrapper')}>
                                    <CircularProgress size='30%' thickness={2} color='inherit' />
                                </div>
                                : null
                        }
                    </div>
                </div>
                <div className={cn('saturation', { disabled, isNotClickable })}>
                    <SaturationSlider
                        value={color.hsv.s * 100}
                        onChange={this.handleSaturationChange}
                        onChangeCommitted={this.handleSaturationCommit}
                        hue={color.hsv.h}
                        disabled={isNotClickable}
                        classes={{
                            rail : styles.rail
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default ColorWheel;
