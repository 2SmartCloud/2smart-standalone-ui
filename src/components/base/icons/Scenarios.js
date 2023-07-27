import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Scenarios extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '32'
                height    = '32'
                viewBox   = '0 0 32 32'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path
                    d='M15 31H3V13h26v7M0 13h32M18 4l9 9M5 13l9-9M16 5a2 2 0 100-4 2 2 0 000 4z'
                    stroke='#A0A0A0' strokeWidth='2' strokeLinejoin='round'
                />
                <path
                    d='M20 25a1 1 0 100-2 1 1 0 000 2zM24 24h8M20 31a1 1 0 100-2 1 1 0 000 2zM24 30h8'
                    stroke='#04C0B2' strokeWidth='2' strokeLinejoin='round'
                />
            </svg>
        );
    }
}

Scenarios.propTypes = {
    className : PropTypes.string
};

Scenarios.defaultProps = {
    className : ''
};

export default Scenarios;
