import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames/bind';
import Base from './Base.js';

import styles from './Widgets.less';


const cx = classnames.bind(styles);

class Widgets extends PureComponent {
    static propTypes = {
        isUpdating : PropTypes.bool
    }

    static defaultProps = {
        isUpdating : false
    }

    render() {
        const { isUpdating } = this.props;

        return (
            <Base
                message='Let’s create your first widget...'
                withArrow
                className={cx({ blur: isUpdating })}
            />
        );
    }
}

export default Widgets;
