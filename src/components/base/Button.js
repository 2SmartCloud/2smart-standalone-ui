import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { PulseLoader }          from 'react-spinners';
import Theme                    from '../../utils/theme';
import styles                   from './Button.less';

const cn = classnames.bind(styles);

class Button extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    render() {
        const {
            text, style, onClick, isFetching, isDisabled, type, autoFocus,
            setRef, className, children, isNegative, color
        } = this.props;
        const { theme } = this.context;
        const ButtonCN = cn('Button', {
            negative    : isNegative,
            [className] : className,
            [color]     : color,
            [theme]     : theme
        });

        return (
            <button
                type      = {type}
                tabIndex  = '1'
                className = {ButtonCN}
                style     = {style}
                onClick   = {onClick}
                disabled  = {isDisabled || isFetching}
                autoFocus = {autoFocus}
                ref       = {setRef}
            >
                {
                    isFetching ?
                        <PulseLoader
                            color    = '#fff'
                            size     = {9}
                            sizeUnit = 'px'
                            loading  = {isFetching}
                        /> :
                        children || text
                }
            </button>
        );
    }
}

Button.propTypes = {
    text       : PropTypes.string,
    style      : PropTypes.object,
    onClick    : PropTypes.func,
    color      : PropTypes.oneOf([ 'action', '' ]),
    isFetching : PropTypes.bool,
    isDisabled : PropTypes.bool,
    type       : PropTypes.string,
    autoFocus  : PropTypes.bool,
    setRef     : PropTypes.func,
    className  : PropTypes.string,
    children   : PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
    isNegative : PropTypes.bool
};

Button.defaultProps = {
    text       : undefined,
    style      : {},
    color      : '',
    onClick    : () => {},
    isFetching : false,
    isDisabled : false,
    type       : '',
    autoFocus  : false,
    setRef     : () => {},
    className  : '',
    children   : null,
    isNegative : false
};

export default Button;
