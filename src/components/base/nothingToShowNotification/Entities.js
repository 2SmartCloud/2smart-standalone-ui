import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Base                     from './Base.js';

class Devices extends PureComponent {
    static propTypes = {
        isSeacrh : PropTypes.bool
    }

    static defaultProps = {
        isSeacrh : false
    }

    render() {
        const { isSeacrh } = this.props;

        return (
            <Base
                withTitle = {false}
                withIcon  = {!isSeacrh}
                message   = {isSeacrh
                    ? 'Nothing found'
                    : 'There are no available entities yet...'
                }
            />
        );
    }
}

export default Devices;
