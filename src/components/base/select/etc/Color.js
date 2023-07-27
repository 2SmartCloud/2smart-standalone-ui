import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Color.less';

const cn = classnames.bind(styles);

class Color extends PureComponent {
    render() {
        const { color } = this.props;
        const colorName = mapCodeToName[color];
        const ColorCN = cn('Color', { [colorName]: colorName });

        return (
            <div className={ColorCN} style={{ backgroundColor: color }} />
        );
    }
}

const mapCodeToName = {
    '#FFF'    : 'white',
    '#ffffff' : 'white'
};

Color.propTypes = {
    color : PropTypes.string.isRequired
};

export default Color;
