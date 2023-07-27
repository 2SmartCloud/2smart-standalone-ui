import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'throttle-debounce';

import Select from './BaseSelect';

class AsyncSelect extends PureComponent {
    handleInputChange = (value) => {
        const { onInputChange, settings } = this.props;

        if (onInputChange) {
            if (!value) return;
            this.debouncedOnChange(settings.basePath, value);

            return value;
        }
    }

    debouncedOnChange = debounce(200, (path, value) => this.props.onInputChange(path, value))

    render() {
        const { components, settings } = this.props;

        return (
            <Select
                {...this.props}
                maxSelectHeight={206}
                components={components}
                selectType='enum-async'
                settings={{
                    ...settings,
                    isSearchable : true
                }}
                onInputChange={this.handleInputChange}
                darkThemeSupport
            />
        );
    }
}

AsyncSelect.propTypes = {
    components    : PropTypes.object,
    settings      : PropTypes.object,
    onInputChange : PropTypes.func
};

AsyncSelect.defaultProps = {
    components    : {},
    settings      : {},
    onInputChange : undefined
};

export default AsyncSelect;
