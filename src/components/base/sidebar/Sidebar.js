/* eslint-disable more/no-c-like-loops */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import { Close }                from '@material-ui/icons';
import Icon  from '../Icon';
import styles                   from './Sidebar.less';

const cn = classnames.bind(styles);

class Sidebar extends PureComponent {
    render() {
        const { children, isOpen, onToggle } = this.props;
        const SidebarCN = cn('Sidebar', { open: isOpen });


        const SidebarWrapperCN = cn('SidebarWrapper', {
            open : isOpen
        });

        return (
            <div className={SidebarWrapperCN}>
                <div className={SidebarCN}>
                    <Close
                        className={styles.close}
                        onClick={onToggle}
                    />
                    <Icon type='logo-dashboard' />
                    {children}
                </div>
                <div className={styles.SidebarFade} onClick={onToggle} />
            </div>
        );
    }
}


Sidebar.propTypes = {
    children : PropTypes.element,
    isOpen   : PropTypes.bool.isRequired,
    onToggle : PropTypes.func.isRequired
};

Sidebar.defaultProps = {
    children : null
};

export default Sidebar;
