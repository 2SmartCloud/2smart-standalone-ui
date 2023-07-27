

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './styles.less';

const cx = classnames.bind(styles);

class ListFlat extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <svg
                className = {cx({ [className]: className })}
                width='94'
                height='94'
                fill='none'
                viewBox='0 0 94 94'
                xmlns='http://www.w3.org/2000/svg'
            >
                <rect
                    x='6' y='12' width='81'
                    height='8' rx='1' fill='#D8D8D8' />
                <rect
                    x='6' y='40' width='81'
                    height='8' rx='1' fill='#D8D8D8' />
                <rect
                    x='6' y='68' width='81'
                    height='8' rx='1' fill='#D8D8D8' />
            </svg>
        );
    }
}

ListFlat.propTypes = {
    className : PropTypes.string
};

ListFlat.defaultProps = {
    className : ''
};

export default ListFlat;
