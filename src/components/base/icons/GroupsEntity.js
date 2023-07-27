import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class GroupsEntity extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width     = '15'
                height    = '13'
                viewBox   = '0 0 15 13'
                fill      = 'none'
                xmlns     = 'http://www.w3.org/2000/svg'
            >
                <path d='M4.96154 7.28467L2 8.81752L7.5 11.5L13 8.81752L10.0385 7.28467' stroke='#ABABAB' />
                <path d='M4.96154 4.44885L2 5.9817L7.5 8.6642L13 5.9817L10.0385 4.44885' stroke='#04C0B2' />
                <path d='M7.50002 1L2.4231 3.29928L7.50002 5.59856L12.1539 3.29928L7.50002 1Z' stroke='#ABABAB' />
            </svg>
        );
    }
}

GroupsEntity.propTypes = {
    className : PropTypes.string
};

GroupsEntity.defaultProps = {
    className : ''
};

export default GroupsEntity;
