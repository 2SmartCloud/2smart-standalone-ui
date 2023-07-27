import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Row.less';

class Row extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div className={styles.Row}>
                {children}
            </div>
        );
    }
}

Row.propTypes = {
    children : PropTypes.node.isRequired
};

export default Row;
