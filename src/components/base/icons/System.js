import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class System extends PureComponent {
    render() {
        const { className, onClick } = this.props;

        return (
            <svg
                className = {cx(styles.Icon, styles.system, { [className]: className })}
                onClick   = {onClick}
                width     = '16'
                height    = '16'
                viewBox   = '0 0 16 16'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M15.3333 2.66667V1.4C15.3333 1 15 0.666667 14.6 0.666667H6.53333L6 0H0.733333C0.333333 0 0 0.333333 0 0.733333V15.2667C0 15.6667 0.333333 16 0.733333 16H15.2667C15.6667 16 16 15.6667 16 15.2667V3.4C16 3 15.7333 2.73333 15.3333 2.66667ZM14.6667 14.6667H1.33333V1.33333H5.33333L7.33333 4H14.6667V14.6667ZM14.6667 2.66667H8L7 1.33333H14.6667V2.66667Z' fill='#BEBEBE' />
                <path d='M7.33333 6V6.73333C7.06666 6.8 6.86666 6.86667 6.66666 7L6.13333 6.53333L5.2 7.46667L5.73333 8C5.6 8.2 5.53333 8.46667 5.46666 8.66667H4.66666V10H5.4C5.46666 10.2667 5.53333 10.4667 5.66666 10.6667L5.13333 11.2L6.06666 12.1333L6.6 11.6C6.8 11.7333 7.06666 11.8 7.26666 11.8667V12.6667H8.6V11.9333C8.86666 11.8667 9.06666 11.8 9.26666 11.6667L9.8 12.2L10.7333 11.2667L10.2667 10.6667C10.4 10.4667 10.4667 10.2 10.5333 10H11.3333V8.66667H10.6C10.5333 8.4 10.4667 8.2 10.3333 8L10.8667 7.46667L9.93333 6.53333L9.33333 7.06667C9.13333 6.93333 8.86666 6.86667 8.66666 6.8V6H7.33333ZM9.33333 9.33333C9.33333 10.0667 8.73333 10.6667 8 10.6667C7.26666 10.6667 6.66666 10.0667 6.66666 9.33333C6.66666 8.6 7.26666 8 8 8C8.73333 8 9.33333 8.6 9.33333 9.33333Z' fill='#BEBEBE' />
            </svg>
        );
    }
}

System.propTypes = {
    className : PropTypes.string,
    onClick   : PropTypes.func
};

System.defaultProps = {
    className : '',
    onClick   : () => {}
};

export default System;
