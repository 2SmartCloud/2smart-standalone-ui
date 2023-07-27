import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Link.less';

class BaseLink extends PureComponent {
    render() {
        const { to, children, onClick } = this.props;

        return (
            <Link to={to} className={styles.BaseLink} onClick={onClick}>
                {children}
            </Link>
        );
    }
}

BaseLink.propTypes = {
    to       : PropTypes.string.isRequired,
    children : PropTypes.element,
    onClick  : PropTypes.func
};

BaseLink.defaultProps = {
    children : null,
    onClick  : () => {}
};

export default BaseLink;
