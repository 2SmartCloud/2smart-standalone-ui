import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames/bind';
import { debounce } from 'throttle-debounce';
import { SizeMe } from 'react-sizeme';

import Theme, { THEMES } from '../../../utils/theme';
import ColorWheel from '../../base/ColorWheel.js';

import styles from './ColorWidget.less';


const cn = classnames.bind(styles);

class ColorWidget extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    static propTypes = {
        value        : PropTypes.string,
        format       : PropTypes.oneOf([ 'rgb', 'hsv' ]).isRequired,
        bgColor      : PropTypes.string.isRequired,
        isEditMode   : PropTypes.bool,
        isLocked     : PropTypes.bool,
        isProcessing : PropTypes.bool,
        onSetValue   : PropTypes.func.isRequired
    }

    static defaultProps = {
        value        : '',
        isEditMode   : false,
        isLocked     : false,
        isProcessing : false
    }

    onChange = value => {
        const { onSetValue } = this.props;

        onSetValue(value);
    }

    debouncedOnChange = debounce(200, this.onChange)

    setValue = value => {
        const { format } = this.props;

        this.colorWheel.setValue(format, value);
    }

    renderWheel = ({ size: { width, height } }) => {
        const {
            format,
            value,
            bgColor,
            isEditMode,
            isProcessing,
            isLocked
        } = this.props;

        const { theme } = this.context;

        const wrapperClasses = cn('wrapper', { editMode: isEditMode });
        const borderColor = THEMES[theme]['--border_color_select'];
        const disabled = isEditMode || isProcessing;
        const isNotClickable = disabled || isLocked;
        const type = format || 'rgb';

        return (
            <div className={wrapperClasses}>
                <ColorWheel
                    ref={el => this.colorWheel = el}
                    value={value}
                    type={type}
                    onChange={this.debouncedOnChange} // eslint-disable-line
                    width={width}
                    height={height}
                    disabled={disabled}
                    isNotClickable={isNotClickable}
                    isProcessing={isProcessing}
                    backgroundColor={bgColor}
                    borderColor={borderColor}
                />
            </div>
        );
    }

    render() {
        return (
            <SizeMe monitorHeight>
                {this.renderWheel}
            </SizeMe>
        );
    }
}

export default ColorWidget;
