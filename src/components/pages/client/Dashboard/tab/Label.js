import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Label.less';

class Label extends PureComponent {
    render() {
        const { label } = this.props;

        return (
            <div className={styles.Label}>{label}</div>
        );
    }
}

Label.propTypes = {
    label : PropTypes.string.isRequired
};

export default Label;
