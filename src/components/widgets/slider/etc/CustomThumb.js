import React, { PureComponent } from 'react';

class CustomThumb extends PureComponent {
    render() {
        return (
            <div
                {...this.props}
                tabIndex='-1'
            />
        );
    }
}

export default CustomThumb;
