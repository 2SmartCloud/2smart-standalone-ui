import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AsyncSelect from './AsyncSelect';
import CitySingleValue from './SingleValue/CitySingleValue';
import CityOption from './Option/CityOption';

class CitiesSelect extends PureComponent {
    render() {
        const { components, onInputChange } = this.props;
        const customComponents = { SingleValue: CitySingleValue, Option: CityOption, ...components };

        return (
            <AsyncSelect
                {...this.props}
                components={customComponents}
                onInputChange={onInputChange}
            />
        );
    }
}

CitiesSelect.propTypes = {
    components       : PropTypes.object,
    onInputChange    : PropTypes.func,
    noOptionsMessage : PropTypes.func
};

CitiesSelect.defaultProps = {
    components       : {},
    onInputChange    : undefined,
    noOptionsMessage : () => 'Enter the required city'
};

export default CitiesSelect;
