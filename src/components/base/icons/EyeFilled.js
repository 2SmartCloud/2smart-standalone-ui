import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class EyeFilled extends PureComponent {
    render() {
        const { isHidden, className, onClick } = this.props;

        return (
            isHidden ?
                <svg
                    width='19' height='19' viewBox='0 0 19 19'
                    className={cx(styles.Icon, styles.eyeFilled, { [className]: className })}
                    fill='none' xmlns='http://www.w3.org/2000/svg'
                >
                    <g clipPath='url(#clip0)'>
                        <path d='M9.35547 6.49086L12.0753 9.21069L12.0883 9.06823C12.0883 7.63922 10.9269 6.47791 9.49794 6.47791L9.35547 6.49086Z' fill='#C4C4C4' />
                        <path d='M9.49837 4.75099C11.8815 4.75099 13.8156 6.68511 13.8156 9.06821C13.8156 9.62513 13.7034 10.1561 13.5091 10.644L16.0346 13.1695C17.3384 12.0816 18.3659 10.6742 19.0006 9.06821C17.5025 5.27772 13.8199 2.59241 9.49841 2.59241C8.28958 2.59241 7.1326 2.80825 6.05762 3.1968L7.92265 5.0575C8.41044 4.86756 8.94145 4.75099 9.49837 4.75099Z' fill='#C4C4C4' />
                        <path d='M0.863427 2.39813L2.83207 4.36677L3.22495 4.75965C1.80027 5.87349 0.673483 7.3543 0 9.0682C1.49376 12.8587 5.18064 15.544 9.49786 15.544C10.8362 15.544 12.1141 15.285 13.2841 14.8144L13.651 15.1814L16.168 17.7026L17.2689 16.606L1.96431 1.29724L0.863427 2.39813ZM5.63828 7.16865L6.97229 8.50266C6.93344 8.68832 6.90753 8.87393 6.90753 9.0682C6.90753 10.4972 8.06885 11.6585 9.49786 11.6585C9.69213 11.6585 9.87778 11.6326 10.0591 11.5938L11.3931 12.9278C10.8189 13.2127 10.18 13.3854 9.49786 13.3854C7.11476 13.3854 5.18064 11.4513 5.18064 9.0682C5.18064 8.3861 5.35334 7.74714 5.63828 7.16865Z' fill='#C4C4C4' />
                    </g>
                </svg>
                :
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 469.44 469.44'
                    className={cx(styles.Icon, styles.eyeFilled, { [className]: className })}
                    onClick={onClick}
                    height='19px'
                    width='19px'
                >
                    <g fill='#E2E2E2'>
                        <path d='M234.667 170.667c-35.307 0-64 28.693-64 64s28.693 64 64 64 64-28.693 64-64-28.694-64-64-64z' />
                        <path d='M234.667 74.667C128 74.667 36.907 141.013 0 234.667c36.907 93.653 128 160 234.667 160 106.773 0 197.76-66.347 234.667-160-36.907-93.654-127.894-160-234.667-160zm0 266.666c-58.88 0-106.667-47.787-106.667-106.667S175.787 128 234.667 128s106.667 47.787 106.667 106.667-47.787 106.666-106.667 106.666z' />
                    </g>
                </svg>

        );
    }
}

EyeFilled.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    onClick   : PropTypes.func
};

EyeFilled.defaultProps = {
    isHidden  : false,
    className : '',
    onClick   : () => {}
};

export default EyeFilled;
