import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Base.less';

class BaseTab extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div className={styles.BaseTab}>
                {children}
            </div>
        );
    }
}

BaseTab.propTypes = {
    children : PropTypes.node.isRequired
};

export default BaseTab;
