import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BaseMenu from '../BaseMenu';
import Checkbox from '../../../../base/Checkbox/';
import styles from './TopicMenu.less';

class TopicMenu extends PureComponent {
    static propTypes = {
        children : PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node)
        ]).isRequired,
        selectProps : PropTypes.shape({
            isCheckboxChecked : PropTypes.bool.isRequired,
            onCheckboxChange  : PropTypes.func.isRequired,
            options           : PropTypes.array
        }).isRequired

    }

    render() {
        const { isCheckboxChecked, onCheckboxChange, options  }  = this.props.selectProps;
        const isCheckboxRender = !!options.length  || isCheckboxChecked;

        return (
            <BaseMenu {...this.props} >
                {isCheckboxRender && <div className = {styles.checkBoxWrapper}>
                    <Checkbox
                        checked={isCheckboxChecked}
                        onChange={onCheckboxChange}
                        label='Show only active'
                        inputProps={{ 'aria-label': 'Show only active' }}
                    />
                </div>}
                {this.props.children}
            </BaseMenu>
        );
    }
}

export default TopicMenu;
