import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import styles from './Base.less';

const cn = classnames.bind(styles);

class BaseOption extends PureComponent {
    handleOptionClick = (option) => {
        const { onChange } = this.props;

        onChange(option);
    }

    isOptionSelected = () => {
        const { defaultValue, value : propValue, option : { value : optionValue } } = this.props;
        const value = propValue && propValue.value
            || defaultValue && defaultValue.value;

        return optionValue && optionValue === value;
    }

    render() {
        const { children, option } = this.props;
        const isSelected = this.isOptionSelected();
        const BaseOptionCN = cn('BaseOption', { selected: isSelected, disabled: option.disabled });

        return (
            <div className={BaseOptionCN} onClick={this.handleOptionClick.bind(this, option)}>
                {children}
            </div>
        );
    }
}

BaseOption.propTypes = {
    onChange : PropTypes.func.isRequired,
    children : PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    option       : PropTypes.object.isRequired,
    defaultValue : PropTypes.object,
    value        : PropTypes.object
};

BaseOption.defaultProps = {
    defaultValue : {},
    value        : {}
};

export default BaseOption;
