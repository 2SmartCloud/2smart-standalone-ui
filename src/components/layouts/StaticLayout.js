import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import { removeSpinner } from '../../utils/removeSpinner';


class StaticLayout extends PureComponent {
    static propTypes = {
        children : PropTypes.node.isRequired
    };

    componentDidMount() {
        removeSpinner();
    }


    render() {
        return (
            <>
                {this.props.children}
            </>
        );
    }
}


export default StaticLayout;
