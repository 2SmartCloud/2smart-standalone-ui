import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Plus extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '8'
                height    = '8'
                viewBox   = '0 0 8 8'
                fill      = 'none'
            >
                <path d='M8 4.571H4.571V8H3.43V4.571H0V3.43h3.429V0H4.57v3.429H8V4.57z' fill='#FFF' />
            </svg>
        );
    }
}

Plus.propTypes = {
    className : PropTypes.string
};

Plus.defaultProps = {
    className : ''
};

export default Plus;
