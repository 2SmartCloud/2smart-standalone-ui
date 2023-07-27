import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Threshold extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '11'
                height    = '11'
                viewBox   = '0 0 11 11'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M5.5 9.9L2.75 11L5.5 4.95L8.25 11L5.5 9.9ZM3.3 0H7.7V1.65H11V2.75H7.7V4.4H3.3V2.75H0V1.65H3.3V0ZM4.4 1.1V3.3H6.6V1.1H4.4Z' fill='#D8D8D8' />
            </svg>

        );
    }
}

Threshold.propTypes = {
    className : PropTypes.string
};

Threshold.defaultProps = {
    className : ''
};

export default Threshold;
