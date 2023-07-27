import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';

class BackupIcon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                className={className}
                viewBox='0 0 20 14'
            >
                <path
                    d='M16.1667 5.25C15.5833 2.275 13.0833 0 10 0C7.58333 0 5.5 1.4 4.5 3.5C1.91667 3.85 0 6.0375 0 8.75C0 11.6375 2.25 14 5 14H15.8333C18.1667 14 20 12.075 20 9.625C20 7.35 18.25 5.425 16.1667 5.25ZM11.6667 7.875V11.375H8.33333V7.875H5.83333L10 3.5L14.1667 7.875H11.6667Z'
                    fill='#E2E2E2' />
            </Base>
        );
    }
}

BackupIcon.propTypes = {
    className : PropTypes.string
};

BackupIcon.defaultProps = {
    className : undefined
};

export default BackupIcon;
