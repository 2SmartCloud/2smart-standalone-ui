

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './GoPrev.less';

class GoPrev extends PureComponent {
    render() {
        return (
            <svg
                className={styles.prev}
                onClick={this.props.onClick}
                width='15' height='13' viewBox='0 0 15 13'
                fill='none' xmlns='http://www.w3.org/2000/svg'
            >
                <line
                    x1='15' y1='6.38867' x2='1'
                    y2='6.38867' stroke='#EDEDED'
                />
                <line
                    y1='-0.5' x2='9.29224' y2='-0.5'
                    transform='matrix(0.753317 -0.657658 0.622524 0.782601 1 7.11133)' stroke='#EDEDED'
                />
                <line
                    y1='-0.5' x2='8.44828' y2='-0.5'
                    transform='matrix(-0.690476 -0.723356 0.690476 -0.723356 6.8335 12)' stroke='#EDEDED'
                />
            </svg>

        );
    }
}


GoPrev.propTypes = {
    onClick : PropTypes.func
};

GoPrev.defaultProps = {
    onClick : () => {}
};

export default GoPrev;
