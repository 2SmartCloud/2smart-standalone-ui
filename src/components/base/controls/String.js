import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Base                     from './Base';

class StringControl extends PureComponent {
    render() {
        const { isProcessing, onActive } = this.props;

        return (
            <Base
                {...this.props}
                type         = 'string'
                isProcessing = {isProcessing}
                onActive     = {onActive}
            />
        );
    }
}

StringControl.propTypes = {
    onActive     : PropTypes.func,
    isProcessing : PropTypes.bool
};

StringControl.defaultProps = {
    onActive     : () => {},
    isProcessing : false
};

export default StringControl;
