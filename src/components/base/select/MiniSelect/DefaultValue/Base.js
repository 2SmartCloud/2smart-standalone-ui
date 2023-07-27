import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Base.less';

class BaseDefaultValue extends PureComponent {
    render() {
        return (
            <div className={styles.BaseDefaultValue}>
                {this.props.children}
            </div>
        );
    }
}

BaseDefaultValue.propTypes = {
    children : PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

export default BaseDefaultValue;
