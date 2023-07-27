import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from '../../../../base/select/BaseSelect';

class SelectInput extends PureComponent {
    static propTypes = {
        value       : PropTypes.string,
        options     : PropTypes.array,
        placeholder : PropTypes.string,
        onChange    : PropTypes.func.isRequired
    }

    static defaultProps = {
        value       : undefined,
        options     : [],
        placeholder : null
    }

    handleChange = ({ value }) => {
        this.props.onChange(value);
    }

    render() {
        const { value, options, placeholder } = this.props;

        const defaultValue = options.find(option => option.value === value);

        return (
            <Select
                settings={{
                    defaultValue,
                    isSearchable : false
                }}
                options={options}
                placeholder={placeholder}
                onChange={this.handleChange}
                isPortalTarget
                darkThemeSupport
            />
        );
    }
}

export default SelectInput;
