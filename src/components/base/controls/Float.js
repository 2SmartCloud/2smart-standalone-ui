import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Base from './Base';

class FloatControl extends PureComponent {
    render() {
        return (
            <Base
                {...this.props}
                type='float'
                onActive={this.props.onActive}
            />
        );
    }
}

FloatControl.propTypes = {
    onActive : PropTypes.func
};

FloatControl.defaultProps = {
    onActive : () => {}
};

export default FloatControl;
