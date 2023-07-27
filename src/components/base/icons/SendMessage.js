import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './styles.less';

const cx = classnames.bind(styles);

class SendMessage extends PureComponent {
    render() {
        const { className, ...rest } = this.props;

        return (
            <svg
                className={cx(styles.Icon, styles.sendMessage, { [className]: className })}
                {...rest}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
            >
                <g data-name='60.mail' id='_60.mail'>
                    <path className='cls-1' d='M23 12V6a3 3 0 00-3-3H4a3 3 0 00-3 3v12a3 3 0 003 3h7' />
                    <path className='cls-1' d='M2 4l10 9 10-9M5 15l4-4M15 17l3-3 3 3M18 14v7' />
                </g>
            </svg>
        );
    }
}


SendMessage.propTypes = {
    className : PropTypes.string
};

SendMessage.defaultProps = {
    className : ''
};

export default SendMessage;
