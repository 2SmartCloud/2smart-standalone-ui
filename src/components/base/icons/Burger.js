import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Burger.less';

class BurgerIcon extends PureComponent {
    render() {
        const { onClick } = this.props;

        return (
            <div className = {styles.BurgerIcon} onClick={onClick}>
                <svg
                    width='30' height='20' viewBox='0 0 30 20'
                    fill='none' xmlns='http://www.w3.org/2000/svg'
                >
                    <rect
                        x='0.5' y='0.5' width='29'
                        height='1'
                    />
                    <rect
                        x='0.5' y='9.5' width='19'
                        height='1'
                    />
                    <rect
                        x='0.5' y='18.5' width='9'
                        height='1'
                    />
                </svg>

            </div>
        );
    }
}

BurgerIcon.propTypes = {
    onClick : PropTypes.func
};

BurgerIcon.defaultProps = {
    onClick : () => {}
};

export default BurgerIcon;
