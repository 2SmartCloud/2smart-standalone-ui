import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './styles.less';

const cx = classnames.bind(styles);

class Logout extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className={cx(styles.Icon, styles.logout, { [className]: className })}
                width='19'
                height='21'
                viewBox='0 0 19 21'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path d='M9.15735 19.7631H3.81387C2.3617 19.7631 1.18343 18.553 1.18343 17.0714V3.89301C1.18343 2.40699 2.36604 1.20127 3.81387 1.20127H9.2443C9.57039 1.20127 9.83126 0.934322 9.83126 0.600636C9.83126 0.266949 9.57039 0 9.2443 0H3.81387C1.71387 0 0.00952148 1.74852 0.00952148 3.89301V17.0714C0.00952148 19.2203 1.71822 20.9644 3.81387 20.9644H9.15735C9.48343 20.9644 9.7443 20.6975 9.7443 20.3638C9.7443 20.0301 9.47909 19.7631 9.15735 19.7631Z' fill='#CECECE' />
                <path d='M18.8268 10.0597L15.0964 6.24228C14.866 6.00648 14.4964 6.00648 14.266 6.24228C14.0355 6.47809 14.0355 6.85627 14.266 7.09207L16.9964 9.88614H5.08769C4.7616 9.88614 4.50073 10.1531 4.50073 10.4868C4.50073 10.8205 4.7616 11.0874 5.08769 11.0874H16.9964L14.266 13.8815C14.0355 14.1173 14.0355 14.4955 14.266 14.7313C14.379 14.8469 14.5312 14.9092 14.679 14.9092C14.8268 14.9092 14.979 14.8514 15.092 14.7313L18.8225 10.9139C19.0573 10.6736 19.0573 10.291 18.8268 10.0597Z' fill='#CECECE' />
            </svg>
        );
    }
}

Logout.propTypes = {
    className : PropTypes.string
};

Logout.defaultProps = {
    className : ''
};

export default Logout;
