import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Lock.less';

const cn = classnames.bind(styles);

class LockIcon extends PureComponent {
    render() {
        const { className, isClosed } = this.props;
        const LockIconCN = cn('LockIcon', { [className]: className });


        return (
            <svg
                enableBackground='new 0 0 500 500'
                height='100%'
                width='100%'
                viewBox='0 0 500 500'
                className={LockIconCN}
            >
                {
                    !isClosed ?
                        <path
                            clipRule='evenodd'
                            d='M68.29,431.711c0,20.078,16.264,36.34,36.343,36.34h290.734  c20.078,0,36.345-16.262,36.345-36.34V250c0-20.079-16.267-36.342-36.345-36.342H177.317v-63.597  c0-40.157,32.525-72.685,72.683-72.685c40.158,0,72.685,32.528,72.685,72.685v4.541c0,12.538,10.176,22.715,22.711,22.715  c12.537,0,22.717-10.177,22.717-22.715v-4.541c0-65.232-52.882-118.111-118.112-118.111c-65.24,0-118.111,52.879-118.111,118.111  v63.597h-27.256c-20.079,0-36.343,16.263-36.343,36.342V431.711z M213.658,313.599c0-20.078,16.263-36.341,36.342-36.341  s36.341,16.263,36.341,36.341c0,12.812-6.634,24.079-16.625,30.529c0,0,3.55,21.446,7.542,46.699  c0,7.538-6.087,13.625-13.629,13.625h-27.258c-7.541,0-13.627-6.087-13.627-13.625l7.542-46.699  C220.294,337.678,213.658,326.41,213.658,313.599z'
                        /> :
                        <path
                            clipRule='evenodd' d='M131.889,150.061v63.597h-27.256  c-20.079,0-36.343,16.263-36.343,36.342v181.711c0,20.078,16.264,36.34,36.343,36.34h290.734c20.078,0,36.345-16.262,36.345-36.34  V250c0-20.079-16.267-36.342-36.345-36.342h-27.254v-63.597c0-65.232-52.882-118.111-118.112-118.111  S131.889,84.828,131.889,150.061z M177.317,213.658v-63.597c0-40.157,32.525-72.685,72.683-72.685  c40.158,0,72.685,32.528,72.685,72.685v63.597H177.317z M213.658,313.599c0-20.078,16.263-36.341,36.342-36.341  s36.341,16.263,36.341,36.341c0,12.812-6.634,24.079-16.625,30.529c0,0,3.55,21.446,7.542,46.699  c0,7.538-6.087,13.625-13.629,13.625h-27.258c-7.541,0-13.627-6.087-13.627-13.625l7.542-46.699  C220.294,337.678,213.658,326.41,213.658,313.599z' fill='#010101'
                            fillRule='evenodd'
                        />
                }
            </svg>
        );
    }
}

LockIcon.propTypes = {
    className : PropTypes.string,
    isClosed  : PropTypes.bool
};

LockIcon.defaultProps = {
    className : '',
    isClosed  : true
};

export default LockIcon;
