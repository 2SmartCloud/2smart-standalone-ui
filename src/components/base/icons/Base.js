import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Base.less';

const cn = classnames.bind(styles);

class BaseIcon extends PureComponent {
    render() {
        const { viewBox, children, className } = this.props;
        const BaseIconCN = cn('BaseIcon', { [className]: className });

        return (
            <svg className={BaseIconCN} viewBox={viewBox}>
                {children}
            </svg>
        );
    }
}

BaseIcon.propTypes = {
    viewBox   : PropTypes.string,
    children  : PropTypes.oneOfType([ PropTypes.element, PropTypes.array ]).isRequired,
    className : PropTypes.string
};

BaseIcon.defaultProps = {
    viewBox   : '',
    className : ''
};

export default BaseIcon;
