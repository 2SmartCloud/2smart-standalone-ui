import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';
import classnames from 'classnames/bind';
import styles from './BaseOption.less';

const cn = classnames.bind(styles);

class BaseOption extends PureComponent {
    render() {
        const { isSelected, isFocused, isDisabled } = this.props;
        const BaseOptionCN = cn('BaseOption', {
            selected : isSelected,
            focused  : isFocused,
            disabled : isDisabled
        });

        return (
            <components.Option {...this.props} className={BaseOptionCN}>
                {this.props.children}
            </components.Option>
        );
    }
}

BaseOption.propTypes = {
    children   : PropTypes.element.isRequired,
    isSelected : PropTypes.bool.isRequired,
    isFocused  : PropTypes.bool.isRequired,
    isDisabled : PropTypes.bool
};

BaseOption.defaultProps = {
    isDisabled : false
};
export default BaseOption;
