import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class GroupEntity extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '12'
                height    = '12'
                viewBox   = '0 0 12 12'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path
                    d='M0 6.08987C0 5.7585 0.268629 5.48987 0.6 5.48987H6V10.8899C6 11.2212 5.73137 11.4899 5.4 11.4899H0.6C0.268629 11.4899 0 11.2212 0 10.8899V6.08987Z' stroke='#D8D8D8'
                    strokeWidth='1.4' fill='transparent' />
                <path
                    d='M5.30005 0.799951C5.30005 0.46858 5.56868 0.199951 5.90005 0.199951H10.7C11.0314 0.199951 11.3 0.46858 11.3 0.799951V5.59995C11.3 5.93132 11.0314 6.19995 10.7 6.19995H5.30005V0.799951Z' stroke='#04C0B2'
                    strokeOpacity='0.4' strokeWidth='1.4' fill='transparent' />
            </svg>

        );
    }
}

GroupEntity.propTypes = {
    className : PropTypes.string
};

GroupEntity.defaultProps = {
    className : ''
};

export default GroupEntity;
