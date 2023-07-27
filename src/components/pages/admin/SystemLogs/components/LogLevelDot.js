import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import styles                   from './LogLevelDot.less';

const cx = classnames.bind(styles);

const LEVEL_COLORS = {
    error   : 'red',
    warning : 'orange',
    info    : 'blue'
};

class LogLevelDot extends PureComponent {
    static propTypes = {
        level      : PropTypes.string,
        dotClasses : PropTypes.string
    }

    static defaultProps = {
        level      : '',
        dotClasses : undefined
    }

    render() {
        const { level, dotClasses } = this.props;

        const dotColor = LEVEL_COLORS[level];

        if (!dotColor) return null;

        return (
            <div className={cx('LogLevel', dotClasses)}>
                <div className={cx('dot', dotColor)} />
            </div>
        );
    }
}

export default LogLevelDot;
