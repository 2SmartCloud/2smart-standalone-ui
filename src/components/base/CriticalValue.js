import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import classnames from 'classnames/bind';

import styles from './CriticalValue.less';

const cn = classnames.bind(styles);

class CriticalValue extends PureComponent {
    state = {
        isOverflowed : false,
        isOpen       : false
    }

    handleTooltipClose = () => {
        this.setState({
            isOpen : false
        });
    }

    handleTooltipOpen = () => {
        const isOverflowed = this.detectOverflow();

        this.setState({
            isOpen : true && isOverflowed
        });
    }

    detectOverflow = () => {
        const { scrollWidth, clientWidth } = this.content;
        const isOverflowed = scrollWidth > clientWidth;

        return isOverflowed;
    }

    isValueIncludesSpaces() {
        const { value } = this.props;

        return !!value.trim().includes(' ');
    }


    render() {
        const {
            value, maxWidth, className, fontWeight, isBreakingValue, hideTooltip,
            interactive
        } = this.props;
        const { isOpen } = this.state;
        const breakValue = isBreakingValue && this.isValueIncludesSpaces() ? 'breakValue' : '';
        const CriticalValueCN = cn('CriticalValue', className, breakValue);
        const tooltipCN = cn('tooltip', { hide: hideTooltip });

        return (
            <div className={CriticalValueCN} style={{ maxWidth }}>
                <Tooltip
                    title={value}
                    onOpen={this.handleTooltipOpen}
                    onClose={this.handleTooltipClose}
                    open={isOpen}
                    interactive={interactive}
                    classes={{
                        tooltip : tooltipCN
                    }}
                >
                    <div className={styles.valueWrapper} style={{ fontWeight: fontWeight || '' }} ref={node => this.content = node}>
                        {value}
                    </div>
                </Tooltip>
            </div>
        );
    }
}

CriticalValue.propTypes = {
    value           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxWidth        : PropTypes.string,
    className       : PropTypes.string,
    fontWeight      : PropTypes.string,
    isBreakingValue : PropTypes.bool,
    hideTooltip     : PropTypes.bool,
    interactive     : PropTypes.bool
};

CriticalValue.defaultProps = {
    value           : '—',
    maxWidth        : undefined,
    className       : null,
    isBreakingValue : false,
    hideTooltip     : false,
    fontWeight      : null,
    interactive     : true
};

export default CriticalValue;
