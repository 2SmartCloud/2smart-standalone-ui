import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';


class AccountIcon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                className={className}
                viewBox='3 3 18 18'
            >
                <path
                    fill='#E2E2E2'
                    width='100%'
                    height='100%'
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'
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
