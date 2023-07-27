import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Puls extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '11'
                height    = '11'
                viewBox   = '0 0 11 11'
                fill      = 'none'
                xmlns      = 'http://www.w3.org/2000/svg'
            >
                <circle
                    cx='5.5' cy='5.5' r='5.25'
                    stroke='#C4C4C4' strokeWidth='0.5' />
                <circle
                    cx='5.5001' cy='5.49961' r='4.15'
                    stroke='#C4C4C4' strokeWidth='0.5' />
                <circle
                    cx='5.5002' cy='5.5002' r='3.3'
                    fill='#ABABAB' />
            </svg>
        );
    }
}

Puls.propTypes = {
    className : PropTypes.string
};

Puls.defaultProps = {
    className : ''
};

export default Puls;
