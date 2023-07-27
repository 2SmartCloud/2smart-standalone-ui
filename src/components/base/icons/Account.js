import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';

class AccountIcon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                viewBox='0 0 15 15'
                className={className}
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M10.8631 3.93645C10.8631 6.11051 9.35727 7.87294 7.49992 7.87294C5.64246 7.87294 4.13676 6.11051 4.13672 3.93645C4.13672 0.921635 5.64242 0 7.49992 0C9.35734 0 10.8631 0.921635 10.8631 3.93645ZM13.2299 9.84511L14.9267 13.6674C15.0436 13.9308 15.0196 14.2324 14.8625 14.4741C14.7054 14.7157 14.4395 14.86 14.1512 14.86H0.848738C0.56048 14.86 0.294622 14.7158 0.137534 14.4741C-0.019628 14.2324 -0.0436037 13.9309 0.0733785 13.6674L1.77015 9.84511C1.84783 9.67013 1.98403 9.52514 2.1538 9.43679L4.7869 8.066C4.84497 8.03583 4.91529 8.04169 4.96764 8.08121C5.71242 8.64453 6.58805 8.94228 7.50004 8.94228C8.41188 8.94228 9.28758 8.64453 10.0324 8.08121C10.0846 8.04169 10.1549 8.03583 10.213 8.066L12.8462 9.43679C13.0159 9.52514 13.1523 9.67021 13.2299 9.84511Z'
                    fill='#E2E2E2'
                />
            </Base>
        );
    }
}

AccountIcon.propTypes = {
    className : PropTypes.string
};

AccountIcon.defaultProps = {
    className : undefined
};

export default AccountIcon;
