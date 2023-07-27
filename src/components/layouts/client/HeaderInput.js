import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Done } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import CriticalValue from '../../base/CriticalValue';

import styles from './HeaderInput.less';

const cn = classnames.bind(styles);

class HeaderInput extends PureComponent {
    state = {
        value : null
    }

    componentDidMount() {
        this.setState({ value: this.props.defaultValue });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) this.setState({ value: nextProps.defaultValue });

        const value = this.state.value && this.state.value.trim();

        if (!nextProps.isActive && !value) this.setState({ value: null });
    }

    componentDidUpdate(prevProps) {
        const { isActive } = this.props;

        if (prevProps.isActive !== isActive && isActive) {
            const len = prevProps.defaultValue ? prevProps.defaultValue.length : 0;

            this.props.inputRef.current.value = prevProps.defaultValue ? prevProps.defaultValue : '';
            this.props.inputRef.current.setSelectionRange(len, len);
        }
    }

    handleInput = e => {
        const { value } = e.target;

        if (value.length > 25) return;

        this.setState({ value });
    }

    handleKeyDown = e => {
        if (e.key === 'Enter') this.props.onSave();
        if (e.key === 'Escape') this.props.onBlur();
    }

    handleSubmit = e => {
        const { onSave } = this.props;

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        onSave();
    }

    render() {
        const { value } = this.state;
        const { defaultValue, style, isDisabled, isFetching, isActive, onBlur, onFocus, inputRef } = this.props;
        const btnWrapperCN = cn('btnWrapper', { active: isActive });
        const labelCN = cn('label', { disabled: isDisabled });
        const inputVal = value === null ? defaultValue : value;

        return (
            <div className={styles.InputContainer}>
                {
                    isActive ?
                        <input
                            className={styles.input}
                            value={inputVal}
                            style={style}
                            onChange={this.handleInput}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            onKeyDown={this.handleKeyDown}
                            ref={inputRef}
                            autoFocus
                        />
                        : <div className={labelCN} onClick={onFocus}>
                            <CriticalValue value={defaultValue} maxWidth='100%' />
                        </div>

                }
                <div className={btnWrapperCN}>
                    {
                        isFetching ?
                            <div className={styles.progressWrapper}>
                                <CircularProgress size={20} thickness={6} color='inherit' />
                            </div> :
                            <button className={styles.submit} onMouseDown={this.handleSubmit}>
                                <Done />
                            </button>
                    }
                </div>
            </div>
        );
    }
}

HeaderInput.propTypes = {
    defaultValue : PropTypes.string,
    style        : PropTypes.object,
    isDisabled   : PropTypes.bool,
    isFetching   : PropTypes.bool,
    onBlur       : PropTypes.func,
    onFocus      : PropTypes.func,
    onSave       : PropTypes.func,
    isActive     : PropTypes.bool,
    inputRef     : PropTypes.any.isRequired
};

HeaderInput.defaultProps = {
    defaultValue : '',
    style        : {},
    isActive     : false,
    isDisabled   : false,
    isFetching   : false,
    onSave       : () => {},
    onBlur       : () => {},
    onFocus      : () => {}
};

export default HeaderInput;
