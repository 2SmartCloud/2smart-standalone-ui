import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Color from '../etc/Color';
import BaseOption from './BaseOption';
import styles from './ColorOption.less';

class ColorOption extends PureComponent {
    render() {
        const { data: { color } } = this.props;

        return (
            <BaseOption {...this.props}>
                {
                    <div className={styles.ColorOption}>
                        <Color color={color} />
                    </div>
                }
            </BaseOption>
        );
    }
}

ColorOption.propTypes = {
    value : PropTypes.string.isRequired,
    data  : PropTypes.shape({
        value : PropTypes.string.isRequired,
        color : PropTypes.string.isRequired
    }).isRequired
};

export default ColorOption;
