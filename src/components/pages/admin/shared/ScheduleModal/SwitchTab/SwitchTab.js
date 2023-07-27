import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Button from '../../../../../base/Button';

import styles from './SwitchTab.less';

const cn = classnames.bind(styles);

class SwitchTab extends PureComponent {
    static propTypes = {
        type       : PropTypes.string,
        children   : PropTypes.string,
        isActive   : PropTypes.bool,
        isVertical : PropTypes.bool,
        onClick    : PropTypes.func,
        className  : PropTypes.string
    }

    static defaultProps = {
        type       : 'button',
        children   : '',
        className  : '',
        isActive   : false,
        isVertical : false,
        onClick    : undefined
    }

    render() {
        const { children, isActive, onClick, className, isVertical, type } = this.props;
        const ButtonCN = cn(styles.Button, {
            active            : isActive,
            nonActiveVertical : isVertical,
            vertical          : isVertical,
            [className]       : className
        });

        return (
            <Button type={type} className={ButtonCN} onClick={onClick}>
                {children}
            </Button>
        );
    }
}

export default SwitchTab;
