import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class Folder extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '11'
                height    = '9'
                viewBox   = '0 0 11 9'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M10.0097 2.62598H0.488709C0.00473223 2.62598 -0.0198767 2.87754 0.00746662 3.18651L0.36293 8.19034C0.387539 8.49659 0.458631 8.75088 0.939874 8.75088H9.58583C10.078 8.75088 10.1354 8.49932 10.1628 8.19034L10.4936 3.12362C10.5182 2.81738 10.4936 2.62598 10.0097 2.62598Z' fill='#E2E2E2' />
                <path d='M9.90308 1.29417C9.88941 0.955111 9.78003 0.875816 9.49019 0.875816C9.49019 0.875816 6.17071 0.875816 5.57463 0.875816C4.97854 0.875816 4.90745 0.884018 4.45629 0.400042C4.08168 -0.00463958 4.22934 0.000829128 3.45552 0.000829128C2.83756 0.000829128 1.39657 0.000829128 1.39657 0.000829128C0.920795 0.000829128 0.751267 -0.0401859 0.707517 0.454728C0.666502 0.911362 0.570801 2.01877 0.557129 2.18829H9.94683L9.90308 1.29417Z' fill='#E2E2E2' />
            </svg>
        );
    }
}

Folder.propTypes = {
    className : PropTypes.string
};

Folder.defaultProps = {
    className : ''
};

export default Folder;
