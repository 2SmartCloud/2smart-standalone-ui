import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { components } from 'react-select';
import uuid from 'uuid';
import styles from './BaseMenu.less';

const cn = classnames.bind(styles);

class BaseMenu extends PureComponent {
    static propTypes = {
        children : PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired,
        menuPlacement : PropTypes.oneOf([ 'top', 'bottom', 'auto' ]).isRequired
    }

    constructor() {
        super();
        this.id = uuid();
        this.className = cn('BaseMenu', this.id);
    }

    componentDidMount() {
        const [ menu ] = document.getElementsByClassName(this.className);

        this.handleElementOutOfScreen(menu);
    }

    handleElementOutOfScreen = (menu) => {
        const scales = menu.getBoundingClientRect();
        const { right: menuRightSidePosition, bottom: menuBottonSidePosition } = scales;
        const { innerWidth, innerHeight } = window;

        if (menuRightSidePosition > innerWidth) {
            this.className = cn(this.className, 'floatRight');
        }  else if (menuBottonSidePosition > innerHeight && this.props.menuPlacement !== 'top') {
            menu.scrollIntoView();
        }
    }

    render() {
        return (
            <components.Menu
                {...this.props}
                className={this.className}
                id={this.id}
            >
                {this.props.children}
            </components.Menu>
        );
    }
}

export default BaseMenu;
