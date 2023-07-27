import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { components } from 'react-select';
import styles from './DropdownIndicator.less';

const cn = classnames.bind(styles);

class DropdownIndicator extends PureComponent {
    render() {
        const { selectProps = {} } = this.props;
        const { darkThemeSupport = false } = selectProps;
        const DropdownIndicatorCN = cn('DropdownIndicator', { dark: darkThemeSupport });

        return (
            <components.DropdownIndicator
                {...this.props}
                className={DropdownIndicatorCN}
            />
        );
    }
}

DropdownIndicator.propTypes = {
    selectProps : PropTypes.object.isRequired
};

export default DropdownIndicator;
