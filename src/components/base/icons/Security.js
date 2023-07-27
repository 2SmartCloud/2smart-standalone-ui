import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';

class SecurityIcon extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                className={className}
                viewBox='0 0 13 17'
            >
                <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M12.6389 6.375H11.5555V4.95832C11.5555 2.22428 9.28769 0 6.5 0C3.71231 0 1.44446 2.22428 1.44446 4.95832V6.375H0.361122C0.161518 6.375 0 6.53341 0 6.72918V15.5834C0 16.3647 0.647799 17 1.44446 17H11.5556C12.3522 17 13 16.3647 13 15.5833V6.72918C13 6.53341 12.8385 6.375 12.6389 6.375ZM7.58123 13.7734C7.5925 13.8734 7.55973 13.9737 7.49131 14.0487C7.42289 14.1238 7.32485 14.1667 7.22224 14.1667H5.77778C5.67517 14.1667 5.57713 14.1238 5.50871 14.0487C5.44029 13.9737 5.40749 13.8734 5.41879 13.7734L5.6466 11.7643C5.27667 11.5004 5.05557 11.0829 5.05557 10.625C5.05557 9.84369 5.70337 9.20831 6.50003 9.20831C7.29668 9.20831 7.94448 9.84366 7.94448 10.625C7.94448 11.0829 7.72338 11.5004 7.35346 11.7643L7.58123 13.7734ZM3.61124 4.95832V6.375H9.38899V4.95832C9.38899 3.39605 8.09302 2.125 6.50011 2.125C4.90721 2.125 3.61124 3.39605 3.61124 4.95832Z'
                    fill='#E2E2E2'
                />
            </Base>
        );
    }
}

SecurityIcon.propTypes = {
    className : PropTypes.string
};

SecurityIcon.defaultProps = {
    className : undefined
};

export default SecurityIcon;
