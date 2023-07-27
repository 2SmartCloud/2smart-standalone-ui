import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import Color from '../etc/Color';
import styles from './ColorSingleValue';

class ColorSingleValue extends PureComponent {
    render() {
        const { data : { color } } = this.props;

        return (
            <components.SingleValue {...this.props}>
                <div className={styles.ColorSingleValue} style={{ width: '100%', height: '15px' }}>
                    <Color color={color} />
                </div>
            </components.SingleValue>
        );
    }
}

ColorSingleValue.propTypes = {
    data : PropTypes.object.isRequired
};

export default ColorSingleValue;
