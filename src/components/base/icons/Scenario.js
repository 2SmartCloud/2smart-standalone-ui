import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Scenario extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '11'
                height    = '10'
                viewBox   = '0 0 11 10'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path
                    fillRule='evenodd' clipRule='evenodd' d='M0 7.64512C0.00823978 7.63104 0.0192262 7.61773 0.0258965 7.60214C0.100839 7.42603 0.236599 7.33513 0.431608 7.33513C1.05822 7.33513 1.68405 7.33475 2.31028 7.33513C2.57513 7.33589 2.74659 7.50134 2.74659 7.75922C2.74816 8.36322 2.74816 8.96684 2.74738 9.57046C2.74659 9.831 2.57395 9.99608 2.30125 9.99646C1.7178 9.9976 1.13395 9.98885 0.550888 10.0003C0.290354 10.0048 0.0988774 9.93294 0 9.68685C0 9.0064 0 8.32557 0 7.64512Z'
                    fill='#ABABAB' />
                <path
                    fillRule='evenodd' clipRule='evenodd' d='M6.19019 4.67299C6.19019 4.46152 6.19019 4.26411 6.19019 4.06709C6.19019 3.93853 6.19019 3.81073 6.19019 3.68217C6.19255 3.45929 6.31693 3.33834 6.54176 3.33986C6.74932 3.34138 6.87135 3.46652 6.87135 3.67913C6.87292 4.00547 6.87292 4.33068 6.87292 4.67223C6.91647 4.67223 6.95374 4.67223 6.99337 4.67223C7.97352 4.67223 8.95444 4.67299 9.93458 4.67223C10.1939 4.67223 10.3117 4.78253 10.3117 5.03052C10.3117 5.4607 10.3117 5.89164 10.3117 6.3222C10.3117 6.53938 10.1869 6.66718 9.97539 6.66794C9.75449 6.66794 9.63128 6.54433 9.62971 6.31878C9.62814 5.99662 9.62971 5.67408 9.62971 5.34279C8.25327 5.34279 6.88155 5.34279 5.49766 5.34279C5.49766 5.43332 5.49766 5.5227 5.49766 5.6117C5.49766 5.85475 5.49844 6.09741 5.49766 6.34084C5.49687 6.54623 5.36582 6.6687 5.15276 6.66794C4.94677 6.66642 4.81689 6.54319 4.8165 6.34274C4.81415 6.04797 4.81572 5.75243 4.8165 5.45804C4.8165 5.42039 4.8165 5.38311 4.8165 5.33975C3.66607 5.33975 2.52545 5.33975 1.37855 5.33975C1.3762 5.37246 1.37267 5.40213 1.37267 5.43294C1.37227 5.72391 1.37267 6.01564 1.37267 6.30699C1.37267 6.54014 1.25025 6.66832 1.02816 6.66794C0.810399 6.66718 0.691119 6.54128 0.691119 6.31269C0.689549 5.87871 0.689549 5.44549 0.691119 5.01151C0.691119 4.7909 0.814715 4.67185 1.04268 4.67185C2.69966 4.67261 4.35782 4.67261 6.01441 4.67261C6.06856 4.67299 6.12153 4.67299 6.19019 4.67299Z'
                    fill='#04BAAC' fillOpacity='0.6' />
                <path
                    fillRule='evenodd' clipRule='evenodd' d='M6.87364 8.6672C6.87364 8.9692 6.87442 9.27082 6.87207 9.57244C6.87207 9.82955 6.70256 9.99577 6.43693 9.99653C5.81424 9.99805 5.19233 9.99805 4.56885 9.99653C4.30322 9.99653 4.13097 9.83146 4.13018 9.57472C4.12783 8.96768 4.12783 8.36101 4.13018 7.75397C4.13097 7.50256 4.30204 7.33673 4.56179 7.33596C5.18801 7.33482 5.81424 7.33444 6.44125 7.33596C6.7061 7.33673 6.87246 7.50256 6.87246 7.76158C6.87364 8.0632 6.87364 8.36558 6.87364 8.6672Z'
                    fill='#ABABAB' />
                <path
                    fillRule='evenodd' clipRule='evenodd' d='M9.63191 7.33547C9.94345 7.33547 10.2546 7.33433 10.5665 7.33547C10.8239 7.33623 10.9989 7.50206 10.9989 7.75233C11.0005 8.36242 11.0005 8.97327 10.9989 9.58373C10.9974 9.82602 10.8231 9.99489 10.5705 9.99603C9.9411 9.99794 9.31134 9.99794 8.68159 9.99603C8.42969 9.99489 8.25626 9.82564 8.25508 9.58259C8.25351 8.97251 8.25351 8.36166 8.25508 7.75119C8.25626 7.50016 8.42694 7.33661 8.68787 7.33547C9.00216 7.33433 9.31762 7.33547 9.63191 7.33547Z'
                    fill='#ABABAB' />
                <path
                    fillRule='evenodd' clipRule='evenodd' d='M6.57889 0.000507136C6.89043 0.000507136 7.20118 -0.000633921 7.51351 0.000507136C7.77091 0.000887489 7.9459 0.167101 7.9459 0.417373C7.94747 1.02746 7.94747 1.6383 7.9459 2.24877C7.94433 2.49105 7.77051 2.65993 7.51744 2.66107C6.88807 2.66297 6.25832 2.66297 5.62856 2.66107C5.37666 2.65993 5.20323 2.49067 5.20245 2.24763C5.2001 1.63754 5.2001 1.0267 5.20245 0.416232C5.20323 0.1652 5.37431 0.00164819 5.63484 0.000507136C5.94913 -0.000253568 6.26499 0.000507136 6.57889 0.000507136Z'
                    fill='#ABABAB' />
            </svg>

        );
    }
}

Scenario.propTypes = {
    className : PropTypes.string
};

Scenario.defaultProps = {
    className : ''
};

export default Scenario;