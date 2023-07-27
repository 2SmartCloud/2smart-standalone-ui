import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base';

class IntegerControl extends PureComponent {
    render() {
        const { isProcessing, onActive } = this.props;

        return (
            <Base
                {...this.props}
                type='integer'
                isProcessing={isProcessing}
                onActive={onActive}
            />
        );
    }
}

IntegerControl.propTypes = {
    onActive     : PropTypes.func,
    isProcessing : PropTypes.bool
};

IntegerControl.defaultProps = {
    onActive     : () => {},
    isProcessing : false
};

export default IntegerControl;
