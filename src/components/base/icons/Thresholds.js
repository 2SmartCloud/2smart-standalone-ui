import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Thresholds extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '12'
                height    = '11'
                viewBox   = '0 0 12 11'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <rect
                    x='4.19971' width='7.8' height='1.73681'
                    rx='0.868406' fill='#ABABAB' />
                <rect
                    width='1.8' height='1.73681' rx='0.868406'
                    fill='#ABABAB' />
                <rect
                    x='4.19971' y='4.63184' width='4.8'
                    height='1.73681' rx='0.868406' fill='#04C0B2' />
                <rect
                    y='4.63184' width='1.8' height='1.73681'
                    rx='0.868406' fill='#04C0B2' />
                <rect
                    x='4.19971' y='9.26367' width='7.8'
                    height='1.73681' rx='0.868406' fill='#ABABAB' />
                <rect
                    y='9.26367' width='1.8' height='1.73681'
                    rx='0.868406' fill='#ABABAB' />
            </svg>
        );
    }
}

Thresholds.propTypes = {
    className : PropTypes.string
};

Thresholds.defaultProps = {
    className : ''
};

export default Thresholds;
