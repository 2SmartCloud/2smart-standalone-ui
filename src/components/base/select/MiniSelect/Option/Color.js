import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseOption from './Base.js';
import styles from './Color.less';

class ColorOption extends PureComponent {
    render() {
        const { option: { color } } = this.props;

        return (
            <BaseOption {...this.props}>
                <div className={styles.ColorOption} style={{ backgroundColor: color }} />
            </BaseOption>
        );
    }
}

ColorOption.propTypes = {
    option : PropTypes.object.isRequired
};

export default ColorOption;
