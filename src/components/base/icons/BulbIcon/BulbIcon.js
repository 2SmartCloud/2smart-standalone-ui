import React                        from 'react';
import PropTypes                    from 'prop-types';
import classnames                   from 'classnames/bind';

import ProcessingIndicator          from '../../ProcessingIndicator';

import styles                       from './BulbIcon.less';

const cx = classnames.bind(styles);

function BulbIcon(props) {
    const { className, isDisabled, isDark, isProcessing, onToggle, opacity } = props;
    const bulbIconCN = cx(styles.BulbIcon, {
        className,
        disabled   : isDisabled,
        dark       : isDark,
        processing : isProcessing
    });
    const bulbBrightness = isDark ? 1 : opacity;

    return (
        <>
            { isProcessing ? (
                <div className={styles.loaderWrapper}>
                    <ProcessingIndicator className={styles.processSvg} size={25} />
                </div>
            ) : null
            }
            <svg
                className={bulbIconCN}
                onClick = {onToggle}
                width='80' height='60' viewBox='0 0 30 30'
                fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g opacity={'1'} clipPath='url(#clip0)'>
                    <g opacity={'1'} filter='url(#filter0_i)'>
                        { !isDark ? (<path
                            opacity={'1'} className={cx(styles.glass)} d='M24.8282 9.82729C24.828 8.11187 24.3789 6.42636 23.5254 4.93832C22.6719 3.45029 21.4438 2.21156 19.9632 1.34527C18.4826 0.478988 16.801 0.0153235 15.0856 0.000373348C13.3703 -0.0145769 11.6809 0.419708 10.1854 1.26005C8.6899 2.1004 7.44041 3.31754 6.56112 4.79047C5.68183 6.2634 5.20338 7.94083 5.17332 9.65599C5.14327 11.3712 5.56266 13.0643 6.38981 14.5671C7.21695 16.07 8.42304 17.3301 9.88818 18.2224C10.1872 18.4071 10.4337 18.6655 10.6042 18.9728C10.7746 19.2801 10.8634 19.6261 10.8618 19.9775V22.7591H19.1382V19.9773C19.1389 19.6221 19.2307 19.2731 19.4049 18.9636C19.579 18.654 19.8297 18.3944 20.1329 18.2094C21.5679 17.3314 22.7533 16.0994 23.5755 14.6317C24.3976 13.1639 24.829 11.5096 24.8282 9.82729Z'
                            fill='#FFFFFF' />) : null
                        }
                        <path
                            opacity={bulbBrightness || '0.01'} className={cx(styles.glass)} d='M24.8282 9.82729C24.828 8.11187 24.3789 6.42636 23.5254 4.93832C22.6719 3.45029 21.4438 2.21156 19.9632 1.34527C18.4826 0.478988 16.801 0.0153235 15.0856 0.000373348C13.3703 -0.0145769 11.6809 0.419708 10.1854 1.26005C8.6899 2.1004 7.44041 3.31754 6.56112 4.79047C5.68183 6.2634 5.20338 7.94083 5.17332 9.65599C5.14327 11.3712 5.56266 13.0643 6.38981 14.5671C7.21695 16.07 8.42304 17.3301 9.88818 18.2224C10.1872 18.4071 10.4337 18.6655 10.6042 18.9728C10.7746 19.2801 10.8634 19.6261 10.8618 19.9775V22.7591H19.1382V19.9773C19.1389 19.6221 19.2307 19.2731 19.4049 18.9636C19.579 18.654 19.8297 18.3944 20.1329 18.2094C21.5679 17.3314 22.7533 16.0994 23.5755 14.6317C24.3976 13.1639 24.829 11.5096 24.8282 9.82729Z'
                            fill='#FFE76C' />
                    </g>
                    <path
                        opacity={bulbBrightness || '0.01'} className={cx(styles.spiral)} d='M18.1529 10.5859C17.526 10.5866 16.9249 10.8266 16.4816 11.2533C16.0383 11.68 15.7889 12.2585 15.7882 12.8619V13.6206H14.2118V12.8619C14.2118 12.4118 14.0731 11.9717 13.8133 11.5975C13.5534 11.2232 13.1841 10.9315 12.752 10.7592C12.3199 10.5869 11.8445 10.5419 11.3858 10.6297C10.9271 10.7175 10.5057 10.9343 10.175 11.2526C9.84431 11.5709 9.6191 11.9764 9.52786 12.4179C9.43662 12.8594 9.48345 13.317 9.66242 13.7329C9.8414 14.1488 10.1445 14.5043 10.5334 14.7544C10.9222 15.0044 11.3794 15.1379 11.8471 15.1379H12.6353V21.9659C12.6353 22.1671 12.7184 22.3601 12.8662 22.5024C13.014 22.6447 13.2145 22.7246 13.4235 22.7246H16.5764C16.7855 22.7246 16.986 22.6447 17.1338 22.5024C17.2816 22.3601 17.3647 22.1671 17.3647 21.9659V15.1379H18.1529C18.78 15.1379 19.3815 14.8981 19.825 14.4713C20.2684 14.0445 20.5176 13.4656 20.5176 12.8619C20.5176 12.2583 20.2684 11.6794 19.825 11.2526C19.3815 10.8257 18.78 10.5859 18.1529 10.5859ZM11.0589 12.8619C11.0589 12.6607 11.1419 12.4678 11.2897 12.3255C11.4376 12.1832 11.638 12.1033 11.8471 12.1033C12.0561 12.1033 12.2566 12.1832 12.4045 12.3255C12.5523 12.4678 12.6353 12.6607 12.6353 12.8619V13.6206H11.8471C11.6381 13.6204 11.4378 13.5404 11.29 13.3981C11.1422 13.2559 11.0591 13.0631 11.0589 12.8619ZM15.7882 21.2073H14.2118V15.1379H15.7882V21.2073ZM18.1529 13.6206H17.3647V12.8619C17.3647 12.7119 17.4109 12.5652 17.4975 12.4404C17.5841 12.3157 17.7072 12.2184 17.8513 12.161C17.9953 12.1036 18.1538 12.0886 18.3067 12.1178C18.4596 12.1471 18.6 12.2194 18.7103 12.3255C18.8205 12.4316 18.8956 12.5668 18.926 12.7139C18.9564 12.8611 18.9408 13.0136 18.8811 13.1523C18.8215 13.2909 18.7204 13.4094 18.5908 13.4927C18.4612 13.5761 18.3088 13.6206 18.1529 13.6206Z'
                        fill='#FAAC20' />
                    <path d='M19.1382 24.8281H10.8618C10.5874 24.8281 10.3243 24.7191 10.1303 24.5251C9.93627 24.3311 9.82727 24.068 9.82727 23.7936C9.82727 23.5192 9.93627 23.2561 10.1303 23.062C10.3243 22.868 10.5874 22.759 10.8618 22.759H19.1382C19.4126 22.759 19.6757 22.868 19.8697 23.062C20.0637 23.2561 20.1727 23.5192 20.1727 23.7936C20.1727 24.068 20.0637 24.3311 19.8697 24.5251C19.6757 24.7191 19.4126 24.8281 19.1382 24.8281Z' fill='#C4C8CB' />
                    <path d='M19.1382 26.8972H10.8618C10.5874 26.8972 10.3243 26.7882 10.1303 26.5942C9.93627 26.4002 9.82727 26.137 9.82727 25.8627C9.82727 25.5883 9.93627 25.3252 10.1303 25.1311C10.3243 24.9371 10.5874 24.8281 10.8618 24.8281H19.1382C19.4126 24.8281 19.6757 24.9371 19.8697 25.1311C20.0637 25.3252 20.1727 25.5883 20.1727 25.8627C20.1727 26.137 20.0637 26.4002 19.8697 26.5942C19.6757 26.7882 19.4126 26.8972 19.1382 26.8972Z' fill='#DFE4E9' />
                    <path d='M10.8618 26.8972H19.1382V27.9318C19.1382 28.4805 18.9202 29.0068 18.5322 29.3948C18.1441 29.7829 17.6178 30.0009 17.0691 30.0009H12.9309C12.3821 30.0009 11.8559 29.7829 11.4678 29.3948C11.0798 29.0068 10.8618 28.4805 10.8618 27.9318V26.8972Z' fill='#C4C8CB' />
                    <path d='M19.1382 22.759H10.8618C10.5874 22.759 10.3243 22.65 10.1303 22.456C9.93627 22.262 9.82727 21.9989 9.82727 21.7245C9.82727 21.4501 9.93627 21.187 10.1303 20.993C10.3243 20.7989 10.5874 20.6899 10.8618 20.6899H19.1382C19.4126 20.6899 19.6757 20.7989 19.8697 20.993C20.0637 21.187 20.1727 21.4501 20.1727 21.7245C20.1727 21.9989 20.0637 22.262 19.8697 22.456C19.6757 22.65 19.4126 22.759 19.1382 22.759Z' fill='#DFE4E9' />
                    <rect
                        className={cx(styles.cross)} width='31.1548' height='2'
                        fillOpacity={0}
                        transform='matrix(-0.707107 0.707107 0.707107 0.707107 25.1871 0)' fill='#C5C5C5' />
                </g>
                <defs>
                    <filter
                        id='filter0_i' x='5.17181' y='0'
                        width='19.6564' height='23.7591' filterUnits='userSpaceOnUse'
                        colorInterpolationFilters='sRGB'>
                        <feFlood floodOpacity='0' result='BackgroundImageFix' />
                        <feBlend
                            mode='normal' in='SourceGraphic' in2='BackgroundImageFix'
                            result='shape' />
                        <feColorMatrix
                            in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                            result='hardAlpha' />
                        <feOffset dy='1' />
                        <feGaussianBlur stdDeviation='1.5' />
                        <feComposite
                            in2='hardAlpha' operator='arithmetic' k2='-1'
                            k3='1' />
                        <feColorMatrix
                            type='matrix'
                            values={'0 0 0 0 0.4625 0 0 0 0 0.4625 0 0 0 0 0.4625 0 0 0 1 0'}
                        />
                        <feBlend mode='normal' in2='shape' result='effect1_innerShadow' />
                    </filter>
                    {/* <clipPath id='clip0'>*/}
                    <rect width='30' height='30' fill='white' />
                    {/* </clipPath>*/}
                </defs>
            </svg>
        </>
    );
}

BulbIcon.propTypes = {
    className    : PropTypes.string,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    isDark       : PropTypes.bool,
    onToggle     : PropTypes.func.isRequired,
    opacity      : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

BulbIcon.defaultProps = {
    className    : '',
    isDisabled   : false,
    isProcessing : false,
    isDark       : false,
    opacity      : '1'
};

export default BulbIcon;
