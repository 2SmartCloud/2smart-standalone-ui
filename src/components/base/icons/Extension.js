import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base.js';

class Extension extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <Base
                className={className} width='24' height='25'
                viewBox='0 0 24 25'
                fill='none'
            >
                <g clipPath='url(#clip0)'>
                    <g clipPath='url(#clip1)'>
                        <path d='M22.2655 18.6766C21.949 18.6766 21.6535 18.7662 21.3985 18.9204V15.9667H18.563C18.711 15.7006 18.797 15.3928 18.797 15.0636C18.797 14.0657 18.0205 13.2568 17.0625 13.2568C16.1045 13.2568 15.328 14.0657 15.328 15.0636C15.328 15.3933 15.414 15.7011 15.562 15.9667H12.7265V18.9204C12.471 18.7662 12.1755 18.6766 11.8595 18.6766C10.9015 18.6766 10.125 19.4855 10.125 20.4834C10.125 21.4813 10.9015 22.2902 11.8595 22.2902C12.176 22.2902 12.4715 22.2006 12.7265 22.0464V25.0001H14.8585H15.562C15.414 24.7339 15.328 24.4261 15.328 24.0969C15.328 23.099 16.1045 22.2902 17.0625 22.2902C18.0205 22.2902 18.797 23.099 18.797 24.0969C18.797 24.4266 18.711 24.7344 18.563 25.0001H19.7H21.398V22.0464C21.6535 22.2006 21.949 22.2902 22.265 22.2902C23.223 22.2902 23.9995 21.4813 23.9995 20.4834C23.9995 19.4855 23.2235 18.6766 22.2655 18.6766Z' fill='#06C0B2' />
                        <path d='M1.784 9.24479H19.6225V14.0411H21.406V9.24479V7.38646V1.85833H16.9465V0H15.1625V1.85833H6.2435V0H4.4595V1.85833H0V7.38646V9.24479V22.2979H8.656V20.4401H1.784V9.24479ZM1.784 3.71615H4.46V5.57448H6.2435V3.71615H15.1625V5.57448H16.9465V3.71615H19.6225V7.38646H1.784V3.71615Z' fill='#06C0B2' />
                    </g>
                </g>
                <defs>
                    <clipPath id='clip0'>
                        <rect width='24' height='25' fill='white' />
                    </clipPath>
                    <clipPath id='clip1'>
                        <rect width='24' height='25' fill='white' />
                    </clipPath>
                </defs>
            </Base>
        );
    }
}

Extension.propTypes = {
    className : PropTypes.string
};

Extension.defaultProps = {
    className : undefined
};

export default Extension;
