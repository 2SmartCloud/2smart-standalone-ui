import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import PropTypes from 'prop-types';
import Theme from '../../../utils/theme';
import Icon from '../Icon';
import SearchIcon from '../../base/icons/Search';

import gracefulDecrement from '../../../utils/gracefulDecrement';
import gracefulIncrement from '../../../utils/gracefulIncrement';

import styles from './Base.less';

const cn = classnames.bind(styles);

class BaseInput extends PureComponent {
    static contextType = Theme; //eslint-disable-line

    state = {
        inputHover : false
    }

    interval = null
    intervalPeriod = 250

    componentDidMount() {
        const len = this.props.value ? this.props.value.length : 0;
        const { maximumHarcodingIOS } = this.props;

        // eslint-disable-next-line no-unused-expressions

        if (maximumHarcodingIOS) {
            setTimeout(() => this.input && this.input.blur(), 0);
        } else {
            this.input.setSelectionRange && this.input.setSelectionRange(len, len); //eslint-disable-line
        }
    }
    handleBlur=() => {
        this.input.blur();
    }
    handleChange = (e) => {
        const { target : { value } } = e;

        this.props.onChange(value);
    }

    handleArrowUpClick = () => {
        const { value, onChange } = this.props;

        onChange(this.incrementValue(value));
    }

    handleArrowDownClick = () => {
        const { value, onChange } = this.props;

        onChange(this.decrementValue(value));
    }

    handleMouseUp = () => {
        this.clearSetValueInterval();
        this.input.focus();
    }

    handleMouseLeave = () => {
        this.clearSetValueInterval();
    }

    handleTouchEnd = () => {
        this.clearSetValueInterval();
        this.input.focus();
    }

    handleMouseDown = direction => {
        this.createSetValueInterval(direction);
    }

    handleTouchStart = direction => {
        this.createSetValueInterval(direction);
    }

    handleKeyDown = (e) => {
        const { type } = this.props;

        if (type === 'tel') {
            const { onChange, value } = this.props;
            const ARROW_UP_CODE = 38;
            const ARROW_DOWN_CODE = 40;
            const code = e.which;
            let nextValue = value;

            if (code === ARROW_UP_CODE) {
                nextValue = this.incrementValue(nextValue);
            } else if (code === ARROW_DOWN_CODE) {
                nextValue = this.decrementValue(nextValue);
            }

            onChange(nextValue);
        }

        return;
    }

    handleFocus = () => {
        this.props.onFocus();
    }

    handleClear = () => {
        this.props.onChange('');
        this.handleToggleInputHover(false);
    }

    handleToggleInputHover = next => {
        this.setState(prevState => ({ inputHover: typeof next === 'boolean' ? next : !prevState.inputHover }));
    }

    clearSetValueInterval = () => {
        clearInterval(this.interval);
    }

    createSetValueInterval = (direction) => {
        const { value, onChange } = this.props;

        let nextValue = value;

        this.interval = setInterval(() => {
            if (direction === 'up') {
                nextValue = this.incrementValue(nextValue);
            } else if (direction === 'down') {
                nextValue = this.decrementValue(nextValue);
            }
            onChange(nextValue);
        }, this.intervalPeriod);
    }

    incrementValue = (value = '0') => {
        return Number.isInteger(+value) ? +value + 1 : gracefulIncrement(value);
    }

    decrementValue = (value = '0') => {
        return Number.isInteger(+value) ? +value - 1 : gracefulDecrement(value);
    }

    renderSearchIcon = () => {
        const { value, searchIconClassName } = this.props;

        const filled = value && value.length;
        const searchIconCN = cn('searchIconWrapper', {
            [searchIconClassName] : searchIconClassName,
            filled
        });

        if (filled) {
            return (
                <div
                    className={searchIconCN}
                    onClick={this.handleClear}
                    onMouseEnter={this.handleToggleInputHover}
                    onMouseLeave={this.handleToggleInputHover}
                >
                    <Icon type='search-close' />
                </div>
            );
        }

        return (
            <div className={searchIconCN}>
                <SearchIcon />
            </div>
        );
    }

    render() {
        const {
            value,
            type,
            autoFocus,
            pattern,
            withArrows,
            maxLength,
            transparent,
            isInvalid,
            id,
            className,
            inputClassName,
            isDisabled,
            placeholder,
            search,
            darkThemeSupport,
            onBlur
        } = this.props;
        const { inputHover } = this.state;

        const { theme } = this.context;
        const BaseInputCN = cn('BaseInput',
            { withArrows,
                transparent,
                invalid     : isInvalid,
                [className] : className,
                disabled    : isDisabled,
                search,
                dark        : darkThemeSupport
            });
        const inputCN = cn('input', {
            [inputClassName] : inputClassName,
            hover            : inputHover
        });
        const arrowIconCN = cn('arrowIcon', { dark: theme === 'DARK' });

        return (
            <div className={BaseInputCN}>
                <input
                    value={value}
                    type={type}
                    pattern={pattern}
                    onChange={this.handleChange}
                    className={inputCN}
                    disabled={isDisabled}
                    step={1}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    onFocus={this.handleFocus}
                    onBlur={onBlur}
                    maxLength={maxLength}
                    onKeyDown={this.handleKeyDown}
                    ref={node => this.input = node}
                    id={id}
                    autoComplete='off'
                    data-lpignore='true'
                />
                {
                    search
                        ? this.renderSearchIcon()
                        : null
                }
                {
                    withArrows ?
                        <div className={styles.arrowsContainer}>
                            <div
                                className={styles.arrowUp}
                                onClick={this.handleArrowUpClick}
                                onMouseDown={this.handleMouseDown.bind(this, 'up')}
                                onMouseUp={this.handleMouseUp}
                                onMouseLeave={this.handleMouseLeave}
                                onTouchStart={this.handleTouchStart.bind(this, 'up')}
                                onTouchEnd={this.handleTouchEnd}
                            >
                                <div className={arrowIconCN} />
                            </div>
                            <div
                                className={styles.arrowDown}
                                onClick={this.handleArrowDownClick}
                                onMouseDown={this.handleMouseDown.bind(this, 'down')}
                                onMouseUp={this.handleMouseUp}
                                onMouseLeave={this.handleMouseLeave}
                                onTouchStart={this.handleTouchStart.bind(this, 'down')}
                                onTouchEnd={this.handleTouchEnd}
                            >
                                <div className={arrowIconCN}  />
                            </div>
                        </div> :
                        true
                }
            </div>
        );
    }
}

BaseInput.propTypes = {
    value               : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    type                : PropTypes.oneOf([ 'number', 'text', 'tel', 'password' ]).isRequired,
    onChange            : PropTypes.func,
    onBlur              : PropTypes.func,
    autoFocus           : PropTypes.bool,
    pattern             : PropTypes.string,
    withArrows          : PropTypes.bool,
    maxLength           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    transparent         : PropTypes.bool,
    isInvalid           : PropTypes.bool,
    id                  : PropTypes.string,
    className           : PropTypes.string,
    inputClassName      : PropTypes.string,
    searchIconClassName : PropTypes.string,
    isDisabled          : PropTypes.bool,
    placeholder         : PropTypes.string,
    onFocus             : PropTypes.func,
    search              : PropTypes.bool,
    darkThemeSupport    : PropTypes.bool,
    maximumHarcodingIOS : PropTypes.bool
};

BaseInput.defaultProps = {
    value               : '',
    onChange            : () => {},
    onBlur              : undefined,
    autoFocus           : false,
    pattern             : null,
    withArrows          : false,
    maxLength           : '',
    transparent         : false,
    isInvalid           : false,
    id                  : undefined,
    className           : '',
    inputClassName      : '',
    searchIconClassName : '',
    isDisabled          : false,
    placeholder         : '',
    onFocus             : () => {},
    search              : false,
    darkThemeSupport    : false,
    maximumHarcodingIOS : false
};

export default BaseInput;
