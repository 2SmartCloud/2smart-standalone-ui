import React, { PureComponent } from 'react';
import Base from './Base.js';

class Devices extends PureComponent {
    render() {
        return (
            <Base
                message='There are no available devices yet...'
            />
        );
    }
}

export default Devices;
