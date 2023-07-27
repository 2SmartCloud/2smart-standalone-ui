import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GenericToggle from '../../../../base/GenericToggle';

class BooleanInput extends PureComponent {
    static propTypes = {
        value    : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        onChange : PropTypes.func.isRequired
    }

    static defaultProps = {
        value : 'false'
    }

    handleChange = ({ value }) => {
        this.props.onChange(value);
    }

    render() {
        const { value } = this.props;

        return (
            <GenericToggle
                value={value}
                onToggle={this.handleChange}
                isSettable
            />
        );
    }
}

export default BooleanInput;
