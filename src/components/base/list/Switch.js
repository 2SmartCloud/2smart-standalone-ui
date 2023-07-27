import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseSwitch from '../Switch';

class Switch extends PureComponent {
    static propTypes = {
        status : PropTypes.oneOf([ 'ACTIVE', 'INACTIVE', 'DISABLED' ]).isRequired
    }

    isChecked = () => {
        const { status } = this.props;

        return status === 'ACTIVE';
    }

    render() {
        const isChecked = this.isChecked();

        return (
            <BaseSwitch checked={isChecked} {...this.props} />
        );
    }
}

export default Switch;
