import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Tooltip }              from '@material-ui/core';
import Icon                     from '../../../../base/Icon';
import LogLevelDot              from './LogLevelDot';
import styles                   from './LogsListRow.less';

const cx = classnames.bind(styles);

class LogsListRow extends PureComponent {
    static propTypes = {
        item : PropTypes.shape({
            container   : PropTypes.string,
            message     : PropTypes.string,
            time        : PropTypes.string,
            timePrecise : PropTypes.string,
            level       : PropTypes.oneOf([ 'error', 'warning', 'info' ])
        }).isRequired,
        rowClasses  : PropTypes.string,
        cellClasses : PropTypes.string
    }

    static defaultProps = {
        rowClasses  : undefined,
        cellClasses : undefined
    }

    state = {
        expanded : false
    }

    handleRowClick = () => this.setState(prevState => ({ expanded: !prevState.expanded }))

    renderRow() {
        const {
            item : { container, message, time, timePrecise, level },
            rowClasses,
            cellClasses
        } = this.props;
        const { expanded } = this.state;

        const arrowTooltip = expanded ? 'Collapse message' : 'Expand message';

        return (
            <div className={cx('row', rowClasses)} onClick={this.handleRowClick}>
                <div className={cx(cellClasses, 'logLevel')}>
                    <LogLevelDot level={level} />
                </div>
                <Tooltip title={container} interactive classes={{ tooltip: styles.tooltip }}>
                    <div className={cx(cellClasses, 'containerName')}>
                        {container}
                    </div>
                </Tooltip>
                <div className={cx(cellClasses, 'message')}>
                    {message}
                </div>
                <Tooltip title={timePrecise}>
                    <div className={cx(cellClasses, 'time')}>
                        {time}
                    </div>
                </Tooltip>
                <Tooltip title={arrowTooltip}>
                    <div className={cx(cellClasses, { expanded })}>
                        <Icon type='arrow-down' />
                    </div>
                </Tooltip>
            </div>
        );
    }

    renderCollapsible() {
        const { item: { message } } = this.props;
        const { expanded } = this.state;

        if (!expanded) return null;

        return (
            <div className={cx('collapsible', 'mono')}>
                {message}
            </div>
        );
    }

    render() {
        return (
            <div className={styles.LogsListRow}>
                {this.renderRow()}
                {this.renderCollapsible()}
            </div>
        );
    }
}

export default LogsListRow;
