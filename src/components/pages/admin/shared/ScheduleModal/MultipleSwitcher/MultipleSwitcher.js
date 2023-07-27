import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import SwitchTab from '../SwitchTab';

import styles from './MultipleSwitcher.less';

const cn = classnames.bind(styles);

class MultipleSwitcher extends PureComponent {
    static propTypes = {
        single     : PropTypes.string,
        multiple   : PropTypes.string,
        align      : PropTypes.string,
        isMultiple : PropTypes.bool,
        onChange   : PropTypes.func,
        className  : PropTypes.string,
        type       : PropTypes.string
    }

    static defaultProps = {
        single     : '',
        multiple   : '',
        align      : 'horizontal',
        className  : '',
        type       : 'button',
        isMultiple : false,
        onChange   : undefined
    }

    handleClickFirstTab = () => {
        const { onChange, isMultiple } = this.props;

        if (!isMultiple) return;
        onChange(false);
    }

    handleClickSecondTab = () => {
        const { onChange, isMultiple } = this.props;

        if (isMultiple) return;
        onChange(true);
    }

    render() {
        const { multiple, single, isMultiple, className, align, type } = this.props;
        const MultipleSwitcherCN = cn(styles.MultipleSwitcher, {
            horizontal : align === 'horizontal'
        });
        const isVertical = align === 'vertical';

        return (
            <div className={MultipleSwitcherCN}>
                <SwitchTab
                    isActive={!isMultiple}
                    isVertical={isVertical}
                    onClick={this.handleClickFirstTab}
                    className={className}
                    type={type}
                >
                    {single}
                </SwitchTab>
                <SwitchTab
                    isActive={isMultiple}
                    isVertical={isVertical}
                    onClick={this.handleClickSecondTab}
                    className={className}
                    type={type}
                >
                    {multiple}
                </SwitchTab>
            </div>
        );
    }
}

export default MultipleSwitcher;
