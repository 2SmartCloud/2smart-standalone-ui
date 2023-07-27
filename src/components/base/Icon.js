import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles from './Icon.less';

const cx = classnames.bind(styles);

class Icon extends PureComponent {
    static propTypes = {
        type      : PropTypes.string.isRequired,
        className : PropTypes.string,
        onClick   : PropTypes.func
    }

    handleClick = () => {
        const { onClick } = this.props;

        if (onClick) onClick();
    }

    render() {
        const { type, className, onClick } = this.props;

        const classes = cx({
            Icon        : true,
            [type]      : true,
            clickable   : onClick,
            [className] : className
        });

        return (
            <i className={classes} onClick={this.handleClick} />
        );
    }
}

Icon.propTypes = {
    type      : PropTypes.string.isRequired,
    className : PropTypes.string,
    onClick   : PropTypes.func
};

Icon.defaultProps = {
    className : null,
    onClick   : null
};

export default Icon;
