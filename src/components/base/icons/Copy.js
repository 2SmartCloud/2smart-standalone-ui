import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './styles.less';

const cx = classnames.bind(styles);

class CopyIcon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                width='100%'
                height='100%'
                viewBox='0 0 48 48'
                className={cx(styles.Icon, styles.copy, { [className]: className })}
            >
                <path d='M32 2h-24c-2.21 0-4 1.79-4 4v28h4v-28h24v-4zm6 8h-22c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4zm0 32h-22v-28h22v28z' fill='#000' />
            </svg>
        );
    }
}


CopyIcon.propTypes = {
    className : PropTypes.string
};

CopyIcon.defaultProps = {
    className : ''
};

export default CopyIcon;
