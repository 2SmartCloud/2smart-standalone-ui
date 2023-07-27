import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import LogLevelDot              from './LogLevelDot';
import styles                   from './LogLevels.less';

const cx = classnames.bind(styles);

const LOG_LEVELS = [
    { value: '', label: 'All' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' }
];

class LogLevels extends PureComponent {
    static propTypes = {
        logLevel         : PropTypes.oneOf([ '', 'error', 'warning', 'info' ]),
        disabled         : PropTypes.bool,
        onChangeLogLevel : PropTypes.func.isRequired
    }

    static defaultProps = {
        logLevel : '',
        disabled : false
    }

    handleChangeLevel = value => {
        const { onChangeLogLevel } = this.props;

        onChangeLogLevel(value);
    }

    render() {
        const { logLevel, disabled } = this.props;

        return (
            <div className={cx('LogLevels', { disabled })}>
                {LOG_LEVELS.map(option => (
                    <div
                        key={option.label}
                        className={cx('level', { active: option.value === logLevel })}
                        onClick={() => this.handleChangeLevel(option.value)}   // eslint-disable-line react/jsx-no-bind
                    >
                        <LogLevelDot level={option.value} dotClasses={styles.levelDot} />
                        {option.label}
                    </div>
                ))}
            </div>
        );
    }
}

export default LogLevels;
