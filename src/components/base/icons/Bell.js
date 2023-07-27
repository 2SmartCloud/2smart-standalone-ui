import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './styles.less';

const cx = classnames.bind(styles);

class Bell extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '36'
                height    = '41'
                viewBox   = '0 0 36 41'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M25.903 28.4l-1.626-2.743a8.22 8.22 0 01-1.148-4.192v-2.402c0-3.034-2-5.6-4.735-6.426v-1.72C18.394 9.86 17.544 9 16.5 9c-1.045 0-1.894.86-1.894 1.917v1.72c-2.735.827-4.735 3.392-4.735 6.425v2.403a8.226 8.226 0 01-1.147 4.19L7.098 28.4a.483.483 0 00-.006.483.47.47 0 00.411.243h17.994c.17 0 .328-.093.412-.242a.486.486 0 00-.006-.483z' fill='#C3C1C1' /><path d='M13.518 30.083C14.052 31.213 15.182 32 16.5 32c1.317 0 2.448-.788 2.982-1.917h-5.964z' fill='#D8D8D8' />
            </svg>
        );
    }
}

Bell.propTypes = {
    className : PropTypes.string
};

Bell.defaultProps = {
    className : ''
};

export default Bell;
