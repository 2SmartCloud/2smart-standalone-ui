import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from '../styles.less';

const cx = classnames.bind(styles);

class ArrowRight extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '8'
                height    = '10'
                viewBox   = '0 0 8 10'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M6.81355 4.17801C7.38756 4.57569 7.38756 5.42431 6.81355 5.82199L2.06949 9.10877C1.40629 9.56825 0.5 9.0936 0.5 8.28678L0.5 1.71322C0.5 0.906401 1.40629 0.431746 2.06949 0.891226L6.81355 4.17801Z' fill='#C4C4C4' />
            </svg>
        );
    }
}

ArrowRight.propTypes = {
    className : PropTypes.string
};

ArrowRight.defaultProps = {
    className : ''
};

export default ArrowRight;
