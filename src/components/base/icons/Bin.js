import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './styles.less';

const cx = classnames.bind(styles);

class BinIcon extends PureComponent {
    render() {
        const { className, onClick } = this.props;

        return (
            <svg
                width='20'
                height='20'
                viewBox='0 0 13 18'
                className={cx(styles.Icon, styles.bin, { [className]: className })}
                onClick={onClick}
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M2.4024 18.0002C1.93193 18.0002 1.54507 17.6173 1.52539 17.1321L0.940186 4.38281H12.0592L11.474 17.1321C11.4543 17.6173 11.0674 18.0002 10.597 18.0002H2.4024ZM8.71006 7.1812C8.51313 7.1812 8.35352 7.34596 8.35352 7.54911V14.8331C8.35352 15.0364 8.51321 15.201 8.71006 15.201H9.28032C9.47725 15.201 9.63686 15.0363 9.63686 14.8331V7.54911C9.63686 7.34592 9.47712 7.1812 9.28032 7.1812H8.71006ZM5.85791 7.54911C5.85791 7.34596 6.01752 7.1812 6.21441 7.1812H6.78467C6.98147 7.1812 7.14117 7.34592 7.14117 7.54911V14.8331C7.14117 15.0363 6.9816 15.201 6.78467 15.201H6.21441C6.01756 15.201 5.85791 15.0364 5.85791 14.8331V7.54911ZM3.71905 7.1812C3.52216 7.1812 3.36255 7.34596 3.36255 7.54911V14.8331C3.36255 15.0364 3.5222 15.201 3.71905 15.201H4.28935C4.48624 15.201 4.64585 15.0363 4.64585 14.8331V7.54911C4.64585 7.34592 4.48619 7.1812 4.28935 7.1812H3.71905Z' //eslint-disable-line
                    fill='#E9E9E9'
                />
                <path d='M12.4492 0.927301H8.66875V0.189708C8.66875 0.0849611 8.58646 0 8.48492 0H4.51508C4.41358 0 4.3313 0.0849611 4.3313 0.189708V0.927257H0.550828C0.246591 0.927257 0 1.18179 0 1.49577V3.28167H13V1.49581C13 1.18183 12.7534 0.927301 12.4492 0.927301Z' fill='#E9E9E9' />
            </svg>
        );
    }
}


BinIcon.propTypes = {
    className : PropTypes.string,
    onClick   : PropTypes.func
};

BinIcon.defaultProps = {
    className : '',
    onClick   : void 0
};

export default BinIcon;
