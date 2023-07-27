import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from './BaseOption';

import styles from './LabelOption.less';

class LabelOption extends PureComponent {
    render() {
        const { label } = this.props;

        return (
            <BaseOption {...this.props}>
                <div className={styles.LabelOption}>{label}</div>
            </BaseOption>
        );
    }
}

LabelOption.propTypes = {
    label : PropTypes.string
};

LabelOption.defaultProps = {
    label : ''
};

export default LabelOption;
